import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { materiModel } from "./materi";
import {
  hasilBaca,
  hasilHitung,
  hasilTulis,
  query,
  resetMysqlTiruan,
  siapkan,
  sqlDijalankan,
  waktu,
} from "./uji/mysql";

vi.mock("mysql2/promise", async () => (await import("./uji/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const link = "https://example.test/materi";
const barisMateri = ["materi", "subkelas", "pj", "Bab 1", null, link, null, null, waktu, waktu];

describe("materiModel", () => {
  beforeEach(resetMysqlTiruan);

  it("menyimpan materi berupa tautan dan membaca baris hasilnya", async () => {
    siapkan(hasilTulis, hasilTulis);
    query.mockImplementationOnce(async (_, [, id]) => hasilBaca([id, ...barisMateri.slice(1)]));
    siapkan(hasilTulis);

    const materi = await materiModel.buat({
      subclassId: "subkelas",
      uploadedBy: "pj",
      title: "Bab 1",
      linkUrl: link,
    });

    expect(materi).toMatchObject({ subclassId: "subkelas", title: "Bab 1", linkUrl: link });
    expect(query.mock.calls[1][1][0]).toBe(materi.id);
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });

  it("mengambil daftar materi dari subkelas dalam kelas terkait", async () => {
    siapkan(hasilHitung(1), hasilBaca(barisMateri));

    await expect(
      materiModel.daftarPerKelas("kelas", { page: 1, limit: 10 }),
    ).resolves.toMatchObject({ baris: [{ id: "materi" }], total: 1 });
    expect(sqlDijalankan().every((sql) => sql.includes("select `id` from `subclasses`"))).toBe(
      true,
    );
  });

  it("mengembalikan null untuk materi di luar subkelas yang diminta", async () => {
    siapkan(hasilBaca());

    await expect(materiModel.cariPerId("subkelas-lain", "materi")).resolves.toBeNull();
    expect(query.mock.calls[0][1]).toEqual(["subkelas-lain", "materi", 1]);
  });

  it("membatalkan perubahan jika tautan satu-satunya dihapus", async () => {
    siapkan(hasilTulis, hasilBaca(barisMateri), hasilTulis);

    await expect(materiModel.ubah("subkelas", "materi", { linkUrl: null })).rejects.toThrow(
      "file atau tautan",
    );
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });
});
