# src/server/db

**Pemilik:** Fadlan · **Reviewer wajib:** Zaki

| Berkas            | Isi                                            |
| ----------------- | ---------------------------------------------- |
| `index.ts`        | Koneksi ke MySQL, mengekspor `db`              |
| `schema/`         | Definisi tabel, satu berkas per kelompok tabel |
| `schema/index.ts` | Mengekspor ulang semua tabel                   |

`db` hanya boleh diimpor dari `src/server/models`.

## Mengubah tabel

1. Ubah atau tambah berkas di `schema/`.
2. `npm run db:generate` membuat berkas SQL di folder `drizzle/`. Baca hasilnya.
3. `npm run db:migrate` menerapkannya ke database lokal.
4. Berkas migrasi yang sudah masuk `main` tidak diubah lagi; buat migrasi baru.

Database lokal dijalankan dengan `npm run db:up` (MySQL di port 3307) dan bisa dilihat dengan `npm run db:studio`.

Skill: `klass-db`.
