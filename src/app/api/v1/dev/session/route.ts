import { keluarDev, masukDev, sesiDev } from "@/server/controllers/dev-auth";
import { handle, ok } from "@/server/http";

/**
 * `/api/v1/dev/session`: sesi akun contoh. Hanya ada saat pengembangan.
 *
 * GET     siapa yang sedang login
 * POST    masuk sebagai akun contoh, body `{ "idAkun": "dev-superadmin" }`
 * DELETE  keluar
 */
export const GET = handle(async () => ok(await sesiDev()));

export const POST = handle(async (req) => ok(await masukDev(await req.json())));

export const DELETE = handle(async () => ok(await keluarDev()));
