import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { ambilSesi, keluar, masukAkunDev } from "@/server/auth";
import { NotFoundError } from "@/server/http/errors";

import { daftarAkunDev, keluarDev, masukDev, sesiDev } from "./dev-auth";

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
    nama: "Superadmin Contoh",
    email: "superadmin@klass.test",
    peran: "superadmin",
    labelPeran: "Superadmin",
    keterangan: "Mengurus website.",
    tujuan: "/admin",
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
  ambilSesi: vi.fn(),
  keluar: vi.fn(),
}));

describe("controller akun contoh", () => {
  beforeEach(() => {
    modus.pengembangan = true;
    vi.mocked(masukAkunDev).mockReset();
    vi.mocked(ambilSesi).mockReset();
    vi.mocked(keluar).mockReset();
  });

  it("mengembalikan daftar akun contoh", async () => {
    await expect(daftarAkunDev()).resolves.toEqual([akunSuperadmin]);
  });

  it("masuk sebagai akun contoh dan mengembalikan sesinya", async () => {
    await expect(masukDev({ idAkun: "dev-superadmin" })).resolves.toEqual({
      idPengguna: "dev-superadmin",
      nama: "Superadmin Contoh",
      email: "superadmin@klass.test",
      isSuperadmin: true,
      peran: "superadmin",
    });
    expect(masukAkunDev).toHaveBeenCalledWith(akunSuperadmin);
  });

  it("menolak body tanpa idAkun", async () => {
    await expect(masukDev({})).rejects.toBeInstanceOf(ZodError);
    expect(masukAkunDev).not.toHaveBeenCalled();
  });

  it("menjawab tidak ditemukan untuk akun yang tidak ada di daftar", async () => {
    await expect(masukDev({ idAkun: "dev-tidak-ada" })).rejects.toBeInstanceOf(NotFoundError);
    expect(masukAkunDev).not.toHaveBeenCalled();
  });

  it("mengembalikan null bila belum login", async () => {
    vi.mocked(ambilSesi).mockResolvedValue(null);

    await expect(sesiDev()).resolves.toBeNull();
  });

  it("mengisi peran null bila yang login bukan akun contoh", async () => {
    vi.mocked(ambilSesi).mockResolvedValue({
      user: { id: "pengguna-google", name: "Budi", email: "budi@contoh.id", isSuperadmin: false },
    } as Awaited<ReturnType<typeof ambilSesi>>);

    await expect(sesiDev()).resolves.toEqual({
      idPengguna: "pengguna-google",
      nama: "Budi",
      email: "budi@contoh.id",
      isSuperadmin: false,
      peran: null,
    });
  });

  it("menolak semua fungsi di produksi", async () => {
    modus.pengembangan = false;

    await expect(daftarAkunDev()).rejects.toBeInstanceOf(NotFoundError);
    await expect(masukDev({ idAkun: "dev-superadmin" })).rejects.toBeInstanceOf(NotFoundError);
    await expect(sesiDev()).rejects.toBeInstanceOf(NotFoundError);
    await expect(keluarDev()).rejects.toBeInstanceOf(NotFoundError);
    expect(masukAkunDev).not.toHaveBeenCalled();
    expect(keluar).not.toHaveBeenCalled();
  });
});
