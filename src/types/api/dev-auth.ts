import { z } from "zod";

/**
 * DTO akun contoh untuk pengembangan (`/api/v1/dev/...`).
 * Hanya berlaku saat pengembangan; di produksi semua alamatnya menjawab 404.
 */

/** Peran yang punya akun contoh. Satu peran, satu akun. */
export const PERAN_DEV = ["superadmin", "class_admin", "subclass_pj", "member", "user"] as const;

export type PeranDev = (typeof PERAN_DEV)[number];

/** Satu akun contoh yang bisa dipilih di `/dev/login`. */
export type AkunDevDto = {
  /** Sama dengan `users.id` akun ini di database. */
  id: string;
  name: string;
  email: string;
  role: PeranDev;
  /** Nama peran yang enak dibaca, misalnya "Admin kelas". */
  roleLabel: string;
  /** Penjelasan singkat apa yang bisa dilakukan peran ini. */
  description: string;
  /** Halaman yang dibuka setelah masuk dengan akun ini. */
  redirectTo: string;
};

/** Body `POST /api/v1/dev/session`. */
export const masukDevSchema = z.object({
  accountId: z.string({ error: "accountId wajib diisi." }).trim().min(1, "accountId wajib diisi."),
});

export type MasukDevInput = z.infer<typeof masukDevSchema>;
