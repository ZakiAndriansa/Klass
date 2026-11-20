# src/server/auth

**Pemilik:** Zaki · **Reviewer wajib:** Zaki · **Status:** akun contoh aktif; login Google tersambung dan aktif setelah kredensialnya diisi

Login dengan Better Auth (F1): konfigurasi, pembaca sesi, dan akun contoh untuk pengembangan.

| Berkas           | Isi                                                                      |
| ---------------- | ------------------------------------------------------------------------ |
| `index.ts`       | Pintu masuk folder. Kode lain mengimpor dari `@/server/auth`             |
| `konfigurasi.ts` | Konfigurasi Better Auth: sambungan ke database, kolom tambahan, penyedia |
| `sesi.ts`        | `ambilSesi()`, `requireAuth()`, dan `keluar()`                           |

Yang di sini hanya menjawab "siapa yang login". "Boleh melakukan apa" ada di `src/server/permissions`.
| `akun-dev.ts` | Daftar akun contoh (satu per peran) dan cara masuk dengan akun itu |

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

Frontend membaca sesi lewat `GET /api/v1/session` dan keluar lewat `DELETE /api/v1/session` (`src/server/controllers/session.ts`).

## Akun contoh untuk pengembangan

Selama kredensial Google belum diisi, masuknya lewat http://localhost:3000/dev/login: pilih satu akun, klik, selesai. Satu peran punya satu akun:

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
3. Peran admin kelas, PJ, dan anggota baru berupa label. Akun itu belum tergabung di kelas mana pun, karena data contoh untuk `class_members` dan `subclass_pj` belum dibuat. Sampai itu ada, yang benar-benar berbeda hanya superadmin.
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
| URL `/api/auth/...`                              | Ada (`src/app/api/auth/[...all]/route.ts`)              |
| Tombol Google di `/login` tersambung             | Ada. Tanpa kredensial, tombolnya menampilkan pesan      |
| Sesi dan keluar yang berlaku di produksi         | Ada (`/api/v1/session`)                                 |
| Kredensial Google Cloud di `.env`                | Belum (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)      |
| `BETTER_AUTH_SECRET` di `.env`                   | Belum. Tidak perlu saat pengembangan, wajib di produksi |
| Dicoba dengan akun Google sungguhan              | Belum, menunggu kredensial                              |

## Mengaktifkan login Google

Dikerjakan sekali oleh Zaki. Yang sudah diuji baru sampai "tombol membuka halaman Google dengan alamat kembali yang benar"; masuk dengan akun Google sungguhan belum dicoba.

1. Buka Google Cloud Console, pilih atau buat proyek, lalu masuk ke "APIs & Services" dan "Credentials".
2. Buat "OAuth client ID" berjenis "Web application".
3. Di "Authorized redirect URIs", isi `http://localhost:3000/api/auth/callback/google`. Untuk produksi, tambahkan alamat yang sama dengan domain aslinya.
4. Salin Client ID dan Client secret ke `.env` sebagai `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`. Jangan pernah menaruhnya di `.env.example` atau di commit.
5. Untuk produksi, isi juga `BETTER_AUTH_SECRET` (minimal 32 huruf acak) dan `NEXT_PUBLIC_APP_URL` dengan alamat aslinya.
6. Matikan lalu jalankan ulang `npm run dev`.

Akun baru dibuat otomatis saat seseorang pertama kali masuk dengan Google, jadi "daftar" dan "masuk" memakai tombol yang sama.

## Aturan

1. Folder ini satu-satunya di luar `src/server/models` yang boleh mengimpor `db`, karena Better Auth membaca dan menulis tabelnya sendiri.
2. Controller dan halaman tidak memanggil Better Auth (`ambilAuth()`) langsung, tetapi lewat `requireAuth()` atau `ambilSesi()`. Pemeriksaan peran (siapa boleh apa) ada di `src/server/permissions`.
3. `is_superadmin` hanya diubah langsung di database oleh pengelola. Pengecualiannya akun contoh `dev-superadmin`.
4. Akun contoh hanya ditambah atau diubah di `akun-dev.ts`, bersamaan dengan `PERAN_DEV` di `src/types/api/dev-auth.ts`.
