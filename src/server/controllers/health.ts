import "server-only";

import { healthModel } from "@/server/models/health";
import type { HealthDto } from "@/types/api/health";

/**
 * CONTOH CONTROLLER. Tiru bentuk berkas ini untuk controller lain.
 *
 * Urutan kerja controller pada fitur sungguhan:
 * 1. Validasi masukan dengan Zod.
 * 2. Periksa izin (lapisan izin, dikerjakan nanti).
 * 3. Panggil fungsi model. Controller tidak pernah menulis query sendiri.
 * 4. Kembalikan DTO, yaitu data yang bentuknya sudah disepakati dengan frontend.
 *
 * Controller mengembalikan data biasa, bukan `Response`, supaya bisa dipanggil
 * dari URL (`route.ts`) maupun langsung dari halaman (Server Component).
 */
export async function cekKesehatan(): Promise<HealthDto> {
  let database: HealthDto["database"] = "terhubung";

  try {
    await healthModel.ping();
  } catch {
    database = "terputus";
  }

  return { aplikasi: "berjalan", database };
}
