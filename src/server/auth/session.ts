import "server-only";
import { headers } from "next/headers";
import { cache } from "react";

import { UnauthorizedError } from "@/server/http/errors";

import { getAuth, type Session } from "./config";

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
export const getSession = cache(async (): Promise<Session | null> => {
  // `headers()` dibaca lebih dulu. Saat `npm run build`, baris ini menghentikan
  // prerender sebelum Better Auth sempat dinyalakan (lihat `getAuth`).
  const kepala = await headers();

  return getAuth().api.getSession({ headers: kepala });
});

/**
 * Pengguna yang sedang login. Melempar `UnauthorizedError` (401) bila belum login.
 *
 * Pemakaian di controller:
 *   const pengguna = await requireAuth();
 *   const profil = await profileModel.findById(pengguna.id);
 */
export async function requireAuth(): Promise<Session["user"]> {
  const sesi = await getSession();

  if (!sesi) {
    throw new UnauthorizedError();
  }

  return sesi.user;
}

/** Mengakhiri sesi yang sedang berjalan dan menghapus cookie-nya. */
export async function signOut(): Promise<void> {
  await getAuth().api.signOut({ headers: await headers() });
}
