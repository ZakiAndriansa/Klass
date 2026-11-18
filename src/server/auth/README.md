# src/server/auth

**Pemilik:** Zaki · **Reviewer wajib:** Zaki · **Status:** konfigurasi dasar ada, login belum aktif

Konfigurasi login Google dengan Better Auth (F1).

| Berkas     | Isi                                                                      |
| ---------- | ------------------------------------------------------------------------ |
| `index.ts` | Konfigurasi Better Auth: sambungan ke database, kolom tambahan, penyedia |

## Hubungan dengan tabel pengguna

Bentuk tabel pengguna ditentukan Better Auth, bukan dirancang sendiri. Konfigurasi di `index.ts` dan skema di `src/server/db/schema/auth.ts` adalah satu pasang:

| Di konfigurasi                      | Akibat di database                                          |
| ----------------------------------- | ----------------------------------------------------------- |
| `usePlural: true`                   | Nama tabel `users`, `sessions`, `accounts`, `verifications` |
| `additionalFields.isSuperadmin`     | Kolom `users.is_superadmin`, tidak bisa diisi lewat API     |
| Menambah plugin atau kolom tambahan | Skema harus dibuat ulang oleh Zaki dan diberi migrasi baru  |

Tabel lain yang butuh pengguna merujuk ke `users.id` (varchar 36). Tidak ada tabel `profiles`.

## Yang sudah dan belum ada

| Hal                                              | Status                                             |
| ------------------------------------------------ | -------------------------------------------------- |
| Konfigurasi dasar dan skema tabel                | Ada                                                |
| Migrasi `drizzle/0000_tabel_auth.sql`            | Ada, belum pernah dijalankan ke database           |
| URL `/api/auth/...`                              | Belum                                              |
| Kredensial Google Cloud di `.env`                | Belum (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) |
| `BETTER_AUTH_SECRET` di `.env`                   | Belum, wajib diisi sebelum login diaktifkan        |
| Tombol Google di `/login` tersambung             | Belum                                              |
| Fungsi pembaca sesi untuk controller dan halaman | Belum                                              |

## Aturan

1. Folder ini satu-satunya di luar `src/server/models` yang boleh mengimpor `db`, karena Better Auth membaca dan menulis tabelnya sendiri.
2. Controller dan halaman tidak memanggil `auth` langsung. Nanti disediakan fungsi pembaca sesi di `src/server/permissions`.
3. `is_superadmin` hanya diubah langsung di database oleh pengelola.
