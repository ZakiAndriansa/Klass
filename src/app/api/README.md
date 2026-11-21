# src/app/api

**Pemilik:** Ahmad, Bintang · **Reviewer wajib:** Zaki

URL backend (REST API). Letak folder menentukan alamat:

| Berkas                          | Alamat                                       |
| ------------------------------- | -------------------------------------------- |
| `v1/health/route.ts`            | `GET /api/v1/health`                         |
| `v1/session/route.ts`           | `GET` dan `DELETE /api/v1/session`           |
| `v1/classes/route.ts`           | `GET` dan `POST /api/v1/classes`             |
| `v1/classes/[classId]/route.ts` | `GET`, `PATCH`, `DELETE /api/v1/classes/123` |

Alamat memakai bahasa Inggris huruf kecil, kata benda jamak, mengikuti nama use case
(`/classes`, `/class-requests`). Teks `message` di dalam respons tetap bahasa Indonesia.

## Aturan

1. `route.ts` hanya menghubungkan alamat ke **satu fungsi controller**, lalu membungkus hasilnya dengan `ok()`.
2. Setiap fungsi dibungkus `handle()` supaya galat otomatis menjadi respons JSON.
3. Tidak ada query, pemeriksaan izin, atau logika di `route.ts`. Semuanya di controller (`src/server/controllers`).
4. Body dibaca dengan `readJson(req)` dari `@/server/http`, bukan `req.json()`, supaya body yang bukan JSON dijawab 400.
5. Nama folder mengikuti nama sumber daya dalam bahasa Inggris, dan nama field JSON juga bahasa Inggris (`docs/api.md` bagian "Penamaan field").
6. Setiap URL baru dicatat di `docs/api.md` supaya tim frontend tahu cara memakainya.

Pengecualian: `auth/[...all]/route.ts` (`/api/auth/*`) dijalankan Better Auth untuk login Google, jadi tidak memakai `handle()` dan `ok()`. Pemiliknya Zaki.

Contoh untuk ditiru: `v1/health/route.ts`.

Skill: `klass-api`.
