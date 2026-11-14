import "server-only";
import { sql } from "drizzle-orm";

import { db } from "@/server/db";

/**
 * CONTOH MODEL. Tiru bentuk berkas ini untuk model lain (kelas, materi, tugas, ...).
 *
 * Aturan model:
 * 1. Hanya model yang boleh mengimpor `db` dan menulis query.
 * 2. Model tidak tahu soal HTTP, sesi, atau role. Ia menerima nilai dan mengembalikan data.
 * 3. Satu berkas mengekspor satu objek berisi fungsi-fungsi untuk satu modul.
 */
export const healthModel = {
  /** Menjalankan query paling ringan. Melempar galat bila database tidak bisa dihubungi. */
  async ping(): Promise<void> {
    await db.execute(sql`select 1`);
  },
};
