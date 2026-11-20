/**
 * Pengguna yang sedang login, dikirim `GET /api/v1/session`.
 *
 * Yang ada di sini hanya identitas. Peran di sebuah kelas berbeda-beda per kelas,
 * jadi diambil terpisah lewat `GET /api/v1/classes/{classId}/access`
 * (`AksesKelasDto` di `class-access.ts`).
 */
export type SesiDto = {
  /** Sama dengan `users.id`. */
  id: string;
  name: string;
  email: string;
  /** Alamat foto profil, atau `null` bila belum ada. */
  image: string | null;
  /** `true` hanya untuk pengelola website. */
  isSuperadmin: boolean;
};
