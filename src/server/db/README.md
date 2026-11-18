# src/server/db

**Pemilik:** Fadlan · **Reviewer wajib:** Zaki

| Berkas            | Isi                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`        | Koneksi ke MySQL, mengekspor `db`                                                                                          |
| `schema/`         | Definisi tabel, satu berkas per kelompok tabel                                                                             |
| `schema/index.ts` | Mengekspor ulang semua tabel                                                                                               |
| `schema/auth.ts`  | Tabel pengguna dari Better Auth (`users`, `sessions`, `accounts`, `verifications`). Milik Zaki, tidak diubah dengan tangan |

`db` hanya boleh diimpor dari `src/server/models`.

## Mengubah tabel

1. Ubah atau tambah berkas di `schema/`.
2. `npm run db:generate -- --name=nama_singkat` membuat berkas SQL di folder `drizzle/`, misalnya `--name=tabel_kelas`. Baca hasilnya.
3. `npm run db:migrate` menerapkannya ke database lokal.
4. Berkas migrasi yang sudah masuk `main` tidak diubah lagi; buat migrasi baru.

Database lokal boleh dari Docker (`npm run db:up`, port 3307) atau dari Laragon (port 3306); caranya ada di `README.md` utama. Isinya bisa dilihat dengan `npm run db:studio`.

Skill: `klass-db`.
