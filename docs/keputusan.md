# Catatan Keputusan

Keputusan teknis yang sudah diambil beserta alasannya. Menambah pustaka baru atau mengubah keputusan di bawah harus dicatat di sini dan disetujui lead terkait (Zaki untuk backend, Aqil untuk frontend).

## 14 November 2026: stack dan struktur awal

| Keputusan                                                  | Alasan                                                                                                       | Diputuskan oleh                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| Next.js App Router, satu proyek untuk frontend dan backend | Ditetapkan PRD bagian 10; tim kecil cukup satu kode                                                          | PRD                            |
| TypeScript                                                 | Ditetapkan PRD; salah ketik nama field ketahuan sebelum dijalankan                                           | Zaki                           |
| Tailwind CSS 4 dan shadcn/ui                               | Ditetapkan PRD; tema kelas (F6) diterapkan lewat variabel CSS                                                | PRD                            |
| MySQL 8.4 dalam kontainer Docker                           | Ditetapkan PRD; semua anggota memakai versi yang sama                                                        | PRD                            |
| Drizzle sebagai ORM                                        | Dekat dengan SQL, cocok untuk menulis ulang skema lama ke MySQL                                              | Zaki                           |
| Better Auth untuk login Google                             | Pengganti Supabase Auth; magic link ditunda                                                                  | Zaki                           |
| npm sebagai package manager                                | Sudah ikut terpasang bersama Node.js, paling sedikit hambatan                                                | Zaki                           |
| Lapisan backend: URL, controller, model                    | Mengikuti pembagian tugas: Ahmad dan Bintang memegang URL dan controller, Fadlan memegang database dan model | Zaki                           |
| Batas lapisan ditegakkan ESLint                            | Kesalahan impor ketahuan otomatis, tidak bergantung pada review                                              | Zaki                           |
| MySQL lokal di port 3307                                   | Menghindari bentrok dengan MySQL Laragon atau XAMPP di 3306                                                  | Zaki                           |
| Cache Components tetap aktif                               | Bawaan Next.js 16.4 untuk proyek baru; bagian halaman yang mengambil data dibungkus `<Suspense>`             | Bawaan Next.js, belum ditinjau |

## 14 November 2026: standar pesan commit

Pesan commit selalu diawali `Add:`, `Update:`, `Delete:`, atau `Fix:`. Diputuskan Zaki supaya mudah diikuti anggota yang baru belajar Git. Format Conventional Commits (`feat`, `chore`, dan sejenisnya) tidak dipakai lagi.

## 14 November 2026: MySQL lokal boleh dari Laragon

MySQL untuk pengembangan boleh dari Docker atau dari Laragon, asalkan versinya 8. Yang membedakan hanya `DATABASE_URL` di `.env` masing-masing anggota. XAMPP tidak dipakai karena isinya MariaDB. Server produksi tetap memakai MySQL dalam kontainer sesuai PRD.

## 18 November 2026: design system Klass dan Docker penuh

| Keputusan                                                                                          | Alasan                                                                  | Diputuskan oleh                     |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------- |
| Tampilan memakai design system Klass (CSS berlingkup `.ds`, token `--ds-*`), bukan komponen shadcn | Gaya kertas dan map manila dari rancangan Figma                         | Aqil, masuk lewat PR #1             |
| Font dimuat lokal dari `src/app/fonts`                                                             | Tidak bergantung jaringan                                               | Aqil, masuk lewat PR #1             |
| `docker compose up` menjalankan aplikasi dan MySQL sekaligus                                       | Anggota bisa menjalankan proyek tanpa memasang Node.js                  | Commit 903c4f0, belum ditinjau Zaki |
| Setelah `git pull` memakai `npm ci`, bukan `npm install`                                           | Versi npm yang berbeda menulis ulang `package-lock.json` secara berbeda | Usulan, menunggu Zaki               |

Belum diputuskan: bagaimana tema kelas (F6) dihubungkan dengan token `--ds-*`.

## 18 November 2026: tabel pengguna

| Keputusan                                                                                         | Alasan                                                               | Diputuskan oleh |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------- |
| Tabel pengguna memakai bentuk dari Better Auth (`users`, `sessions`, `accounts`, `verifications`) | Bentuknya ditentukan pustaka; tabel lain cukup merujuk ke `users.id` | Zaki            |
| Nama tabel auth dijamakkan (`usePlural`)                                                          | Seragam dengan tabel lain                                            | Zaki            |
| Tidak ada tabel `profiles`; `is_superadmin` menjadi kolom tambahan di `users`                     | Nama dan avatar sudah ada di `users`, menghindari data ganda         | Zaki            |
| Skema auth dan migrasi pertama dibuat Zaki sebelum tabel lain                                     | Supaya Fadlan bisa memasang kunci asing ke pengguna                  | Zaki            |

## 18 November 2026: URL memakai bahasa Inggris

Alamat halaman dan API memakai bahasa Inggris huruf kecil, mengikuti nama use case yang dikenal
pengguna (`/dashboard`, `/classes`, `/login`, `/classes/request`), bukan terjemahan harfiah dari
bahasa Indonesia.

Alasan: alamat lebih mudah ditebak dan diketik, cocok dengan istilah yang sudah lazim di produk
lain sehingga pengguna baru tidak perlu menghafal terjemahan, dan memudahkan penamaan berkas serta
tautan antar-halaman.

Yang **tidak** berubah:

- Teks di dalam halaman tetap bahasa Indonesia (skill `klass-komponen`).
- `message` pada respons galat tetap bahasa Indonesia; hanya `code` yang berbahasa Inggris.
- Nama komponen, variabel, dan komentar tetap seperti sebelumnya.

Rujukannya skill `klass-halaman` (peta route) dan `klass-api` (penamaan URL). Mengubah alamat
berarti mengubah kedua skill itu juga.

## 19 November 2026: halaman Klass memakai kelas CSS sendiri, bukan utilitas Tailwind

Halaman yang memakai design system Klass (`.ds`: landing, galeri komponen, login, dasbor, dan
seluruh halaman kelas) hanya memakai nama kelas dari `src/app/styles/klass/`. Utilitas Tailwind
seperti `flex`, `gap-6`, atau `mt-8` tidak dipakai lagi di markup halaman dan layout.

Alasan: tampilan Klass sudah ditulis sebagai CSS biasa dengan token `--ds-*`. Mencampurnya dengan
utilitas Tailwind membuat dua sumber kebenaran untuk hal yang sama, dan perubahan kelas utilitas
(atau plugin yang merapikan urutan kelas) bisa diam-diam mengubah tampilan tanpa ada yang menyentuh
stylesheet Klass. Satu nama kelas yang jelas juga lebih mudah dicari saat memperbaiki tampilan.

Yang **tidak** berubah:

- Tailwind dan shadcn/ui tetap terpasang dan tetap dipakai di `src/components/ui` (area shadcn).
  Komponen contoh `src/components/shared/kartu-status.tsx` masih merakit `Card`/`Badge`/`Skeleton` dari
  sana, tetapi `className` miliknya sendiri sudah memakai kelas Klass (`kartu-status__*`).
- Token warna, jarak, dan tipografi tetap `--ds-*`; tidak ada warna mentah baru.
- Kelas baru ditulis di berkas yang sesuai: `shell.css` untuk cangkang halaman, `kelas.css` untuk
  halaman kelas, `meja.css` untuk dasbor (dulu `dashboard.css`, dihapus 21 November 2026).

## 20 November 2026: setiap koneksi MySQL dipaksa memakai UTC

`src/server/db/index.ts` menjalankan `SET time_zone = '+00:00'` pada setiap koneksi baru.

Alasan: opsi `timezone: "Z"` hanya mengatur cara aplikasi mengirim dan membaca waktu. MySQL tetap
memakai zona waktu komputernya, sehingga di Laragon (WIB) kolom yang diisi MySQL sendiri
(`created_at`, `updated_at`) terbaca tujuh jam lebih maju, sedangkan di Docker (UTC) tidak. Dengan
sesi dipaksa UTC, hasilnya sama di semua laptop dan di server.

Akibat untuk data lokal yang sudah ada di Laragon: waktu yang dulu ditulis aplikasi (misalnya masa
berlaku sesi) terbaca tujuh jam lebih awal. Untuk data contoh ini tidak perlu diperbaiki.

## 20 November 2026: nama field API memakai bahasa Inggris

Sebelumnya tidak seragam: akun contoh memakai `nama` dan `idPengguna`, endpoint subkelas memakai
`name` dan `classId`. Diputuskan Zaki: yang dibaca program berbahasa Inggris (URL, nama field JSON,
nilai pilihan, `code`), yang dibaca orang berbahasa Indonesia (`message`, teks tampilan). Nama field
mengikuti nama kolom database dalam `camelCase`, supaya tidak ada dua nama untuk hal yang sama.
Nama berkas di `src/app/api`, `src/server/controllers`, dan `src/types/api` mengikuti nama sumber
daya di URL. Nama fungsi dan variabel di kode tidak berubah. Rinciannya di `docs/api.md`.

Yang ikut diubah: `HealthDto` dan `DevAccountDto`, serta body `POST /api/v1/dev/session`
(`idAkun` menjadi `accountId`).

## 20 November 2026: lapisan izin dan penjagaan halaman

| Keputusan                                                                           | Alasan                                                                                                                                       |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Pemeriksaan peran hanya ditulis di `src/server/permissions`, dipanggil controller   | Satu tempat untuk diuji per peran; controller tidak menulis `if (role === ...)`                                                              |
| Peran tidak diperiksa di proxy (dulu middleware)                                    | Peran berlaku per kelas dan harus dibaca dari database; proxy hanya mengalihkan pengunjung tanpa cookie sesi                                 |
| Penjagaan halaman ditaruh di halaman, bukan di `layout.tsx`                         | Dicoba di layout: Next.js merender layout dan halaman terpisah, sehingga isi halaman tetap terkirim ke yang tidak berhak                     |
| Orang luar di kelas privat mendapat 404, di kelas terdaftar 403                     | Keberadaan kelas privat tidak boleh bisa ditebak                                                                                             |
| Kelas yang diarsipkan hanya bisa dibaca; mengubahnya dijawab 409                    | PRD menyebut datanya disimpan, tetapi tidak menyebut boleh diubah. Bila tim memutuskan lain, ubah `ensureEditable` di `permissions/class.ts` |
| `forbidden()` milik Next.js tidak dipakai; 403 di halaman dialihkan ke `/forbidden` | `forbidden()` masih eksperimental di Next.js 16.4                                                                                            |
| Sesi dibaca frontend lewat `/api/v1/session`, bukan `/api/v1/dev/session`           | Alamat `dev` menjawab 404 di produksi, sehingga tombol Keluar tidak berfungsi di sana                                                        |

## 20 November 2026: 400 untuk kiriman yang salah

Body yang bukan JSON dulu dijawab 500. Sekarang `route.ts` membaca body dengan `readJson(req)` dan
jawabannya 400. Empat pesan di model yang sebenarnya salah masukan dipindah dari 409 ke 400 (materi
tanpa file dan tautan, kelas privat tanpa kode undangan, pengingat tidak sebelum tenggat, poster
berulang dalam satu perubahan urutan), dan hari jadwal di luar 1 sampai 7 sekarang dijawab 400,
bukan 500. Patokannya: 400 bila kiriman yang sama tidak akan pernah berhasil, 409 bila kirimannya
benar tetapi keadaan datanya tidak memungkinkan.

## 21 November 2026: nama di backend memakai bahasa Inggris

Sebelumnya hanya URL dan nama field JSON yang berbahasa Inggris, sedangkan nama fungsi, model,
tipe, dan berkas backend berbahasa Indonesia. Akibatnya muncul nama campuran seperti
`ambilProfile` dan `buatSubkelas`, dan kunci berbahasa Indonesia di hasil model berisiko ikut
terkirim ke frontend. Sekarang semuanya bahasa Inggris.

Yang berubah: nama fungsi, objek model dan metodenya, tipe, konstanta, dan berkas di
`src/server`, `src/types/api`, dan `src/app/api`, beserta kunci data di hasil model dan fungsi
izin. Yang **tidak** berubah: URL, tabel dan kolom database (tidak ada migrasi), isi respons API
selain satu field di bawah, komentar, `message` galat, nama tes, dan seluruh kode frontend.

Satu field API ikut berganti: body `POST /api/v1/classes/{classId}/subclasses` memakai
`pjUserIds`, bukan lagi `pjAwal`.

Padanan yang paling sering dipakai:

| Lama                                            | Baru                                                 |
| ----------------------------------------------- | ---------------------------------------------------- |
| `bacaJson(req)`                                 | `readJson(req)`                                      |
| `ambilSesi()`, `keluar()`                       | `getSession()`, `signOut()`                          |
| `sesiSaya()`, `keluarSesi()`                    | `getMySession()`, `endSession()`                     |
| `wajibLogin()`, `wajibSuperadmin()`             | `requirePageLogin()`                                 |
| `untukHalaman(fn)`                              | `forPage(fn)`                                        |
| `bacaAksesKelas()`, `aksesKelasSaya()`          | `readClassAccess()`, `getMyClassAccess()`            |
| `{ user, kelas, role }` dari fungsi izin        | `{ user, classData, role }`                          |
| opsi `{ bolehArsip: true }`                     | `{ allowArchived: true }`                            |
| `kelasModel`, `anggotaKelasModel`               | `classModel`, `classMemberModel`                     |
| `subkelasModel`, `materiModel`                  | `subclassModel`, `materialModel`                     |
| `jadwalModel`, `tugasModel`                     | `scheduleModel`, `assignmentModel`                   |
| `cariPerId`, `buat`, `ubah`, `hapus`            | `findById`, `create`, `update`, `remove`             |
| `daftar`, `daftarPerKelas`, `daftarPerSubkelas` | `list`, `listByClass`, `listBySubclass`              |
| hasil daftar `{ baris, total }`                 | `{ rows, total }`                                    |
| `ambilHalaman()`, tipe `Halaman`                | `paginate()`, tipe `Pagination`                      |
| `SesiDto`, `AksesKelasDto`, `SubkelasDto`       | `SessionDto`, `ClassAccessDto`, `SubclassDto`        |
| `ApiSukses`, `ApiGagal`, `MetaDaftar`           | `ApiSuccess`, `ApiFailure`, `ListMeta`               |
| `models/kelas.ts`, `models/anggota-kelas.ts`    | `models/class.ts`, `models/class-member.ts`          |
| `models/materi.ts`, `jadwal.ts`, `tugas.ts`     | `models/material.ts`, `schedule.ts`, `assignment.ts` |
| `auth/sesi.ts`, `konfigurasi.ts`, `akun-dev.ts` | `auth/session.ts`, `config.ts`, `dev-accounts.ts`    |
| `permissions/kelas.ts`, `halaman.ts`            | `permissions/class.ts`, `page.ts`                    |
| `types/api/umum.ts`                             | `types/api/common.ts`                                |

Kunci hasil fungsi izin bernama `classData`, bukan `class`, karena `class` kata khusus di
JavaScript dan tidak bisa ditulis sebagai `const { class } = ...`.

Bagi yang punya branch dari sebelum perubahan ini: setelah `git pull origin main`, jalankan
`npm run typecheck`. Setiap nama lama yang masih dipakai akan muncul sebagai galat, dan
penggantinya ada di tabel di atas.

## 21 November 2026: `/dashboard` jadi Meja, `/admin` dihapus

`/admin` dihapus dan disatukan ke `/dashboard`. Satu rute, dua tampilan, dipilih dari
`users.is_superadmin`:

| Peran      | Tampilan | Isi                                              |
| ---------- | -------- | ------------------------------------------------ |
| pengguna   | Meja     | agenda lintas kelas, tenggat, tab map, kabar     |
| superadmin | Loket    | antrean pengajuan, undangan admin, kondisi situs |

Alasan: `/admin` pada dasarnya adalah pratinjau `/dashboard` untuk peran lain, dan memisahkannya
membuat superadmin kehilangan agenda pribadinya. Peran website dan peran kelas berlaku di scope
berbeda, jadi tidak seharusnya menghalangi akses ke Meja.

Yang ikut berubah:

- Redirect superadmin ke `/admin` dihapus; `redirectTo` akun contoh superadmin menjadi
  `/dashboard`.
- Sidebar `SisiDasbor` dan `KerangkaDasbor` dihapus. Navigasi memakai satu navbar dengan tiga tab
  (Meja/Loket, Kelas, Profil), sehingga tidak ada dua sumber navigasi untuk tujuan yang sama.
- `dashboard.css` (1027 baris, 22 kelas mati) diganti `meja.css`. Token `--ds-dash-*` yang hanya
  dipakai dasbor lama dihapus; `--ds-shadow-dash-sheet` menjadi `--ds-shadow-kertas-panel` dan
  tetap dipakai `kelas.css`.
- `requirePageSuperadmin()` dihapus karena tidak ada lagi halaman yang perlu menolak peran.
  Tampilan dipilih, bukan ditolak.
- Kartu statistik dihapus. Metrik yang dipantau peran ini adalah umur pengajuan tertua, ditulis
  sebagai kalimat di kepala antrean dan berubah merah setelah 48 jam.
- Penolakan pengajuan sekarang wajib beralasan; sebelumnya alasan sudah ditampilkan ke pengaju
  tetapi UI tidak pernah memintanya.

## Ditunda

| Hal                                           | Menunggu                          |
| --------------------------------------------- | --------------------------------- |
| Login Google aktif (kodenya sudah tersambung) | Kredensial Google Cloud           |
| Data contoh keanggotaan untuk akun contoh     | Disusun Fadlan dan Zaki           |
| PWA dan notifikasi                            | Fitur tugas (F10)                 |
| Worker pengingat, Dockerfile produksi, HTTPS  | Mendekati rilis                   |
| `.github/CODEOWNERS`                          | Nama pengguna GitHub tiap anggota |
