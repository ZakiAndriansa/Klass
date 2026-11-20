# src/server/controllers

**Pemilik:** Ahmad, Bintang · **Reviewer wajib:** Zaki

Controller adalah fungsi yang menjalankan satu aksi, misalnya "buat materi" atau "keluarkan anggota". Satu berkas per modul, dinamai seperti sumber dayanya di URL: `subclass.ts`, `session.ts`, `class-access.ts`.

## Urutan kerja di dalam controller

1. Validasi masukan dengan Zod.
2. Periksa izin dengan satu fungsi dari `@/server/permissions` (misalnya `requireClassAdmin(classId)`), atau `requireAuth()` dari `@/server/auth` bila cukup login.
3. Panggil fungsi model.
4. Kembalikan DTO (bentuk data yang disepakati dengan frontend, ada di `src/types/api`).

## Aturan

1. Controller **tidak menulis query** dan tidak mengimpor `db`. Butuh data berarti memanggil fungsi di `src/server/models`. Bila fungsinya belum ada, minta ke Fadlan.
2. Controller mengembalikan data biasa, bukan `Response`. Yang membungkus menjadi respons adalah `route.ts`.
3. Untuk menolak permintaan, lempar galat dari `@/server/http`, misalnya `throw new NotFoundError("Kelas tidak ditemukan.")`.
4. Setiap controller punya berkas uji di sebelahnya (`subclass.test.ts`), termasuk minimal satu uji penolakan izin.
5. Controller tidak menulis `if (role === ...)` sendiri. Bila aturan izin yang dibutuhkan belum ada, minta ke Zaki.

Contoh untuk ditiru: `health.ts` dan `health.test.ts`. Contoh yang memakai izin: `class-access.ts`.

Skill: `klass-api`.
