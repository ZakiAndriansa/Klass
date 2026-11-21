import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/server/http/errors";

import { pushSubscriptionModel } from "./push-subscription";
import {
  readResult,
  countResult,
  writeResult,
  query,
  resetMysqlMock,
  queueResults,
  executedSql,
  noChange,
  sampleTime,
} from "./testing/mysql";

vi.mock("mysql2/promise", async () => (await import("./testing/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const endpoint = "https://example.test/push/Token";
const masukan = { userId: "anggota", endpoint, p256dh: "kunci-baru", auth: "auth-baru" };
const langganan = ["langganan", "anggota", endpoint, "kunci-lama", "auth-lama", sampleTime];

describe("pushSubscriptionModel", () => {
  beforeEach(resetMysqlMock);

  it("memperbarui kunci dari endpoint milik pengguna yang sama", async () => {
    queueResults(writeResult, writeResult, readResult(langganan), writeResult, writeResult);

    await expect(pushSubscriptionModel.save(masukan)).resolves.toMatchObject(masukan);
    expect(query.mock.calls[3][1]).toEqual(["kunci-baru", "auth-baru", "langganan"]);
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("menolak endpoint yang sudah terdaftar atas nama pengguna lain", async () => {
    queueResults(writeResult, writeResult, readResult(langganan), writeResult);

    await expect(pushSubscriptionModel.save({ ...masukan, userId: "orang-lain" })).rejects.toThrow(
      ConflictError,
    );
    expect(executedSql().at(-1)).toBe("rollback");
    expect(executedSql()).not.toContainEqual(
      expect.stringContaining("update `push_subscriptions`"),
    );
  });

  it("menolak varian kapitalisasi token yang bertabrakan pada indeks MySQL", async () => {
    queueResults(writeResult, writeResult, readResult(langganan), writeResult);

    await expect(
      pushSubscriptionModel.save({ ...masukan, endpoint: endpoint.toLowerCase() }),
    ).rejects.toThrow(ConflictError);
  });

  it("mengambil langganan anggota kelas untuk pengingat", async () => {
    queueResults(countResult(1), readResult(langganan));

    await expect(
      pushSubscriptionModel.listByClass("kelas", { page: 1, limit: 10 }),
    ).resolves.toMatchObject({ rows: [{ userId: "anggota", endpoint }], total: 1 });
    expect(executedSql()[1]).toContain("from `class_members`");
  });

  it("mengembalikan false ketika endpoint tidak ditemukan untuk pemiliknya", async () => {
    queueResults(noChange);

    await expect(pushSubscriptionModel.remove("anggota", endpoint)).resolves.toBe(false);
    expect(query.mock.calls[0][1]).toEqual(["anggota", endpoint, endpoint]);
  });
});
