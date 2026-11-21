/**
 * Data contoh untuk Meja (`/dashboard`) dan Loket superadmin.
 *
 * TODO(api): ganti dengan endpoint "milik saya" saat controller siap:
 *   GET /api/v1/me/agenda    → agenda + pita mingguan
 *   GET /api/v1/me/classes   → kelas yang diikuti + jumlah item baru
 *   GET /api/v1/me/feed      → kabar lintas kelas
 *   GET /api/v1/class-requests?mine=1 → riwayat pengajuan
 *   GET /api/v1/admin/...    → antrean, undangan, kondisi situs
 *
 * Bentuk tipe sengaja mengikuti field yang akan dipakai UI supaya penggantian
 * nanti tidak mengubah markup. Data dipilih per `userId` akun contoh
 * (`src/server/auth/dev-accounts.ts`) supaya keadaan "belum punya kelas" dan
 * "sudah punya kelas" bisa dicoba tanpa mengubah kode.
 */

export type WarnaMeja = "kuning" | "biru" | "lila" | "hijau";

export type ItemAgenda = {
  id: string;
  /** Jam siap tampil, mis. "08.00" atau "23.59". */
  jam: string;
  /** Nama kelas atau mata kuliah yang jadi judul baris. */
  judul: string;
  /** Satu baris keterangan: topik + ruang, atau jenis tenggat. */
  keterangan: string;
  jenis: "sesi" | "tugas";
  warna: WarnaMeja;
  href: string;
  /** Tenggat hari ini: ditandai lebih tegas di baris. */
  mendesak?: boolean;
};

export type HariMeja = {
  id: string;
  label: string;
  /** Jumlah kegiatan pada hari itu, dipakai sebagai angka di bawah label. */
  jumlah: number;
  warna: WarnaMeja[];
  /** `true` untuk hari ini, ditandai dengan latar kuning. */
  ini?: boolean;
};

export type Perhatian = {
  id: string;
  judul: string;
  kelas: string;
  tenggat: string;
  /** Sudah lewat tenggat: dihitung terpisah di kepala note. */
  lewat?: boolean;
  warna: WarnaMeja;
  href: string;
};

export type KelasMeja = {
  id: string;
  nama: string;
  peran: string;
  warna: WarnaMeja;
  /** Jumlah materi/jadwal baru yang belum dibuka. */
  baru: number;
  href: string;
};

export type KabarMeja = {
  id: string;
  jenis: "materi" | "jadwal" | "tugas" | "pengumuman";
  judul: string;
  kelas: string;
  waktu: string;
  warna: WarnaMeja;
  href: string;
};

export type PengajuanMeja = {
  id: string;
  kelas: string;
  jenis: string;
  tanggal: string;
  status: "Diajukan" | "Disetujui" | "Ditolak";
  catatan?: string;
};

export type MejaData = {
  /** Tanggal siap tampil di eyebrow, mis. "21 November 2026". */
  tanggal: string;
  agenda: ItemAgenda[];
  minggu: HariMeja[];
  perhatian: Perhatian[];
  kelas: KelasMeja[];
  kabar: KabarMeja[];
  pengajuan: PengajuanMeja[];
};

/* --------------------------------------------------------------------------
   Loket superadmin
   -------------------------------------------------------------------------- */

export type SinyalAntrean = {
  nada: "info" | "waspada";
  teks: string;
};

export type AntreanPengajuan = {
  id: string;
  kelas: string;
  jenis: string;
  pengaju: string;
  email: string;
  deskripsi: string;
  /** Tanggal pengajuan siap tampil. */
  diajukan: string;
  /** Umur pengajuan dalam jam; dasar warna peringatan di kartu. */
  umurJam: number;
  akunSejak: string;
  jumlahKelas: number;
  sinyal: SinyalAntrean[];
};

export type UndanganAdmin = {
  id: string;
  nama: string;
  kelas: string;
  umurHari: number;
};

export type KondisiSitus = {
  pengingatAktif: boolean;
  terakhirKirim: string;
  gagal: number;
};

export type LoketData = {
  antrean: AntreanPengajuan[];
  undangan: UndanganAdmin[];
  kondisi: KondisiSitus;
};

/* --------------------------------------------------------------------------
   Isi Meja per akun contoh
   -------------------------------------------------------------------------- */

const mejaAnggota: MejaData = {
  tanggal: "21 November 2026",
  agenda: [
    {
      id: "agenda-bd",
      jam: "08.00",
      judul: "Basis Data",
      keterangan: "Query lanjutan · Lab Komputer 3 · 08.00–09.40",
      jenis: "sesi",
      warna: "kuning",
      href: "/classes/teknik-informatika-a/schedule",
    },
    {
      id: "agenda-alg",
      jam: "13.00",
      judul: "Algoritma",
      keterangan: "Latihan graf · Ruang 301 · 13.00–14.40",
      jenis: "sesi",
      warna: "biru",
      href: "/classes/teknik-informatika-a/schedule",
    },
    {
      id: "agenda-tugas",
      jam: "23.59",
      judul: "Normalisasi tabel nilai sampai 3NF",
      keterangan: "Basis Data · tenggat hari ini",
      jenis: "tugas",
      warna: "kuning",
      href: "/classes/teknik-informatika-a/progress",
      mendesak: true,
    },
  ],
  minggu: [
    { id: "sen", label: "Sen", jumlah: 2, warna: ["kuning", "hijau"] },
    { id: "sel", label: "Sel", jumlah: 1, warna: ["biru"] },
    { id: "rab", label: "Rab", jumlah: 1, warna: ["lila"] },
    { id: "kam", label: "Kam", jumlah: 3, warna: ["kuning", "biru", "kuning"], ini: true },
    { id: "jum", label: "Jum", jumlah: 2, warna: ["lila", "hijau"] },
    { id: "sab", label: "Sab", jumlah: 2, warna: ["kuning", "lila"] },
  ],
  perhatian: [
    {
      id: "ph-1",
      judul: "Normalisasi tabel nilai sampai 3NF",
      kelas: "Basis Data",
      tenggat: "Hari ini, 23.59",
      warna: "kuning",
      href: "/classes/teknik-informatika-a/progress",
    },
    {
      id: "ph-2",
      judul: "Analisis kompleksitas tiga algoritma",
      kelas: "Algoritma",
      tenggat: "2 hari lagi",
      warna: "biru",
      href: "/classes/teknik-informatika-a/progress",
    },
    {
      id: "ph-3",
      judul: "Window function: tiga soal latihan",
      kelas: "Basis Data 2025",
      tenggat: "3 hari lagi",
      warna: "biru",
      href: "/classes/basis-data-2025/progress",
    },
  ],
  kelas: [
    {
      id: "teknik-informatika-a",
      nama: "Teknik Informatika A",
      peran: "PJ Basis Data",
      warna: "kuning",
      baru: 2,
      href: "/classes/teknik-informatika-a",
    },
    {
      id: "basis-data-2025",
      nama: "Basis Data 2025",
      peran: "Anggota",
      warna: "biru",
      baru: 1,
      href: "/classes/basis-data-2025",
    },
    {
      id: "komunitas-fotografi",
      nama: "Komunitas Fotografi",
      peran: "Anggota",
      warna: "lila",
      baru: 0,
      href: "/classes/komunitas-fotografi",
    },
  ],
  kabar: [
    {
      id: "kabar-1",
      jenis: "materi",
      judul: "Slide B-Tree Indexing terbit",
      kelas: "Basis Data 2025",
      waktu: "Kemarin, 16.40",
      warna: "biru",
      href: "/classes/basis-data-2025/materials",
    },
    {
      id: "kabar-2",
      jenis: "jadwal",
      judul: "Sesi Kamis pindah ke Lab Komputer 3",
      kelas: "Teknik Informatika A",
      waktu: "Kemarin, 09.12",
      warna: "kuning",
      href: "/classes/teknik-informatika-a/schedule",
    },
    {
      id: "kabar-3",
      jenis: "materi",
      judul: "Tema latihan baru: Cahaya",
      kelas: "Komunitas Fotografi",
      waktu: "2 hari lalu",
      warna: "lila",
      href: "/classes/komunitas-fotografi/materials",
    },
  ],
  pengajuan: [
    {
      id: "klub-debat",
      kelas: "Klub Debat Kampus",
      jenis: "Organisasi / himpunan",
      tanggal: "18 Nov 2026",
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
  ],
};

const mejaKosong: MejaData = {
  tanggal: "21 November 2026",
  agenda: [],
  minggu: [],
  perhatian: [],
  kelas: [],
  kabar: [],
  pengajuan: [],
};

/**
 * Meja per akun contoh. Akun yang tidak terdaftar di sini memakai meja anggota
 * supaya halaman tetap bisa dibuka saat pengembangan.
 */
const mejaPerPengguna: Record<string, MejaData> = {
  "dev-anggota": mejaAnggota,
  "dev-admin-kelas": mejaAnggota,
  "dev-pj": mejaAnggota,
  "dev-superadmin": mejaAnggota,
  "dev-pengguna": mejaKosong,
};

export function ambilMeja(userId: string): MejaData {
  return mejaPerPengguna[userId] ?? mejaAnggota;
}

/** Pilihan jenis kelompok di formulir pengajuan. */
export const jenisKelompok = [
  { value: "kuliah", label: "Kelas Kuliah" },
  { value: "organisasi", label: "Organisasi / Himpunan" },
  { value: "komunitas", label: "Komunitas Belajar" },
];

/** Antrean contoh di Loket superadmin. */
export const loketContoh: LoketData = {
  antrean: [
    {
      id: "komunitas-fotografi",
      kelas: "Komunitas Fotografi",
      jenis: "Pengajuan ruang komunitas",
      pengaju: "Dina Maharani",
      email: "dina.maharani@gmail.com",
      deskripsi:
        "Ruang untuk kelas fotografi mingguan dan arsip hasil tugas. Anggotanya lintas jurusan, sekitar 30 orang.",
      diajukan: "19 Nov 2026",
      umurJam: 50,
      akunSejak: "4 bulan lalu",
      jumlahKelas: 0,
      sinyal: [{ nada: "waspada", teks: 'Nama mirip kelas aktif "Fotografi DKV".' }],
    },
    {
      id: "statistika-b",
      kelas: "Statistika B",
      jenis: "Pengajuan kelas kuliah",
      pengaju: "Ardi Pratama",
      email: "ardi.pratama@gmail.com",
      deskripsi:
        "Kelas kuliah Semester 3. Butuh tempat untuk materi, jadwal responsi, dan pengingat tugas.",
      diajukan: "20 Nov 2026",
      umurJam: 26,
      akunSejak: "1 tahun lalu",
      jumlahKelas: 2,
      sinyal: [],
    },
    {
      id: "panitia-tech-day",
      kelas: "Panitia Tech Day",
      jenis: "Pengajuan ruang komunitas",
      pengaju: "Raka Wijaya",
      email: "raka.wijaya@gmail.com",
      deskripsi:
        "Ruang panitia untuk 12 divisi. Perlu materi, jadwal rapat, dan daftar tugas per divisi.",
      diajukan: "21 Nov 2026",
      umurJam: 3,
      akunSejak: "2 hari lalu",
      jumlahKelas: 0,
      sinyal: [{ nada: "info", teks: "Akun baru dibuat 2 hari lalu." }],
    },
  ],
  undangan: [
    { id: "inv-1", nama: "Ardi Pratama", kelas: "Statistika B", umurHari: 3 },
    { id: "inv-2", nama: "Nadia Putri", kelas: "Basis Data 2025", umurHari: 1 },
  ],
  kondisi: {
    pengingatAktif: true,
    terakhirKirim: "12 menit lalu",
    gagal: 0,
  },
};
