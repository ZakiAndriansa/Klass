import { checkHealth } from "@/server/controllers/health";
import { handle, ok } from "@/server/http";

/**
 * CONTOH URL. Alamatnya mengikuti letak folder: berkas ini melayani GET /api/v1/health.
 *
 * `route.ts` hanya menghubungkan alamat ke satu fungsi controller.
 * Tidak ada query, tidak ada pemeriksaan izin, tidak ada logika di sini.
 */
export const GET = handle(async () => ok(await checkHealth()));
