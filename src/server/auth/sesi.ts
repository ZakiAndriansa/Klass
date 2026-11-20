import "server-only";
import { headers } from "next/headers";
import { cache } from "react";

import { UnauthorizedError } from "@/server/http/errors";

import { ambilAuth, type Sesi } from "./konfigurasi";

/**
 * Pembaca sesi login. Pemilik: Zaki.
 *
 * Controller memakai fungsi di sini untuk mengetahui siapa yang sedang login.
 * Berlaku sama untuk akun contoh (`/dev/login`) maupun login Google nanti,
 * karena keduanya menghasilkan sesi Better Auth yang sama.
 */

/**
 * Sesi pengguna yang sedang login, atau `null` bila belum login.
 *
 * Dibungkus `cache()` supaya dalam satu kali render halaman, layout, halaman, dan
 * controller yang sama-sama bertanya "siapa yang login" hanya membaca database sekali.
 */
export const ambilSesi = cache(async (): Promise<Sesi | null> => {
  // `headers()` dibaca lebih dulu. Saat `npm run build`, baris ini menghentikan
  // prerender sebelum Better Auth sempat dinyalakan (lihat `ambilAuth`).
  const kepala = await headers();

  return ambilAuth().api.getSession({ headers: kepala });
});

/**
 * Pengguna yang sedang login. Melempar `UnauthorizedError` (401) bila belum login.
 *
 * Pemakaian di controller:
 *   const pengguna = await requireAuth();
 *   const profil = await profileModel.cariPerId(pengguna.id);
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
