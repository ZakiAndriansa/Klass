import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/server/http/errors";

import { pushSubscriptionModel } from "./push-subscription";
import {
  hasilBaca,
  hasilHitung,
  hasilTulis,
  query,
  resetMysqlTiruan,
  siapkan,
  sqlDijalankan,
  tanpaPerubahan,
  waktu,
} from "./uji/mysql";

vi.mock("mysql2/promise", async () => (await import("./uji/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const endpoint = "https://example.test/push/Token";
const masukan = { userId: "anggota", endpoint, p256dh: "kunci-baru", auth: "auth-baru" };
const langganan = ["langganan", "anggota", endpoint, "kunci-lama", "auth-lama", waktu];

describe("pushSubscriptionModel", () => {
  beforeEach(resetMysqlTiruan);

  it("memperbarui kunci dari endpoint milik pengguna yang sama", async () => {
    siapkan(hasilTulis, hasilTulis, hasilBaca(langganan), hasilTulis, hasilTulis);

    await expect(pushSubscriptionModel.simpan(masukan)).resolves.toMatchObject(masukan);
    expect(query.mock.calls[3][1]).toEqual(["kunci-baru", "auth-baru", "langganan"]);
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });

  it("menolak endpoint yang sudah terdaftar atas nama pengguna lain", async () => {
    siapkan(hasilTulis, hasilTulis, hasilBaca(langganan), hasilTulis);

    await expect(
      pushSubscriptionModel.simpan({ ...masukan, userId: "orang-lain" }),
    ).rejects.toThrow(ConflictError);
    expect(sqlDijalankan().at(-1)).toBe("rollback");
    expect(sqlDijalankan()).not.toContainEqual(
      expect.stringContaining("update `push_subscriptions`"),
    );
  });

  it("menolak varian kapitalisasi token yang bertabrakan pada indeks MySQL", async () => {
    siapkan(hasilTulis, hasilTulis, hasilBaca(langganan), hasilTulis);

    await expect(
      pushSubscriptionModel.simpan({ ...masukan, endpoint: endpoint.toLowerCase() }),
    ).rejects.toThrow(ConflictError);
  });

  it("mengambil langganan anggota kelas untuk pengingat", async () => {
    siapkan(hasilHitung(1), hasilBaca(langganan));

    await expect(
      pushSubscriptionModel.daftarPerKelas("kelas", { page: 1, limit: 10 }),
    ).resolves.toMatchObject({ baris: [{ userId: "anggota", endpoint }], total: 1 });
    expect(sqlDijalankan()[1]).toContain("from `class_members`");
  });

  it("mengembalikan false ketika endpoint tidak ditemukan untuk pemiliknya", async () => {
    siapkan(tanpaPerubahan);

    await expect(pushSubscriptionModel.hapus("anggota", endpoint)).resolves.toBe(false);
    expect(query.mock.calls[0][1]).toEqual(["anggota", endpoint, endpoint]);
  });
});
