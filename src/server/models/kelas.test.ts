import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ValidationError } from "@/server/http/errors";

import { kelasModel } from "./kelas";
import {
  getConnection,
  hasilHitung,
  hasilTulis,
  query,
  release,
  resetMysqlTiruan,
  waktu,
} from "./uji/mysql";

// Drizzle tetap membangun SQL dan memetakan hasil. Hanya driver MySQL yang ditiru.
vi.mock("mysql2/promise", async () => (await import("./uji/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const idKelas = "db7c8c93-3b38-4ab2-9997-f13d98a80580";
const dataKelas = { name: "Informatika A", createdBy: "pengguna-pengaju" };

function barisDariMySQL(id: string) {
  return [id, dataKelas.name, dataKelas.createdBy, "pending", 1, null, null, null, waktu, waktu];
}

describe("kelasModel", () => {
  beforeEach(resetMysqlTiruan);

  it("mencari kelas berdasarkan ID dan mengembalikan data kelas", async () => {
    query.mockResolvedValueOnce([[barisDariMySQL(idKelas)], []]);

    await expect(kelasModel.cariPerId(idKelas)).resolves.toMatchObject({
      id: idKelas,
      ...dataKelas,
    });
    expect(query).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ sql: expect.stringContaining("where `classes`.`id` = ?") }),
      [idKelas, 1],
    );
  });

  it("mengembalikan null bila ID kelas tidak ditemukan", async () => {
    query.mockResolvedValueOnce([[], []]);

    await expect(kelasModel.cariPerId(idKelas)).resolves.toBeNull();
  });

  it("menyimpan kelas, membaca ID yang dibuat Drizzle, lalu mengembalikan baris lengkap", async () => {
    query
      .mockResolvedValueOnce(hasilTulis) // BEGIN
      .mockResolvedValueOnce(hasilTulis) // INSERT
      .mockImplementationOnce(async (_, [id]) => [[barisDariMySQL(String(id))], []])
      .mockResolvedValueOnce(hasilTulis); // COMMIT

    const kelas = await kelasModel.buat(dataKelas);

    expect(kelas).toEqual({
      id: expect.stringMatching(/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/),
      ...dataKelas,
      status: "pending",
      isListed: true,
      inviteCode: null,
      memberLimit: null,
      style: null,
      createdAt: new Date("2026-11-19T03:00:00Z"),
      updatedAt: new Date("2026-11-19T03:00:00Z"),
    });
    expect(query).toHaveBeenNthCalledWith(1, expect.objectContaining({ sql: "begin" }), []);
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ sql: expect.stringContaining("insert into `classes`") }),
      [kelas.id, dataKelas.name, dataKelas.createdBy],
    );
    expect(query).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ sql: expect.stringContaining("where `classes`.`id` = ?") }),
      [kelas.id, 1],
    );
    expect(query).toHaveBeenNthCalledWith(4, expect.objectContaining({ sql: "commit" }), []);
    expect(getConnection).toHaveBeenCalledTimes(1);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("membatalkan penyimpanan bila kelas yang baru dibuat tidak bisa ditemukan", async () => {
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[], []])
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.buat(dataKelas)).rejects.toThrow(
      "Kelas yang baru dibuat tidak ditemukan.",
    );
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ sql: "rollback" }), []);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("membatasi daftar publik pada kelas aktif yang terdaftar", async () => {
    query.mockResolvedValueOnce(hasilHitung(1));
    query.mockResolvedValueOnce([[["kelas", "Dasar 100%", null]], []]);

    await expect(kelasModel.daftarPublik({ page: 1, limit: 10 }, "100%")).resolves.toEqual({
      baris: [{ id: "kelas", name: "Dasar 100%", style: null }],
      total: 1,
    });
    expect(query.mock.calls[1][1]).toEqual(["active", true, "%100!%%", 10]);
  });

  it.each([
    { page: -1, limit: 20 },
    { page: 0, limit: 20 },
    { page: 1.5, limit: 20 },
    { page: Number.NaN, limit: 20 },
    { page: 1, limit: 0 },
    { page: 1, limit: 2.5 },
    { page: 1, limit: 101 },
    { page: Number.MAX_SAFE_INTEGER, limit: 100 },
  ])("menolak pagination $page/$limit sebelum menjalankan SQL", async (halaman) => {
    await expect(kelasModel.daftarPublik(halaman)).rejects.toThrow(ValidationError);
    expect(query).not.toHaveBeenCalled();
  });

  it("mengembalikan halaman kosong tanpa SELECT baris saat offset melebihi total", async () => {
    query.mockResolvedValueOnce(hasilHitung(3));

    await expect(
      kelasModel.daftarPublik({ page: Number.MAX_SAFE_INTEGER, limit: 1 }),
    ).resolves.toEqual({ baris: [], total: 3 });
    expect(query).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ sql: expect.stringContaining("count(") }),
      ["active", true],
    );
  });

  it("menerima batas 100 baris sesuai kontrak API", async () => {
    query.mockResolvedValueOnce(hasilHitung(1));
    query.mockResolvedValueOnce([[["kelas", "Kelas A", null]], []]);

    await expect(kelasModel.daftarPublik({ page: 1, limit: 100 })).resolves.toMatchObject({
      total: 1,
    });
    expect(query.mock.calls[1][1]).toEqual(["active", true, 100]);
  });

  it("menjadikan pengaju admin sebelum mengaktifkan kelas", async () => {
    const pending = barisDariMySQL(idKelas);
    const aktif = [...pending];
    aktif[3] = "active";
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[pending], []])
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[aktif], []])
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.setujuiPengajuan(idKelas)).resolves.toMatchObject({ status: "active" });
    expect(query.mock.calls[2][1]).toEqual([idKelas, dataKelas.createdBy, "admin", "admin"]);
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ sql: "commit" }), []);
  });

  it("mengembalikan null jika pengajuan yang hendak ditolak tidak ada", async () => {
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[], []])
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.tolakPengajuan(idKelas)).resolves.toBeNull();
    expect(query).toHaveBeenCalledTimes(3);
  });

  it("menolak persetujuan ulang tanpa menulis perubahan peran", async () => {
    const aktif = barisDariMySQL(idKelas);
    aktif[3] = "active";
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[aktif], []])
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.setujuiPengajuan(idKelas)).rejects.toThrow("sudah diputuskan");
    expect(query).toHaveBeenCalledTimes(3);
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ sql: "rollback" }), []);
  });

  it("membatalkan penetapan pengaju sebagai admin jika aktivasi gagal", async () => {
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[barisDariMySQL(idKelas)], []])
      .mockResolvedValueOnce(hasilTulis)
      .mockRejectedValueOnce(new Error("aktivasi gagal"))
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.setujuiPengajuan(idKelas)).rejects.toHaveProperty(
      "cause.message",
      "aktivasi gagal",
    );
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ sql: "rollback" }), []);
  });

  it("mencegah kelas privat disimpan tanpa kode undangan", async () => {
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[barisDariMySQL(idKelas)], []])
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.ubahPengaturan(idKelas, { isListed: false })).rejects.toMatchObject({
      status: 400,
      message: "Kelas yang tidak terdaftar harus memiliki kode undangan.",
    });
    expect(query).toHaveBeenLastCalledWith(expect.objectContaining({ sql: "rollback" }), []);
  });

  it("menerima pengajuan privat dengan kode undangan dan batas anggota", async () => {
    const privat = barisDariMySQL(idKelas);
    privat[4] = 0;
    privat[5] = "KODE";
    privat[6] = 20;
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[privat], []])
      .mockResolvedValueOnce(hasilTulis);

    const opsi = { isListed: false, inviteCode: "KODE", memberLimit: 20 };
    await expect(kelasModel.buat({ ...dataKelas, ...opsi })).resolves.toMatchObject(opsi);
    expect(query.mock.calls[1][1]).toEqual([
      expect.any(String),
      dataKelas.name,
      dataKelas.createdBy,
      false,
      "KODE",
      20,
    ]);
  });

  it("mengubah kode undangan duplikat menjadi galat konflik", async () => {
    const duplikat = Object.assign(new Error("duplicate"), { code: "ER_DUP_ENTRY" });
    query
      .mockResolvedValueOnce(hasilTulis)
      .mockResolvedValueOnce([[barisDariMySQL(idKelas)], []])
      .mockRejectedValueOnce(duplikat)
      .mockResolvedValueOnce(hasilTulis);

    await expect(kelasModel.ubahPengaturan(idKelas, { inviteCode: "KODE" })).rejects.toThrow(
      "kelas lain",
    );
  });
});
