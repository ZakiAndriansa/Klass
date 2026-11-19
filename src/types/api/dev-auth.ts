import { z } from "zod";

/**
 * DTO akun contoh untuk pengembangan (`/api/v1/dev/...`).
 * Hanya berlaku saat pengembangan; di produksi semua alamatnya menjawab 404.
 */

/** Peran yang punya akun contoh. Satu peran, satu akun. */
export const PERAN_DEV = ["superadmin", "admin_kelas", "pj", "anggota", "pengguna"] as const;

export type PeranDev = (typeof PERAN_DEV)[number];

/** Satu akun contoh yang bisa dipilih di `/dev/login`. */
export type AkunDevDto = {
  /** Sama dengan `users.id` akun ini di database. */
  id: string;
  nama: string;
  email: string;
  peran: PeranDev;
  /** Nama peran yang enak dibaca, misalnya "Admin kelas". */
  labelPeran: string;
  /** Penjelasan singkat apa yang bisa dilakukan peran ini. */
  keterangan: string;
  /** Halaman yang dibuka setelah masuk dengan akun ini. */
  tujuan: string;
};

/** Pengguna yang sedang login. */
export type SesiDevDto = {
  idPengguna: string;
  nama: string;
  email: string;
  isSuperadmin: boolean;
  /** `null` bila yang login bukan salah satu akun contoh. */
  peran: PeranDev | null;
};

/** Body `POST /api/v1/dev/session`. */
export const masukDevSchema = z.object({
  idAkun: z.string({ error: "idAkun wajib diisi." }).trim().min(1, "idAkun wajib diisi."),
});

export type MasukDevInput = z.infer<typeof masukDevSchema>;
