/**
 * Data contoh untuk dasbor pengguna dan dasbor superadmin.
 *
 * Isi kelas (materi, jadwal, tugas, anggota) punya data contohnya sendiri di
 * `@/components/features/kelas/data-contoh`.
 *
 * TODO(api): ganti isi berkas ini dengan data dari controller/server saat
 * endpoint pengajuan dan poster sudah tersedia. Bentuk tipe di bawah sengaja
 * mengikuti field yang akan dipakai di UI agar penggantian nanti tidak
 * mengubah markup.
 */

export type WarnaKartu = "kuning" | "oranye" | "biru";

export type RingkasanDasbor = {
  nomor: string;
  judul: string;
  deskripsi: string;
  warna: WarnaKartu;
};

export type StatusPengajuan = "Diajukan" | "Disetujui" | "Ditolak";

export type PengajuanDasbor = {
  id: string;
  kelas: string;
  jenis: string;
  pengaju: string;
  email: string;
  tanggal: string;
  status: StatusPengajuan;
};

export const ringkasanSuperadminContoh: RingkasanDasbor[] = [
  {
    nomor: "03",
    judul: "Menunggu tinjauan",
    deskripsi: "Tiga kelas baru ingin mulai merapikan kegiatan.",
    warna: "kuning",
  },
  {
    nomor: "12",
    judul: "Kelas aktif",
    deskripsi: "Kelas yang telah disetujui dan dibuka.",
    warna: "oranye",
  },
  {
    nomor: "01",
    judul: "Poster aktif",
    deskripsi: "Satu agenda tampil di halaman utama.",
    warna: "biru",
  },
];

export const pengajuanContoh: PengajuanDasbor[] = [
  {
    id: "komunitas-fotografi",
    kelas: "Komunitas Fotografi",
    jenis: "Pengajuan ruang komunitas",
    pengaju: "Dina Maharani",
    email: "dina.maharani@gmail.com",
    tanggal: "14 Nov 2026",
    status: "Diajukan",
  },
  {
    id: "statistika-b",
    kelas: "Statistika B",
    jenis: "Pengajuan ruang komunitas",
    pengaju: "Ardi Pratama",
    email: "ardi.pratama@gmail.com",
    tanggal: "14 Nov 2026",
    status: "Diajukan",
  },
  {
    id: "panitia-tech-day",
    kelas: "Panitia Tech Day",
    jenis: "Pengajuan ruang komunitas",
    pengaju: "Raka Wijaya",
    email: "raka.wijaya@gmail.com",
    tanggal: "13 Nov 2026",
    status: "Diajukan",
  },
];

export const posterContoh = {
  judul: "Ide bagus tumbuh kalau dibagi.",
  jadwal: "Sesi kenalan Klass · 21 Nov 2026 · 15.00 WIB",
};

/* --------------------------------------------------------------------------
   Dasbor pengguna (belum punya peran PJ maupun admin kelas)
   -------------------------------------------------------------------------- */

export type StatusKelasDiikuti = "Aktif" | "Menunggu persetujuan" | "Ditolak";

export type KelasDiikuti = {
  id: string;
  nama: string;
  jenis: string;
  /** Ringkasan isi kelas supaya pengguna tahu apa yang bisa dibuka. */
  isi: string;
  peran: string;
  status: StatusKelasDiikuti;
  /** Kosong bila kelas belum bisa dibuka (masih menunggu / ditolak). */
  href?: string;
};

export type PengajuanSaya = {
  id: string;
  kelas: string;
  jenis: string;
  tanggal: string;
  status: StatusPengajuan;
  catatan?: string;
};

export const kelasDiikutiContoh: KelasDiikuti[] = [
  {
    id: "teknik-informatika-a",
    nama: "Teknik Informatika A",
    jenis: "Kelas kuliah · Semester 3",
    isi: "6 subkelas · materi, jadwal, dan tugas",
    peran: "Anggota",
    status: "Aktif",
    href: "/classes/teknik-informatika-a",
  },
  {
    id: "basis-data-2025",
    nama: "Basis Data 2025",
    jenis: "Kelas kuliah · Semester 3",
    isi: "4 subkelas · materi dan tugas",
    peran: "Anggota",
    status: "Aktif",
    href: "/classes/basis-data-2025",
  },
  {
    id: "komunitas-fotografi",
    nama: "Komunitas Fotografi",
    jenis: "Komunitas belajar",
    isi: "Menunggu admin kelas membuka ruang",
    peran: "Pengaju",
    status: "Menunggu persetujuan",
  },
];

export const pengajuanSayaContoh: PengajuanSaya[] = [
  {
    id: "komunitas-fotografi",
    kelas: "Komunitas Fotografi",
    jenis: "Komunitas belajar",
    tanggal: "14 Nov 2026",
    status: "Diajukan",
    catatan: "Menunggu tinjauan superadmin.",
  },
  {
    id: "panitia-tech-day",
    kelas: "Panitia Tech Day",
    jenis: "Organisasi / himpunan",
    tanggal: "2 Nov 2026",
    status: "Ditolak",
    catatan: "Nama kelas terlalu mirip dengan kelas yang sudah ada.",
  },
];

export const ringkasanPenggunaContoh: RingkasanDasbor[] = [
  {
    nomor: "02",
    judul: "Kelas diikuti",
    deskripsi: "Ruang yang sudah bisa kamu buka sekarang.",
    warna: "kuning",
  },
  {
    nomor: "01",
    judul: "Pengajuan diproses",
    deskripsi: "Menunggu tinjauan superadmin.",
    warna: "oranye",
  },
  {
    nomor: "00",
    judul: "Peran khusus",
    deskripsi: "Jadi PJ atau admin kelas lewat pengajuan.",
    warna: "biru",
  },
];

/** Pilihan jenis kelompok di formulir pengajuan. */
export const jenisKelompok = [
  { value: "kuliah", label: "Kelas Kuliah" },
  { value: "organisasi", label: "Organisasi / Himpunan" },
  { value: "komunitas", label: "Komunitas Belajar" },
];
