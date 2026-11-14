---
name: klass-komponen
description: Membuat atau mengubah komponen UI Klass (React, Tailwind, shadcn/ui) sesuai konvensi tim, termasuk dukungan tema kelas lewat CSS variables. Pakai saat diminta "buat komponen", "buat card", "buat form", "buat navbar", "desain bagian halaman", atau saat menyentuh berkas di src/components. Pemilik area ini Rehan dan Darrel; setiap komponen harus disetujui Aqil sebelum digabung.
argument-hint: "[nama komponen dan fiturnya, misalnya: kartu-tugas untuk fitur tugas]"
---

# Komponen UI Klass

Aturan pemakaian shadcn ada di skill `shadcn`, aturan Tailwind v4 di `tailwind-patterns`, dan aksesibilitas di `accessibility`. Berkas ini berisi aturan khusus Klass dan menang bila berbeda.

## Letak dan nama

```
src/components/ui/                    keluaran shadcn. Jangan diubah langsung.
src/components/shared/                dipakai lebih dari satu fitur (header, kartu kosong, avatar pengguna)
src/components/features/<fitur>/      milik satu fitur: kelas, subkelas, materi, jadwal, tugas, poster, admin
```

1. Nama berkas `kebab-case.tsx`, nama komponen `PascalCase`, satu komponen utama per berkas: `kartu-tugas.tsx` mengekspor `KartuTugas`.
2. Ekspor bernama, bukan `export default`.
3. Sebelum membuat komponen baru, cari dulu di `src/components` dan di registry shadcn (`npx shadcn@latest search`). Menambah komponen shadcn baru ke `ui/` perlu persetujuan Aqil karena memengaruhi semua orang.

## Aturan penulisan

1. Server Component secara bawaan. Tulis `"use client"` hanya bila komponen butuh state, efek, atau event handler, dan letakkan sedalam mungkin di pohon komponen.
2. Komponen menerima data lewat props. Jangan mengambil data, memanggil API, atau mengimpor apa pun dari `src/server` di dalam `src/components`. Pengambilan data adalah urusan halaman (skill `klass-halaman`).
3. Props diberi tipe eksplisit. Bentuk data mengikuti DTO di `src/types/api`, jangan membuat tipe tandingan.
4. Varian memakai `cva` seperti komponen shadcn, bukan rangkaian `className` bersyarat yang panjang.
5. Gabungkan kelas dengan `cn()` dan selalu teruskan `className` dari props ke elemen terluar.
6. Teks antarmuka berbahasa Indonesia.

## Tema kelas (F6)

Setiap kelas bisa mengganti warna, logo, background, dan banner. Tema diterapkan sebagai CSS variables pada pembungkus halaman kelas, jadi komponen harus ikut berubah tanpa disentuh.

1. Pakai token semantik: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `bg-muted`.
2. Dilarang menulis warna mentah (`bg-blue-500`, `text-[#123456]`, `style={{ color }}`) dan dilarang `dark:` untuk warna.
3. Teks di atas warna tema selalu memakai pasangan `-foreground` yang sesuai, karena kontras dihitung dari pasangan itu.
4. Gambar dari pengguna (logo, banner, avatar) selalu punya ukuran tetap, `object-cover`, `alt`, dan tampilan cadangan bila gagal dimuat.

## Keadaan yang wajib ada

Komponen yang menampilkan data harus punya tampilan untuk: isi normal, kosong, memuat (skeleton), galat, serta teks panjang dan nama panjang (dipotong dengan rapi). Komponen aksi (tombol, form) punya keadaan nonaktif dan sedang memproses.

## Responsif dan aksesibilitas

1. Rancang dari lebar 360 px lebih dulu. Klass adalah PWA yang paling sering dibuka di HP.
2. Sasaran sentuh minimal 44 px.
3. Semua aksi bisa dijalankan dengan keyboard dan punya fokus yang terlihat.
4. Tombol berisi ikon saja wajib punya `aria-label`.
5. Form memakai pola field shadcn dengan label dan pesan galat yang terhubung ke inputnya.

## Pembagian kerja

Satu fitur dipegang satu orang supaya Rehan dan Darrel tidak mengubah berkas yang sama. Pembagian dicatat Aqil di papan tugas. Komponen di `shared/` dikerjakan setelah disepakati dengan Aqil.

## Sebelum membuka PR

1. Jalankan `npm run lint` dan `npm run typecheck`.
2. Coba di lebar 360 px dan 1280 px, lalu coba dengan tema kelas yang gelap dan yang terang.
3. Lampirkan tangkapan layar tiap keadaan di PR.
4. Minta review Aqil. PR komponen tidak boleh digabung tanpa persetujuannya (lihat skill `klass-pr`).
