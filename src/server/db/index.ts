import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "@/env";

import * as schema from "./schema";

/**
 * Koneksi database. Pemilik: Fadlan.
 *
 * Berkas ini hanya boleh diimpor dari `src/server/models/**`.
 * Controller, URL, dan halaman tidak pernah mengimpor `db`; mereka memanggil fungsi model.
 */

// Saat `npm run dev`, berkas dimuat ulang setiap kali kode berubah. Pool disimpan di
// `globalThis` supaya tidak dibuat ulang terus sampai MySQL kehabisan koneksi.
const penyimpan = globalThis as unknown as { poolKlass?: mysql.Pool };

const pool =
  penyimpan.poolKlass ??
  mysql.createPool({
    uri: env.DATABASE_URL,
    connectionLimit: 10,
    connectTimeout: 5000,
    timezone: "Z", // semua waktu disimpan dan dibaca sebagai UTC
  });

if (process.env.NODE_ENV !== "production") {
  penyimpan.poolKlass = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
