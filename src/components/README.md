# src/components

Potongan tampilan yang dipakai ulang: tombol, kartu, form, navigasi.

| Folder      | Isi                                                               | Pemilik       | Reviewer wajib |
| ----------- | ----------------------------------------------------------------- | ------------- | -------------- |
| `shared/`   | Komponen design system Klass yang dipakai lebih dari satu halaman | Rehan, Darrel | Aqil           |
| `features/` | Komponen milik satu fitur, satu subfolder per fitur               | Rehan, Darrel | Aqil           |
| `ui/`       | Komponen shadcn/ui, belum dipakai halaman mana pun                | Aqil          | Aqil           |

**Semua komponen harus disetujui Aqil sebelum digabung.**

## Aturan

1. Komponen menerima data lewat props. Komponen tidak mengambil data, tidak memanggil API, dan tidak mengimpor apa pun dari `@/server`. ESLint akan menolak bila dilanggar.
2. Warna memakai token Klass (`var(--ds-color-*)` di CSS) atau token shadcn (`bg-primary`) di dalam `ui/`, bukan `bg-blue-500` atau kode warna, supaya tema tiap kelas bisa mengubahnya.
3. Halaman Klass memakai kelas CSS sendiri (`src/app/styles/klass/`), bukan utilitas Tailwind seperti `flex` atau `mt-8`. Utilitas Tailwind hanya dipakai di dalam `ui/` (komponen shadcn). Alasannya dicatat di `docs/keputusan.md`.
4. Nama berkas `huruf-kecil-bertanda-hubung.tsx`, nama komponen `HurufBesarDiAwal`: `kartu-tugas.tsx` berisi `KartuTugas`.
5. Sebelum membuat komponen baru, cari dulu di folder ini dan di https://ui.shadcn.com/docs/components.

Contoh untuk ditiru: `shared/tombol-kertas.tsx` dan `shared/lencana.tsx`.

Skill: `klass-komponen`, `klass-review-komponen`.
