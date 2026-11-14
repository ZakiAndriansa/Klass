import type { ApiGagal, ApiSukses, MetaDaftar } from "@/types/api/umum";

/**
 * Pembentuk respons API. Pemilik: Zaki.
 * Semua endpoint memakai dua fungsi ini supaya bentuk respons selalu sama.
 */

/** Respons berhasil: `{ data }`, atau `{ data, meta }` untuk daftar berhalaman. */
export function ok<T>(data: T, status = 200, meta?: MetaDaftar): Response {
  const isi: ApiSukses<T> = meta ? { data, meta } : { data };
  return Response.json(isi, { status });
}

/** Respons gagal: `{ error: { code, message, details } }`. */
export function fail(
  status: number,
  code: string,
  message: string,
  details: unknown = null,
): Response {
  const isi: ApiGagal = { error: { code, message, details } };
  return Response.json(isi, { status });
}
