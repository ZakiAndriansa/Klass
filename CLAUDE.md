# Klass

@AGENTS.md

Platform komunitas pengelola kelas. Kebutuhan ada di `docs/PRD-Klass.md`. Tim beranggotakan tujuh mahasiswa yang masih belajar, jadi kode dan komentar ditulis sederhana, berbahasa Indonesia, dan mudah ditiru.

## Stack

Next.js 16 App Router dengan Cache Components aktif, TypeScript, Tailwind CSS 4, shadcn/ui (basis Base UI), MySQL 8.4, Drizzle ORM (`drizzle-orm/mysql2`), Better Auth (belum dikonfigurasi), Zod 4, Vitest, npm.

## Perintah

```bash
npm run dev          # aplikasi di http://localhost:3000
npm run db:up        # MySQL lewat Docker, port 3307
npm run lint         # termasuk penjaga batas folder
npm run typecheck
npm run test
npm run build
```

## Batas lapisan (ditegakkan ESLint)

1. Alur satu arah: halaman atau URL (`route.ts`) memanggil controller, controller memanggil model, model memanggil `db`.
2. Hanya `src/server/models/**` yang mengimpor `@/server/db` dan menulis query.
3. `src/components/**`, `src/lib/**`, dan `src/types/**` tidak mengimpor dari `@/server`.
4. Berkas di `src/server/**` diawali `import "server-only";`.
5. Variabel lingkungan dibaca lewat `env` dari `@/env`, bukan `process.env`.
6. Karena Cache Components aktif, bagian halaman yang mengambil data dibungkus `<Suspense>`; lihat `src/app/(publik)/page.tsx`. Jangan memakai `export const dynamic`.

## Pemilik dan reviewer

Zaki adalah lead backend dan Aqil lead frontend. Tabel pemilik per folder ada di `README.md`, dan setiap folder punya `README.md` sendiri. Sebelum mengubah berkas, baca README folder itu.

| Area                             | Pemilik        | Reviewer wajib |
| -------------------------------- | -------------- | -------------- |
| Komponen (`src/components`)      | Rehan, Darrel  | Aqil           |
| Halaman (`src/app` selain `api`) | Aqil           | Aqil           |
| URL dan controller               | Ahmad, Bintang | Zaki           |
| Database dan model               | Fadlan         | Zaki           |
| Config, struktur, template       | Zaki           | Zaki           |

## Skill proyek

`klass-setup` (struktur dan config), `klass-api` (URL dan controller), `klass-db` (tabel dan model), `klass-komponen`, `klass-halaman`, `klass-review-komponen`, `klass-pr` (Git dan PR), `klass-izin` (ditunda, belum dipakai).

## Aturan Git

Pesan commit selalu diawali `Add:`, `Update:`, `Delete:`, atau `Fix:`, misalnya `Add: kartu tugas dengan status tenggat`.

Jangan menyebut Claude atau alat AI di pesan commit, judul PR, atau deskripsi PR. Tidak ada baris `Co-Authored-By`. Commit dan push hanya bila diminta. Rinciannya di skill `klass-pr`.
