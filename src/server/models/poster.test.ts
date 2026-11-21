import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { posterModel } from "./poster";
import {
  readResult,
  countResult,
  writeResult,
  query,
  resetMysqlMock,
  queueResults,
  executedSql,
  sampleTime,
} from "./testing/mysql";

vi.mock("mysql2/promise", async () => (await import("./testing/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

describe("posterModel", () => {
  beforeEach(resetMysqlMock);

  it("menampilkan hanya poster aktif dengan urutan tampilan dan total", async () => {
    queueResults(
      countResult(1),
      readResult([
        "poster",
        "Selamat Datang",
        "https://example.test/poster",
        1,
        2,
        sampleTime,
        sampleTime,
      ]),
    );

    await expect(posterModel.listActive({ page: 1, limit: 10 })).resolves.toMatchObject({
      rows: [{ id: "poster", isActive: true, sortOrder: 2 }],
      total: 1,
    });
    expect(executedSql()[1]).toContain("`posters`.`is_active` = ?");
    expect(executedSql()[1]).toContain("order by `posters`.`sort_order` asc");
  });

  it("mengubah semua posisi dalam satu transaksi", async () => {
    queueResults(writeResult, readResult(["satu"], ["dua"]), writeResult, writeResult, writeResult);

    await expect(
      posterModel.reorder([
        { id: "satu", sortOrder: 2 },
        { id: "dua", sortOrder: 1 },
      ]),
    ).resolves.toBe(true);
    expect(query.mock.calls.slice(2, 4).map(([, params]) => params)).toEqual([
      [2, "satu"],
      [1, "dua"],
    ]);
    expect(executedSql().at(-1)).toBe("commit");
  });

  it("mengembalikan false tanpa menulis jika ada poster yang tidak ditemukan", async () => {
    queueResults(writeResult, readResult(["satu"]), writeResult);

    await expect(
      posterModel.reorder([
        { id: "satu", sortOrder: 2 },
        { id: "hilang", sortOrder: 1 },
      ]),
    ).resolves.toBe(false);
    expect(query).toHaveBeenCalledTimes(3);
  });

  it("menolak ID berulang sebelum membuka transaksi", async () => {
    await expect(
      posterModel.reorder([
        { id: "satu", sortOrder: 1 },
        { id: "satu", sortOrder: 2 },
      ]),
    ).rejects.toMatchObject({ status: 400 });
    expect(query).not.toHaveBeenCalled();
  });

  it("membatalkan perubahan urutan pertama jika penulisan berikutnya gagal", async () => {
    queueResults(
      writeResult,
      readResult(["satu"], ["dua"]),
      writeResult,
      new Error("gagal"),
      writeResult,
    );

    await expect(
      posterModel.reorder([
        { id: "satu", sortOrder: 2 },
        { id: "dua", sortOrder: 1 },
      ]),
    ).rejects.toThrow();
    expect(executedSql().at(-1)).toBe("rollback");
  });
});
