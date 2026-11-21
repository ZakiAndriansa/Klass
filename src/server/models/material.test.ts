import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { materialModel } from "./material";
import {
  readResult,
  countResult,
  writeResult,
  query,
  resetMysqlMock,
  queueResults,
  executedSql,
  sampleTime,
} from "./testing/mysql";

vi.mock("mysql2/promise", async () => (await import("./testing/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const link = "https://example.test/materi";
const barisMateri = [
  "materi",
  "subkelas",
  "pj",
  "Bab 1",
  null,
  link,
  null,
  null,
  sampleTime,
  sampleTime,
];

describe("materialModel", () => {
  beforeEach(resetMysqlMock);

  it("menyimpan materi berupa tautan dan membaca baris hasilnya", async () => {
    queueResults(writeResult, writeResult);
    query.mockImplementationOnce(async (_, [, id]) => readResult([id, ...barisMateri.slice(1)]));
    queueResults(writeResult);

    const materi = await materialModel.create({
      subclassId: "subkelas",
      uploadedBy: "pj",
      title: "Bab 1",
      linkUrl: link,
    });

    expect(materi).toMatchObject({ subclassId: "subkelas", title: "Bab 1", linkUrl: link });
    expect(query.mock.calls[1][1][0]).toBe(materi.id);
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("mengambil daftar materi dari subkelas dalam kelas terkait", async () => {
    queueResults(countResult(1), readResult(barisMateri));

    await expect(materialModel.listByClass("kelas", { page: 1, limit: 10 })).resolves.toMatchObject(
      { rows: [{ id: "materi" }], total: 1 },
    );
    expect(executedSql().every((sql) => sql.includes("select `id` from `subclasses`"))).toBe(true);
  });

  it("mengembalikan null untuk materi di luar subkelas yang diminta", async () => {
    queueResults(readResult());

    await expect(materialModel.findById("subkelas-lain", "materi")).resolves.toBeNull();
    expect(query.mock.calls[0][1]).toEqual(["subkelas-lain", "materi", 1]);
  });

  it("membatalkan perubahan jika tautan satu-satunya dihapus", async () => {
    queueResults(writeResult, readResult(barisMateri), writeResult);

    await expect(
      materialModel.update("subkelas", "materi", { linkUrl: null }),
    ).rejects.toMatchObject({
      status: 400,
      message: "Materi harus memiliki file atau tautan.",
    });
    expect(executedSql().at(-1)).toBe("rollback");
  });
});
