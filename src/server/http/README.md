# src/server/http

**Pemilik:** Zaki · **Reviewer wajib:** Zaki

Alat bantu supaya semua endpoint menjawab dengan bentuk yang sama. Dipakai Ahmad dan Bintang, tetapi tidak diubah tanpa Zaki.

| Fungsi                                                                                     | Guna                                                                             |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `handle(fn)`                                                                               | Membungkus fungsi di `route.ts`; menangkap galat dan mengubahnya menjadi respons |
| `ok(data, status?, meta?)`                                                                 | Respons berhasil: `{ "data": ... }`                                              |
| `fail(status, code, message)`                                                              | Respons gagal: `{ "error": { ... } }`                                            |
| `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError` | Galat yang dilempar controller atau model                                        |

Semuanya diimpor dari `@/server/http`.

Bentuk respons dan daftar kode galat dijelaskan di `docs/api.md`.
