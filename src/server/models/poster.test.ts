import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { posterModel } from "./poster";
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

describe("posterModel", () => {
  beforeEach(resetMysqlTiruan);

  it("menampilkan hanya poster aktif dengan urutan tampilan dan total", async () => {
    siapkan(
      hasilHitung(1),
      hasilBaca(["poster", "Selamat Datang", "https://example.test/poster", 1, 2, waktu, waktu]),
    );

    await expect(posterModel.daftarAktif({ page: 1, limit: 10 })).resolves.toMatchObject({
      baris: [{ id: "poster", isActive: true, sortOrder: 2 }],
      total: 1,
    });
    expect(sqlDijalankan()[1]).toContain("`posters`.`is_active` = ?");
    expect(sqlDijalankan()[1]).toContain("order by `posters`.`sort_order` asc");
  });

  it("mengubah semua posisi dalam satu transaksi", async () => {
    siapkan(hasilTulis, hasilBaca(["satu"], ["dua"]), hasilTulis, hasilTulis, hasilTulis);

    await expect(
      posterModel.ubahUrutan([
        { id: "satu", sortOrder: 2 },
        { id: "dua", sortOrder: 1 },
      ]),
    ).resolves.toBe(true);
    expect(query.mock.calls.slice(2, 4).map(([, params]) => params)).toEqual([
      [2, "satu"],
      [1, "dua"],
    ]);
    expect(sqlDijalankan().at(-1)).toBe("commit");
  });

  it("mengembalikan false tanpa menulis jika ada poster yang tidak ditemukan", async () => {
    siapkan(hasilTulis, hasilBaca(["satu"]), hasilTulis);

    await expect(
      posterModel.ubahUrutan([
        { id: "satu", sortOrder: 2 },
        { id: "hilang", sortOrder: 1 },
      ]),
    ).resolves.toBe(false);
    expect(query).toHaveBeenCalledTimes(3);
  });

  it("menolak ID berulang sebelum membuka transaksi", async () => {
    await expect(
      posterModel.ubahUrutan([
        { id: "satu", sortOrder: 1 },
        { id: "satu", sortOrder: 2 },
      ]),
    ).rejects.toThrow("muncul sekali");
    expect(query).not.toHaveBeenCalled();
  });

  it("membatalkan perubahan urutan pertama jika penulisan berikutnya gagal", async () => {
    siapkan(hasilTulis, hasilBaca(["satu"], ["dua"]), hasilTulis, new Error("gagal"), hasilTulis);

    await expect(
      posterModel.ubahUrutan([
        { id: "satu", sortOrder: 2 },
        { id: "dua", sortOrder: 1 },
      ]),
    ).rejects.toThrow();
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });
});
