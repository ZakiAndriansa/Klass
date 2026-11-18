# Kontrak API Klass

Dokumen ini adalah kesepakatan antara backend dan frontend. Setiap URL baru dicatat di sini oleh pembuatnya (Ahmad atau Bintang) sebelum atau bersamaan dengan kodenya, dan disetujui Zaki.

Alamat dasar: `/api/v1`

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

### Profil

`GET /api/v1/profil`

Mengambil profil pengguna yang sedang login.

| Hal                | Isi                                      |
| ------------------ | ---------------------------------------- |
| Siapa yang boleh   | Pengguna yang sudah login                |
| Body               | Tidak ada                                |
| Respons berhasil   | 200, `{ "data": ProfilDto }`             |
| Galat yang mungkin | `UNAUTHORIZED`, `NOT_FOUND`              |
| Tipe               | `ProfilDto` di `src/types/api/profil.ts` |

`PATCH /api/v1/profil`

Mengubah nama dan avatar pengguna yang sedang login.

| Hal                | Isi                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Siapa yang boleh   | Pengguna yang sudah login, hanya profilnya sendiri                                          |
| Body               | `nama` wajib, string 3–50 karakter. `avatarUrl` opsional, URL http/https maks 2048 karakter |
| Respons berhasil   | 200, `{ "data": ProfilDto }`                                                                |
| Galat yang mungkin | `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`                                             |
| Tipe               | `UbahProfilInput` (masukan), `ProfilDto` (keluaran)                                         |

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
