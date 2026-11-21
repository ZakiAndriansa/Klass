import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { assignmentModel } from "./assignment";
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
  sampleTime,
  sampleTime,
];

describe("assignmentModel", () => {
  beforeEach(resetMysqlMock);

  it("menyimpan tugas dan pengingat dalam transaksi yang sama", async () => {
    queueResults(writeResult, writeResult, writeResult);
    query.mockImplementationOnce(async (_, [id]) => readResult([id, ...barisTugas.slice(1)]));
    queueResults(writeResult);

    const tugas = await assignmentModel.create(data, [remindAt, remindAt]);

    expect(tugas).toMatchObject({ title: "Makalah", dueAt });
    expect(query.mock.calls[2][1]).toContain(tugas.id);
    expect(executedSql()[2]).toContain("on duplicate key update");
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("membatalkan tugas bila penulisan pengingat gagal", async () => {
    queueResults(writeResult, writeResult, new Error("pengingat gagal"), writeResult);

    await expect(assignmentModel.create(data, [remindAt])).rejects.toHaveProperty(
      "cause.message",
      "pengingat gagal",
    );
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("menolak pengingat yang tidak sebelum tenggat sebagai salah masukan (400)", async () => {
    queueResults(writeResult, writeResult, writeResult);

    await expect(assignmentModel.create(data, [dueAt])).rejects.toMatchObject({
      status: 400,
      message: "Waktu pengingat harus sebelum tenggat tugas.",
    });
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("mengembalikan null untuk tugas di kelas lain", async () => {
    queueResults(writeResult, readResult(), writeResult);

    await expect(
      assignmentModel.update("kelas-lain", "tugas", { title: "Baru" }),
    ).resolves.toBeNull();
    expect(query.mock.calls[1][1]).toEqual(["tugas", "kelas-lain"]);
  });

  it("meminta jadwal pengganti bila tenggat berubah dan masih ada pengingat", async () => {
    queueResults(writeResult, readResult(barisTugas), countResult(1), writeResult);

    await expect(
      assignmentModel.update("kelas", "tugas", { dueAt: new Date("2026-11-26T12:00:00Z") }),
    ).rejects.toThrow("jadwal pengingat baru");
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("mengganti pengingat yang belum terkirim dan mempertahankan riwayat kirim", async () => {
    queueResults(
      writeResult,
      readResult(barisTugas),
      writeResult,
      writeResult,
      readResult(barisTugas),
      writeResult,
    );

    await expect(assignmentModel.update("kelas", "tugas", {}, [remindAt])).resolves.toMatchObject({
      id: "tugas",
    });
    expect(executedSql()[2]).toContain("`assignment_reminders`.`sent_at` is null");
  });

  it("menghindari penimpaan waktu kirim yang sudah tercatat", async () => {
    queueResults(noChange);

    await expect(assignmentModel.markReminderSent("pengingat", dueAt)).resolves.toBe(false);
    expect(executedSql()[0]).toContain("`assignment_reminders`.`sent_at` is null");
  });

  it("mengambil pengingat tugas termasuk yang sudah terkirim", async () => {
    queueResults(
      readResult(
        ["pengingat-1", "tugas", "2026-11-23 12:00:00", null, sampleTime],
        ["pengingat-2", "tugas", "2026-11-24 12:00:00", "2026-11-24 13:00:00", sampleTime],
      ),
    );

    const hasil = await assignmentModel.listReminders("tugas");

    expect(hasil).toHaveLength(2);
    expect(hasil.map((pengingat) => pengingat.id)).toEqual(["pengingat-1", "pengingat-2"]);

    expect(hasil[0].sentAt).toBeNull();
    expect(hasil[1].sentAt).not.toBeNull();
  });

  it("mengembalikan daftar kosong jika tugas tidak punya pengingat", async () => {
    queueResults(readResult());

    const hasil = await assignmentModel.listReminders("tugas");

    expect(hasil).toEqual([]);
  });

  it("hanya mencari pengingat berdasarkan ID tugas yang diberikan", async () => {
    queueResults(readResult());

    await assignmentModel.listReminders("tugas-123");

    expect(query.mock.calls[0][1]).toEqual(["tugas-123"]);

    const sql = executedSql()[0];

    expect(sql).toContain("`assignment_reminders`.`assignment_id` = ?");
    expect(sql).toContain("order by");
    expect(sql).not.toContain("`assignment_reminders`.`sent_at` is null");
  });
});
