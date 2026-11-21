# src/server/http

**Pemilik:** Zaki · **Reviewer wajib:** Zaki

Alat bantu supaya semua endpoint menjawab dengan bentuk yang sama. Dipakai Ahmad dan Bintang, tetapi tidak diubah tanpa Zaki.

| Fungsi                                                                                     | Guna                                                                             |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `handle(fn)`                                                                               | Membungkus fungsi di `route.ts`; menangkap galat dan mengubahnya menjadi respons |
| `readJson(req)`                                                                            | Membaca body JSON; body yang bukan JSON dijawab 400, bukan 500                   |
| `ok(data, status?, meta?)`                                                                 | Respons berhasil: `{ "data": ... }`                                              |
| `fail(status, code, message)`                                                              | Respons gagal: `{ "error": { ... } }`                                            |
| `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError` | Galat yang dilempar controller atau model                                        |

Semuanya diimpor dari `@/server/http`.

Di `route.ts`, body selalu dibaca dengan `readJson(req)`, bukan `req.json()` (dijaga ESLint).

Memilih galat: `ValidationError` (400) bila kirimannya sendiri yang salah, `ConflictError` (409) bila kirimannya benar tetapi bertabrakan dengan keadaan data. Galat izin (401, 403) tidak dilempar sendiri; panggil fungsi di `src/server/permissions`.

Bentuk respons dan daftar kode galat dijelaskan di `docs/api.md`.
