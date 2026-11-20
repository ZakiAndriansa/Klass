import "server-only";

import { modePengembangan } from "@/env";
import { AKUN_DEV, cariAkunDev, masukAkunDev } from "@/server/auth";
import { NotFoundError } from "@/server/http/errors";
import { masukDevSchema, type AkunDevDto } from "@/types/api/dev-auth";
import type { SesiDto } from "@/types/api/session";

/**
 * Controller akun contoh untuk pengembangan. Pemilik: Zaki.
 *
 * Dipakai tim frontend dan backend untuk masuk sebagai peran tertentu tanpa
 * login Google. Semua fungsi di sini menolak bekerja di produksi.
 *
 * Membaca sesi dan keluar tidak ada di sini; keduanya berlaku juga di produksi,
 * jadi tempatnya di `session.ts` (`/api/v1/session`).
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
export async function masukDev(masukan: unknown): Promise<SesiDto> {
  pastikanModePengembangan();

  const { accountId } = masukDevSchema.parse(masukan);

  const akun = cariAkunDev(accountId);
  if (!akun) {
    throw new NotFoundError("Akun contoh tidak ditemukan.");
  }

  await masukAkunDev(akun);

  return {
    id: akun.id,
    name: akun.name,
    email: akun.email,
    image: null,
    isSuperadmin: akun.role === "superadmin",
  };
}
