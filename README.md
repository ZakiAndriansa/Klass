# Klass

Platform komunitas untuk mengelola kelas: materi, jadwal, tugas, dan pengingat dalam satu tempat. Kebutuhan lengkapnya ada di [`docs/PRD-Klass.md`](docs/PRD-Klass.md).

Baru bergabung? Baca dulu [`docs/panduan-belajar.md`](docs/panduan-belajar.md).

## Menjalankan di laptop

Yang perlu terpasang: Node.js 22 atau lebih baru, Git, dan Docker Desktop (dalam keadaan menyala).

```bash
npm install            # 1. pasang paket
cp .env.example .env   # 2. siapkan pengaturan lokal (di CMD Windows: copy .env.example .env)
npm run db:up          # 3. nyalakan MySQL
npm run dev            # 4. jalankan aplikasi
```

Buka http://localhost:3000. Dua kartu di halaman itu harus menunjukkan "Berjalan" dan "Terhubung". Bila kartu database menunjukkan "Terputus", Docker Desktop belum menyala atau langkah 3 terlewat.

## Peta folder dan pemilik

Setiap folder punya `README.md` sendiri yang menjelaskan isinya. Tabel ini ringkasannya.

| Folder                                                                          | Isi                                                  | Pemilik        | Reviewer wajib |
| ------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------- | -------------- |
| **Frontend**                                                                    |                                                      |                |                |
| `src/components/shared`, `src/components/features`                              | Komponen tampilan                                    | Rehan, Darrel  | Aqil           |
| `src/components/ui`                                                             | Komponen dasar shadcn/ui                             | Aqil           | Aqil           |
| `src/app` selain `api`                                                          | Halaman dan alamatnya (slicing)                      | Aqil           | Aqil           |
| **Backend**                                                                     |                                                      |                |                |
| `src/app/api`                                                                   | URL backend                                          | Ahmad, Bintang | Zaki           |
| `src/server/controllers`                                                        | Logika tiap endpoint                                 | Ahmad, Bintang | Zaki           |
| `src/types/api`                                                                 | Bentuk data yang dikirim API                         | Ahmad, Bintang | Zaki           |
| `src/server/models`                                                             | Query ke database                                    | Fadlan         | Zaki           |
| `src/server/db`, `drizzle`                                                      | Tabel dan migrasi                                    | Fadlan         | Zaki           |
| `src/server/http`, `permissions`, `auth`                                        | Alat bantu API, izin, login                          | Zaki           | Zaki           |
| **Umum**                                                                        |                                                      |                |                |
| `src/lib`, `src/env.ts`                                                         | Fungsi bantu, pengaturan lingkungan                  | Zaki           | Zaki           |
| Berkas config di akar, `compose.yaml`, `docker`, `worker`, `.github`, `.claude` | Struktur, format, template                           | Zaki           | Zaki           |
| `docs`                                                                          | PRD, panduan belajar, kontrak API, catatan keputusan | Semua          | Lead terkait   |

Aqil adalah lead frontend dan Zaki lead backend. Tidak ada perubahan yang digabung ke `main` tanpa persetujuan lead bagiannya.

## Alur data

```
halaman (src/app)  ----\
                        >-->  controller  -->  model  -->  database
URL (src/app/api)  ----/
```

Komponen hanya menerima data lewat props. Halaman dan URL memanggil controller. Controller memanggil model. Hanya model yang menyentuh database. `npm run lint` menolak impor yang melanggar alur ini.

Satu contoh lengkap yang bisa ditiru sudah ada, yaitu cek kesehatan:

| Lapisan               | Berkas                                               |
| --------------------- | ---------------------------------------------------- |
| Halaman               | `src/app/(publik)/page.tsx`                          |
| Komponen              | `src/components/shared/kartu-status.tsx`             |
| URL                   | `src/app/api/v1/health/route.ts`                     |
| Controller dan ujinya | `src/server/controllers/health.ts`, `health.test.ts` |
| Model                 | `src/server/models/health.ts`                        |
| Bentuk data           | `src/types/api/health.ts`                            |

## Perintah

| Perintah                           | Guna                                    |
| ---------------------------------- | --------------------------------------- |
| `npm run dev`                      | Menjalankan aplikasi untuk pengembangan |
| `npm run lint`                     | Memeriksa kode dan batas folder         |
| `npm run typecheck`                | Memeriksa tipe TypeScript               |
| `npm run test`                     | Menjalankan uji                         |
| `npm run format`                   | Merapikan kode                          |
| `npm run build`                    | Membangun versi produksi                |
| `npm run db:up`, `npm run db:down` | Menyalakan dan mematikan MySQL          |
| `npm run db:generate`              | Membuat migrasi dari perubahan tabel    |
| `npm run db:migrate`               | Menerapkan migrasi ke database          |
| `npm run db:studio`                | Melihat isi database di peramban        |

Sebelum membuka pull request, jalankan `npm run lint`, `npm run typecheck`, dan `npm run test`.

## Cara bekerja

1. Buat branch dari `main`: `feat/<nama>-<ringkas>`, misalnya `feat/rehan-kartu-tugas`.
2. Kerjakan di folder milikmu. Butuh perubahan di folder orang lain? Minta ke pemiliknya.
3. Buka pull request dan minta review lead bagianmu.

Aturan lengkapnya ada di `.claude/skills/klass-pr/SKILL.md`.

## Teknologi

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, MySQL 8.4, Drizzle ORM, Better Auth, Zod, Vitest. Alasan pemilihannya dicatat di [`docs/keputusan.md`](docs/keputusan.md).
