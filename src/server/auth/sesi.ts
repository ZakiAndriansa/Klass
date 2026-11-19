import "server-only";
import { headers } from "next/headers";

import { UnauthorizedError } from "@/server/http/errors";

import { ambilAuth, type Sesi } from "./konfigurasi";

/**
 * Pembaca sesi login. Pemilik: Zaki.
 *
 * Controller memakai fungsi di sini untuk mengetahui siapa yang sedang login.
 * Berlaku sama untuk akun contoh (`/dev/login`) maupun login Google nanti,
 * karena keduanya menghasilkan sesi Better Auth yang sama.
 */

/** Sesi pengguna yang sedang login, atau `null` bila belum login. */
export async function ambilSesi(): Promise<Sesi | null> {
  return ambilAuth().api.getSession({ headers: await headers() });
}

/**
 * Pengguna yang sedang login. Melempar `UnauthorizedError` (401) bila belum login.
 *
 * Pemakaian di controller:
 *   const pengguna = await requireAuth();
 *   const profil = await profilModel.cariPerId(pengguna.id);
 */
export async function requireAuth(): Promise<Sesi["user"]> {
  const sesi = await ambilSesi();

  if (!sesi) {
    throw new UnauthorizedError();
  }

  return sesi.user;
}

/** Mengakhiri sesi yang sedang berjalan dan menghapus cookie-nya. */
export async function keluar(): Promise<void> {
  await ambilAuth().api.signOut({ headers: await headers() });
}
