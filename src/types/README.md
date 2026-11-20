# src/types

**Pemilik:** Ahmad, Bintang (isi `api/`) · **Reviewer wajib:** Zaki

Tipe TypeScript yang dipakai bersama oleh backend dan frontend.

`api/` berisi DTO, yaitu bentuk data yang dikirim API. Satu berkas per modul, dinamai seperti sumber dayanya di URL: `api/subclass.ts`, `api/session.ts`. Skema Zod untuk memvalidasi masukan juga ditaruh di berkas yang sama.

Nama field dan nilai pilihannya berbahasa Inggris dan mengikuti nama kolom database (`name`, `classId`, `createdAt`). Aturannya di `docs/api.md` bagian "Penamaan field".

Tim frontend mengimpor tipe dari sini dan tidak membuat tipe tandingan. Karena itu, mengubah DTO yang sudah dipakai berarti memberi tahu Aqil lewat PR.

Contoh: `api/health.ts`, `api/umum.ts`.
