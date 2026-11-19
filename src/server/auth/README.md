# src/server/auth

**Pemilik:** Zaki · **Reviewer wajib:** Zaki · **Status:** akun contoh untuk pengembangan aktif, login Google belum

Login dengan Better Auth (F1): konfigurasi, pembaca sesi, dan akun contoh untuk pengembangan.

| Berkas           | Isi                                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| `index.ts`       | Pintu masuk folder. Kode lain mengimpor dari `@/server/auth`             |
| `konfigurasi.ts` | Konfigurasi Better Auth: sambungan ke database, kolom tambahan, penyedia |
| `sesi.ts`        | `ambilSesi()`, `requireAuth()`, dan `keluar()`                           |
| `akun-dev.ts`    | Daftar akun contoh (satu per peran) dan cara masuk dengan akun itu       |

## Membaca siapa yang login

Controller memanggil `requireAuth()`. Bila belum login, fungsi ini melempar galat 401 yang otomatis diubah `handle()` menjadi respons JSON.

```ts
import { requireAuth } from "@/server/auth";

export async function ambilProfil() {
  const pengguna = await requireAuth(); // pengguna.id, pengguna.name, pengguna.email, pengguna.isSuperadmin
  // ...
}
```

Pakai `ambilSesi()` bila belum login bukan sebuah galat (hasilnya `null`).

## Akun contoh untuk pengembangan

Selama login Google belum ada, masuknya lewat http://localhost:3000/dev/login: pilih satu akun, klik, selesai. Satu peran punya satu akun:

| `id` (sama dengan `users.id`) | Peran         | Dibuka setelah masuk |
| ----------------------------- | ------------- | -------------------- |
| `dev-superadmin`              | Superadmin    | `/admin`             |
| `dev-admin-kelas`             | Admin kelas   | `/classes`           |
| `dev-pj`                      | PJ subkelas   | `/classes`           |
| `dev-anggota`                 | Anggota       | `/classes`           |
| `dev-pengguna`                | Pengguna baru | `/dashboard`         |

Yang perlu diketahui:

1. Akun dimasukkan ke tabel `users` saat pertama kali dipakai, lalu sesinya dibuat Better Auth seperti login biasa. Tidak ada tabel, kolom, atau migrasi tambahan.
2. `id` akun sama di semua laptop, jadi data contoh tabel lain boleh merujuk ke `id` itu.
3. Peran admin kelas, PJ, dan anggota baru berupa label. Tabel `class_members` dan `subclass_pj` belum ada, jadi akun itu belum tergabung di kelas mana pun. Setelah tabelnya ada, keanggotaannya diisi lewat data contoh.
4. Fitur ini mati di produksi: `/dev/login` dan `/api/v1/dev/...` menjawab 404, dan login kata sandi dinonaktifkan.

Endpoint-nya dicatat di `docs/api.md` bagian "Akun contoh".

## Hubungan dengan tabel pengguna

Bentuk tabel pengguna ditentukan Better Auth, bukan dirancang sendiri. Konfigurasi di `index.ts` dan skema di `src/server/db/schema/auth.ts` adalah satu pasang:

| Di konfigurasi                      | Akibat di database                                          |
| ----------------------------------- | ----------------------------------------------------------- |
| `usePlural: true`                   | Nama tabel `users`, `sessions`, `accounts`, `verifications` |
| `additionalFields.isSuperadmin`     | Kolom `users.is_superadmin`, tidak bisa diisi lewat API     |
| Menambah plugin atau kolom tambahan | Skema harus dibuat ulang oleh Zaki dan diberi migrasi baru  |

Tabel lain yang butuh pengguna merujuk ke `users.id` (varchar 36). Tidak ada tabel `profiles`.

## Yang sudah dan belum ada

| Hal                                              | Status                                                  |
| ------------------------------------------------ | ------------------------------------------------------- |
| Konfigurasi dasar dan skema tabel                | Ada                                                     |
| Migrasi `drizzle/0000_tabel_auth.sql`            | Ada, sudah dicoba di MySQL 8.4 lokal                    |
| Akun contoh, `/dev/login`, dan `/api/v1/dev/...` | Ada, hanya saat pengembangan                            |
| Fungsi pembaca sesi (`requireAuth`, `ambilSesi`) | Ada                                                     |
| URL `/api/auth/...`                              | Belum                                                   |
| Kredensial Google Cloud di `.env`                | Belum (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)      |
| `BETTER_AUTH_SECRET` di `.env`                   | Belum. Tidak perlu saat pengembangan, wajib di produksi |
| Tombol Google di `/login` tersambung             | Belum                                                   |

## Aturan

1. Folder ini satu-satunya di luar `src/server/models` yang boleh mengimpor `db`, karena Better Auth membaca dan menulis tabelnya sendiri.
2. Controller dan halaman tidak memanggil Better Auth (`ambilAuth()`) langsung, tetapi lewat `requireAuth()` atau `ambilSesi()`. Pemeriksaan peran (siapa boleh apa) nanti ada di `src/server/permissions`.
3. `is_superadmin` hanya diubah langsung di database oleh pengelola. Pengecualiannya akun contoh `dev-superadmin`.
4. Akun contoh hanya ditambah atau diubah di `akun-dev.ts`, bersamaan dengan `PERAN_DEV` di `src/types/api/dev-auth.ts`.
