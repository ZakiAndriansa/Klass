/**
 * Bentuk umum respons API, dipakai backend (`src/server/http`) dan frontend (`src/lib/api-client`).
 */

/** Keterangan halaman pada respons daftar. */
export type ListMeta = {
  page: number;
  limit: number;
  total: number;
};

/** Respons berhasil. `meta` hanya ada pada daftar berhalaman. */
export type ApiSuccess<T> = {
  data: T;
  meta?: ListMeta;
};

/** Respons gagal. Frontend bercabang berdasarkan `code` dan menampilkan `message`. */
export type ApiFailure = {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
};
