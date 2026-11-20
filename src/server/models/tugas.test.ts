import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { tugasModel } from "./tugas";
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

const dueAt = new Date("2026-11-25T12:00:00Z");
const remindAt = new Date("2026-11-24T12:00:00Z");
const data = { subclassId: "subkelas", title: "Makalah", createdBy: "pj", dueAt };
const barisTugas = [
  "tugas",
  "subkelas",
  "Makalah",
  null,
  "pj",
  "2026-11-25 12:00:00",
  waktu,
  waktu,
];

describe("tugasModel", () => {
  beforeEach(resetMysqlTiruan);

  it("menyimpan tugas dan pengingat dalam transaksi yang sama", async () => {
    siapkan(hasilTulis, hasilTulis, hasilTulis);
    query.mockImplementationOnce(async (_, [id]) => hasilBaca([id, ...barisTugas.slice(1)]));
    siapkan(hasilTulis);

    const tugas = await tugasModel.buat(data, [remindAt, remindAt]);

    expect(tugas).toMatchObject({ title: "Makalah", dueAt });
    expect(query.mock.calls[2][1]).toContain(tugas.id);
    expect(sqlDijalankan()[2]).toContain("on duplicate key update");
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });

  it("membatalkan tugas bila penulisan pengingat gagal", async () => {
    siapkan(hasilTulis, hasilTulis, new Error("pengingat gagal"), hasilTulis);

    await expect(tugasModel.buat(data, [remindAt])).rejects.toHaveProperty(
      "cause.message",
      "pengingat gagal",
    );
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("mengembalikan null untuk tugas di kelas lain", async () => {
    siapkan(hasilTulis, hasilBaca(), hasilTulis);

    await expect(tugasModel.ubah("kelas-lain", "tugas", { title: "Baru" })).resolves.toBeNull();
    expect(query.mock.calls[1][1]).toEqual(["tugas", "kelas-lain"]);
  });

  it("meminta jadwal pengganti bila tenggat berubah dan masih ada pengingat", async () => {
    siapkan(hasilTulis, hasilBaca(barisTugas), hasilHitung(1), hasilTulis);

    await expect(
      tugasModel.ubah("kelas", "tugas", { dueAt: new Date("2026-11-26T12:00:00Z") }),
    ).rejects.toThrow("jadwal pengingat baru");
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("mengganti pengingat yang belum terkirim dan mempertahankan riwayat kirim", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(barisTugas),
      hasilTulis,
      hasilTulis,
      hasilBaca(barisTugas),
      hasilTulis,
    );

    await expect(tugasModel.ubah("kelas", "tugas", {}, [remindAt])).resolves.toMatchObject({
      id: "tugas",
    });
    expect(sqlDijalankan()[2]).toContain("`assignment_reminders`.`sent_at` is null");
  });

  it("menghindari penimpaan waktu kirim yang sudah tercatat", async () => {
    siapkan(tanpaPerubahan);

    await expect(tugasModel.tandaiPengingatTerkirim("pengingat", dueAt)).resolves.toBe(false);
    expect(sqlDijalankan()[0]).toContain("`assignment_reminders`.`sent_at` is null");
  });

  it("mengambil pengingat tugas termasuk yang sudah terkirim", async () => {
    siapkan(
      hasilBaca(
        ["pengingat-1", "tugas", "2026-11-23 12:00:00", null, waktu],
        ["pengingat-2", "tugas", "2026-11-24 12:00:00", "2026-11-24 13:00:00", waktu],
      ),
    );

    const hasil = await tugasModel.daftarPengingat("tugas");

    expect(hasil).toHaveLength(2);
    expect(hasil.map((pengingat) => pengingat.id)).toEqual(["pengingat-1", "pengingat-2"]);

    expect(hasil[0].sentAt).toBeNull();
    expect(hasil[1].sentAt).not.toBeNull();
  });

  it("mengembalikan daftar kosong jika tugas tidak punya pengingat", async () => {
    siapkan(hasilBaca());

    const hasil = await tugasModel.daftarPengingat("tugas");

    expect(hasil).toEqual([]);
  });

  it("hanya mencari pengingat berdasarkan ID tugas yang diberikan", async () => {
    siapkan(hasilBaca());

    await tugasModel.daftarPengingat("tugas-123");

    expect(query.mock.calls[0][1]).toEqual(["tugas-123"]);

    const sql = sqlDijalankan()[0];

    expect(sql).toContain("`assignment_reminders`.`assignment_id` = ?");
    expect(sql).toContain("order by");
    expect(sql).not.toContain("`assignment_reminders`.`sent_at` is null");
  });
});
