import { beforeEach, describe, expect, it, vi } from "vitest";

import { ambilSesi, keluar } from "@/server/auth";

import { keluarSesi, sesiSaya } from "./session";

/** Uji controller sesi. Folder auth diganti tiruan, jadi tidak butuh database. */
vi.mock("@/server/auth", () => ({ ambilSesi: vi.fn(), keluar: vi.fn() }));

function masukSebagai(user: Record<string, unknown> | null) {
  vi.mocked(ambilSesi).mockResolvedValue(
    user === null ? null : ({ user } as Awaited<ReturnType<typeof ambilSesi>>),
  );
}

describe("controller sesi", () => {
  beforeEach(() => vi.resetAllMocks());

  it("mengembalikan null bila belum login", async () => {
    masukSebagai(null);

    await expect(sesiSaya()).resolves.toBeNull();
  });

  it("mengembalikan identitas pengguna tanpa kolom lain dari tabel users", async () => {
    masukSebagai({
      id: "u-1",
      name: "Budi",
      email: "budi@contoh.id",
      image: undefined,
      isSuperadmin: false,
      emailVerified: true,
      createdAt: new Date(),
    });

    await expect(sesiSaya()).resolves.toEqual({
      id: "u-1",
      name: "Budi",
      email: "budi@contoh.id",
      image: null,
      isSuperadmin: false,
    });
  });

  it("keluar mengakhiri sesi yang sedang berjalan", async () => {
    masukSebagai({ id: "u-1" });

    await expect(keluarSesi()).resolves.toBeNull();
    expect(keluar).toHaveBeenCalledTimes(1);
  });

  it("keluar tanpa sesi tidak dianggap galat", async () => {
    masukSebagai(null);

    await expect(keluarSesi()).resolves.toBeNull();
    expect(keluar).not.toHaveBeenCalled();
  });
});
