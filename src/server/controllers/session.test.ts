import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession, signOut } from "@/server/auth";

import { endSession, getMySession } from "./session";

/** Uji controller sesi. Folder auth diganti tiruan, jadi tidak butuh database. */
vi.mock("@/server/auth", () => ({ getSession: vi.fn(), signOut: vi.fn() }));

function masukSebagai(user: Record<string, unknown> | null) {
  vi.mocked(getSession).mockResolvedValue(
    user === null ? null : ({ user } as Awaited<ReturnType<typeof getSession>>),
  );
}

describe("controller sesi", () => {
  beforeEach(() => vi.resetAllMocks());

  it("mengembalikan null bila belum login", async () => {
    masukSebagai(null);

    await expect(getMySession()).resolves.toBeNull();
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

    await expect(getMySession()).resolves.toEqual({
      id: "u-1",
      name: "Budi",
      email: "budi@contoh.id",
      image: null,
      isSuperadmin: false,
    });
  });

  it("keluar mengakhiri sesi yang sedang berjalan", async () => {
    masukSebagai({ id: "u-1" });

    await expect(endSession()).resolves.toBeNull();
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("keluar tanpa sesi tidak dianggap galat", async () => {
    masukSebagai(null);

    await expect(endSession()).resolves.toBeNull();
    expect(signOut).not.toHaveBeenCalled();
  });
});
