import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ValidationError } from "@/server/http/errors";

import { jadwalModel } from "./jadwal";
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

const jadwal = ["jadwal", "subkelas", 2, "08:00:00", "09:30:00", waktu, waktu];

describe("jadwalModel", () => {
  beforeEach(resetMysqlTiruan);

  it("menampilkan jadwal berurutan menurut hari dan jam mulai", async () => {
    siapkan(hasilHitung(3), hasilBaca(jadwal));

    await expect(
      jadwalModel.daftarPerKelas("kelas", { page: 1, limit: 10 }),
    ).resolves.toMatchObject({ baris: [{ weekday: 2, startTime: "08:00:00" }], total: 3 });
    expect(sqlDijalankan()[1]).toContain(
      "order by `schedules`.`weekday` asc, `schedules`.`start_time` asc",
    );
  });

  it("mengubah jam tanpa mengganti hari dan mengembalikan baris yang sudah diubah", async () => {
    const sebelum = [...jadwal];
    sebelum[4] = "09:00:00";
    siapkan(hasilTulis, hasilBaca(sebelum), hasilTulis, hasilBaca(jadwal), hasilTulis);

    await expect(
      jadwalModel.ubah("subkelas", "jadwal", { endTime: "09:30:00" }),
    ).resolves.toMatchObject({ id: "jadwal", weekday: 2, endTime: "09:30:00" });
    expect(sqlDijalankan()[1]).toContain("for update");
    expect(query.mock.calls[2][1]).toEqual(["09:30:00", "subkelas", "jadwal"]);
  });

  it.each([
    ["08:00", "08:00:00"],
    ["22:00", "06:00"],
    ["08:00", "24:00"],
    ["08:70", "09:00"],
  ])("menolak jadwal %s hingga %s sebelum menulis ke database", async (startTime, endTime) => {
    await expect(
      jadwalModel.buat({ subclassId: "subkelas", weekday: 2, startTime, endTime }),
    ).rejects.toThrow(ValidationError);
    expect(query).not.toHaveBeenCalled();
  });

  it("menggunakan jam yang tersimpan ketika perubahan hanya berisi jam mulai", async () => {
    siapkan(hasilTulis, hasilBaca(jadwal), hasilTulis);

    await expect(jadwalModel.ubah("subkelas", "jadwal", { startTime: "10:00" })).rejects.toThrow(
      "Jam selesai harus setelah jam mulai",
    );
    expect(sqlDijalankan()).toEqual(["begin", expect.stringContaining("for update"), "rollback"]);
  });

  it("memvalidasi jam selesai baru terhadap jam mulai yang tersimpan", async () => {
    siapkan(hasilTulis, hasilBaca(jadwal), hasilTulis);

    await expect(jadwalModel.ubah("subkelas", "jadwal", { endTime: "07:00" })).rejects.toThrow(
      ValidationError,
    );
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("mengembalikan false jika jadwal yang akan dihapus tidak ada di subkelas", async () => {
    siapkan(tanpaPerubahan);

    await expect(jadwalModel.hapus("subkelas-lain", "jadwal")).resolves.toBe(false);
    expect(query.mock.calls[0][1]).toEqual(["subkelas-lain", "jadwal"]);
  });

  it("melakukan rollback bila penulisan jadwal gagal", async () => {
    siapkan(hasilTulis, new Error("weekday tidak valid"), hasilTulis);

    await expect(
      jadwalModel.buat({
        subclassId: "subkelas",
        weekday: 9,
        startTime: "08:00",
        endTime: "09:00",
      }),
    ).rejects.toHaveProperty("cause.message", "weekday tidak valid");
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });
});
