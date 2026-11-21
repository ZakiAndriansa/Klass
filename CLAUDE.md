# Klass

@AGENTS.md

Platform komunitas pengelola kelas. Kebutuhan ada di `docs/PRD-Klass.md`. Tim beranggotakan tujuh mahasiswa yang masih belajar, jadi kode ditulis sederhana dan mudah ditiru. Komentar dan pesan untuk pengguna berbahasa Indonesia; nama di backend berbahasa Inggris (aturan nomor 8 di bawah).

## Stack

Next.js 16 App Router dengan Cache Components aktif, TypeScript, Tailwind CSS 4, design system Klass (CSS berlingkup `.ds`), shadcn/ui (terpasang tetapi belum dipakai halaman mana pun), MySQL 8.4, Drizzle ORM (`drizzle-orm/mysql2`), Better Auth (akun contoh untuk pengembangan lewat `/dev/login`; login Google aktif setelah kredensialnya diisi di `.env`), Zod 4, Vitest, npm.

## Perintah

```bash
npm ci               # setelah git pull; npm install hanya saat menambah paket
npm run dev          # aplikasi di http://localhost:3000
npm run db:up        # MySQL lewat Docker, port 3307
docker compose up    # alternatif: aplikasi dan MySQL sekaligus di Docker
npm run lint         # termasuk penjaga batas folder
npm run typecheck
npm run test
npm run build
```

## Batas lapisan (ditegakkan ESLint)

1. Alur satu arah: halaman atau URL (`route.ts`) memanggil controller, controller memanggil model, model memanggil `db`.
2. Hanya `src/server/models/**` yang mengimpor `@/server/db` dan menulis query. Satu pengecualian: `src/server/auth`, karena Better Auth mengelola tabelnya sendiri.
3. `src/components/**`, `src/lib/**`, dan `src/types/**` tidak mengimpor dari `@/server`.
4. Berkas di `src/server/**` diawali `import "server-only";`.
5. Variabel lingkungan dibaca lewat `env` dari `@/env`, bukan `process.env`.
6. Karena Cache Components aktif, bagian halaman yang mengambil data dibungkus `<Suspense>`; polanya ada di skill `klass-halaman`. Jangan memakai `export const dynamic`.
7. Pemeriksaan peran hanya ditulis di `src/server/permissions`. Controller memanggil `requireAuth()` atau salah satu `require...` sebelum model; halaman memanggil controller lewat `forPage()`. `route.ts` membaca body dengan `readJson(req)`, bukan `req.json()`.
8. Di backend (`src/server`, `src/types/api`, `src/app/api`), nama fungsi, model, tipe, dan berkas berbahasa Inggris: `classModel.findById`, `createSubclass`, `SessionDto`, `class-member.ts`. Komentar, `message` galat, dan nama tes tetap bahasa Indonesia. Padanan nama lama dan baru ada di `docs/keputusan.md` (21 November 2026).

## Tampilan

1. Semua halaman (publik, auth, dasbor, admin) memakai design system Klass buatan Aqil: CSS biasa di `src/app/styles/klass/`, token `--ds-*` di `tokens.css`, berlaku hanya di dalam elemen berkelas `ds` (dipasang di `layout.tsx` grup route).
2. Komponennya ada di `src/components/shared` dan `features`; daftarnya di `src/components/shared/README.md`, galerinya di `/components`.
3. Nilai visual tidak ditulis langsung di CSS komponen atau TSX; tambahkan token. Tombol selalu memakai `TombolKertas`.
4. Halaman dan layout memakai nama kelas CSS Klass, bukan utilitas Tailwind. Tailwind dan shadcn hanya dipakai di `src/components/ui` (lihat `docs/keputusan.md`).
5. URL halaman dan API memakai bahasa Inggris huruf kecil (`/dashboard`, `/classes`, `/api/v1/classes`); teks di halaman dan `message` galat tetap bahasa Indonesia.
6. Nama field JSON dan nilai pilihannya juga bahasa Inggris (`name`, `classId`, `"admin"`), mengikuti nama kolom database. Aturannya di `docs/api.md` bagian "Penamaan field".

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

`klass-setup` (struktur dan config), `klass-api` (URL dan controller), `klass-db` (tabel dan model), `klass-komponen`, `klass-halaman`, `klass-review-komponen`, `klass-pr` (Git dan PR), `klass-izin` (siapa boleh apa; kodenya di `src/server/permissions`).

## Aturan Git

Pesan commit selalu diawali `Add:`, `Update:`, `Delete:`, atau `Fix:`, misalnya `Add: kartu tugas dengan status tenggat`.

`package-lock.json` yang berubah tanpa penambahan paket tidak di-commit.

Jangan menyebut Claude atau alat AI di pesan commit, judul PR, atau deskripsi PR. Tidak ada baris `Co-Authored-By`. Commit dan push hanya bila diminta. Rinciannya di skill `klass-pr`.
