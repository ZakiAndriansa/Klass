# Kontrak API Klass

Dokumen ini adalah kesepakatan antara backend dan frontend. Setiap URL baru dicatat di sini oleh pembuatnya (Ahmad atau Bintang) sebelum atau bersamaan dengan kodenya, dan disetujui Zaki.

Alamat dasar: `/api/v1`

## Penamaan URL

1. Bahasa Inggris, kata benda jamak, huruf kecil, tanda hubung bila dua kata: `/api/v1/classes`, `/api/v1/classes/{classId}/members`.
2. Sumber daya bersarang paling dalam dua tingkat: `/classes/{classId}/subclasses`, lalu `/subclasses/{subclassId}/materials`.
3. Aksi yang bukan CRUD memakai sub-sumber-daya dengan POST: `POST /classes/{classId}/join`, `POST /class-requests/{id}/approve`.
4. Daftar selalu berhalaman: `?page=1&limit=20`, batas atas `limit` 100.

`message` pada respons galat tetap berbahasa Indonesia karena ditampilkan ke pengguna; `code` berbahasa Inggris huruf besar.

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

| Status | `code`             | Kapan                                                           |
| ------ | ------------------ | --------------------------------------------------------------- |
| 400    | `VALIDATION_ERROR` | Data yang dikirim tidak valid; `details` berisi galat per field |
| 401    | `UNAUTHORIZED`     | Belum login                                                     |
| 403    | `FORBIDDEN`        | Sudah login tetapi tidak berhak                                 |
| 404    | `NOT_FOUND`        | Data tidak ada                                                  |
| 409    | `CONFLICT`         | Bertabrakan dengan keadaan data, misalnya sudah menjadi anggota |
| 500    | `INTERNAL_ERROR`   | Galat tak terduga di server                                     |

## Daftar endpoint

### Kesehatan

`GET /api/v1/health`

Memeriksa apakah aplikasi dan database berjalan. Tidak butuh login.

Respons 200:

```json
{ "data": { "aplikasi": "berjalan", "database": "terhubung" } }
```

`database` bernilai `"terhubung"` atau `"terputus"`. Tipe: `HealthDto` di `src/types/api/health.ts`.

### Akun contoh (hanya saat pengembangan)

Untuk masuk sebagai peran tertentu tanpa login Google. Halamannya ada di `/dev/login`. Di produksi semua alamat di bawah menjawab 404.

Tipe: `AkunDevDto` dan `SesiDevDto` di `src/types/api/dev-auth.ts`.

`GET /api/v1/dev/accounts`

Daftar akun contoh, satu per peran. Tidak butuh login.

```json
{
  "data": [
    {
      "id": "dev-superadmin",
      "nama": "Superadmin Contoh",
      "email": "superadmin@klass.test",
      "peran": "superadmin",
      "labelPeran": "Superadmin",
      "keterangan": "Mengurus website: menyetujui pengajuan kelas dan mengelola poster.",
      "tujuan": "/admin"
    }
  ]
}
```

`peran` bernilai `superadmin`, `admin_kelas`, `pj`, `anggota`, atau `pengguna`. `id` yang tersedia: `dev-superadmin`, `dev-admin-kelas`, `dev-pj`, `dev-anggota`, `dev-pengguna`.

`POST /api/v1/dev/session`

Masuk sebagai salah satu akun contoh. Server memasang cookie sesi, jadi permintaan berikutnya dari peramban yang sama sudah dianggap login.

| Hal                | Isi                                                           |
| ------------------ | ------------------------------------------------------------- |
| Siapa yang boleh   | Siapa saja, hanya saat pengembangan                           |
| Body               | `{ "idAkun": "dev-pj" }`                                      |
| Respons berhasil   | 200, `data` berbentuk `SesiDevDto`                            |
| Galat yang mungkin | `VALIDATION_ERROR` (body salah), `NOT_FOUND` (akun tidak ada) |

```json
{
  "data": {
    "idPengguna": "dev-pj",
    "nama": "PJ Contoh",
    "email": "pj@klass.test",
    "isSuperadmin": false,
    "peran": "pj"
  }
}
```

`GET /api/v1/dev/session`

Siapa yang sedang login. Respons 200 dengan `data` berbentuk `SesiDevDto`, atau `{ "data": null }` bila belum login. `peran` bernilai `null` bila yang login bukan akun contoh.

`DELETE /api/v1/dev/session`

Keluar. Respons 200 dengan `{ "data": null }`.

Contoh pemakaian dari Client Component:

```ts
import { api } from "@/lib/api-client";
import type { SesiDevDto } from "@/types/api/dev-auth";

await api<SesiDevDto>("/dev/session", {
  method: "POST",
  body: JSON.stringify({ idAkun: "dev-pj" }),
});
const { data: sesi } = await api<SesiDevDto | null>("/dev/session");
```

### Templat untuk endpoint baru

Salin bagian ini lalu isi.

`METODE /api/v1/alamat`

Penjelasan satu kalimat.

| Hal                | Isi                         |
| ------------------ | --------------------------- |
| Siapa yang boleh   |                             |
| Body               |                             |
| Respons berhasil   | status dan bentuk `data`    |
| Galat yang mungkin | daftar `code`               |
| Tipe               | nama DTO di `src/types/api` |
