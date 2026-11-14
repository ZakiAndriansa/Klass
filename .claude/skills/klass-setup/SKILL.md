---
name: klass-setup
description: Membangun kerangka awal proyek Klass dari nol (Next.js App Router, TypeScript, Tailwind, shadcn/ui, Drizzle, MySQL, Better Auth, Docker Compose) beserta struktur folder, config, format, dan template untuk tim. Pakai saat diminta "setup project", "scaffold", "buat struktur awal", "siapkan config", "tambah template", atau saat mengubah struktur folder dan konfigurasi dasar. Pemilik area ini Zaki.
---

# Setup Proyek Klass

Sumber kebutuhan: `docs/PRD-Klass.md`. Baca bagian 5, 6, 7, dan 10 sebelum mengubah struktur.

## Keputusan stack

| Lapisan | Pilihan | Status |
| --- | --- | --- |
| Aplikasi | Next.js App Router, TypeScript, folder `src/` | Keputusan PRD |
| UI | Tailwind v4, shadcn/ui | Keputusan PRD |
| Database | MySQL 8 dalam kontainer | Keputusan PRD |
| ORM | Drizzle (`drizzle-orm/mysql2`) | Disetujui Zaki 14 Nov 2026 |
| Auth | Better Auth, login Google; magic link ditunda | Disetujui Zaki 14 Nov 2026 |
| Package manager | npm | Disetujui Zaki 14 Nov 2026 |
| Validasi | Zod | Usulan |
| Uji | Vitest, wajib untuk lapisan izin | Usulan |

Bahasa yang dipakai TypeScript, bukan JavaScript. Mengganti isi tabel ini butuh persetujuan Zaki, dan tabel ini diubah lebih dulu daripada kodenya supaya skill lain tetap selaras.

## Struktur folder target

```
klass/
  docs/                      PRD, kontrak API, catatan keputusan
  docker/                    Dockerfile web dan worker, config Caddy
  compose.yaml               web, db, worker, (realtime dan proxy menyusul)
  drizzle/                   berkas migrasi hasil drizzle-kit
  worker/                    job pengingat tugas (F10)
  public/                    manifest PWA, ikon, service worker
  src/
    app/
      (publik)/              halaman utama dan poster
      (auth)/                login
      (app)/                 semua halaman yang butuh login
        kelas/[classId]/
          sub/[subclassId]/
      admin/                 area superadmin
      api/v1/                REST API
    components/
      ui/                    keluaran shadcn, jangan diubah tanpa izin lead frontend
      shared/                komponen umum buatan tim
      features/<fitur>/      komponen milik satu fitur
    server/                  hanya boleh diimpor dari kode server
      db/
        schema/              satu berkas per kelompok tabel
        index.ts             koneksi Drizzle
      controllers/           validasi, izin, dan aturan bisnis per modul
      models/                semua query dan transaksi per modul
      permissions/           lapisan izin terpusat
      auth/                  konfigurasi Better Auth
      http/                  helper respons, error, dan validasi untuk route handler
    lib/                     util yang aman untuk klien
    types/                   tipe bersama (DTO API)
```

Aturan batas lapisan:

1. `src/server/**` diawali `import "server-only"`. Komponen klien tidak boleh mengimpornya.
2. Alurnya satu arah: URL (`route.ts`) memanggil controller, controller memanggil model, model memanggil `db`. Tidak ada yang melompati lapisan.
3. Hanya `src/server/models/**` yang boleh mengimpor `db` dan menulis query.
4. Setiap controller yang membaca atau mengubah data kelas memanggil lapisan izin lebih dulu (lihat skill `klass-izin`).
5. Server Component memanggil controller langsung. Client Component memanggil REST lewat `src/lib/api-client.ts`.

## Kepemilikan folder

| Area | Pemilik | Reviewer wajib |
| --- | --- | --- |
| Config, struktur, `docker/`, `compose.yaml`, template | Zaki | Zaki |
| Database dan model: `src/server/db/**`, `src/server/models/**`, `drizzle/**` | Fadlan | Zaki |
| URL dan controller: `src/app/api/**`, `src/server/controllers/**` | Ahmad, Bintang | Zaki |
| `src/server/permissions/**`, `worker/` | Zaki | Zaki |
| `src/components/**` | Rehan, Darrel | Aqil |
| `src/app/**` selain `api` (slicing halaman) | Aqil | Aqil |

Zaki adalah lead backend dan Aqil lead frontend. Semua persetujuan backend (PR, perubahan skema, kontrak API, aturan izin, penambahan pustaka server) harus lewat Zaki; semua komponen dan halaman harus lewat Aqil.

Tuangkan tabel ini ke `.github/CODEOWNERS` setelah nama pengguna GitHub tiap anggota diketahui. Jangan mengarang nama pengguna.

## Langkah scaffold

Langkah 1 sampai 10 sudah dijalankan pada 14 November 2026 (Next.js 16.4, Tailwind 4, shadcn basis Base UI). Bagian ini disimpan sebagai catatan cara proyek dibuat dan sebagai acuan bila ada yang perlu diulang.

1. Buat aplikasi. Folder sudah berisi `.claude/` dan `docs/`, jadi bila `create-next-app` menolak folder yang tidak kosong, jalankan di folder sementara lalu pindahkan isinya ke sini.
   ```bash
   npx create-next-app@latest klass --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --skip-install --disable-git --yes
   ```
2. Pasang shadcn: `npx shadcn@latest init --defaults`, lalu komponen dasar sesuai permintaan lead frontend.
3. Pasang dependensi server: `drizzle-orm mysql2 better-auth zod server-only`, dan dev: `drizzle-kit vitest prettier prettier-plugin-tailwindcss`. `@types/node` dinaikkan ke versi 22 karena Vitest memintanya.
4. Buat folder sesuai struktur target. Folder kosong diberi `README.md` satu paragraf yang menjelaskan isinya dan pemiliknya, bukan `.gitkeep`.
5. Config dan format: `.editorconfig`, `.prettierrc`, skrip npm `dev`, `build`, `lint`, `format`, `typecheck`, `test`, `db:generate`, `db:migrate`, `db:studio`.
6. Variabel lingkungan: `.env.example` berisi semua kunci tanpa nilai rahasia, dan `src/env.ts` yang memvalidasinya dengan Zod saat aplikasi mulai. `.env` masuk `.gitignore`.
7. `compose.yaml` untuk pengembangan: layanan `db` (MySQL 8, volume bernama, healthcheck). Petakan ke port host 3307 agar tidak bentrok dengan MySQL Laragon di 3306.
8. Template: `.github/pull_request_template.md`, `.github/CODEOWNERS`, contoh satu URL, satu controller, satu model, satu komponen, dan satu uji izin sebagai acuan salin.
9. `CLAUDE.md` di akar proyek: ringkasan stack, perintah, batas lapisan, dan daftar skill `klass-*`.
10. `README.md`: cara menjalankan dari nol dalam lima langkah atau kurang.

## Database lokal

Anggota boleh memakai MySQL dari Docker (`npm run db:up`, port 3307, pengguna `klass`) atau dari Laragon (port 3306, pengguna `root` tanpa kata sandi, database `klass` dibuat sendiri). Kode tidak boleh bergantung pada salah satunya: semua koneksi membaca `DATABASE_URL` lewat `@/env`. Panduan untuk anggota ada di `README.md`.

## Hal yang berbeda dari Next.js versi lama

1. `create-next-app` menyalakan Cache Components (`cacheComponents: true` di `next.config.ts`). Bagian halaman yang mengambil data harus dibungkus `<Suspense>`, dan `export const dynamic` tidak dipakai.
2. Tailwind dimuat lewat `@tailwindcss/turbopack` di `next.config.ts`, tanpa `postcss.config.mjs`.
3. Proyek menyertakan `AGENTS.md` dan dokumentasi Next.js di `node_modules/next/dist/docs/`. Baca panduan di sana sebelum menulis kode yang menyentuh API Next.js.
4. `npm run typecheck` menjalankan `next typegen` lebih dulu supaya tipe route tersedia.

## Selesai bila

1. `npm run lint`, `npm run typecheck`, `npm run test`, dan `npm run build` lolos.
2. `docker compose up -d db` lalu `npm run db:migrate` berhasil pada mesin bersih.
3. Anggota baru bisa menjalankan aplikasi hanya dengan mengikuti `README.md`.

## Jangan

1. Jangan menambah pustaka di luar tabel stack tanpa mencatat alasannya di `docs/keputusan.md`.
2. Jangan memasang layanan tahap berikutnya (Socket.IO, Redis, BullMQ) pada MVP. PRD menunda chat dan memilih worker sederhana.
3. Jangan menyalin `schema.sql` PostgreSQL apa adanya. Penulisan ulang ke MySQL ada di skill `klass-db`.
