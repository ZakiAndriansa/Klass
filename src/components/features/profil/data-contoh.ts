/**
 * Data contoh untuk halaman profil.
 *
 * TODO(api): ganti dengan `GET /api/v1/classes` (daftar kelas yang diikuti)
 * dan endpoint riwayat kelas. Sampai endpoint itu ada, isi di sini dipakai
 * supaya tata letak buku dan daftar peran bisa diuji.
 *
 * Bentuk tipe sengaja mengikuti field yang akan dipakai UI agar penggantian
 * nanti tidak mengubah markup.
 */

export type PeranProfil = "Admin kelas" | "PJ" | "Anggota";

export type KelasProfil = {
  id: string;
  nama: string;
  peran: PeranProfil;
  /** Subkelas yang dipegang, hanya untuk PJ. */
  pjSubkelas?: string[];
  anggota: number;
  /** Ringkasan aktivitas terakhir, dipakai di kolom histori. */
  aktivitas: string;
  waktu: string;
  warna: "kuning" | "biru" | "lila" | "hijau";
};

export type CatatanProfil = {
  judul: string;
  isi: string;
  waktu: string;
  jenis: "materi" | "jadwal" | "tugas" | "anggota";
};

/** Kelas yang diikuti, dipakai untuk daftar peran dan shortcut. */
export const kelasProfilContoh: KelasProfil[] = [
  {
    id: "teknik-informatika-a",
    nama: "Teknik Informatika A",
    peran: "Admin kelas",
    anggota: 46,
    aktivitas: "Menambahkan subkelas Basis Data Lanjut",
    waktu: "Hari ini, 09.12",
    warna: "kuning",
  },
  {
    id: "basis-data-lanjut",
    nama: "Basis Data Lanjut",
    peran: "PJ",
    pjSubkelas: ["Normalisasi & indeks"],
    anggota: 42,
    aktivitas: "Menerbitkan materi B-Tree Indexing",
    waktu: "Kemarin, 16.40",
    warna: "lila",
  },
  {
    id: "pemrograman-web",
    nama: "Pemrograman Web",
    peran: "Anggota",
    anggota: 38,
    aktivitas: "Tugas Modul 05 dinilai",
    waktu: "2 hari lalu",
    warna: "hijau",
  },
  {
    id: "sistem-operasi",
    nama: "Sistem Operasi",
    peran: "Anggota",
    anggota: 44,
    aktivitas: "Jadwal responsi dipindah ke Jumat",
    waktu: "4 hari lalu",
    warna: "biru",
  },
];

export type JadwalProfil = {
  hari: string;
  jam: string;
  kelas: string;
  ruang: string;
  /** `true` untuk sesi terdekat, ditandai di halaman catatan. */
  terdekat?: boolean;
};

/** Jadwal terdekat, tampil bersama catatan di halaman kiri. */
export const jadwalProfilContoh: JadwalProfil[] = [
  {
    hari: "Hari ini",
    jam: "15.00",
    kelas: "Basis Data Lanjut",
    ruang: "Lab 3",
    terdekat: true,
  },
  {
    hari: "Besok",
    jam: "08.00",
    kelas: "Pemrograman Web",
    ruang: "Lab 1",
  },
  {
    hari: "Jumat",
    jam: "13.00",
    kelas: "Sistem Operasi",
    ruang: "Ruang 2.4",
  },
];

/** Catatan terbaru, tampil di halaman kanan buku. */
export const catatanProfilContoh: CatatanProfil[] = [
  {
    judul: "Materi baru di Basis Data Lanjut",
    isi: "B-Tree Indexing dan Query Optimization sudah bisa diunduh.",
    waktu: "Hari ini, 09.12",
    jenis: "materi",
  },
  {
    judul: "Jadwal responsi berubah",
    isi: "Sistem Operasi · Jumat, 15.00 di Lab 2 (sebelumnya Kamis).",
    waktu: "Kemarin, 14.05",
    jenis: "jadwal",
  },
  {
    judul: "Tugas Modul 05 dibuka",
    isi: "Pemrograman Web · tenggat Minggu, 23.59.",
    waktu: "2 hari lalu",
    jenis: "tugas",
  },
];
