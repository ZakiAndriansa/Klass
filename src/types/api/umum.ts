/**
 * Bentuk umum respons API, dipakai backend (`src/server/http`) dan frontend (`src/lib/api-client`).
 */

/** Keterangan halaman pada respons daftar. */
export type MetaDaftar = {
  page: number;
  limit: number;
  total: number;
};

/** Respons berhasil. `meta` hanya ada pada daftar berhalaman. */
export type ApiSukses<T> = {
  data: T;
  meta?: MetaDaftar;
};

/** Respons gagal. Frontend bercabang berdasarkan `code` dan menampilkan `message`. */
export type ApiGagal = {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
};
