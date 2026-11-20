import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/server/http/errors";

import { subkelasModel } from "./subkelas";
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

const kelas = ["kelas", "Kelas A", "pengaju", "active", 1, null, null, null, waktu, waktu];
const subkelas = ["subkelas", "kelas", "Basis Data", waktu, waktu];

describe("subkelasModel", () => {
  beforeEach(resetMysqlTiruan);

  it("mengambil daftar subkelas beserta jumlah total", async () => {
    siapkan(hasilHitung(4), hasilBaca(subkelas));

    await expect(
      subkelasModel.daftarPerKelas("kelas", { page: 2, limit: 2 }),
    ).resolves.toMatchObject({
      baris: [{ id: "subkelas", classId: "kelas" }],
      total: 4,
    });
    expect(query.mock.calls[1][1]).toEqual(["kelas", 2, 2]);
  });

  it("mengembalikan null jika subkelas tidak ada di kelas yang diberikan", async () => {
    siapkan(hasilTulis, hasilBaca(kelas), hasilBaca(), hasilTulis);

    await expect(subkelasModel.tunjukPj("kelas", "subkelas-lain", "anggota")).resolves.toBeNull();
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });

  it("menunjuk anggota kelas yang sama sebagai PJ", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(subkelas),
      hasilHitung(1),
      hasilTulis,
      hasilBaca(["subkelas", "anggota", waktu]),
      hasilTulis,
    );

    await expect(subkelasModel.tunjukPj("kelas", "subkelas", "anggota")).resolves.toMatchObject({
      subclassId: "subkelas",
      userId: "anggota",
    });
  });

  it("mengubah galat PJ duplikat menjadi konflik", async () => {
    const duplikat = Object.assign(new Error("duplicate"), { code: "ER_DUP_ENTRY" });
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(subkelas),
      hasilHitung(1),
      duplikat,
      hasilTulis,
    );

    await expect(subkelasModel.tunjukPj("kelas", "subkelas", "anggota")).rejects.toThrow(
      ConflictError,
    );
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("membatalkan pembuatan subkelas jika PJ awal berasal dari luar kelas", async () => {
    siapkan(hasilTulis, hasilBaca(kelas), hasilTulis, hasilHitung(0), hasilTulis);

    await expect(
      subkelasModel.buat({ classId: "kelas", name: "Basis Data" }, ["pengguna-luar"]),
    ).rejects.toThrow("anggota kelas yang sama");
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("berhasil menghapus subkelas dari kelas yang benar", async () => {
    siapkan(
      hasilTulis,          // Mulai transaksi
      hasilBaca(kelas),    // Kelas ditemukan
      hasilBaca(subkelas), // Subkelas ditemukan
      hasilTulis,          // DELETE berhasil
      hasilTulis,          // Commit
    );

    const hasil = await subkelasModel.hapus("kelas", "subkelas");

    expect(hasil).toBe(true);
    const queryHapus = query.mock.calls.find(
      ([perintah]) => perintah.sql.includes("delete from `subclasses`"),
    );

    expect(queryHapus).toBeDefined();
    expect(queryHapus?.[1]).toEqual(["kelas", "subkelas"]);
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });

  it("tidak menghapus jika kelas tidak ditemukan", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(), // Kelas tidak ditemukan
      hasilTulis,
    );

    const hasil = await subkelasModel.hapus("kelas-salah", "subkelas");

    expect(hasil).toBe(false);
    expect(sqlDijalankan().some((sql) => sql.startsWith("delete"))).toBe(false);
  });

  it("tidak menghapus jika subkelas tidak ditemukan", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(), // Subkelas tidak ditemukan
      hasilTulis,
    );

    const hasil = await subkelasModel.hapus("kelas", "subkelas-salah");

    expect(hasil).toBe(false);
    expect(sqlDijalankan().some((sql) => sql.startsWith("delete"))).toBe(false);
  });

  it("tidak menghapus subkelas milik kelas lain", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(), // Tidak ada subkelas yang cocok dengan kedua ID
      hasilTulis,
    );

    const hasil = await subkelasModel.hapus("kelas", "subkelas-kelas-lain");

    expect(hasil).toBe(false);
    expect(sqlDijalankan().some((sql) => sql.startsWith("delete"))).toBe(false);
  });

  it("membatalkan transaksi jika DELETE mengalami error", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(subkelas),
      new Error("Database error"),
      hasilTulis,
    );

    await expect(
      subkelasModel.hapus("kelas", "subkelas"),
    ).rejects.toThrow("Failed query: delete from");

    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("mengembalikan false jika DELETE tidak menghapus baris", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(subkelas),
      tanpaPerubahan,
      hasilTulis,
    );

    const hasil = await subkelasModel.hapus("kelas", "subkelas");

    expect(hasil).toBe(false);
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });
});
