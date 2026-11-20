import { connection } from "next/server";

import { penanganAuth } from "@/server/auth";

/**
 * `/api/auth/*`: alamat milik Better Auth. Pemilik: Zaki.
 *
 * Dipakai untuk login Google (`/api/auth/sign-in/social`, lalu Google mengembalikan
 * pengguna ke `/api/auth/callback/google`). Isinya dijalankan Better Auth sendiri,
 * jadi bentuk responsnya BUKAN `{ data }` atau `{ error }` seperti `/api/v1`.
 *
 * Frontend tidak memanggil alamat ini langsung. Pakai `masukDenganGoogle()` dari
 * `src/lib/auth-client.ts`, dan `/api/v1/session` untuk membaca sesi atau keluar.
 */
async function teruskan(req: Request): Promise<Response> {
  // Jangan dijalankan saat `npm run build`.
  await connection();

  return penanganAuth(req);
}

export { teruskan as GET, teruskan as POST };
