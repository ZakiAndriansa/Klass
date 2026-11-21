import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSession } from "@/server/auth";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/server/http/errors";

import { forPage, requirePageLogin } from "./page";

/**
 * `redirect()` dan `notFound()` milik Next.js bekerja dengan melempar galat.
 * Di sini keduanya diganti tiruan yang melempar teks yang mudah diperiksa.
 */
vi.mock("next/navigation", () => ({
  redirect: (tujuan: string) => {
    throw new Error(`PINDAH:${tujuan}`);
  },
  notFound: () => {
    throw new Error("TIDAK_DITEMUKAN");
  },
}));
vi.mock("@/server/auth", () => ({ getSession: vi.fn() }));

function masukSebagai(isSuperadmin: boolean | null) {
  vi.mocked(getSession).mockResolvedValue(
    isSuperadmin === null
      ? null
      : ({ user: { id: "u-1", name: "Pengguna", isSuperadmin } } as Awaited<
          ReturnType<typeof getSession>
        >),
  );
}

beforeEach(() => vi.resetAllMocks());

describe("requirePageLogin", () => {
  it("mengembalikan pengguna bila sudah login", async () => {
    masukSebagai(false);
    await expect(requirePageLogin()).resolves.toMatchObject({ id: "u-1" });
  });

  it("memindahkan ke /login bila belum login", async () => {
    masukSebagai(null);
    await expect(requirePageLogin()).rejects.toThrow("PINDAH:/login");
  });
});

describe("forPage", () => {
  it("meneruskan hasil controller bila berhasil", async () => {
    await expect(forPage(async () => ({ id: "kelas-a" }))).resolves.toEqual({ id: "kelas-a" });
  });

  it.each([
    ["belum login (401)", new UnauthorizedError(), "PINDAH:/login"],
    ["tidak ada (404)", new NotFoundError(), "TIDAK_DITEMUKAN"],
    ["tidak punya izin (403)", new ForbiddenError(), "PINDAH:/forbidden"],
  ])("%s", async (_nama, galat, harapan) => {
    await expect(
      forPage(async () => {
        throw galat;
      }),
    ).rejects.toThrow(harapan);
  });

  it("meneruskan galat lain apa adanya supaya ditangani error.tsx", async () => {
    const galat = new ConflictError("Kelas sudah penuh.");
    await expect(
      forPage(async () => {
        throw galat;
      }),
    ).rejects.toBe(galat);
  });
});
