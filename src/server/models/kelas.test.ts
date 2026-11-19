import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { kelasModel } from "./kelas";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));

// Drizzle tetap membangun SQL dan memetakan hasil. Hanya driver MySQL yang ditiru.
vi.mock("mysql2/promise", () => ({ default: { createPool: () => ({ query }) } }));
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const idKelas = "db7c8c93-3b38-4ab2-9997-f13d98a80580";
const dataKelas = { name: "Informatika A", createdBy: "pengguna-pengaju" };
const waktu = "2026-11-19 03:00:00";
const hasilTulis = [{ affectedRows: 1, insertId: 0 }, []];

function barisDariMySQL(id: string) {
  return [id, dataKelas.name, dataKelas.createdBy, "pending", 1, null, null, null, waktu, waktu];
}

describe("kelasModel", () => {
  beforeEach(() => {
    query.mockReset();
  });

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
      .mockImplementationOnce(async (_, [id]: [string]) => [[barisDariMySQL(id)], []])
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
  });
});
