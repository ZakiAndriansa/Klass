import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import type { PoolConnection as KoneksiCallback } from "mysql2";
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
const globalStore = globalThis as unknown as { poolKlass?: mysql.Pool };

function createDbPool(): mysql.Pool {
  const pool = mysql.createPool({
    uri: env.DATABASE_URL,
    connectionLimit: 10,
    connectTimeout: 5000,
    timezone: "Z", // aplikasi mengirim dan membaca semua waktu sebagai UTC
  });

  // `timezone: "Z"` hanya mengatur sisi aplikasi. MySQL sendiri memakai zona waktu
  // komputernya (WIB di Laragon), sehingga `created_at` yang diisi MySQL terbaca
  // tujuh jam lebih maju. Setiap koneksi baru dipaksa memakai UTC supaya keduanya sama.
  pool.on("connection", (koneksi) => {
    // Di sini mysql2 memberikan koneksi gaya callback, walaupun tipenya tertulis promise.
    (koneksi as unknown as KoneksiCallback).query("SET time_zone = '+00:00'", (galat) => {
      if (galat) console.error("Gagal mengatur zona waktu koneksi MySQL ke UTC:", galat);
    });
  });

  return pool;
}

const pool = globalStore.poolKlass ?? createDbPool();

if (process.env.NODE_ENV !== "production") {
  globalStore.poolKlass = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
