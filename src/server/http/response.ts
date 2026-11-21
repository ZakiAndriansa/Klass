import type { ApiFailure, ApiSuccess, ListMeta } from "@/types/api/common";

/**
 * Pembentuk respons API. Pemilik: Zaki.
 * Semua endpoint memakai dua fungsi ini supaya bentuk respons selalu sama.
 */

/** Respons berhasil: `{ data }`, atau `{ data, meta }` untuk daftar berhalaman. */
export function ok<T>(data: T, status = 200, meta?: ListMeta): Response {
  const isi: ApiSuccess<T> = meta ? { data, meta } : { data };
  return Response.json(isi, { status });
}

/** Respons gagal: `{ error: { code, message, details } }`. */
export function fail(
  status: number,
  code: string,
  message: string,
  details: unknown = null,
): Response {
  const isi: ApiFailure = { error: { code, message, details } };
  return Response.json(isi, { status });
}
