import "server-only";
import { cache } from "react";

import { sesiSaya } from "@/server/controllers/session";

/**
 * Sesi pengguna untuk Server Component, misalnya navbar dan halaman profil.
 *
 * Berbeda dari `wajibLogin()` di `@/server/permissions`, fungsi ini TIDAK
 * memindahkan pengguna ke mana pun: hasilnya `null` bila belum login. Itu
 * yang dibutuhkan komponen yang juga tampil di halaman publik, seperti
 * navbar — cukup tampilkan tombol "Masuk", tanpa memaksa perpindahan.
 *
 * Dibungkus `cache()` supaya navbar, sidebar, dan halaman yang memintanya
 * pada satu render hanya membaca database sekali.
 */
export const ambilSesiSaya = cache(async () => {
  return sesiSaya();
});

export type PenggunaAktif = NonNullable<Awaited<ReturnType<typeof ambilSesiSaya>>>;
