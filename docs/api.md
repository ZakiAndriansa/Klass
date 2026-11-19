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
