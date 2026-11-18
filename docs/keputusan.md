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

## 18 November 2026: tabel pengguna

| Keputusan                                                                                         | Alasan                                                               | Diputuskan oleh |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------- |
| Tabel pengguna memakai bentuk dari Better Auth (`users`, `sessions`, `accounts`, `verifications`) | Bentuknya ditentukan pustaka; tabel lain cukup merujuk ke `users.id` | Zaki            |
| Nama tabel auth dijamakkan (`usePlural`)                                                          | Seragam dengan tabel lain                                            | Zaki            |
| Tidak ada tabel `profiles`; `is_superadmin` menjadi kolom tambahan di `users`                     | Nama dan avatar sudah ada di `users`, menghindari data ganda         | Zaki            |
| Skema auth dan migrasi pertama dibuat Zaki sebelum tabel lain                                     | Supaya Fadlan bisa memasang kunci asing ke pengguna                  | Zaki            |

## Ditunda

| Hal                                                | Menunggu                          |
| -------------------------------------------------- | --------------------------------- |
| Lapisan izin (`src/server/permissions`)            | Kerangka dan tabel dasar selesai  |
| Login Google (URL `/api/auth`, tombol di `/login`) | Kredensial Google Cloud           |
| PWA dan notifikasi                                 | Fitur tugas (F10)                 |
| Worker pengingat, Dockerfile produksi, HTTPS       | Mendekati rilis                   |
| `.github/CODEOWNERS`                               | Nama pengguna GitHub tiap anggota |
