import { listDevAccounts } from "@/server/controllers/dev-auth";
import { handle, ok } from "@/server/http";

/** `GET /api/v1/dev/accounts`: daftar akun contoh. Hanya ada saat pengembangan. */
export const GET = handle(async () => ok(await listDevAccounts()));
