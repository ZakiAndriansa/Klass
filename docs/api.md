# Kontrak API Klass

Dokumen ini adalah kesepakatan antara backend dan frontend. Setiap URL baru dicatat di sini oleh pembuatnya (Ahmad atau Bintang) sebelum atau bersamaan dengan kodenya, dan disetujui Zaki.

Alamat dasar: `/api/v1`

## Penamaan URL

1. Bahasa Inggris, kata benda jamak, huruf kecil, tanda hubung bila dua kata: `/api/v1/classes`, `/api/v1/classes/{classId}/members`.
2. Sumber daya bersarang paling dalam dua tingkat: `/classes/{classId}/subclasses`, lalu `/subclasses/{subclassId}/materials`.
3. Aksi yang bukan CRUD memakai sub-sumber-daya dengan POST: `POST /classes/{classId}/join`, `POST /class-requests/{id}/approve`.
4. Daftar selalu berhalaman: `?page=1&limit=20`, batas atas `limit` 100.

## Penamaan field

Aturannya satu: **yang dibaca program berbahasa Inggris, yang dibaca orang berbahasa Indonesia.**

| Bagian                                | Bahasa    | Contoh                                         |
| ------------------------------------- | --------- | ---------------------------------------------- |
| URL                                   | Inggris   | `/classes/{classId}/subclasses`                |
| Nama field di body dan di `data`      | Inggris   | `name`, `classId`, `createdAt`, `isSuperadmin` |
| Nilai pilihan (enum)                  | Inggris   | `"admin"`, `"member"`, `"connected"`           |
| `error.code`                          | Inggris   | `FORBIDDEN`                                    |
| `error.message` dan teks untuk tampil | Indonesia | `"Kamu tidak punya izin untuk aksi ini."`      |

Rinciannya:

1. Nama field memakai `camelCase`. Bila field itu berasal dari kolom database, namanya mengikuti kolomnya: kolom `class_id` menjadi `classId`, `created_at` menjadi `createdAt`. Jangan diterjemahkan menjadi `idKelas` atau `nama`.
2. Tanggal dikirim sebagai teks ISO 8601 UTC, misalnya `"2026-11-20T03:00:00.000Z"`.
3. Nama berkas di `src/app/api`, `src/server/controllers`, dan `src/types/api` mengikuti nama sumber daya di URL: `subclass.ts`, `session.ts`, `class-access.ts`.
4. Nama fungsi, variabel, dan tipe di dalam kode tetap seperti biasa (`buatSubkelas`, `SesiDto`). Aturan ini hanya untuk yang dikirim lewat jaringan.

## Bentuk respons

Berhasil:

```json
{ "data": { "id": "..." } }
```

Berhasil, berupa daftar berhalaman:

```json
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 57 } }
```

Gagal:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Kamu tidak punya izin untuk aksi ini.",
    "details": null
  }
}
```

Frontend bercabang berdasarkan `error.code` dan menampilkan `error.message` ke pengguna.

## Kode galat

| Status | `code`             | Kapan                                                                                     |
| ------ | ------------------ | ----------------------------------------------------------------------------------------- |
| 400    | `VALIDATION_ERROR` | Data yang dikirim salah, termasuk body yang bukan JSON; `details` berisi galat per field  |
| 401    | `UNAUTHORIZED`     | Belum login, atau sesinya sudah habis                                                     |
| 403    | `FORBIDDEN`        | Sudah login tetapi perannya tidak cukup                                                   |
| 404    | `NOT_FOUND`        | Data tidak ada, atau ada tetapi tidak boleh diketahui                                     |
| 409    | `CONFLICT`         | Datanya benar, tetapi bertabrakan dengan keadaan sekarang, misalnya sudah menjadi anggota |
| 500    | `INTERNAL_ERROR`   | Galat tak terduga di server                                                               |

Beda 400 dan 409: 400 berarti kirimannya sendiri yang salah (jam selesai sebelum jam mulai), jadi mengirim ulang data yang sama tidak akan pernah berhasil. 409 berarti kirimannya benar tetapi keadaannya tidak memungkinkan (kelas sudah penuh).

## Login dan peran

Peran di Klass berlaku **per kelas**. Orang yang sama bisa admin di satu kelas dan anggota biasa di kelas lain. Karena itu ada dua pertanyaan terpisah:

| Pertanyaan                 | Endpoint                               |
| -------------------------- | -------------------------------------- |
| Siapa yang sedang login?   | `GET /api/v1/session`                  |
| Apa perannya di kelas ini? | `GET /api/v1/classes/{classId}/access` |

Yang terjadi bila pengguna membuka sesuatu yang bukan haknya:

| Keadaan                                          | API                | Halaman                          |
| ------------------------------------------------ | ------------------ | -------------------------------- |
| Belum login                                      | 401 `UNAUTHORIZED` | dipindahkan ke `/login?next=...` |
| Kelas tidak ada, atau masih berupa pengajuan     | 404 `NOT_FOUND`    | halaman 404                      |
| Bukan anggota, kelasnya tidak terdaftar (privat) | 404 `NOT_FOUND`    | halaman 404                      |
| Bukan anggota, kelasnya terdaftar                | 403 `FORBIDDEN`    | halaman `/forbidden`             |
| Anggota, tetapi perannya kurang                  | 403 `FORBIDDEN`    | halaman `/forbidden`             |
| Mengubah isi kelas yang sudah diarsipkan         | 409 `CONFLICT`     | pesan galat di tempat            |

Untuk kelas privat jawabannya 404, bukan 403, supaya orang luar tidak bisa menebak kelas itu ada.

Yang perlu diingat frontend:

1. **401 sudah ditangani `api()`.** Saat API menjawab 401, `api()` di `src/lib/api-client.ts` langsung memindahkan pengguna ke `/login?next=<halaman sekarang>`. Komponen tidak perlu menulis penanganan 401 sendiri.
2. **Menyembunyikan tombol bukan pengamanan.** `GET .../access` dipakai untuk memutuskan tombol mana yang tampil. Server tetap memeriksa izin di setiap endpoint, jadi tombol yang lupa disembunyikan akan dijawab 403.
3. **Di Server Component**, panggil controller lewat `untukHalaman()` dari `@/server/permissions`. Fungsi itu mengubah penolakan menjadi perpindahan halaman seperti tabel di atas.

## Daftar endpoint

### Kesehatan

`GET /api/v1/health`

Memeriksa apakah aplikasi dan database berjalan. Tidak butuh login.

Respons 200:

```json
{ "data": { "app": "running", "database": "connected" } }
```

`database` bernilai `"connected"` atau `"disconnected"`. Tipe: `HealthDto` di `src/types/api/health.ts`.

### Sesi

Tipe: `SesiDto` di `src/types/api/session.ts`.

`GET /api/v1/session`

Siapa yang sedang login. Berlaku untuk akun contoh maupun login Google.

| Hal                | Isi                                                           |
| ------------------ | ------------------------------------------------------------- |
| Siapa yang boleh   | Siapa saja                                                    |
| Respons berhasil   | 200, `data` berbentuk `SesiDto`, atau `null` bila belum login |
| Galat yang mungkin | tidak ada; belum login bukan galat di sini                    |

```json
{
  "data": {
    "id": "dev-pj",
    "name": "PJ Contoh",
    "email": "pj@klass.test",
    "image": null,
    "isSuperadmin": false
  }
}
```

`DELETE /api/v1/session`

Keluar. Respons 200 dengan `{ "data": null }`, juga bila memang belum login. Di halaman, pakai komponen `TombolKeluar`.

### Peran di sebuah kelas

Tipe: `AksesKelasDto` di `src/types/api/class-access.ts`.

`GET /api/v1/classes/{classId}/access`

Peran pengguna yang sedang login di kelas ini.

| Hal                | Isi                                                                          |
| ------------------ | ---------------------------------------------------------------------------- |
| Siapa yang boleh   | Siapa saja yang sudah login                                                  |
| Respons berhasil   | 200, `data` berbentuk `AksesKelasDto`                                        |
| Galat yang mungkin | `UNAUTHORIZED`, `NOT_FOUND` (kelas tidak ada, atau privat dan bukan anggota) |

```json
{
  "data": {
    "classId": "8f1c...",
    "role": "member",
    "pjSubclassIds": ["3a7e..."],
    "readOnly": false
  }
}
```

| Field           | Arti                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| `role`          | `"admin"`, `"member"`, atau `null` bila belum menjadi anggota            |
| `pjSubclassIds` | ID subkelas di kelas ini yang PJ-nya pengguna ini; kosong bila bukan PJ  |
| `readOnly`      | `true` bila kelas sudah diarsipkan: masih bisa dibaca, tidak bisa diubah |

Cara memakainya untuk tampilan:

| Yang ditampilkan                                    | Syarat                                                         |
| --------------------------------------------------- | -------------------------------------------------------------- |
| Tombol atur kelas (tema, subkelas, PJ, kick, ban)   | `role === "admin"`                                             |
| Tombol kelola satu subkelas (materi, jadwal, tugas) | `role === "admin"`, atau ID subkelasnya ada di `pjSubclassIds` |
| Tombol gabung                                       | `role === null`                                                |
| Semua tombol ubah disembunyikan                     | `readOnly === true`                                            |

Superadmin yang bukan anggota mendapat `role: null`; status superadmin-nya dibaca dari `isSuperadmin` di `GET /session`.

### Login Google

Alamat di bawah `/api/auth/` dijalankan Better Auth sendiri. Bentuk jawabannya **bukan** `{ data }` atau `{ error }`, dan frontend tidak memanggilnya langsung.

| Keperluan  | Yang dipakai                                          |
| ---------- | ----------------------------------------------------- |
| Masuk      | `masukDenganGoogle()` dari `src/lib/auth-client.ts`   |
| Siapa saya | `GET /api/v1/session`                                 |
| Keluar     | `DELETE /api/v1/session` atau komponen `TombolKeluar` |

Login Google baru aktif setelah kredensialnya diisi di `.env` (caranya di `src/server/auth/README.md`). Sebelum itu tombol Google menampilkan pesan, dan masuknya lewat akun contoh.

### Akun contoh (hanya saat pengembangan)

Untuk masuk sebagai peran tertentu tanpa login Google. Halamannya ada di `/dev/login`. Di produksi semua alamat di bawah menjawab 404.

Tipe: `AkunDevDto` di `src/types/api/dev-auth.ts`.

`GET /api/v1/dev/accounts`

Daftar akun contoh, satu per peran. Tidak butuh login.

```json
{
  "data": [
    {
      "id": "dev-superadmin",
      "name": "Superadmin Contoh",
      "email": "superadmin@klass.test",
      "role": "superadmin",
      "roleLabel": "Superadmin",
      "description": "Mengurus website: menyetujui pengajuan kelas dan mengelola poster.",
      "redirectTo": "/dashboard"
    }
  ]
}
```

`role` bernilai `superadmin`, `class_admin`, `subclass_pj`, `member`, atau `user`. `id` yang tersedia: `dev-superadmin`, `dev-admin-kelas`, `dev-pj`, `dev-anggota`, `dev-pengguna`.

`POST /api/v1/dev/session`

Masuk sebagai salah satu akun contoh. Server memasang cookie sesi, jadi permintaan berikutnya dari peramban yang sama sudah dianggap login.

| Hal                | Isi                                                           |
| ------------------ | ------------------------------------------------------------- |
| Siapa yang boleh   | Siapa saja, hanya saat pengembangan                           |
| Body               | `{ "accountId": "dev-pj" }`                                   |
| Respons berhasil   | 200, `data` berbentuk `SesiDto`                               |
| Galat yang mungkin | `VALIDATION_ERROR` (body salah), `NOT_FOUND` (akun tidak ada) |

Membaca sesi dan keluar memakai `/api/v1/session` di atas, sama seperti di produksi.

Contoh pemakaian dari Client Component:

```ts
import { api } from "@/lib/api-client";
import type { SesiDto } from "@/types/api/session";

await api<SesiDto>("/dev/session", {
  method: "POST",
  body: JSON.stringify({ accountId: "dev-pj" }),
});
const { data: sesi } = await api<SesiDto | null>("/session");
```

### Templat untuk endpoint baru

Salin bagian ini lalu isi. Endpoint baru ditulis **di atas** bagian ini.

`METODE /api/v1/alamat`

Penjelasan satu kalimat.

| Hal                | Isi                         |
| ------------------ | --------------------------- |
| Siapa yang boleh   |                             |
| Body               |                             |
| Respons berhasil   | status dan bentuk `data`    |
| Galat yang mungkin | daftar `code`               |
| Tipe               | nama DTO di `src/types/api` |
