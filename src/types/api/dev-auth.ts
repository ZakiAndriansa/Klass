import { z } from "zod";

/**
 * DTO akun contoh untuk pengembangan (`/api/v1/dev/...`).
 * Hanya berlaku saat pengembangan; di produksi semua alamatnya menjawab 404.
 */

/** Peran yang punya akun contoh. Satu peran, satu akun. */
export const DEV_ROLES = ["superadmin", "class_admin", "subclass_pj", "member", "user"] as const;

export type DevRole = (typeof DEV_ROLES)[number];

/** Satu akun contoh yang bisa dipilih di `/dev/login`. */
export type DevAccountDto = {
  /** Sama dengan `users.id` akun ini di database. */
  id: string;
  name: string;
  email: string;
  role: DevRole;
  /** Nama peran yang enak dibaca, misalnya "Admin kelas". */
  roleLabel: string;
  /** Penjelasan singkat apa yang bisa dilakukan peran ini. */
  description: string;
  /** Halaman yang dibuka setelah masuk dengan akun ini. */
  redirectTo: string;
};

/** Body `POST /api/v1/dev/session`. */
export const devSignInSchema = z.object({
  accountId: z.string({ error: "accountId wajib diisi." }).trim().min(1, "accountId wajib diisi."),
});

export type DevSignInInput = z.infer<typeof devSignInSchema>;
