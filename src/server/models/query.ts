import "server-only";

import type { db } from "@/server/db";
import { ValidationError } from "@/server/http/errors";

export type Pagination = { page: number; limit: number };
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function paginate<T>(
  { page, limit }: Pagination,
  hitungTotal: PromiseLike<number>,
  ambilBaris: (limit: number, offset: number) => PromiseLike<T[]>,
) {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new ValidationError("Halaman harus berupa bilangan bulat positif.");
  }
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new ValidationError("Jumlah baris per halaman harus antara 1 dan 100.");
  }
  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(offset)) {
    throw new ValidationError("Nomor halaman terlalu besar.");
  }

  const total = await hitungTotal;
  // Hindari SELECT dengan OFFSET besar ketika halamannya di luar jumlah baris.
  const rows = offset < total ? await ambilBaris(limit, offset) : [];
  return { rows, total };
}

export function isDuplicateEntry(galat: unknown): boolean {
  return (
    (galat instanceof Error && "code" in galat && galat.code === "ER_DUP_ENTRY") ||
    (galat instanceof Error && galat.cause instanceof Error && isDuplicateEntry(galat.cause))
  );
}
