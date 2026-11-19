import "server-only";

import { modePengembangan } from "@/env";
import { AKUN_DEV, ambilSesi, cariAkunDev, keluar, masukAkunDev } from "@/server/auth";
import { NotFoundError } from "@/server/http/errors";
import { masukDevSchema, type AkunDevDto, type SesiDevDto } from "@/types/api/dev-auth";

/**
 * Controller akun contoh untuk pengembangan. Pemilik: Zaki.
 *
 * Dipakai tim frontend dan backend untuk masuk sebagai peran tertentu tanpa
 * login Google. Semua fungsi di sini menolak bekerja di produksi.
 */

/** Dipakai halaman `/dev/login` untuk memutuskan tampil atau 404. */
export function loginDevAktif(): boolean {
  return modePengembangan;
}

/** Di produksi alamat ini dianggap tidak ada, jadi jawabannya 404, bukan 403. */
function pastikanModePengembangan(): void {
  if (!modePengembangan) {
    throw new NotFoundError("Alamat ini hanya ada saat pengembangan.");
  }
}

/** Daftar akun contoh, satu per peran. */
export async function daftarAkunDev(): Promise<AkunDevDto[]> {
  pastikanModePengembangan();

  return [...AKUN_DEV];
}

/** Masuk sebagai salah satu akun contoh. */
export async function masukDev(masukan: unknown): Promise<SesiDevDto> {
  pastikanModePengembangan();

  const { idAkun } = masukDevSchema.parse(masukan);

  const akun = cariAkunDev(idAkun);
  if (!akun) {
    throw new NotFoundError("Akun contoh tidak ditemukan.");
  }

  await masukAkunDev(akun);

  return {
    idPengguna: akun.id,
    nama: akun.nama,
    email: akun.email,
    isSuperadmin: akun.peran === "superadmin",
    peran: akun.peran,
  };
}

/** Siapa yang sedang login. `null` berarti belum login. */
export async function sesiDev(): Promise<SesiDevDto | null> {
  pastikanModePengembangan();

  const sesi = await ambilSesi();
  if (!sesi) return null;

  const { user } = sesi;

  return {
    idPengguna: user.id,
    nama: user.name,
    email: user.email,
    isSuperadmin: user.isSuperadmin,
    peran: cariAkunDev(user.id)?.peran ?? null,
  };
}

/** Keluar dari akun yang sedang dipakai. */
export async function keluarDev(): Promise<null> {
  pastikanModePengembangan();

  await keluar();

  return null;
}
