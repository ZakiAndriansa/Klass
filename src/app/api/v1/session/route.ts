import { endSession, getMySession } from "@/server/controllers/session";
import { handle, ok } from "@/server/http";

/**
 * `/api/v1/session`: sesi pengguna yang sedang login.
 *
 * GET     siapa yang sedang login, atau `null` bila belum login
 * DELETE  keluar
 */
export const GET = handle(async () => ok(await getMySession()));

export const DELETE = handle(async () => ok(await endSession()));
