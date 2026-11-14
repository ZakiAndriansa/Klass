# src/server/controllers

**Pemilik:** Ahmad, Bintang · **Reviewer wajib:** Zaki

Controller adalah fungsi yang menjalankan satu aksi, misalnya "buat materi" atau "keluarkan anggota". Satu berkas per modul: `kelas.ts`, `materi.ts`, `tugas.ts`.

## Urutan kerja di dalam controller

1. Validasi masukan dengan Zod.
2. Periksa izin.
3. Panggil fungsi model.
4. Kembalikan DTO (bentuk data yang disepakati dengan frontend, ada di `src/types/api`).

## Aturan

1. Controller **tidak menulis query** dan tidak mengimpor `db`. Butuh data berarti memanggil fungsi di `src/server/models`. Bila fungsinya belum ada, minta ke Fadlan.
2. Controller mengembalikan data biasa, bukan `Response`. Yang membungkus menjadi respons adalah `route.ts`.
3. Untuk menolak permintaan, lempar galat dari `@/server/http`, misalnya `throw new NotFoundError("Kelas tidak ditemukan.")`.
4. Setiap controller punya berkas uji di sebelahnya (`materi.test.ts`).

Contoh untuk ditiru: `health.ts` dan `health.test.ts`.

Skill: `klass-api`.
