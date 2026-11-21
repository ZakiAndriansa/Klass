import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { alamatLogin } from "@/lib/tujuan";

/**
 * Proxy (dulu bernama middleware). Pemilik: Zaki.
 *
 * Dijalankan Next.js SEBELUM halaman dibuat. Tugasnya satu: pengunjung yang belum
 * punya cookie sesi dan membuka halaman wajib login langsung dipindahkan ke
 * `/login?next=...`, tanpa menunggu halamannya dirender.
 *
 * INI BUKAN PENGAMANAN. Proxy hanya melihat "ada cookie atau tidak"; cookie palsu
 * akan lolos dari sini. Pemeriksaan sungguhan (sesi masih berlaku, perannya apa)
 * dilakukan di tempat lain:
 *   halaman   `requirePageLogin()` dan `requirePageSuperadmin()` di layout
 *   data      `requireAuth()` dan `require...` di controller (`src/server/permissions`)
 *
 * Peran (admin kelas, PJ) sengaja tidak diperiksa di sini, karena peran berlaku per
 * kelas dan harus dibaca dari database. Jangan mengimpor apa pun dari `@/server` ke
 * berkas ini.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) {
    return NextResponse.next();
  }

  const asal = request.nextUrl.pathname + request.nextUrl.search;

  return NextResponse.redirect(new URL(alamatLogin(asal), request.url));
}

/** Halaman yang wajib login. `/api` tidak termasuk: API menjawab 401 dalam bentuk JSON. */
export const config = {
  matcher: ["/dashboard/:path*", "/classes/:path*", "/admin/:path*"],
};
