# src/app/api

**Pemilik:** Ahmad, Bintang · **Reviewer wajib:** Zaki

URL backend (REST API). Letak folder menentukan alamat:

| Berkas                        | Alamat                                     |
| ----------------------------- | ------------------------------------------ |
| `v1/health/route.ts`          | `GET /api/v1/health`                       |
| `v1/kelas/route.ts`           | `GET` dan `POST /api/v1/kelas`             |
| `v1/kelas/[classId]/route.ts` | `GET`, `PATCH`, `DELETE /api/v1/kelas/123` |

## Aturan

1. `route.ts` hanya menghubungkan alamat ke **satu fungsi controller**, lalu membungkus hasilnya dengan `ok()`.
2. Setiap fungsi dibungkus `handle()` supaya galat otomatis menjadi respons JSON.
3. Tidak ada query, pemeriksaan izin, atau logika di `route.ts`. Semuanya di controller (`src/server/controllers`).
4. Setiap URL baru dicatat di `docs/api.md` supaya tim frontend tahu cara memakainya.

Contoh untuk ditiru: `v1/health/route.ts`.

Skill: `klass-api`.
