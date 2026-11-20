import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { masukAkunDev } from "@/server/auth";
import { NotFoundError } from "@/server/http/errors";

import { daftarAkunDev, masukDev } from "./dev-auth";

/**
 * Uji controller akun contoh. Folder auth diganti tiruan, jadi uji ini tidak
 * butuh database maupun Better Auth.
 */
// `vi.mock` dijalankan lebih dulu daripada isi berkas, jadi data yang dipakai
// di dalamnya harus dibuat lewat `vi.hoisted`.
const { modus, akunSuperadmin } = vi.hoisted(() => ({
  modus: { pengembangan: true },
  akunSuperadmin: {
    id: "dev-superadmin",
    name: "Superadmin Contoh",
    email: "superadmin@klass.test",
    role: "superadmin",
    roleLabel: "Superadmin",
    description: "Mengurus website.",
    redirectTo: "/admin",
  },
}));

vi.mock("@/env", () => ({
  get modePengembangan() {
    return modus.pengembangan;
  },
}));

vi.mock("@/server/auth", () => ({
  AKUN_DEV: [akunSuperadmin],
  cariAkunDev: (id: string) => (id === akunSuperadmin.id ? akunSuperadmin : undefined),
  masukAkunDev: vi.fn(),
}));

describe("controller akun contoh", () => {
  beforeEach(() => {
    modus.pengembangan = true;
    vi.mocked(masukAkunDev).mockReset();
  });

  it("mengembalikan daftar akun contoh", async () => {
    await expect(daftarAkunDev()).resolves.toEqual([akunSuperadmin]);
  });

  it("masuk sebagai akun contoh dan mengembalikan sesinya", async () => {
    await expect(masukDev({ accountId: "dev-superadmin" })).resolves.toEqual({
      id: "dev-superadmin",
      name: "Superadmin Contoh",
      email: "superadmin@klass.test",
      image: null,
      isSuperadmin: true,
    });
    expect(masukAkunDev).toHaveBeenCalledWith(akunSuperadmin);
  });

  it("menolak body tanpa accountId", async () => {
    await expect(masukDev({})).rejects.toBeInstanceOf(ZodError);
    expect(masukAkunDev).not.toHaveBeenCalled();
  });

  it("menjawab tidak ditemukan untuk akun yang tidak ada di daftar", async () => {
    await expect(masukDev({ accountId: "dev-tidak-ada" })).rejects.toBeInstanceOf(NotFoundError);
    expect(masukAkunDev).not.toHaveBeenCalled();
  });

  it("menolak semua fungsi di produksi", async () => {
    modus.pengembangan = false;

    await expect(daftarAkunDev()).rejects.toBeInstanceOf(NotFoundError);
    await expect(masukDev({ accountId: "dev-superadmin" })).rejects.toBeInstanceOf(NotFoundError);
    expect(masukAkunDev).not.toHaveBeenCalled();
  });
});
