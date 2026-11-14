import { beforeEach, describe, expect, it, vi } from "vitest";

import { healthModel } from "@/server/models/health";

import { cekKesehatan } from "./health";

/**
 * CONTOH UJI CONTROLLER. Model diganti tiruan, jadi uji ini tidak butuh database.
 * Jalankan dengan `npm run test`.
 */
vi.mock("@/server/models/health", () => ({
  healthModel: { ping: vi.fn() },
}));

describe("cekKesehatan", () => {
  beforeEach(() => {
    vi.mocked(healthModel.ping).mockReset();
  });

  it("melaporkan database terhubung bila query berhasil", async () => {
    vi.mocked(healthModel.ping).mockResolvedValue();

    await expect(cekKesehatan()).resolves.toEqual({
      aplikasi: "berjalan",
      database: "terhubung",
    });
  });

  it("melaporkan database terputus bila query gagal, tanpa melempar galat", async () => {
    vi.mocked(healthModel.ping).mockRejectedValue(new Error("ECONNREFUSED"));

    await expect(cekKesehatan()).resolves.toEqual({
      aplikasi: "berjalan",
      database: "terputus",
    });
  });
});
