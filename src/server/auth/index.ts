import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/env";
import { db } from "@/server/db";
import * as skemaAuth from "@/server/db/schema/auth";

/**
 * Konfigurasi login (Better Auth). Pemilik: Zaki.
 *
 * STATUS: konfigurasi dasar. Belum ada URL `/api/auth` dan tombol Google belum tersambung,
 * karena kredensial Google Cloud belum dibuat. Berkas ini sudah ada lebih dulu supaya
 * bentuk tabel pengguna pasti, sehingga tabel lain bisa merujuk ke `users`.
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

export const auth = betterAuth({
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

  socialProviders: google ? { google } : {},

  // Harus menjadi plugin terakhir: membuat cookie sesi bisa dipasang dari Server Action.
  plugins: [nextCookies()],
});

/** Bentuk sesi dan pengguna yang dikembalikan Better Auth, termasuk `isSuperadmin`. */
export type Sesi = typeof auth.$Infer.Session;
