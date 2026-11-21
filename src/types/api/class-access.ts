/** Peran seorang anggota di satu kelas. */
export type ClassRole = "admin" | "member";

/**
 * Hak pengguna yang sedang login di SATU kelas, dikirim
 * `GET /api/v1/classes/{classId}/access`.
 *
 * Dipakai frontend untuk memutuskan tombol mana yang ditampilkan:
 *
 *   tombol atur kelas (tema, subkelas, PJ, kick, ban)    role === "admin"
 *   tombol kelola satu subkelas (materi, jadwal, tugas)  role === "admin", atau id-nya ada di pjSubclassIds
 *   tombol gabung                                        role === null
 *   semua tombol ubah disembunyikan                      readOnly === true
 *
 * Ini hanya untuk tampilan. Server tetap memeriksa izin di setiap endpoint.
 */
export type ClassAccessDto = {
  classId: string;
  /** `null` berarti belum menjadi anggota kelas ini. */
  role: ClassRole | null;
  /** ID subkelas di kelas ini yang PJ-nya pengguna ini. Kosong bila bukan PJ. */
  pjSubclassIds: string[];
  /** `true` bila kelas sudah diarsipkan: masih bisa dibaca, tidak bisa diubah. */
  readOnly: boolean;
};
