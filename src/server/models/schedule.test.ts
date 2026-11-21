import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ValidationError } from "@/server/http/errors";

import { scheduleModel } from "./schedule";
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

const jadwal = ["jadwal", "subkelas", 2, "08:00:00", "09:30:00", sampleTime, sampleTime];

describe("scheduleModel", () => {
  beforeEach(resetMysqlMock);

  it("menampilkan jadwal berurutan menurut hari dan jam mulai", async () => {
    queueResults(countResult(3), readResult(jadwal));

    await expect(scheduleModel.listByClass("kelas", { page: 1, limit: 10 })).resolves.toMatchObject(
      { rows: [{ weekday: 2, startTime: "08:00:00" }], total: 3 },
    );
    expect(executedSql()[1]).toContain(
      "order by `schedules`.`weekday` asc, `schedules`.`start_time` asc",
    );
  });

  it("mengubah jam tanpa mengganti hari dan mengembalikan baris yang sudah diubah", async () => {
    const sebelum = [...jadwal];
    sebelum[4] = "09:00:00";
    queueResults(writeResult, readResult(sebelum), writeResult, readResult(jadwal), writeResult);

    await expect(
      scheduleModel.update("subkelas", "jadwal", { endTime: "09:30:00" }),
    ).resolves.toMatchObject({ id: "jadwal", weekday: 2, endTime: "09:30:00" });
    expect(executedSql()[1]).toContain("for update");
    expect(query.mock.calls[2][1]).toEqual(["09:30:00", "subkelas", "jadwal"]);
  });

  it.each([
    ["08:00", "08:00:00"],
    ["22:00", "06:00"],
    ["08:00", "24:00"],
    ["08:70", "09:00"],
  ])("menolak jadwal %s hingga %s sebelum menulis ke database", async (startTime, endTime) => {
    await expect(
      scheduleModel.create({ subclassId: "subkelas", weekday: 2, startTime, endTime }),
    ).rejects.toThrow(ValidationError);
    expect(query).not.toHaveBeenCalled();
  });

  it("menggunakan jam yang tersimpan ketika perubahan hanya berisi jam mulai", async () => {
    queueResults(writeResult, readResult(jadwal), writeResult);

    await expect(
      scheduleModel.update("subkelas", "jadwal", { startTime: "10:00" }),
    ).rejects.toThrow("Jam selesai harus setelah jam mulai");
    expect(executedSql()).toEqual(["begin", expect.stringContaining("for update"), "rollback"]);
  });

  it("memvalidasi jam selesai baru terhadap jam mulai yang tersimpan", async () => {
    queueResults(writeResult, readResult(jadwal), writeResult);

    await expect(scheduleModel.update("subkelas", "jadwal", { endTime: "07:00" })).rejects.toThrow(
      ValidationError,
    );
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("mengembalikan false jika jadwal yang akan dihapus tidak ada di subkelas", async () => {
    queueResults(noChange);

    await expect(scheduleModel.remove("subkelas-lain", "jadwal")).resolves.toBe(false);
    expect(query.mock.calls[0][1]).toEqual(["subkelas-lain", "jadwal"]);
  });

  it("melakukan rollback bila penulisan jadwal gagal", async () => {
    queueResults(writeResult, new Error("subkelas tidak ada"), writeResult);

    await expect(
      scheduleModel.create({
        subclassId: "subkelas",
        weekday: 2,
        startTime: "08:00",
        endTime: "09:00",
      }),
    ).rejects.toHaveProperty("cause.message", "subkelas tidak ada");
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it.each([0, 8, 9, 2.5])("menolak hari %s sebagai salah masukan (400)", async (weekday) => {
    await expect(
      scheduleModel.create({
        subclassId: "subkelas",
        weekday,
        startTime: "08:00",
        endTime: "09:00",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(scheduleModel.update("subkelas", "jadwal", { weekday })).rejects.toBeInstanceOf(
      ValidationError,
    );
    // Ditolak sebelum database disentuh.
    expect(query).not.toHaveBeenCalled();
  });
});
