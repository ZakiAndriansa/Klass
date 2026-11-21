import type { AksesKelasDto } from "@/types/api/class-access";

/**
 * Menerjemahkan `AksesKelasDto` menjadi keputusan tampilan.
 *
 * Satu-satunya tempat di frontend yang boleh menulis perbandingan peran.
 * Komponen cukup bertanya "boleh atur kelas?" tanpa tahu arti `role` dan
 * `pjSubclassIds`. Dengan begitu aturan tombol tidak tersebar di banyak berkas
 * dan tidak berbeda antar halaman.
 *
 * Ini HANYA untuk tampilan. Server tetap memeriksa izin di setiap endpoint,
 * jadi menyembunyikan tombol bukan pengamanan (lihat `docs/api.md`).
 */
export type HakKelas = {
  /** Admin kelas: atur tema, subkelas, PJ, keluarkan, dan blokir anggota. */
  bolehAturKelas: boolean;
  /** Sudah menjadi anggota, apa pun perannya. */
  sudahAnggota: boolean;
  /** Belum anggota: tampilkan tombol gabung, bukan tombol kelola. */
  perluGabung: boolean;
  /** Kelas diarsipkan: semua tombol ubah disembunyikan. */
  terkunci: boolean;
};

export type AksesKelas = Pick<AksesKelasDto, "role" | "pjSubclassIds" | "readOnly">;

export function hakKelas(akses: AksesKelas | null): HakKelas {
  if (!akses) {
    return { bolehAturKelas: false, sudahAnggota: false, perluGabung: false, terkunci: false };
  }

  const readOnly = akses.readOnly;
  const admin = akses.role === "admin";

  return {
    bolehAturKelas: admin && !readOnly,
    sudahAnggota: akses.role !== null,
    perluGabung: akses.role === null,
    terkunci: readOnly,
  };
}

/**
 * Boleh mengubah isi satu subkelas (materi, jadwal, tugas).
 *
 * Admin kelas boleh semuanya; PJ hanya subkelas yang dipegangnya.
 */
export function bolehKelolaSubkelas(akses: AksesKelas | null, subclassId: string): boolean {
  if (!akses || akses.readOnly) return false;
  if (akses.role === "admin") return true;

  return akses.pjSubclassIds.includes(subclassId);
}

/**
 * Label peran untuk ditampilkan, misalnya di lencana kartu kelas.
 *
 * "PJ" hanya dipakai bila pengguna benar-benar memegang subkelas di kelas itu,
 * supaya anggota biasa tidak diberi label PJ hanya karena ada di daftar PJ
 * kelas lain.
 */
export function labelPeran(akses: AksesKelas | null): "Admin kelas" | "PJ" | "Anggota" | "Belum gabung" {
  if (!akses || akses.role === null) return "Belum gabung";
  if (akses.role === "admin") return "Admin kelas";
  if (akses.pjSubclassIds.length > 0) return "PJ";

  return "Anggota";
}
