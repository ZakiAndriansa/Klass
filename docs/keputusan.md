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

## Ditunda

| Hal                                          | Menunggu                                   |
| -------------------------------------------- | ------------------------------------------ |
| Lapisan izin (`src/server/permissions`)      | Kerangka dan tabel dasar selesai           |
| Login Google (`src/server/auth`)             | Tabel pengguna dan kredensial Google Cloud |
| PWA dan notifikasi                           | Fitur tugas (F10)                          |
| Worker pengingat, Dockerfile produksi, HTTPS | Mendekati rilis                            |
| `.github/CODEOWNERS`                         | Nama pengguna GitHub tiap anggota          |
