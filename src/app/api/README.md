# src/app/api

**Pemilik:** Ahmad, Bintang · **Reviewer wajib:** Zaki

URL backend (REST API). Letak folder menentukan alamat:

| Berkas                          | Alamat                                       |
| ------------------------------- | -------------------------------------------- |
| `v1/health/route.ts`            | `GET /api/v1/health`                         |
| `v1/classes/route.ts`           | `GET` dan `POST /api/v1/classes`             |
| `v1/classes/[classId]/route.ts` | `GET`, `PATCH`, `DELETE /api/v1/classes/123` |

Alamat memakai bahasa Inggris huruf kecil, kata benda jamak, mengikuti nama use case
(`/classes`, `/class-requests`). Teks `message` di dalam respons tetap bahasa Indonesia.

## Aturan

1. `route.ts` hanya menghubungkan alamat ke **satu fungsi controller**, lalu membungkus hasilnya dengan `ok()`.
2. Setiap fungsi dibungkus `handle()` supaya galat otomatis menjadi respons JSON.
3. Tidak ada query, pemeriksaan izin, atau logika di `route.ts`. Semuanya di controller (`src/server/controllers`).
4. Setiap URL baru dicatat di `docs/api.md` supaya tim frontend tahu cara memakainya.

Contoh untuk ditiru: `v1/health/route.ts`.

Skill: `klass-api`.
