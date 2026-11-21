import "server-only";
import { unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import { z, ZodError } from "zod";

import { AppError } from "./errors";
import { fail } from "./response";

type Handler<Konteks> = (req: Request, ctx: Konteks) => Promise<Response>;

/**
 * Pembungkus semua fungsi di `route.ts`. Pemilik: Zaki.
 *
 * Yang dikerjakan:
 * 1. Memastikan endpoint dijalankan saat ada permintaan, bukan saat `npm run build`.
 * 2. Menangkap galat dan mengubahnya menjadi respons JSON yang seragam,
 *    sehingga `route.ts` tidak perlu menulis `try` dan `catch`.
 *
 * Pemakaian:
 *   export const GET = handle(async () => ok(await checkHealth()));
 */
export function handle<Konteks = unknown>(penangan: Handler<Konteks>): Handler<Konteks> {
  return async (req, ctx) => {
    await connection();

    try {
      return await penangan(req, ctx);
    } catch (galat) {
      // Galat internal Next.js (redirect, notFound, dan sejenisnya) diteruskan apa adanya.
      unstable_rethrow(galat);

      if (galat instanceof ZodError) {
        return fail(
          400,
          "VALIDATION_ERROR",
          "Data yang dikirim tidak valid.",
          z.flattenError(galat).fieldErrors,
        );
      }

      if (galat instanceof AppError) {
        return fail(galat.status, galat.code, galat.message, galat.details);
      }

      // Rincian galat tak terduga hanya dicatat di server, tidak dikirim ke pengguna.
      console.error("[api]", req.method, new URL(req.url).pathname, galat);
      return fail(500, "INTERNAL_ERROR", "Terjadi kesalahan di server.");
    }
  };
}
