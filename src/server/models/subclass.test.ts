import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/server/http/errors";

import { subclassModel } from "./subclass";
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

const kelas = [
  "kelas",
  "Kelas A",
  "pengaju",
  "active",
  1,
  null,
  null,
  null,
  sampleTime,
  sampleTime,
];
// Urutan kolom mengikuti definisi tabel: id, class_id, name, description, created_at, updated_at.
const subkelas = ["subkelas", "kelas", "Basis Data", null, sampleTime, sampleTime];
const subkelasBerdeskripsi = [
  "subkelas",
  "kelas",
  "Basis Data",
  "Materi dan tugas Basis Data semester 3.",
  sampleTime,
  sampleTime,
];

describe("subclassModel", () => {
  beforeEach(resetMysqlMock);

  it("mengambil daftar subkelas beserta jumlah total", async () => {
    queueResults(countResult(4), readResult(subkelas));

    await expect(subclassModel.listByClass("kelas", { page: 2, limit: 2 })).resolves.toMatchObject({
      rows: [{ id: "subkelas", classId: "kelas" }],
      total: 4,
    });
    expect(query.mock.calls[1][1]).toEqual(["kelas", 2, 2]);
  });

  it("mengembalikan null jika subkelas tidak ada di kelas yang diberikan", async () => {
    queueResults(writeResult, readResult(kelas), readResult(), writeResult);

    await expect(subclassModel.assignPj("kelas", "subkelas-lain", "anggota")).resolves.toBeNull();
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("menunjuk anggota kelas yang sama sebagai PJ", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(subkelas),
      countResult(1),
      writeResult,
      readResult(["subkelas", "anggota", sampleTime]),
      writeResult,
    );

    await expect(subclassModel.assignPj("kelas", "subkelas", "anggota")).resolves.toMatchObject({
      subclassId: "subkelas",
      userId: "anggota",
    });
  });

  it("mengubah galat PJ duplikat menjadi konflik", async () => {
    const duplikat = Object.assign(new Error("duplicate"), { code: "ER_DUP_ENTRY" });
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(subkelas),
      countResult(1),
      duplikat,
      writeResult,
    );

    await expect(subclassModel.assignPj("kelas", "subkelas", "anggota")).rejects.toThrow(
      ConflictError,
    );
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("membatalkan pembuatan subkelas jika PJ awal berasal dari luar kelas", async () => {
    queueResults(writeResult, readResult(kelas), writeResult, countResult(0), writeResult);

    await expect(
      subclassModel.create({ classId: "kelas", name: "Basis Data" }, ["pengguna-luar"]),
    ).rejects.toThrow("anggota kelas yang sama");
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("menyimpan deskripsi saat membuat subkelas", async () => {
    queueResults(
      writeResult, // Mulai transaksi
      readResult(kelas), // Kelas dikunci
      writeResult, // INSERT
      readResult(subkelasBerdeskripsi), // Baca hasilnya
      writeResult, // Commit
    );

    const hasil = await subclassModel.create({
      classId: "kelas",
      name: "Basis Data",
      description: "Materi dan tugas Basis Data semester 3.",
    });

    expect(hasil).toMatchObject({
      id: "subkelas",
      name: "Basis Data",
      description: "Materi dan tugas Basis Data semester 3.",
    });
    const queryTambah = query.mock.calls.find(([perintah]) =>
      perintah.sql.startsWith("insert into `subclasses`"),
    );
    expect(queryTambah?.[1]).toContain("Materi dan tugas Basis Data semester 3.");
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("membuat subkelas tanpa deskripsi, sehingga deskripsinya kosong", async () => {
    queueResults(writeResult, readResult(kelas), writeResult, readResult(subkelas), writeResult);

    const hasil = await subclassModel.create({ classId: "kelas", name: "Basis Data" });

    expect(hasil).toMatchObject({ id: "subkelas", description: null });
  });

  it("mengubah nama dan deskripsi sekaligus", async () => {
    queueResults(writeResult, writeResult, readResult(subkelasBerdeskripsi), writeResult);

    const hasil = await subclassModel.update("kelas", "subkelas", {
      name: "Basis Data",
      description: "Materi dan tugas Basis Data semester 3.",
    });

    expect(hasil).toMatchObject({ description: "Materi dan tugas Basis Data semester 3." });
    const queryUbah = query.mock.calls.find(([perintah]) =>
      perintah.sql.startsWith("update `subclasses`"),
    );
    expect(queryUbah?.[0].sql).toContain("`name` = ?");
    expect(queryUbah?.[0].sql).toContain("`description` = ?");
    expect(queryUbah?.[1]).toEqual([
      "Basis Data",
      "Materi dan tugas Basis Data semester 3.",
      "kelas",
      "subkelas",
    ]);
  });

  it("mengubah deskripsi saja tanpa menyentuh nama", async () => {
    queueResults(writeResult, writeResult, readResult(subkelasBerdeskripsi), writeResult);

    await subclassModel.update("kelas", "subkelas", {
      description: "Materi dan tugas Basis Data semester 3.",
    });

    const queryUbah = query.mock.calls.find(([perintah]) =>
      perintah.sql.startsWith("update `subclasses`"),
    );
    expect(queryUbah?.[0].sql).not.toContain("`name` = ?");
    expect(queryUbah?.[1]).toEqual([
      "Materi dan tugas Basis Data semester 3.",
      "kelas",
      "subkelas",
    ]);
  });

  it("mengosongkan deskripsi bila dikirim null", async () => {
    queueResults(writeResult, writeResult, readResult(subkelas), writeResult);

    const hasil = await subclassModel.update("kelas", "subkelas", { description: null });

    expect(hasil).toMatchObject({ description: null });
    const queryUbah = query.mock.calls.find(([perintah]) =>
      perintah.sql.startsWith("update `subclasses`"),
    );
    expect(queryUbah?.[1]).toEqual([null, "kelas", "subkelas"]);
  });

  it("tidak menjalankan UPDATE bila tidak ada yang diubah", async () => {
    queueResults(writeResult, readResult(subkelas), writeResult);

    await expect(subclassModel.update("kelas", "subkelas", {})).resolves.toMatchObject({
      id: "subkelas",
    });
    expect(executedSql().some((sql) => sql.startsWith("update"))).toBe(false);
  });

  it("mengembalikan null bila subkelas yang diubah tidak ada di kelas itu", async () => {
    queueResults(writeResult, noChange, readResult(), writeResult);

    await expect(
      subclassModel.update("kelas", "subkelas-lain", { name: "Nama Baru" }),
    ).resolves.toBeNull();
  });

  it("berhasil menghapus subkelas dari kelas yang benar", async () => {
    queueResults(
      writeResult, // Mulai transaksi
      readResult(kelas), // Kelas ditemukan
      readResult(subkelas), // Subkelas ditemukan
      writeResult, // DELETE berhasil
      writeResult, // Commit
    );

    const hasil = await subclassModel.remove("kelas", "subkelas");

    expect(hasil).toBe(true);
    const queryHapus = query.mock.calls.find(([perintah]) =>
      perintah.sql.includes("delete from `subclasses`"),
    );

    expect(queryHapus).toBeDefined();
    expect(queryHapus?.[1]).toEqual(["kelas", "subkelas"]);
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("tidak menghapus jika kelas tidak ditemukan", async () => {
    queueResults(
      writeResult,
      readResult(), // Kelas tidak ditemukan
      writeResult,
    );

    const hasil = await subclassModel.remove("kelas-salah", "subkelas");

    expect(hasil).toBe(false);
    expect(executedSql().some((sql) => sql.startsWith("delete"))).toBe(false);
  });

  it("tidak menghapus jika subkelas tidak ditemukan", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(), // Subkelas tidak ditemukan
      writeResult,
    );

    const hasil = await subclassModel.remove("kelas", "subkelas-salah");

    expect(hasil).toBe(false);
    expect(executedSql().some((sql) => sql.startsWith("delete"))).toBe(false);
  });

  it("tidak menghapus subkelas milik kelas lain", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(), // Tidak ada subkelas yang cocok dengan kedua ID
      writeResult,
    );

    const hasil = await subclassModel.remove("kelas", "subkelas-kelas-lain");

    expect(hasil).toBe(false);
    expect(executedSql().some((sql) => sql.startsWith("delete"))).toBe(false);
  });

  it("membatalkan transaksi jika DELETE mengalami error", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(subkelas),
      new Error("Database error"),
      writeResult,
    );

    await expect(subclassModel.remove("kelas", "subkelas")).rejects.toThrow(
      "Failed query: delete from",
    );

    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("mengembalikan false jika DELETE tidak menghapus baris", async () => {
    queueResults(writeResult, readResult(kelas), readResult(subkelas), noChange, writeResult);

    const hasil = await subclassModel.remove("kelas", "subkelas");

    expect(hasil).toBe(false);
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("mengambil ID subkelas yang dipegang seorang PJ di satu kelas", async () => {
    queueResults(readResult(["subkelas-a"], ["subkelas-b"]));

    await expect(subclassModel.listIdsByPj("kelas", "pj")).resolves.toEqual([
      "subkelas-a",
      "subkelas-b",
    ]);
    expect(query.mock.calls[0][1]).toEqual(["kelas", "pj"]);
    expect(executedSql()[0]).toContain("inner join `subclasses`");
  });

  it("mengembalikan daftar kosong bila pengguna bukan PJ di kelas itu", async () => {
    queueResults(readResult());

    await expect(subclassModel.listIdsByPj("kelas", "anggota")).resolves.toEqual([]);
  });
});
