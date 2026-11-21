import "server-only";
import { notFound, redirect } from "next/navigation";

import { ambilSesi, type Sesi } from "@/server/auth";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/server/http/errors";

/**
 * Penjaga untuk HALAMAN (Server Component). Pemilik: Zaki.
 *
 * Di API, galat izin diubah `handle()` menjadi JSON. Halaman tidak punya `handle()`,
 * jadi berkas ini yang menerjemahkannya menjadi perpindahan halaman:
 *
 *   belum login         pindah ke /login
 *   tidak ada           halaman 404
 *   tidak punya izin    pindah ke /forbidden
 *
 * Ketiga fungsi di bawah membaca cookie, jadi pemanggilnya harus berada di dalam
 * `<Suspense>` (aturan Cache Components, lihat skill `klass-halaman`).
 */

const HALAMAN_LOGIN = "/login";
const HALAMAN_TANPA_IZIN = "/forbidden";

/** Dipasang di layout `(app)`: semua halaman di bawahnya wajib login. */
export async function wajibLogin(): Promise<Sesi["user"]> {
  const sesi = await ambilSesi();
  if (!sesi) redirect(HALAMAN_LOGIN);

  return sesi.user;
}

/**
 * Dipasang di layout `/admin`. Yang bukan superadmin mendapat 404, bukan
 * "tidak punya izin", supaya area admin tidak terlihat ada.
 */
export async function wajibSuperadmin(): Promise<Sesi["user"]> {
  const user = await wajibLogin();
  if (!user.isSuperadmin) notFound();

  return user;
}

/**
 * Membungkus pemanggilan controller dari halaman.
 *
 * Pemakaian:
 *   const akses = await untukHalaman(() => aksesKelasSaya(classId));
 *
 * Galat lain (misalnya database mati) diteruskan ke `error.tsx`.
 */
export async function untukHalaman<T>(ambil: () => Promise<T>): Promise<T> {
  try {
    return await ambil();
  } catch (galat) {
    if (galat instanceof UnauthorizedError) redirect(HALAMAN_LOGIN);
    if (galat instanceof NotFoundError) notFound();
    if (galat instanceof ForbiddenError) redirect(HALAMAN_TANPA_IZIN);
    throw galat;
  }
}
