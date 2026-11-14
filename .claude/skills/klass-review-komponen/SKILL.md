---
name: klass-review-komponen
description: Meninjau PR komponen atau halaman frontend Klass dengan daftar periksa lead frontend, lalu menghasilkan putusan setuju atau minta perbaikan. Pakai saat diminta "review komponen", "cek PR frontend", "approve komponen", "tinjau PR Rehan", "tinjau PR Darrel", atau sebelum menggabungkan perubahan di src/components dan src/app. Dipakai oleh Aqil.
argument-hint: "[nomor PR atau nama branch]"
---

# Review Komponen Klass

Semua komponen harus disetujui Aqil sebelum digabung. Skill ini membantu meninjau secara konsisten; putusan akhir tetap di tangan Aqil, dan skill ini tidak menggabungkan PR.

## Langkah

1. Ambil perubahan: `git fetch`, lalu `git diff main...<branch> -- src/components src/app`.
2. Baca setiap berkas yang berubah secara utuh, bukan hanya potongan diff.
3. Periksa dengan daftar di bawah. Aturan rincinya ada di skill `klass-komponen` dan `klass-halaman`.
4. Jalankan `npm run lint` dan `npm run typecheck` pada branch itu.
5. Tulis hasil dengan format di bagian akhir.

## Daftar periksa

Wajib, satu saja gagal berarti minta perbaikan:

1. Letak dan nama berkas sesuai konvensi; ekspor bernama.
2. Tidak ada warna mentah dan tidak ada `dark:` untuk warna; semua memakai token semantik sehingga tema kelas bekerja.
3. Tidak ada pengambilan data, pemanggilan API, atau impor dari `src/server` di dalam `src/components`.
4. `"use client"` hanya ada bila memang perlu dan tidak diletakkan di komponen pembungkus besar.
5. Berkas di `src/components/ui` tidak diubah, atau perubahannya sudah disepakati.
6. Props bertipe dan memakai DTO dari `src/types/api`.
7. Tombol ikon punya `aria-label`, input punya label, urutan fokus masuk akal.
8. Tata letak tidak pecah di lebar 360 px.
9. Lint dan pemeriksaan tipe lolos.
10. Tidak ada komponen ganda untuk hal yang sudah ada di `shared/` atau di shadcn.

Perlu, boleh disetujui dengan catatan:

1. Keadaan kosong, memuat, dan galat tersedia.
2. Teks panjang dan nama panjang tidak merusak tata letak.
3. Varian memakai `cva`, `className` diteruskan lewat `cn()`.
4. Tangkapan layar tiap keadaan terlampir di PR.
5. Teks antarmuka berbahasa Indonesia dan konsisten dengan halaman lain.

## Format hasil

```
Putusan: SETUJU | SETUJU DENGAN CATATAN | MINTA PERBAIKAN

Wajib diperbaiki
1. <berkas>:<baris> <masalah> -> <saran perbaikan>

Catatan
1. <berkas>:<baris> <saran>

Yang sudah baik
1. <hal yang patut dipertahankan>
```

Tulis temuan dengan menunjuk berkas dan baris, jelaskan alasannya, dan beri contoh perbaikan singkat. Rehan dan Darrel belajar dari review ini, jadi bagian "yang sudah baik" tidak boleh dikosongkan bila memang ada.
