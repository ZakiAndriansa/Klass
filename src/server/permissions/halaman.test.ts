import { beforeEach, describe, expect, it, vi } from "vitest";

import { ambilSesi } from "@/server/auth";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/server/http/errors";

import { untukHalaman, wajibLogin, wajibSuperadmin } from "./halaman";

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
vi.mock("@/server/auth", () => ({ ambilSesi: vi.fn() }));

function masukSebagai(isSuperadmin: boolean | null) {
  vi.mocked(ambilSesi).mockResolvedValue(
    isSuperadmin === null
      ? null
      : ({ user: { id: "u-1", name: "Pengguna", isSuperadmin } } as Awaited<
          ReturnType<typeof ambilSesi>
        >),
  );
}

beforeEach(() => vi.resetAllMocks());

describe("wajibLogin", () => {
  it("mengembalikan pengguna bila sudah login", async () => {
    masukSebagai(false);
    await expect(wajibLogin()).resolves.toMatchObject({ id: "u-1" });
  });

  it("memindahkan ke /login bila belum login", async () => {
    masukSebagai(null);
    await expect(wajibLogin()).rejects.toThrow("PINDAH:/login");
  });
});

describe("wajibSuperadmin", () => {
  it("meloloskan superadmin", async () => {
    masukSebagai(true);
    await expect(wajibSuperadmin()).resolves.toMatchObject({ isSuperadmin: true });
  });

  it("menjawab 404 untuk pengguna biasa", async () => {
    masukSebagai(false);
    await expect(wajibSuperadmin()).rejects.toThrow("TIDAK_DITEMUKAN");
  });

  it("memindahkan ke /login bila belum login", async () => {
    masukSebagai(null);
    await expect(wajibSuperadmin()).rejects.toThrow("PINDAH:/login");
  });
});

describe("untukHalaman", () => {
  it("meneruskan hasil controller bila berhasil", async () => {
    await expect(untukHalaman(async () => ({ id: "kelas-a" }))).resolves.toEqual({ id: "kelas-a" });
  });

  it.each([
    ["belum login (401)", new UnauthorizedError(), "PINDAH:/login"],
    ["tidak ada (404)", new NotFoundError(), "TIDAK_DITEMUKAN"],
    ["tidak punya izin (403)", new ForbiddenError(), "PINDAH:/forbidden"],
  ])("%s", async (_nama, galat, harapan) => {
    await expect(
      untukHalaman(async () => {
        throw galat;
      }),
    ).rejects.toThrow(harapan);
  });

  it("meneruskan galat lain apa adanya supaya ditangani error.tsx", async () => {
    const galat = new ConflictError("Kelas sudah penuh.");
    await expect(
      untukHalaman(async () => {
        throw galat;
      }),
    ).rejects.toBe(galat);
  });
});
