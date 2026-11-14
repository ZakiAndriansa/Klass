/**
 * CONTOH DTO. DTO adalah bentuk data yang dikirim backend ke frontend.
 * Backend dan frontend sama-sama mengimpor tipe dari sini, jadi keduanya selalu sepakat.
 */
export type HealthDto = {
  aplikasi: "berjalan";
  database: "terhubung" | "terputus";
};
