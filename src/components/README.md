# src/components

Potongan tampilan yang dipakai ulang: tombol, kartu, form, navigasi.

| Folder      | Isi                                                    | Pemilik       | Reviewer wajib |
| ----------- | ------------------------------------------------------ | ------------- | -------------- |
| `ui/`       | Komponen dasar dari shadcn/ui (tombol, kartu, lencana) | Aqil          | Aqil           |
| `shared/`   | Komponen buatan tim yang dipakai lebih dari satu fitur | Rehan, Darrel | Aqil           |
| `features/` | Komponen milik satu fitur, satu subfolder per fitur    | Rehan, Darrel | Aqil           |

**Semua komponen harus disetujui Aqil sebelum digabung.**

## Aturan

1. Komponen menerima data lewat props. Komponen tidak mengambil data, tidak memanggil API, dan tidak mengimpor apa pun dari `@/server`. ESLint akan menolak bila dilanggar.
2. Warna memakai token seperti `bg-primary` dan `text-muted-foreground`, bukan `bg-blue-500` atau kode warna, supaya tema tiap kelas bisa mengubahnya.
3. Nama berkas `huruf-kecil-bertanda-hubung.tsx`, nama komponen `HurufBesarDiAwal`: `kartu-tugas.tsx` berisi `KartuTugas`.
4. Sebelum membuat komponen baru, cari dulu di folder ini dan di https://ui.shadcn.com/docs/components.

Contoh untuk ditiru: `shared/kartu-status.tsx`.

Skill: `klass-komponen`, `klass-review-komponen`.
