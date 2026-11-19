/**
 * Data contoh pengalaman Kelas.
 *
 * TODO(api): ganti seluruh isi berkas ini dengan data dari controller kelas,
 * materi, jadwal, tugas, dan anggota. Bentuk tipe di bawah sengaja mengikuti
 * field yang akan dipakai UI supaya penggantian nanti tidak mengubah markup.
 *
 * Data ini hanya diimpor oleh Server Component, kecuali tipe. Client
 * Component menerima potongan data lewat props agar tidak ikut membundel
 * seluruh isi contoh.
 */

export type PeranKelas = "Admin kelas" | "PJ" | "Anggota";
export type WarnaKelas = "kuning" | "biru" | "lila" | "hijau";
export type JenisKelas = "Kelas kuliah" | "Komunitas belajar" | "Organisasi";
export type StatusTugas = "todo" | "doing" | "done";
export type JenisMateri = "pdf" | "video" | "tautan" | "slide" | "catatan";
export type HariKelas = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu";

export type KelasRingkas = {
  id: string;
  nama: string;
  jenis: JenisKelas;
  semester: string;
  angkatan: string;
  deskripsi: string;
  anggota: number;
  kodeUndangan: string;
  peran: PeranKelas;
  warna: WarnaKelas;
  jumlahMateri: number;
  jumlahTugas: number;
  /** Persentase tugas pribadi yang sudah selesai, 0–100. */
  progres: number;
  jadwalBerikutnya: string;
  mataKuliah: string[];
};

export type MataKuliah = {
  id: string;
  nama: string;
  kode: string;
  pj: string;
  warna: WarnaKelas;
  jumlahMateri: number;
  jumlahTugas: number;
  /** Persentase progres pribadi di mata kuliah ini. */
  progres: number;
};

export type Materi = {
  id: string;
  kelasId: string;
  mataKuliahId: string;
  mataKuliah: string;
  warna: WarnaKelas;
  judul: string;
  ringkasan: string;
  jenis: JenisMateri;
  minggu: number;
  tanggal: string;
  durasi: string;
  penulis: string;
  baru?: boolean;
  tujuan: string[];
  poin: string[];
  latihan: string[];
  catatan: string;
  tugasTerkaitId?: string;
};

export type SesiJadwal = {
  id: string;
  hari: HariKelas;
  mulai: string;
  selesai: string;
  mataKuliahId: string;
  mataKuliah: string;
  topik: string;
  ruang: string;
  pj: string;
  mode: "Tatap muka" | "Daring" | "Hybrid";
  warna: WarnaKelas;
};

export type TugasProgress = {
  id: string;
  judul: string;
  mataKuliah: string;
  deadline: string;
  prioritas: "Rendah" | "Sedang" | "Tinggi";
  status: StatusTugas;
  deskripsi?: string;
};

export type AnggotaProgress = {
  id: string;
  nama: string;
  inisial: string;
  peran: PeranKelas;
  mataKuliah?: string;
  bergabung: string;
  /** Status per id tugas. Tugas yang tidak ada di peta dianggap "todo". */
  status: Record<string, StatusTugas>;
};

export type AnggotaKelas = {
  id: string;
  nama: string;
  inisial: string;
  peran: PeranKelas;
  mataKuliah?: string;
  bergabung: string;
};

export type PengumumanKelas = {
  penulis: string;
  inisial: string;
  peran: string;
  isi: string;
  lencana: string;
};

export type KelasDetail = Omit<KelasRingkas, "mataKuliah" | "anggota"> & {
  pengumuman: PengumumanKelas;
  mataKuliah: MataKuliah[];
  jadwal: SesiJadwal[];
  materi: Materi[];
  tugas: TugasProgress[];
  anggota: AnggotaKelas[];
  progresAnggota: AnggotaProgress[];
  /** Anggota yang sedang dilihat. Nanti berasal dari sesi. */
  idSaya: string;
  hariIni: HariKelas;
};

type MateriInput = Omit<Materi, "tujuan" | "poin" | "latihan" | "catatan"> &
  Partial<Pick<Materi, "tujuan" | "poin" | "latihan" | "catatan">>;

function buatMateri(input: MateriInput): Materi {
  return {
    ...input,
    tujuan: input.tujuan ?? [],
    poin: input.poin ?? [],
    latihan: input.latihan ?? [],
    catatan: input.catatan ?? "",
  };
}

const anggotaIntiTI: AnggotaKelas[] = [
  {
    id: "naufal-aqil",
    nama: "Naufal Aqil",
    inisial: "NA",
    peran: "PJ",
    mataKuliah: "Basis Data",
    bergabung: "Agu 2026",
  },
  {
    id: "nadia-putri",
    nama: "Nadia Putri",
    inisial: "NP",
    peran: "PJ",
    mataKuliah: "Basis Data",
    bergabung: "Agu 2026",
  },
  {
    id: "rizky-pratama",
    nama: "Rizky Pratama",
    inisial: "RP",
    peran: "PJ",
    mataKuliah: "Algoritma",
    bergabung: "Agu 2026",
  },
  {
    id: "sinta-amelia",
    nama: "Sinta Amelia",
    inisial: "SA",
    peran: "PJ",
    mataKuliah: "Sistem Operasi",
    bergabung: "Agu 2026",
  },
  {
    id: "dea-larasati",
    nama: "Dea Larasati",
    inisial: "DL",
    peran: "PJ",
    mataKuliah: "Rekayasa Perangkat Lunak",
    bergabung: "Agu 2026",
  },
  {
    id: "bagas-prakoso",
    nama: "Bagas Prakoso",
    inisial: "BP",
    peran: "Anggota",
    bergabung: "Agu 2026",
  },
  {
    id: "citra-maharani",
    nama: "Citra Maharani",
    inisial: "CM",
    peran: "Anggota",
    bergabung: "Sep 2026",
  },
  {
    id: "dimas-ardiansyah",
    nama: "Dimas Ardiansyah",
    inisial: "DA",
    peran: "Anggota",
    bergabung: "Sep 2026",
  },
  {
    id: "eka-safitri",
    nama: "Eka Safitri",
    inisial: "ES",
    peran: "Anggota",
    bergabung: "Sep 2026",
  },
  {
    id: "farah-nabila",
    nama: "Farah Nabila",
    inisial: "FN",
    peran: "Anggota",
    bergabung: "Sep 2026",
  },
  {
    id: "gilang-ramadhan",
    nama: "Gilang Ramadhan",
    inisial: "GR",
    peran: "Anggota",
    bergabung: "Okt 2026",
  },
  {
    id: "hana-putri",
    nama: "Hana Putri",
    inisial: "HP",
    peran: "Anggota",
    bergabung: "Okt 2026",
  },
];

const tugasTI: TugasProgress[] = [
  {
    id: "tugas-normalisasi",
    judul: "Normalisasi tabel nilai sampai 3NF",
    mataKuliah: "Basis Data",
    deadline: "22 Nov 2026",
    prioritas: "Tinggi",
    status: "doing",
    deskripsi: "Lampirkan tabel sebelum dan sesudah normalisasi beserta alasannya.",
  },
  {
    id: "tugas-query",
    judul: "Latihan query JOIN dan subquery",
    mataKuliah: "Basis Data",
    deadline: "25 Nov 2026",
    prioritas: "Sedang",
    status: "done",
  },
  {
    id: "tugas-kompleksitas",
    judul: "Analisis kompleksitas tiga algoritma",
    mataKuliah: "Algoritma",
    deadline: "23 Nov 2026",
    prioritas: "Tinggi",
    status: "todo",
  },
  {
    id: "tugas-graf",
    judul: "Latihan struktur data graf",
    mataKuliah: "Algoritma",
    deadline: "28 Nov 2026",
    prioritas: "Rendah",
    status: "done",
  },
  {
    id: "tugas-cpu",
    judul: "Simulasi penjadwalan CPU",
    mataKuliah: "Sistem Operasi",
    deadline: "26 Nov 2026",
    prioritas: "Sedang",
    status: "doing",
  },
  {
    id: "tugas-usecase",
    judul: "Use case aplikasi kampus",
    mataKuliah: "Rekayasa Perangkat Lunak",
    deadline: "30 Nov 2026",
    prioritas: "Sedang",
    status: "todo",
  },
];

const materiTI: Materi[] = [
  buatMateri({
    id: "normalisasi-basis-data",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "basis-data",
    mataKuliah: "Basis Data",
    warna: "kuning",
    judul: "Normalisasi Basis Data",
    ringkasan:
      "Mengubah tabel yang gemuk menjadi struktur yang tidak menyimpan data ganda, sehingga perubahan di satu tempat tidak membuat data lain ikut rusak.",
    jenis: "pdf",
    minggu: 4,
    tanggal: "18 Nov 2026",
    durasi: "24 halaman",
    penulis: "Naufal Aqil",
    baru: true,
    tugasTerkaitId: "tugas-normalisasi",
    tujuan: [
      "Mengenali anomali sisip, ubah, dan hapus pada tabel yang belum ternormalisasi.",
      "Membedakan bentuk normal pertama, kedua, dan ketiga.",
      "Memecah tabel tanpa kehilangan hubungan antar-data.",
    ],
    poin: [
      "1NF menghapus grup berulang: satu sel berisi satu nilai, bukan daftar nilai.",
      "2NF menghapus ketergantungan parsial: setiap atribut bergantung pada seluruh kunci utama.",
      "3NF menghapus ketergantungan transitif: atribut non-kunci tidak bergantung pada atribut non-kunci lain.",
      "Normalisasi berhenti saat duplikasi hilang dan query masih masuk akal. Tidak semua tabel harus mencapai BCNF.",
    ],
    latihan: [
      "Normalisasi tabel nilai berisi NIM, nama, kode mata kuliah, nama mata kuliah, dan nilai.",
      "Tentukan kunci utama setiap tabel hasil dan gambarkan relasinya.",
      "Tulis satu query JOIN yang mengambil nilai akhir seorang mahasiswa.",
    ],
    catatan:
      "Jangan memecah tabel hanya karena angkanya berulang. Pisahkan bila ada ketergantungan data yang menyebabkan anomali.",
  }),
  buatMateri({
    id: "query-lanjutan-join",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "basis-data",
    mataKuliah: "Basis Data",
    warna: "kuning",
    judul: "Query Lanjutan dengan JOIN",
    ringkasan:
      "Membaca data dari beberapa tabel sekaligus dengan INNER, LEFT, dan self JOIN, lalu memeriksa hasilnya sebelum dipakai di aplikasi.",
    jenis: "video",
    minggu: 5,
    tanggal: "12 Nov 2026",
    durasi: "18 menit",
    penulis: "Nadia Putri",
    tugasTerkaitId: "tugas-query",
    tujuan: [
      "Memilih jenis JOIN sesuai data yang ingin dipertahankan.",
      "Membaca hasil JOIN yang kosong atau berlipat.",
      "Menulis query dengan alias yang mudah dibaca.",
    ],
    poin: [
      "INNER JOIN hanya mengembalikan baris yang cocok di kedua tabel.",
      "LEFT JOIN mempertahankan semua baris tabel kiri, termasuk yang tidak punya pasangan.",
      "Self JOIN dipakai untuk hubungan dalam satu tabel, misalnya atasan dan bawahan.",
      "Periksa jumlah baris sebelum dan sesudah JOIN; hasil yang berlipat biasanya berasal dari relasi banyak-ke-banyak yang belum dijembatani.",
    ],
    latihan: [
      "Ambil daftar mahasiswa beserta nilai mata kuliahnya, termasuk mahasiswa yang belum punya nilai.",
      "Tampilkan nama mata kuliah dan jumlah mahasiswa yang mengambilnya.",
    ],
    catatan:
      "Alias tabel pendek boleh, tetapi jangan sampai menutupi asal kolom saat query mulai panjang.",
  }),
  buatMateri({
    id: "erd-relasi-many-to-many",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "basis-data",
    mataKuliah: "Basis Data",
    warna: "kuning",
    judul: "ERD: Relasi Many-to-Many",
    ringkasan:
      "Menerjemahkan hubungan banyak-ke-banyak menjadi tabel penghubung yang menyimpan kunci dari kedua sisi.",
    jenis: "slide",
    minggu: 3,
    tanggal: "5 Nov 2026",
    durasi: "32 slide",
    penulis: "Nadia Putri",
    tujuan: [
      "Menggambar relasi banyak-ke-banyak dengan tabel jembatan.",
      "Menentukan kunci gabungan dan atribut tambahan pada tabel jembatan.",
    ],
    poin: [
      "Relasi banyak-ke-banyak tidak disimpan langsung sebagai dua foreign key di salah satu tabel.",
      "Tabel jembatan menyimpan pasangan kunci dan atribut hubungan, misalnya tanggal ambil mata kuliah.",
      "Kunci utama tabel jembatan dapat berupa gabungan dua foreign key atau id tersendiri.",
    ],
    latihan: [
      "Gambar ERD untuk mahasiswa, mata kuliah, dan nilai.",
      "Tambahkan atribut semester pada hubungan mahasiswa–mata kuliah.",
    ],
    catatan: "ERD yang benar harus bisa dibaca tanpa menebak arah panah.",
  }),
  buatMateri({
    id: "kompleksitas-waktu",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "algoritma",
    mataKuliah: "Algoritma",
    warna: "biru",
    judul: "Kompleksitas Waktu",
    ringkasan:
      "Membandingkan algoritma berdasarkan pertumbuhan jumlah langkah saat ukuran input bertambah, bukan berdasarkan waktu eksekusi di satu komputer.",
    jenis: "video",
    minggu: 4,
    tanggal: "17 Nov 2026",
    durasi: "14 menit",
    penulis: "Rizky Pratama",
    baru: true,
    tugasTerkaitId: "tugas-kompleksitas",
    tujuan: [
      "Menuliskan notasi Big-O dari potongan kode sederhana.",
      "Membedakan kasus terbaik, rata-rata, dan terburuk.",
      "Memilih struktur data dengan biaya operasi yang masuk akal.",
    ],
    poin: [
      "O(1) berarti jumlah langkah tidak bergantung pada ukuran input.",
      "O(n) berarti satu putaran atas seluruh input; O(n²) berarti putaran bersarang.",
      "Konstanta dan suku berpangkat rendah diabaikan saat menulis Big-O.",
      "Notasi Big-O menggambarkan batas atas pertumbuhan, bukan waktu dalam milidetik.",
    ],
    latihan: [
      "Tentukan kompleksitas pencarian linear dan pencarian biner.",
      "Bandingkan dua algoritma pengurutan untuk input 10, 1.000, dan 1.000.000 elemen.",
    ],
    catatan:
      "Algoritma yang lebih cepat di input kecil belum tentu lebih cepat di input besar. Lihat pertumbuhannya.",
  }),
  buatMateri({
    id: "divide-and-conquer",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "algoritma",
    mataKuliah: "Algoritma",
    warna: "biru",
    judul: "Divide and Conquer",
    ringkasan:
      "Memecah masalah besar menjadi bagian yang lebih kecil, menyelesaikan tiap bagian, lalu menggabungkan hasilnya.",
    jenis: "pdf",
    minggu: 5,
    tanggal: "10 Nov 2026",
    durasi: "20 halaman",
    penulis: "Rizky Pratama",
    tujuan: [
      "Mengenali masalah yang cocok dipecah secara rekursif.",
      "Menulis relasi rekurensi sederhana.",
    ],
    poin: [
      "Tiga langkah: divide, conquer, combine.",
      "Merge sort memecah larik sampai satu elemen, lalu menggabungkan dua larik terurut.",
      "Binary search hanya bekerja pada data yang sudah terurut.",
      "Relasi rekurensi T(n) = 2T(n/2) + O(n) menghasilkan O(n log n).",
    ],
    latihan: [
      "Tulis langkah merge sort untuk larik 8, 3, 5, 1, 9, 2.",
      "Hitung jumlah perbandingan binary search untuk 32 data.",
    ],
    catatan: "Rekursi butuh kondisi berhenti. Tanpa itu, program akan terus memanggil dirinya.",
  }),
  buatMateri({
    id: "struktur-data-graf",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "algoritma",
    mataKuliah: "Algoritma",
    warna: "biru",
    judul: "Struktur Data Graf",
    ringkasan:
      "Menyimpan hubungan antar-simpul dengan adjacency list atau matrix, lalu memilih representasi sesuai kebutuhan.",
    jenis: "tautan",
    minggu: 3,
    tanggal: "3 Nov 2026",
    durasi: "12 menit baca",
    penulis: "Rizky Pratama",
    tugasTerkaitId: "tugas-graf",
    tujuan: [
      "Membedakan graf berarah, tak berarah, dan berbobot.",
      "Memilih adjacency list atau matrix berdasarkan kepadatan graf.",
    ],
    poin: [
      "Adjacency list hemat ruang untuk graf jarang.",
      "Adjacency matrix cepat untuk mengecek ada tidaknya sisi, tetapi memakan O(V²) ruang.",
      "BFS cocok untuk jarak terpendek pada graf tanpa bobot; DFS cocok untuk penelusuran dan deteksi siklus.",
    ],
    latihan: [
      "Gambar adjacency list untuk graf pertemanan lima simpul.",
      "Tentukan lintasan terpendek dari simpul A ke E memakai BFS.",
    ],
    catatan: "Graf adalah alat berpikir. Gambarkan dulu, baru pilih struktur penyimpanannya.",
  }),
  buatMateri({
    id: "penjadwalan-proses",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "sistem-operasi",
    mataKuliah: "Sistem Operasi",
    warna: "lila",
    judul: "Penjadwalan Proses",
    ringkasan:
      "Membandingkan FCFS, SJF, dan round robin lewat waiting time serta turnaround time pada satu set proses.",
    jenis: "slide",
    minggu: 4,
    tanggal: "16 Nov 2026",
    durasi: "28 slide",
    penulis: "Sinta Amelia",
    baru: true,
    tugasTerkaitId: "tugas-cpu",
    tujuan: [
      "Menghitung waiting time dan turnaround time.",
      "Menjelaskan trade-off keadilan dan efisiensi pada tiap algoritma.",
    ],
    poin: [
      "FCFS sederhana tetapi bisa mengalami convoy effect.",
      "SJF meminimalkan rata-rata waiting time, tetapi butuh perkiraan burst time.",
      "Round robin memberi setiap proses jatah waktu yang sama; panjang quantum memengaruhi overhead context switch.",
      "Prioritas tanpa aging dapat membuat proses berprioritas rendah kelaparan.",
    ],
    latihan: [
      "Hitung rata-rata waiting time untuk empat proses dengan FCFS dan SJF.",
      "Simulasikan round robin quantum 2 untuk lima proses.",
    ],
    catatan:
      "Tabel Gantt membantu, tetapi keputusan akhir tetap harus dijelaskan dengan angka rata-rata.",
  }),
  buatMateri({
    id: "sinkronisasi-semaphore",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "sistem-operasi",
    mataKuliah: "Sistem Operasi",
    warna: "lila",
    judul: "Sinkronisasi dan Semaphore",
    ringkasan:
      "Mengatur akses bersama dengan mutex dan semaphore agar dua proses tidak mengubah data yang sama secara bersamaan.",
    jenis: "video",
    minggu: 5,
    tanggal: "9 Nov 2026",
    durasi: "22 menit",
    penulis: "Sinta Amelia",
    tujuan: [
      "Membedakan race condition, critical section, dan deadlock.",
      "Menggunakan semaphore biner dan penghitung dengan benar.",
    ],
    poin: [
      "Race condition muncul saat hasil bergantung pada urutan eksekusi yang tidak diatur.",
      "Mutex menjaga satu pemilik pada satu waktu; semaphore penghitung membatasi jumlah pemakai.",
      "Deadlock dapat muncul bila beberapa proses menunggu sumber daya secara melingkar.",
      "Urutan acquire dan release harus konsisten untuk menghindari kebuntuan.",
    ],
    latihan: [
      "Tulis pseudocode producer–consumer dengan semaphore.",
      "Cari satu urutan eksekusi yang membuat dua mutex saling menunggu.",
    ],
    catatan:
      "Sinkronisasi yang benar lebih penting daripada sinkronisasi yang cepat. Ukur dulu sebelum mengoptimalkan.",
  }),
  buatMateri({
    id: "manajemen-memori",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "sistem-operasi",
    mataKuliah: "Sistem Operasi",
    warna: "lila",
    judul: "Manajemen Memori",
    ringkasan:
      "Membahas paging, segmentasi, dan page replacement saat memori fisik lebih kecil dari kebutuhan proses.",
    jenis: "pdf",
    minggu: 3,
    tanggal: "2 Nov 2026",
    durasi: "18 halaman",
    penulis: "Sinta Amelia",
    tujuan: [
      "Membedakan alamat logis dan alamat fisik.",
      "Membandingkan FIFO, LRU, dan optimal page replacement.",
    ],
    poin: [
      "Paging memecah memori menjadi halaman dan frame berukuran sama.",
      "Page fault terjadi saat halaman yang dibutuhkan belum ada di memori fisik.",
      "FIFO bisa mengalami Belady's anomaly; LRU lebih dekat ke pola akses nyata tetapi butuh pencatatan.",
      "Thrashing terjadi saat terlalu banyak halaman yang saling menggantikan.",
    ],
    latihan: [
      "Hitung jumlah page fault untuk deret 7, 0, 1, 2, 0, 3, 0, 4 dengan FIFO dan LRU.",
      "Jelaskan mengapa menambah memori tidak selalu menghilangkan thrashing.",
    ],
    catatan: "Gambar peta halaman ke frame sebelum menghitung; kesalahan kecil mudah terlihat.",
  }),
  buatMateri({
    id: "metode-agile",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "rpl",
    mataKuliah: "Rekayasa Perangkat Lunak",
    warna: "hijau",
    judul: "Metode Agile",
    ringkasan:
      "Bekerja dalam iterasi pendek, memprioritaskan umpan balik pengguna, dan menjaga perangkat lunak tetap bisa dirilis.",
    jenis: "catatan",
    minggu: 4,
    tanggal: "15 Nov 2026",
    durasi: "10 menit baca",
    penulis: "Dea Larasati",
    baru: true,
    tugasTerkaitId: "tugas-usecase",
    tujuan: [
      "Menjelaskan nilai Agile tanpa menyamakannya dengan tanpa dokumentasi.",
      "Menyusun backlog dan definisi selesai untuk satu iterasi.",
    ],
    poin: [
      "Iterasi pendek memberi ruang koreksi sebelum biaya perubahan membesar.",
      "Backlog bukan daftar keinginan; ia diurutkan berdasarkan nilai dan risiko.",
      "Definisi selesai harus disepakati sebelum pekerjaan dimulai.",
      "Review dan retrospektif berbeda: yang satu membahas produk, yang lain membahas cara kerja.",
    ],
    latihan: [
      "Tulis lima item backlog untuk aplikasi absensi kelas.",
      "Tentukan definisi selesai untuk fitur login.",
    ],
    catatan:
      "Agile bukan alasan untuk melewatkan desain. Keputusan besar tetap perlu dicatat dan diuji.",
  }),
  buatMateri({
    id: "diagram-use-case",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "rpl",
    mataKuliah: "Rekayasa Perangkat Lunak",
    warna: "hijau",
    judul: "Diagram Use Case",
    ringkasan:
      "Menggambarkan siapa memakai sistem dan apa yang ingin mereka capai, tanpa tenggelam dalam detail teknis.",
    jenis: "slide",
    minggu: 5,
    tanggal: "8 Nov 2026",
    durasi: "24 slide",
    penulis: "Dea Larasati",
    tujuan: [
      "Menentukan aktor dan batas sistem.",
      "Menulis use case yang berorientasi tujuan pengguna.",
    ],
    poin: [
      "Aktor adalah peran, bukan selalu satu orang tertentu.",
      "Use case ditulis dari sudut pandang pengguna, bukan dari nama halaman.",
      "Include dipakai untuk langkah wajib; extend untuk variasi opsional.",
      "Batas sistem membantu memisahkan tanggung jawab aplikasi dan pihak luar.",
    ],
    latihan: [
      "Gambar use case untuk fitur pengajuan kelas.",
      "Tandai satu include dan satu extend beserta alasannya.",
    ],
    catatan: "Use case yang baik bisa dibaca oleh pengguna tanpa penjelasan teknis.",
  }),
  buatMateri({
    id: "pengujian-perangkat-lunak",
    kelasId: "teknik-informatika-a",
    mataKuliahId: "rpl",
    mataKuliah: "Rekayasa Perangkat Lunak",
    warna: "hijau",
    judul: "Pengujian Perangkat Lunak",
    ringkasan:
      "Memilih tingkat pengujian yang tepat: unit, integrasi, dan end-to-end, lalu merawat uji agar tetap cepat dan dipercaya.",
    jenis: "tautan",
    minggu: 3,
    tanggal: "1 Nov 2026",
    durasi: "15 menit baca",
    penulis: "Dea Larasati",
    tujuan: [
      "Membedakan unit, integrasi, dan end-to-end test.",
      "Menulis kasus uji yang gagal karena alasan yang benar.",
    ],
    poin: [
      "Unit test cepat dan sempit; end-to-end test lambat tetapi mendekati pengalaman pengguna.",
      "Uji harus menguji perilaku, bukan detail implementasi.",
      "Satu uji sebaiknya memeriksa satu alasan gagal.",
      "Uji yang rapuh lebih buruk daripada tidak ada uji karena membuat tim mengabaikan sinyal.",
    ],
    latihan: [
      "Tulis tiga kasus uji untuk fitur masuk kelas dengan kode undangan.",
      "Tentukan tingkat pengujian yang tepat untuk validasi kode dan tampilan galat.",
    ],
    catatan: "Uji adalah dokumentasi perilaku yang bisa dijalankan.",
  }),
];

const jadwalTI: SesiJadwal[] = [
  {
    id: "tia-senin-bd",
    hari: "Senin",
    mulai: "09.00",
    selesai: "10.40",
    mataKuliahId: "basis-data",
    mataKuliah: "Basis Data",
    topik: "Normalisasi lanjutan",
    ruang: "Lab Komputer 3",
    pj: "Naufal Aqil",
    mode: "Tatap muka",
    warna: "kuning",
  },
  {
    id: "tia-senin-rpl",
    hari: "Senin",
    mulai: "13.00",
    selesai: "14.40",
    mataKuliahId: "rpl",
    mataKuliah: "Rekayasa Perangkat Lunak",
    topik: "Sprint review",
    ruang: "Ruang 204",
    pj: "Dea Larasati",
    mode: "Tatap muka",
    warna: "hijau",
  },
  {
    id: "tia-selasa-alg",
    hari: "Selasa",
    mulai: "13.00",
    selesai: "14.40",
    mataKuliahId: "algoritma",
    mataKuliah: "Algoritma",
    topik: "Divide and conquer",
    ruang: "Ruang 301",
    pj: "Rizky Pratama",
    mode: "Tatap muka",
    warna: "biru",
  },
  {
    id: "tia-rabu-so",
    hari: "Rabu",
    mulai: "10.00",
    selesai: "11.40",
    mataKuliahId: "sistem-operasi",
    mataKuliah: "Sistem Operasi",
    topik: "Penjadwalan proses",
    ruang: "Lab Sistem",
    pj: "Sinta Amelia",
    mode: "Hybrid",
    warna: "lila",
  },
  {
    id: "tia-kamis-bd",
    hari: "Kamis",
    mulai: "08.00",
    selesai: "09.40",
    mataKuliahId: "basis-data",
    mataKuliah: "Basis Data",
    topik: "Query lanjutan",
    ruang: "Lab Komputer 3",
    pj: "Naufal Aqil",
    mode: "Tatap muka",
    warna: "kuning",
  },
  {
    id: "tia-kamis-alg",
    hari: "Kamis",
    mulai: "13.00",
    selesai: "14.40",
    mataKuliahId: "algoritma",
    mataKuliah: "Algoritma",
    topik: "Latihan graf",
    ruang: "Ruang 301",
    pj: "Rizky Pratama",
    mode: "Daring",
    warna: "biru",
  },
  {
    id: "tia-jumat-so",
    hari: "Jumat",
    mulai: "08.00",
    selesai: "09.40",
    mataKuliahId: "sistem-operasi",
    mataKuliah: "Sistem Operasi",
    topik: "Sinkronisasi",
    ruang: "Lab Sistem",
    pj: "Sinta Amelia",
    mode: "Tatap muka",
    warna: "lila",
  },
  {
    id: "tia-jumat-rpl",
    hari: "Jumat",
    mulai: "13.00",
    selesai: "14.40",
    mataKuliahId: "rpl",
    mataKuliah: "Rekayasa Perangkat Lunak",
    topik: "Pengujian",
    ruang: "Ruang 204",
    pj: "Dea Larasati",
    mode: "Tatap muka",
    warna: "hijau",
  },
];

const progresAnggotaTI: AnggotaProgress[] = [
  {
    id: "naufal-aqil",
    nama: "Naufal Aqil",
    inisial: "NA",
    peran: "PJ",
    mataKuliah: "Basis Data",
    bergabung: "Agu 2026",
    status: {
      "tugas-normalisasi": "doing",
      "tugas-query": "done",
      "tugas-kompleksitas": "todo",
      "tugas-graf": "done",
      "tugas-cpu": "doing",
      "tugas-usecase": "todo",
    },
  },
  {
    id: "nadia-putri",
    nama: "Nadia Putri",
    inisial: "NP",
    peran: "PJ",
    mataKuliah: "Basis Data",
    bergabung: "Agu 2026",
    status: {
      "tugas-normalisasi": "done",
      "tugas-query": "done",
      "tugas-kompleksitas": "done",
      "tugas-graf": "done",
      "tugas-cpu": "done",
      "tugas-usecase": "done",
    },
  },
  {
    id: "rizky-pratama",
    nama: "Rizky Pratama",
    inisial: "RP",
    peran: "PJ",
    mataKuliah: "Algoritma",
    bergabung: "Agu 2026",
    status: {
      "tugas-normalisasi": "done",
      "tugas-query": "todo",
      "tugas-kompleksitas": "done",
      "tugas-graf": "done",
      "tugas-cpu": "doing",
      "tugas-usecase": "done",
    },
  },
  {
    id: "sinta-amelia",
    nama: "Sinta Amelia",
    inisial: "SA",
    peran: "PJ",
    mataKuliah: "Sistem Operasi",
    bergabung: "Agu 2026",
    status: {
      "tugas-normalisasi": "done",
      "tugas-query": "done",
      "tugas-kompleksitas": "todo",
      "tugas-graf": "done",
      "tugas-cpu": "doing",
      "tugas-usecase": "todo",
    },
  },
  {
    id: "dea-larasati",
    nama: "Dea Larasati",
    inisial: "DL",
    peran: "PJ",
    mataKuliah: "Rekayasa Perangkat Lunak",
    bergabung: "Agu 2026",
    status: {
      "tugas-normalisasi": "done",
      "tugas-query": "doing",
      "tugas-kompleksitas": "todo",
      "tugas-graf": "done",
      "tugas-cpu": "todo",
      "tugas-usecase": "doing",
    },
  },
  {
    id: "bagas-prakoso",
    nama: "Bagas Prakoso",
    inisial: "BP",
    peran: "Anggota",
    bergabung: "Agu 2026",
    status: {
      "tugas-normalisasi": "done",
      "tugas-query": "doing",
      "tugas-kompleksitas": "doing",
      "tugas-graf": "todo",
      "tugas-cpu": "todo",
      "tugas-usecase": "todo",
    },
  },
  {
    id: "citra-maharani",
    nama: "Citra Maharani",
    inisial: "CM",
    peran: "Anggota",
    bergabung: "Sep 2026",
    status: {
      "tugas-normalisasi": "todo",
      "tugas-query": "todo",
      "tugas-kompleksitas": "doing",
      "tugas-graf": "todo",
      "tugas-cpu": "todo",
      "tugas-usecase": "todo",
    },
  },
  {
    id: "dimas-ardiansyah",
    nama: "Dimas Ardiansyah",
    inisial: "DA",
    peran: "Anggota",
    bergabung: "Sep 2026",
    status: {
      "tugas-normalisasi": "done",
      "tugas-query": "done",
      "tugas-kompleksitas": "done",
      "tugas-graf": "done",
      "tugas-cpu": "todo",
      "tugas-usecase": "todo",
    },
  },
];

const kelasTI: KelasDetail = {
  id: "teknik-informatika-a",
  nama: "Teknik Informatika A",
  jenis: "Kelas kuliah",
  semester: "Semester 3",
  angkatan: "TI A 2025",
  deskripsi:
    "Ruang bersama TI A untuk materi, jadwal, dan progres tugas. Semua catatan kelas dikumpulkan di sini.",
  kodeUndangan: "KLS-TIA-2026",
  peran: "PJ",
  warna: "kuning",
  jumlahMateri: 12,
  jumlahTugas: 6,
  progres: 33,
  jadwalBerikutnya: "Kamis, 19 Nov · 13.00",
  mataKuliah: [
    {
      id: "basis-data",
      nama: "Basis Data",
      kode: "BD-301",
      pj: "Naufal Aqil · Nadia Putri",
      warna: "kuning",
      jumlahMateri: 3,
      jumlahTugas: 2,
      progres: 50,
    },
    {
      id: "algoritma",
      nama: "Algoritma",
      kode: "ALG-302",
      pj: "Rizky Pratama",
      warna: "biru",
      jumlahMateri: 3,
      jumlahTugas: 2,
      progres: 50,
    },
    {
      id: "sistem-operasi",
      nama: "Sistem Operasi",
      kode: "SO-303",
      pj: "Sinta Amelia",
      warna: "lila",
      jumlahMateri: 3,
      jumlahTugas: 1,
      progres: 0,
    },
    {
      id: "rpl",
      nama: "Rekayasa Perangkat Lunak",
      kode: "RPL-304",
      pj: "Dea Larasati",
      warna: "hijau",
      jumlahMateri: 3,
      jumlahTugas: 1,
      progres: 0,
    },
  ],
  pengumuman: {
    penulis: "Nadia Putri",
    inisial: "NP",
    peran: "PJ Basis Data",
    isi: "Sesi Kamis pindah ke Lab Komputer 3. Bawa laptop dan file latihan normalisasi.",
    lencana: "Pengumuman",
  },
  jadwal: jadwalTI,
  materi: materiTI,
  tugas: tugasTI,
  anggota: anggotaIntiTI,
  progresAnggota: progresAnggotaTI,
  idSaya: "naufal-aqil",
  hariIni: "Kamis",
};

const materiBasisData: Materi[] = [
  buatMateri({
    id: "window-function",
    kelasId: "basis-data-2025",
    mataKuliahId: "sql",
    mataKuliah: "SQL & Query",
    warna: "biru",
    judul: "Window Function",
    ringkasan:
      "Menghitung peringkat dan total berjalan tanpa menggabungkan baris menjadi satu kelompok.",
    jenis: "pdf",
    minggu: 4,
    tanggal: "18 Nov 2026",
    durasi: "16 halaman",
    penulis: "Nadia Putri",
    baru: true,
    tugasTerkaitId: "tugas-window",
    tujuan: ["Membedakan GROUP BY dan window function.", "Memakai ROW_NUMBER, RANK, dan SUM OVER."],
    poin: [
      "Window function tetap mempertahankan baris asli.",
      "PARTITION BY membagi data sebelum fungsi dihitung.",
      "ORDER BY di dalam OVER menentukan urutan peringkat.",
    ],
    latihan: [
      "Tampilkan tiga nilai tertinggi per kelas dengan ROW_NUMBER.",
      "Hitung total nilai berjalan per mahasiswa.",
    ],
    catatan: "Window function bukan pengganti GROUP BY; keduanya menjawab pertanyaan berbeda.",
  }),
  buatMateri({
    id: "index-optimasi",
    kelasId: "basis-data-2025",
    mataKuliahId: "sql",
    mataKuliah: "SQL & Query",
    warna: "biru",
    judul: "Index dan Optimasi Query",
    ringkasan:
      "Membaca rencana eksekusi dan menentukan index yang benar-benar membantu, bukan menambah beban tulis.",
    jenis: "video",
    minggu: 5,
    tanggal: "11 Nov 2026",
    durasi: "20 menit",
    penulis: "Nadia Putri",
    tugasTerkaitId: "tugas-optimasi",
    tujuan: ["Membaca EXPLAIN.", "Memilih kolom index berdasarkan pola query."],
    poin: [
      "Index mempercepat pencarian tetapi memperlambat insert dan update.",
      "Index komposit mengikuti urutan kolom dari kiri.",
      "Fungsi pada kolom yang di-index dapat membuat index tidak terpakai.",
    ],
    latihan: ["Jalankan EXPLAIN pada query nilai.", "Tambahkan index dan bandingkan rencananya."],
    catatan: "Ukur sebelum dan sesudah. Tanpa angka, optimasi hanya dugaan.",
  }),
  buatMateri({
    id: "transaksi-acid",
    kelasId: "basis-data-2025",
    mataKuliahId: "basis-data-lanjut",
    mataKuliah: "Basis Data Lanjut",
    warna: "kuning",
    judul: "Transaksi dan ACID",
    ringkasan:
      "Menjaga perubahan tetap konsisten saat dua pengguna menyentuh data yang sama pada waktu bersamaan.",
    jenis: "slide",
    minggu: 3,
    tanggal: "4 Nov 2026",
    durasi: "26 slide",
    penulis: "Naufal Aqil",
    tujuan: ["Menjelaskan empat sifat ACID.", "Mengenali tingkat isolasi transaksi."],
    poin: [
      "Atomicity: semua langkah berhasil atau tidak ada yang berubah.",
      "Consistency: transaksi membawa data dari satu keadaan valid ke keadaan valid berikutnya.",
      "Isolation: transaksi yang berjalan bersamaan tidak saling merusak.",
      "Durability: perubahan yang sudah commit bertahan meski server mati.",
    ],
    latihan: ["Tulis transaksi transfer saldo.", "Tentukan tingkat isolasi untuk laporan stok."],
    catatan: "ACID bukan jaminan aplikasi bebas bug; ia menjaga batas transaksi database.",
  }),
  buatMateri({
    id: "normalisasi-lanjut",
    kelasId: "basis-data-2025",
    mataKuliahId: "basis-data-lanjut",
    mataKuliah: "Basis Data Lanjut",
    warna: "kuning",
    judul: "Normalisasi Lanjut",
    ringkasan: "Melihat BCNF dan denormalisasi terkendali untuk kebutuhan pelaporan.",
    jenis: "pdf",
    minggu: 2,
    tanggal: "28 Okt 2026",
    durasi: "22 halaman",
    penulis: "Naufal Aqil",
    tujuan: ["Mengenali pelanggaran BCNF.", "Menimbang denormalisasi untuk performa."],
    poin: [
      "BCNF memperketat aturan 3NF pada kandidat kunci.",
      "Denormalisasi menukar sebagian konsistensi dengan kecepatan baca.",
      "Setiap duplikasi yang disengaja harus punya alasan dan cara perawatan.",
    ],
    latihan: [
      "Periksa satu skema kandidat BCNF.",
      "Tentukan satu kolom yang aman didenormalisasi.",
    ],
    catatan: "Jangan menduplikasi data hanya karena query terasa lambat.",
  }),
  buatMateri({
    id: "data-warehouse",
    kelasId: "basis-data-2025",
    mataKuliahId: "pemodelan",
    mataKuliah: "Pemodelan Data",
    warna: "lila",
    judul: "Data Warehouse",
    ringkasan: "Membedakan database operasional dan gudang data analitik.",
    jenis: "tautan",
    minggu: 3,
    tanggal: "30 Okt 2026",
    durasi: "14 menit baca",
    penulis: "Sinta Amelia",
    tujuan: ["Menjelaskan star schema.", "Membedakan fact dan dimension table."],
    poin: [
      "Database operasional mengutamakan transaksi; warehouse mengutamakan pembacaan analitik.",
      "Fact table menyimpan peristiwa dan ukuran; dimension table menyimpan konteks.",
      "Star schema sengaja denormal untuk query yang mudah dibaca.",
    ],
    latihan: ["Rancang star schema untuk penjualan.", "Tentukan grain fact table."],
    catatan: "Grain adalah keputusan pertama; ubah grain berarti ubah seluruh model.",
  }),
  buatMateri({
    id: "latihan-sql",
    kelasId: "basis-data-2025",
    mataKuliahId: "sql",
    mataKuliah: "SQL & Query",
    warna: "biru",
    judul: "Latihan SQL Terpadu",
    ringkasan: "Kumpulan soal JOIN, agregasi, dan subquery untuk persiapan evaluasi.",
    jenis: "catatan",
    minggu: 5,
    tanggal: "12 Nov 2026",
    durasi: "12 menit baca",
    penulis: "Nadia Putri",
    baru: true,
    tujuan: ["Menggabungkan beberapa konsep dalam satu query."],
    poin: [
      "Pecah soal menjadi langkah kecil: filter, gabung, kelompokkan, urutkan.",
      "Periksa duplikasi setelah JOIN sebelum menghitung agregat.",
    ],
    latihan: ["Ambil rata-rata nilai per mata kuliah.", "Tampilkan mahasiswa tanpa nilai."],
    catatan: "Tulis query yang bisa dibaca manusia sebelum mengejar bentuk terpendek.",
  }),
];

const jadwalBasisData: SesiJadwal[] = [
  {
    id: "bd-selasa",
    hari: "Selasa",
    mulai: "09.00",
    selesai: "10.40",
    mataKuliahId: "sql",
    mataKuliah: "SQL & Query",
    topik: "Window function",
    ruang: "Lab Data 2",
    pj: "Nadia Putri",
    mode: "Tatap muka",
    warna: "biru",
  },
  {
    id: "bd-rabu",
    hari: "Rabu",
    mulai: "13.00",
    selesai: "14.40",
    mataKuliahId: "basis-data-lanjut",
    mataKuliah: "Basis Data Lanjut",
    topik: "Transaksi ACID",
    ruang: "Ruang 205",
    pj: "Naufal Aqil",
    mode: "Tatap muka",
    warna: "kuning",
  },
  {
    id: "bd-kamis",
    hari: "Kamis",
    mulai: "10.00",
    selesai: "11.40",
    mataKuliahId: "pemodelan",
    mataKuliah: "Pemodelan Data",
    topik: "Star schema",
    ruang: "Lab Data 2",
    pj: "Sinta Amelia",
    mode: "Hybrid",
    warna: "lila",
  },
  {
    id: "bd-jumat",
    hari: "Jumat",
    mulai: "09.00",
    selesai: "10.40",
    mataKuliahId: "sql",
    mataKuliah: "SQL & Query",
    topik: "Optimasi query",
    ruang: "Lab Data 2",
    pj: "Nadia Putri",
    mode: "Daring",
    warna: "biru",
  },
];

const tugasBasisData: TugasProgress[] = [
  {
    id: "tugas-window",
    judul: "Latihan window function",
    mataKuliah: "SQL & Query",
    deadline: "21 Nov 2026",
    prioritas: "Tinggi",
    status: "done",
  },
  {
    id: "tugas-optimasi",
    judul: "Optimasi query laporan",
    mataKuliah: "SQL & Query",
    deadline: "24 Nov 2026",
    prioritas: "Sedang",
    status: "doing",
  },
  {
    id: "tugas-erd",
    judul: "ERD perpustakaan",
    mataKuliah: "Pemodelan Data",
    deadline: "27 Nov 2026",
    prioritas: "Sedang",
    status: "todo",
  },
  {
    id: "tugas-acid",
    judul: "Ringkasan transaksi ACID",
    mataKuliah: "Basis Data Lanjut",
    deadline: "29 Nov 2026",
    prioritas: "Rendah",
    status: "todo",
  },
];

const kelasBasisData: KelasDetail = {
  id: "basis-data-2025",
  nama: "Basis Data 2025",
  jenis: "Kelas kuliah",
  semester: "Semester 3",
  angkatan: "BD 2025",
  deskripsi:
    "Kelas pendamping Basis Data untuk latihan query, pemodelan, dan diskusi tugas mingguan.",
  kodeUndangan: "KLS-BD-2025",
  peran: "Anggota",
  warna: "biru",
  jumlahMateri: 6,
  jumlahTugas: 4,
  progres: 25,
  jadwalBerikutnya: "Kamis, 19 Nov · 10.00",
  mataKuliah: [
    {
      id: "sql",
      nama: "SQL & Query",
      kode: "BD-201",
      pj: "Nadia Putri",
      warna: "biru",
      jumlahMateri: 3,
      jumlahTugas: 2,
      progres: 25,
    },
    {
      id: "basis-data-lanjut",
      nama: "Basis Data Lanjut",
      kode: "BD-202",
      pj: "Naufal Aqil",
      warna: "kuning",
      jumlahMateri: 2,
      jumlahTugas: 1,
      progres: 50,
    },
    {
      id: "pemodelan",
      nama: "Pemodelan Data",
      kode: "BD-203",
      pj: "Sinta Amelia",
      warna: "lila",
      jumlahMateri: 1,
      jumlahTugas: 1,
      progres: 0,
    },
  ],
  pengumuman: {
    penulis: "Nadia Putri",
    inisial: "NP",
    peran: "PJ SQL & Query",
    isi: "Latihan window function dibahas Kamis. Bawa query yang sudah kamu coba.",
    lencana: "Pengingat",
  },
  jadwal: jadwalBasisData,
  materi: materiBasisData,
  tugas: tugasBasisData,
  anggota: [
    {
      id: "naufal-aqil",
      nama: "Naufal Aqil",
      inisial: "NA",
      peran: "Anggota",
      bergabung: "Agu 2026",
    },
    {
      id: "nadia-putri",
      nama: "Nadia Putri",
      inisial: "NP",
      peran: "PJ",
      mataKuliah: "SQL & Query",
      bergabung: "Agu 2026",
    },
    {
      id: "sinta-amelia",
      nama: "Sinta Amelia",
      inisial: "SA",
      peran: "PJ",
      mataKuliah: "Pemodelan Data",
      bergabung: "Agu 2026",
    },
    {
      id: "bagas-prakoso",
      nama: "Bagas Prakoso",
      inisial: "BP",
      peran: "Anggota",
      bergabung: "Agu 2026",
    },
    {
      id: "citra-maharani",
      nama: "Citra Maharani",
      inisial: "CM",
      peran: "Anggota",
      bergabung: "Sep 2026",
    },
    {
      id: "dimas-ardiansyah",
      nama: "Dimas Ardiansyah",
      inisial: "DA",
      peran: "Anggota",
      bergabung: "Sep 2026",
    },
  ],
  progresAnggota: [],
  idSaya: "naufal-aqil",
  hariIni: "Kamis",
};

const materiFotografi: Materi[] = [
  buatMateri({
    id: "segitiga-exposure",
    kelasId: "komunitas-fotografi",
    mataKuliahId: "dasar",
    mataKuliah: "Dasar Fotografi",
    warna: "lila",
    judul: "Segitiga Exposure",
    ringkasan:
      "Menyeimbangkan aperture, shutter speed, dan ISO untuk mendapatkan foto yang sesuai cahaya.",
    jenis: "video",
    minggu: 2,
    tanggal: "16 Nov 2026",
    durasi: "16 menit",
    penulis: "Dina Maharani",
    baru: true,
    tugasTerkaitId: "tugas-ruang",
    tujuan: ["Membaca cahaya.", "Memilih prioritas exposure."],
    poin: [
      "Aperture mengatur banyak cahaya dan kedalaman bidang.",
      "Shutter speed mengatur gerak dan risiko blur.",
      "ISO tinggi menambah noise; pakai setelah aperture dan shutter tidak cukup.",
    ],
    latihan: ["Foto satu objek dengan tiga kombinasi exposure.", "Bandingkan hasilnya."],
    catatan: "Tidak ada satu setelan yang benar untuk semua situasi.",
  }),
  buatMateri({
    id: "komposisi",
    kelasId: "komunitas-fotografi",
    mataKuliahId: "dasar",
    mataKuliah: "Dasar Fotografi",
    warna: "lila",
    judul: "Komposisi dan Ruang Negatif",
    ringkasan: "Mengatur letak subjek dan ruang kosong agar foto punya arah baca.",
    jenis: "slide",
    minggu: 3,
    tanggal: "9 Nov 2026",
    durasi: "22 slide",
    penulis: "Dina Maharani",
    tujuan: ["Menggunakan rule of thirds.", "Memanfaatkan ruang negatif."],
    poin: [
      "Titik perhatian tidak harus di tengah.",
      "Ruang kosong memberi napas dan konteks.",
      "Garis leading membawa mata menuju subjek.",
    ],
    latihan: ["Pilih tiga foto dan tandai titik perhatiannya."],
    catatan: "Aturan komposisi adalah titik awal, bukan larangan.",
  }),
  buatMateri({
    id: "editing-warna",
    kelasId: "komunitas-fotografi",
    mataKuliahId: "editing",
    mataKuliah: "Editing",
    warna: "kuning",
    judul: "Editing Warna Dasar",
    ringkasan: "Menyeimbangkan white balance dan kontras tanpa membuat warna kulit tampak aneh.",
    jenis: "pdf",
    minggu: 4,
    tanggal: "2 Nov 2026",
    durasi: "18 halaman",
    penulis: "Raka Wijaya",
    tujuan: ["Membaca histogram.", "Menjaga warna kulit."],
    poin: [
      "Perbaiki exposure sebelum warna.",
      "White balance memengaruhi seluruh gambar.",
      "Kurangi saturasi sebelum menambah kontras.",
    ],
    latihan: ["Edit satu foto dengan histogram sebagai acuan."],
    catatan: "Simpan versi asli. Editing yang baik bisa diulang.",
  }),
  buatMateri({
    id: "portofolio",
    kelasId: "komunitas-fotografi",
    mataKuliahId: "portofolio",
    mataKuliah: "Portofolio",
    warna: "hijau",
    judul: "Membangun Portofolio Mini",
    ringkasan: "Memilih lima foto yang saling bercerita, bukan sekadar lima foto terbaik.",
    jenis: "catatan",
    minggu: 5,
    tanggal: "26 Okt 2026",
    durasi: "8 menit baca",
    penulis: "Dina Maharani",
    tugasTerkaitId: "tugas-portofolio",
    tujuan: ["Memilih tema.", "Menyusun urutan foto."],
    poin: [
      "Portofolio adalah kumpulan keputusan, bukan galeri acak.",
      "Mulai dan akhiri dengan foto yang kuat.",
      "Sertakan satu kalimat konteks untuk setiap seri.",
    ],
    latihan: ["Pilih lima foto dan tulis urutannya."],
    catatan: "Lebih baik lima foto yang utuh daripada dua puluh foto yang saling bersaing.",
  }),
];

const jadwalFotografi: SesiJadwal[] = [
  {
    id: "foto-jumat",
    hari: "Jumat",
    mulai: "16.00",
    selesai: "17.30",
    mataKuliahId: "dasar",
    mataKuliah: "Dasar Fotografi",
    topik: "Latihan cahaya sore",
    ruang: "Taman Kampus",
    pj: "Dina Maharani",
    mode: "Tatap muka",
    warna: "lila",
  },
  {
    id: "foto-sabtu",
    hari: "Sabtu",
    mulai: "10.00",
    selesai: "12.00",
    mataKuliahId: "editing",
    mataKuliah: "Editing",
    topik: "Review hasil foto",
    ruang: "Ruang Komunitas",
    pj: "Raka Wijaya",
    mode: "Hybrid",
    warna: "kuning",
  },
];

const tugasFotografi: TugasProgress[] = [
  {
    id: "tugas-ruang",
    judul: 'Foto tema "Ruang"',
    mataKuliah: "Dasar Fotografi",
    deadline: "23 Nov 2026",
    prioritas: "Sedang",
    status: "doing",
  },
  {
    id: "tugas-editing",
    judul: "Editing tiga foto pilihan",
    mataKuliah: "Editing",
    deadline: "25 Nov 2026",
    prioritas: "Rendah",
    status: "todo",
  },
  {
    id: "tugas-portofolio",
    judul: "Susun portofolio mini",
    mataKuliah: "Portofolio",
    deadline: "30 Nov 2026",
    prioritas: "Tinggi",
    status: "done",
  },
];

const kelasFotografi: KelasDetail = {
  id: "komunitas-fotografi",
  nama: "Komunitas Fotografi",
  jenis: "Komunitas belajar",
  semester: "2025",
  angkatan: "Angkatan 2025",
  deskripsi:
    "Ruang santai untuk belajar melihat cahaya, menyusun komposisi, dan saling memberi masukan atas karya.",
  kodeUndangan: "KLS-FOTO-2025",
  peran: "Anggota",
  warna: "lila",
  jumlahMateri: 4,
  jumlahTugas: 3,
  progres: 33,
  jadwalBerikutnya: "Jumat, 20 Nov · 16.00",
  mataKuliah: [
    {
      id: "dasar",
      nama: "Dasar Fotografi",
      kode: "FTO-01",
      pj: "Dina Maharani",
      warna: "lila",
      jumlahMateri: 2,
      jumlahTugas: 1,
      progres: 50,
    },
    {
      id: "editing",
      nama: "Editing",
      kode: "FTO-02",
      pj: "Raka Wijaya",
      warna: "kuning",
      jumlahMateri: 1,
      jumlahTugas: 1,
      progres: 0,
    },
    {
      id: "portofolio",
      nama: "Portofolio",
      kode: "FTO-03",
      pj: "Dina Maharani",
      warna: "hijau",
      jumlahMateri: 1,
      jumlahTugas: 1,
      progres: 100,
    },
  ],
  pengumuman: {
    penulis: "Dina Maharani",
    inisial: "DM",
    peran: "PJ Dasar Fotografi",
    isi: "Sesi Jumat pindah ke Taman Kampus. Bawa kamera atau ponsel dan jaket.",
    lencana: "Pengumuman",
  },
  jadwal: jadwalFotografi,
  materi: materiFotografi,
  tugas: tugasFotografi,
  anggota: [
    {
      id: "naufal-aqil",
      nama: "Naufal Aqil",
      inisial: "NA",
      peran: "Anggota",
      bergabung: "Okt 2026",
    },
    {
      id: "dina-maharani",
      nama: "Dina Maharani",
      inisial: "DM",
      peran: "PJ",
      mataKuliah: "Dasar Fotografi",
      bergabung: "Agu 2026",
    },
    {
      id: "raka-wijaya",
      nama: "Raka Wijaya",
      inisial: "RW",
      peran: "PJ",
      mataKuliah: "Editing",
      bergabung: "Agu 2026",
    },
    {
      id: "eka-safitri",
      nama: "Eka Safitri",
      inisial: "ES",
      peran: "Anggota",
      bergabung: "Sep 2026",
    },
    {
      id: "farah-nabila",
      nama: "Farah Nabila",
      inisial: "FN",
      peran: "Anggota",
      bergabung: "Sep 2026",
    },
    {
      id: "gilang-ramadhan",
      nama: "Gilang Ramadhan",
      inisial: "GR",
      peran: "Anggota",
      bergabung: "Okt 2026",
    },
  ],
  progresAnggota: [],
  idSaya: "naufal-aqil",
  hariIni: "Kamis",
};

export const kelasContoh: KelasDetail[] = [kelasTI, kelasBasisData, kelasFotografi];

export const daftarKelas: KelasRingkas[] = kelasContoh.map((kelas) => ({
  id: kelas.id,
  nama: kelas.nama,
  jenis: kelas.jenis,
  semester: kelas.semester,
  angkatan: kelas.angkatan,
  deskripsi: kelas.deskripsi,
  anggota: kelas.anggota.length,
  kodeUndangan: kelas.kodeUndangan,
  peran: kelas.peran,
  warna: kelas.warna,
  jumlahMateri: kelas.jumlahMateri,
  jumlahTugas: kelas.jumlahTugas,
  progres: kelas.progres,
  jadwalBerikutnya: kelas.jadwalBerikutnya,
  mataKuliah: kelas.mataKuliah.map((mapel) => mapel.nama),
}));

export function ambilKelas(classId: string): KelasDetail | undefined {
  return kelasContoh.find((kelas) => kelas.id === classId);
}

export function ambilMateri(kelas: KelasDetail, materiId: string): Materi | undefined {
  return kelas.materi.find((materi) => materi.id === materiId);
}

/** Materi lain di mata kuliah yang sama, lalu materi terbaru dari kelas. */
export function materiTerkait(kelas: KelasDetail, materi: Materi, batas = 3): Materi[] {
  return kelas.materi
    .filter((item) => item.id !== materi.id)
    .sort((a, b) => {
      const mapelA = a.mataKuliahId === materi.mataKuliahId ? 0 : 1;
      const mapelB = b.mataKuliahId === materi.mataKuliahId ? 0 : 1;
      return mapelA - mapelB;
    })
    .slice(0, batas);
}

/** Materi sebelum/sesudah berdasarkan urutan daftar materi kelas. */
export function materiSekitar(
  kelas: KelasDetail,
  materi: Materi,
): { sebelumnya?: Materi; berikutnya?: Materi } {
  const indeks = kelas.materi.findIndex((item) => item.id === materi.id);
  return {
    sebelumnya: indeks > 0 ? kelas.materi[indeks - 1] : undefined,
    berikutnya: indeks >= 0 ? kelas.materi[indeks + 1] : undefined,
  };
}
