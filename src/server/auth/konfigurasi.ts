import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { env, modePengembangan } from "@/env";
import { db } from "@/server/db";
import * as skemaAuth from "@/server/db/schema/auth";

/**
 * Konfigurasi login (Better Auth). Pemilik: Zaki.
 *
 * STATUS: alur login Google sudah tersambung (`/api/auth/*` dan tombol di `/login`),
 * tetapi baru aktif setelah `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` diisi di `.env`
 * (caranya ada di `README.md` folder ini). Sebelum itu, saat pengembangan, masuknya
 * lewat akun contoh di `/dev/login` (lihat `akun-dev.ts`).
 *
 * Konfigurasi ini dan `src/server/db/schema/auth.ts` adalah satu pasang. Mengubah
 * `additionalFields`, `usePlural`, atau menambah plugin berarti skema harus dibuat ulang
 * dan dibuatkan migrasi baru.
 *
 * Folder ini satu-satunya di luar `src/server/models` yang boleh mengimpor `db`,
 * karena Better Auth membaca dan menulis tabelnya sendiri.
 */

// Login Google baru aktif setelah dua kredensialnya diisi di `.env`.
const google =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }
    : undefined;

function buatAuth() {
  return betterAuth({
    baseURL: env.NEXT_PUBLIC_APP_URL,
    secret: env.BETTER_AUTH_SECRET,

    database: drizzleAdapter(db, {
      provider: "mysql",
      // Nama tabel jamak (`users`, bukan `user`) supaya seragam dengan tabel lain.
      usePlural: true,
      schema: skemaAuth,
    }),

    user: {
      additionalFields: {
        isSuperadmin: {
          type: "boolean",
          required: true,
          defaultValue: false,
          // `input: false` berarti nilai ini tidak pernah diterima dari pengguna,
          // baik saat mendaftar maupun saat mengubah profil.
          input: false,
        },
      },
    },

    // Login email dan kata sandi HANYA untuk akun contoh saat pengembangan (`akun-dev.ts`).
    // Di produksi fitur ini mati, sehingga satu-satunya cara masuk adalah Google.
    emailAndPassword: { enabled: modePengembangan },

    socialProviders: google ? { google } : {},

    // Harus menjadi plugin terakhir: membuat cookie sesi bisa dipasang dari Server Action.
    plugins: [nextCookies()],
  });
}

type Auth = ReturnType<typeof buatAuth>;

let tersimpan: Auth | undefined;

/**
 * Better Auth yang sudah dikonfigurasi.
 *
 * Dibuat saat pertama kali dipakai, bukan saat berkas ini dimuat. Dengan begitu
 * `npm run build` tidak ikut menyalakan Better Auth, yang di mode produksi
 * menolak berjalan tanpa `BETTER_AUTH_SECRET`.
 */
export function ambilAuth(): Auth {
  tersimpan ??= buatAuth();
  return tersimpan;
}

/**
 * Menjalankan permintaan ke `/api/auth/*` (login Google dan callback-nya).
 * Hanya dipakai `src/app/api/auth/[...all]/route.ts`.
 */
export function penanganAuth(req: Request): Promise<Response> {
  return ambilAuth().handler(req);
}

/** Bentuk sesi dan pengguna yang dikembalikan Better Auth, termasuk `isSuperadmin`. */
export type Sesi = Auth["$Infer"]["Session"];
