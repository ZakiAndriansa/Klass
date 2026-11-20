import { masukDev } from "@/server/controllers/dev-auth";
import { bacaJson, handle, ok } from "@/server/http";

/**
 * `POST /api/v1/dev/session`: masuk sebagai akun contoh, body `{ "accountId": "dev-superadmin" }`.
 * Hanya ada saat pengembangan.
 *
 * Membaca sesi dan keluar memakai `/api/v1/session`, yang berlaku juga di produksi.
 */
export const POST = handle(async (req) => ok(await masukDev(await bacaJson(req))));
