import "server-only";

import { ValidationError } from "./errors";

/**
 * Membaca body JSON dari permintaan. Pemilik: Zaki.
 *
 * Pakai fungsi ini di `route.ts`, bukan `req.json()`. Bila body kosong atau bukan
 * JSON, `req.json()` melempar galat yang berakhir sebagai 500. Fungsi ini
 * mengubahnya menjadi 400 `VALIDATION_ERROR`, karena yang salah adalah kiriman klien.
 *
 * Pemakaian:
 *   export const POST = handle(async (req) => ok(await buatKelas(await readJson(req)), 201));
 *
 * Hasilnya `unknown`. Bentuknya baru diperiksa controller dengan Zod.
 */
export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ValidationError("Body harus berupa JSON yang valid.");
  }
}
