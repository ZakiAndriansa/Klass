# Klass

Platform komunitas untuk mengelola kelas: materi, jadwal, tugas, dan pengingat dalam satu tempat. Kebutuhan lengkapnya ada di [`docs/PRD-Klass.md`](docs/PRD-Klass.md).

Baru bergabung? Baca dulu [`docs/panduan-belajar.md`](docs/panduan-belajar.md).

## Menjalankan di laptop

Yang perlu terpasang: Node.js 22 atau lebih baru, Git, dan MySQL 8. MySQL boleh dari Docker Desktop atau dari Laragon; pilih salah satu. Bila tidak ingin memasang Node.js, lihat Pilihan C.

```bash
npm ci                 # 1. pasang paket persis sesuai package-lock.json
cp .env.example .env   # 2. siapkan pengaturan lokal (di CMD Windows: copy .env.example .env)
                       # 3. nyalakan MySQL, lihat Pilihan A atau Pilihan B di bawah
npm run dev            # 4. jalankan aplikasi
```

Buka http://localhost:3000 untuk melihat halaman utama. Halaman lain yang sudah ada: `/login`, `/register`, dan `/components` (galeri semua komponen).

Login Google belum tersambung. Untuk masuk saat pengembangan, buka http://localhost:3000/dev/login lalu klik salah satu akun contoh (satu akun per peran: superadmin, admin kelas, PJ, anggota, dan pengguna baru).

Untuk memastikan database tersambung, buka http://localhost:3000/api/v1/health. Jawabannya harus memuat `"database":"terhubung"`. Bila tertulis `"terputus"`, MySQL belum menyala atau `DATABASE_URL` di `.env` tidak cocok dengan pilihanmu.

**Setelah `git pull`, jalankan `npm ci` lagi** supaya paket di laptopmu sama dengan yang dipakai tim. Pakai `npm install <nama-paket>` hanya saat menambah paket baru, dan itu harus disetujui lead. Bila `package-lock.json` berubah padahal kamu tidak menambah paket, jangan ikut di-commit; kembalikan dengan `git checkout -- package-lock.json`.

Folder proyek boleh diletakkan di mana saja, tidak harus di `C:\laragon\www`.

### Pilihan A: MySQL dari Docker

1. Nyalakan Docker Desktop.
2. Jalankan `npm run db:up`. Database `klass` dan penggunanya dibuat otomatis.
3. `.env` tidak perlu diubah. Isinya sudah cocok:

   ```
   DATABASE_URL=mysql://klass:klass_dev@localhost:3307/klass
   ```

Untuk mematikan: `npm run db:down`.

### Pilihan B: MySQL dari Laragon

Perintah `npm run db:up` dan `npm run db:down` **tidak dipakai** pada pilihan ini.

1. Buka Laragon lalu klik **Start All**. MySQL berjalan di port 3306.
2. Buat database bernama `klass`. Database tidak dibuat otomatis seperti pada Docker. Pilih salah satu cara:
   - Klik tombol **Database** di Laragon (membuka HeidiSQL), klik kanan pada koneksi di panel kiri, pilih **Create new** lalu **Database**, isi nama `klass`, pilih collation `utf8mb4_unicode_ci`, lalu OK.
   - Atau klik tombol **Terminal** di Laragon dan jalankan:

     ```bash
     mysql -u root -e "CREATE DATABASE klass CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
     ```

3. Buka `.env` dan ganti baris `DATABASE_URL` menjadi:

   ```
   DATABASE_URL=mysql://root@localhost:3306/klass
   ```

   Itu untuk pengaturan bawaan Laragon, yaitu pengguna `root` tanpa kata sandi. Bila `root` milikmu diberi kata sandi, tulis `mysql://root:KATASANDI@localhost:3306/klass`.

4. Matikan lalu jalankan ulang `npm run dev` supaya `.env` yang baru terbaca.

Yang perlu diperhatikan:

1. Pastikan versi MySQL di Laragon adalah 8 (klik kanan Laragon, menu **MySQL**, lalu **Version**). Laragon lama membawa MySQL 5.7, yang tidak dipakai di proyek ini.
2. XAMPP tidak bisa dipakai sebagai pengganti karena isinya MariaDB, bukan MySQL.
3. `.env` tidak ikut di-commit, jadi tiap anggota bebas memakai pilihannya sendiri tanpa mengganggu yang lain.

### Perbedaan kedua pilihan

| Hal                     | Docker                  | Laragon                  |
| ----------------------- | ----------------------- | ------------------------ |
| Menyalakan              | `npm run db:up`         | **Start All** di Laragon |
| Port                    | 3307                    | 3306                     |
| Pengguna dan kata sandi | `klass` dan `klass_dev` | `root` tanpa kata sandi  |
| Database `klass`        | Dibuat otomatis         | Dibuat sendiri sekali    |
| `DATABASE_URL`          | Bawaan `.env.example`   | Diganti manual           |

Perintah lain (`npm run db:generate`, `npm run db:migrate`, `npm run db:studio`) sama untuk keduanya, karena semuanya membaca `DATABASE_URL` dari `.env`.

### Pilihan C: aplikasi dan MySQL sekaligus di Docker

Bila tidak ingin memasang Node.js, seluruh proyek bisa dijalankan dengan satu perintah:

```bash
docker compose up
```

Perintah itu menyalakan MySQL, memasang paket npm, lalu menjalankan aplikasi Next.js dalam mode pengembangan. Buka http://localhost:3000. Perubahan berkas di folder proyek langsung terlihat karena folder itu dipasang ke kontainer. Penyalaan pertama lebih lama karena paket npm sedang dipasang.

Catatan:

1. Hentikan dengan `docker compose down`, atau tekan Ctrl+C bila perintah dijalankan di terminal.
2. Jangan menjalankan `npm run dev` di laptop bersamaan, karena port 3000 sudah dipakai.
3. Ketergantungan npm dan cache Next.js disimpan di volume Docker, bukan di folder proyek.
4. `.env` tidak perlu diubah. `compose.yaml` memberi `DATABASE_URL` ke kontainer dengan alamat `db:3306`.
5. Bila nanti ingin kembali memakai `npm run dev` di laptop, hapus dulu folder `node_modules` dan `.next` buatan Docker, lalu jalankan `npm install`.

## Peta folder dan pemilik

Setiap folder punya `README.md` sendiri yang menjelaskan isinya. Tabel ini ringkasannya.

| Folder                                                                          | Isi                                                        | Pemilik        | Reviewer wajib |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------- | -------------- |
| **Frontend**                                                                    |                                                            |                |                |
| `src/components/shared`, `src/components/features`                              | Komponen design system Klass                               | Rehan, Darrel  | Aqil           |
| `src/app/styles`, `src/app/fonts`, `public`                                     | Gaya design system (token, CSS per komponen), font, gambar | Aqil           | Aqil           |
| `src/components/ui`                                                             | Komponen shadcn/ui, belum dipakai halaman mana pun         | Aqil           | Aqil           |
| `src/app` selain `api`                                                          | Halaman dan alamatnya (slicing)                            | Aqil           | Aqil           |
| **Backend**                                                                     |                                                            |                |                |
| `src/app/api`                                                                   | URL backend                                                | Ahmad, Bintang | Zaki           |
| `src/server/controllers`                                                        | Logika tiap endpoint                                       | Ahmad, Bintang | Zaki           |
| `src/types/api`                                                                 | Bentuk data yang dikirim API                               | Ahmad, Bintang | Zaki           |
| `src/server/models`                                                             | Query ke database                                          | Fadlan         | Zaki           |
| `src/server/db`, `drizzle`                                                      | Tabel dan migrasi                                          | Fadlan         | Zaki           |
| `src/server/http`, `permissions`, `auth`                                        | Alat bantu API, izin, login                                | Zaki           | Zaki           |
| **Umum**                                                                        |                                                            |                |                |
| `src/lib`, `src/env.ts`                                                         | Fungsi bantu, pengaturan lingkungan                        | Zaki           | Zaki           |
| Berkas config di akar, `compose.yaml`, `docker`, `worker`, `.github`, `.claude` | Struktur, format, template                                 | Zaki           | Zaki           |
| `docs`                                                                          | PRD, panduan belajar, kontrak API, catatan keputusan       | Semua          | Lead terkait   |

Aqil adalah lead frontend dan Zaki lead backend. Tidak ada perubahan yang digabung ke `main` tanpa persetujuan lead bagiannya.

## Alur data

```
halaman (src/app)  ----\
                        >-->  controller  -->  model  -->  database
URL (src/app/api)  ----/
```

Komponen hanya menerima data lewat props. Halaman dan URL memanggil controller. Controller memanggil model. Hanya model yang menyentuh database. `npm run lint` menolak impor yang melanggar alur ini.

Contoh yang bisa ditiru untuk tiap lapisan:

| Lapisan               | Berkas                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------- |
| Halaman               | `src/app/(publik)/page.tsx` (merakit komponen, belum mengambil data)                    |
| Komponen dan gayanya  | `src/components/shared/tombol-kertas.tsx`, `src/app/styles/klass/components/button.css` |
| URL                   | `src/app/api/v1/health/route.ts`                                                        |
| Controller dan ujinya | `src/server/controllers/health.ts`, `health.test.ts`                                    |
| Model                 | `src/server/models/health.ts`                                                           |
| Bentuk data           | `src/types/api/health.ts`                                                               |

Belum ada halaman yang mengambil data dari controller. Polanya (komponen `async` di dalam `<Suspense>`) dicatat di `.claude/skills/klass-halaman/SKILL.md`.

## Tampilan

Tampilan memakai **design system Klass** bergaya kertas dan map manila. Gayanya ditulis sebagai CSS biasa di `src/app/styles/klass/`, semua nilai visual ada di `tokens.css` (variabel `--ds-*`), dan hanya berlaku di dalam elemen berkelas `ds` yang dipasang di `layout.tsx` tiap kelompok halaman. Daftar komponen ada di `src/components/shared/README.md`, dan semuanya bisa dilihat di http://localhost:3000/components.

## Perintah

| Perintah              | Guna                                                          |
| --------------------- | ------------------------------------------------------------- |
| `npm ci`              | Memasang paket sesuai lockfile, dijalankan setelah `git pull` |
| `npm run dev`         | Menjalankan aplikasi untuk pengembangan                       |
| `npm run lint`        | Memeriksa kode dan batas folder                               |
| `npm run typecheck`   | Memeriksa tipe TypeScript                                     |
| `npm run test`        | Menjalankan uji                                               |
| `npm run format`      | Merapikan kode                                                |
| `npm run build`       | Membangun versi produksi                                      |
| `npm run db:up`       | Menyalakan MySQL saja                                         |
| `npm run db:down`     | Mematikan semua layanan Docker                                |
| `docker compose up`   | Menjalankan aplikasi dan MySQL di Docker                      |
| `npm run db:generate` | Membuat migrasi dari perubahan tabel                          |
| `npm run db:migrate`  | Menerapkan migrasi ke database                                |
| `npm run db:studio`   | Melihat isi database di peramban                              |

Sebelum membuka pull request, jalankan `npm run lint`, `npm run typecheck`, dan `npm run test`.

## Cara bekerja

1. Buat branch dari `main`: `feat/<nama>-<ringkas>`, misalnya `feat/rehan-kartu-tugas`.
2. Kerjakan di folder milikmu. Butuh perubahan di folder orang lain? Minta ke pemiliknya.
3. Commit dengan pesan sesuai [standar pesan commit](#standar-pesan-commit).
4. Buka pull request dan minta review lead bagianmu.

## Standar pesan commit

Setiap pesan commit **wajib diawali** salah satu dari empat kata berikut, lalu titik dua, lalu ringkasan singkat berbahasa Indonesia. Tidak ada awalan lain.

| Awalan   | Dipakai saat                                                                                 | Contoh                                     |
| -------- | -------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `Add`    | Menambah sesuatu yang baru: berkas, fitur, komponen, tabel, endpoint                         | `Add: kartu tugas dengan status tenggat`   |
| `Update` | Mengubah yang sudah ada tanpa memperbaiki bug: tampilan, isi, config, dokumen, perapian kode | `Update: teks halaman utama`               |
| `Delete` | Menghapus berkas, fitur, atau kode yang tidak dipakai                                        | `Delete: komponen banner lama`             |
| `Fix`    | Memperbaiki sesuatu yang salah atau rusak                                                    | `Fix: tombol join tidak bisa diklik di HP` |

Cara menulisnya di terminal:

```bash
git commit -m "Add: kartu tugas dengan status tenggat"
```

Aturan:

1. Bentuknya `Awalan: ringkasan`. Awalan diawali huruf besar dan ditulis persis seperti di tabel.
2. Ringkasan menjelaskan **apa yang berubah**, paling panjang kira-kira 70 karakter, tanpa titik di akhir.
3. Satu commit untuk satu jenis perubahan. Bila pekerjaanmu menambah sekaligus menghapus, pecah menjadi dua commit. Bila tidak bisa dipecah, pakai awalan dari perubahan utamanya.
4. Ragu antara `Update` dan `Fix`? Bila sebelumnya salah atau rusak, pakai `Fix`. Bila sebelumnya benar tetapi diubah, pakai `Update`.
5. Judul pull request memakai bentuk yang sama.
6. Jangan menyebut alat AI di pesan commit dan jangan menambahkan baris `Co-Authored-By`.

| Salah                                            | Kenapa                                        | Benar                                  |
| ------------------------------------------------ | --------------------------------------------- | -------------------------------------- |
| `update`                                         | Tidak menjelaskan apa yang berubah            | `Update: warna tombol utama`           |
| `add: form login`                                | Awalan harus diawali huruf besar              | `Add: form login`                      |
| `feat: form login`                               | `feat` bukan salah satu dari empat awalan     | `Add: form login`                      |
| `Fix bug`                                        | Tanpa titik dua dan tidak jelas bug yang mana | `Fix: jadwal hari Minggu tidak tampil` |
| `Add: form login, hapus banner, perbaiki navbar` | Tiga jenis perubahan dalam satu commit        | Tiga commit terpisah                   |

Commit pertama repo ini (`chore: setup awal proyek Klass`) dibuat sebelum standar berlaku dan dibiarkan apa adanya.

## Teknologi

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, design system Klass (CSS dengan token `--ds-*`), MySQL 8.4, Drizzle ORM, Better Auth, Zod, Vitest. Alasan pemilihannya dicatat di [`docs/keputusan.md`](docs/keputusan.md).
