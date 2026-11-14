# src/types

**Pemilik:** Ahmad, Bintang (isi `api/`) · **Reviewer wajib:** Zaki

Tipe TypeScript yang dipakai bersama oleh backend dan frontend.

`api/` berisi DTO, yaitu bentuk data yang dikirim API. Satu berkas per modul: `api/kelas.ts`, `api/materi.ts`. Skema Zod untuk memvalidasi masukan juga ditaruh di berkas yang sama.

Tim frontend mengimpor tipe dari sini dan tidak membuat tipe tandingan. Karena itu, mengubah DTO yang sudah dipakai berarti memberi tahu Aqil lewat PR.

Contoh: `api/health.ts`, `api/umum.ts`.
