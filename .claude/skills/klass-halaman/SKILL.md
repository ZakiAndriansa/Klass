---
name: klass-halaman
description: Slicing halaman Klass di Next.js App Router, yaitu menyusun route, layout, loading, error, pengambilan data, dan penerapan tema kelas dari komponen yang sudah ada. Pakai saat diminta "slicing", "buat halaman", "buat route", "buat layout", "sambungkan halaman ke API", atau saat menyentuh src/app selain folder api. Pemilik area ini Aqil sebagai lead frontend.
argument-hint: "[halaman, misalnya: daftar tugas subkelas]"
---

# Slicing Halaman Klass

Halaman merakit komponen dari `src/components` dan memberi mereka data. Tampilan baru dibuat sebagai komponen (skill `klass-komponen`), bukan ditulis langsung di `page.tsx`.

## Peta route MVP

```
src/app/
  (publik)/page.tsx                                   halaman utama dan poster (F11)
  (auth)/login/page.tsx                               login Google (F1)
  (app)/layout.tsx                                    wajib login, navigasi utama
  (app)/beranda/page.tsx                              daftar kelas saya, tenggat terdekat
  (app)/profil/page.tsx                               nama dan avatar (F1)
  (app)/kelas/ajukan/page.tsx                         pengajuan kelas (F2)
  (app)/kelas/gabung/page.tsx                         join dengan kode undangan (F4)
  (app)/kelas/[classId]/layout.tsx                    pemeriksaan anggota, penerapan tema (F6)
  (app)/kelas/[classId]/page.tsx                      ringkasan kelas dan daftar subkelas
  (app)/kelas/[classId]/anggota/page.tsx              anggota, kick, ban (F5)
  (app)/kelas/[classId]/pengaturan/page.tsx           kelas, tema, subkelas, PJ (F6, F7)
  (app)/kelas/[classId]/sub/[subclassId]/page.tsx     materi, jadwal, tugas (F8, F9, F10)
  admin/layout.tsx                                    wajib superadmin
  admin/pengajuan/page.tsx                            setujui atau tolak, tunjuk admin (F3)
  admin/poster/page.tsx                               kelola poster (F11)
```

URL memakai bahasa Indonesia huruf kecil. Mengubah peta ini berarti mengubah berkas ini juga.

## Aturan App Router

1. `page.tsx` dan `layout.tsx` adalah Server Component. `params` dan `searchParams` berupa Promise, jadi selalu di-`await`.
2. Cache Components aktif. Bagian halaman yang mengambil data dipisah menjadi komponen `async` dan dibungkus `<Suspense>` dengan skeleton sebagai `fallback`; bagian lain tampil seketika. Contohnya `src/app/(publik)/page.tsx`. Jangan memakai `export const dynamic`.
3. Komponen `async` yang tidak membaca cookie atau header tetapi butuh data segar memanggil `await connection()` dari `next/server` lebih dulu, supaya database tidak dihubungi saat build.
4. Setiap segmen yang mengambil data punya `error.tsx`. Data yang tidak ada atau tidak boleh dilihat dijawab dengan `notFound()`.
5. Sebelum memakai API Next.js yang belum pernah dipakai di proyek ini, baca panduannya di `node_modules/next/dist/docs/`.
6. Tulis `generateMetadata` atau `metadata` untuk judul tiap halaman.
7. Perlindungan halaman dilakukan di layout segmennya dengan memanggil lapisan izin di server. Menyembunyikan menu saja tidak cukup (skill `klass-izin`).

## Pengambilan data

1. Di Server Component, panggil fungsi controller dari `src/server/controllers` secara langsung. Jangan `fetch` ke `/api/v1` milik sendiri dari server.
2. Di Client Component, panggil REST lewat `src/lib/api-client.ts` yang sudah menangani bentuk `{ data }` dan `{ error }` (skill `klass-api`).
3. Bercabang berdasarkan `error.code`, tampilkan `error.message` ke pengguna.
4. Setelah mutasi berhasil, segarkan data dengan `router.refresh()` atau revalidasi di server.
5. Bila endpoint belum jadi, pakai data tiruan yang bentuknya sama persis dengan `docs/api.md` dan tandai dengan komentar `TODO(api)` agar mudah dicari.

## Penerapan tema kelas

`(app)/kelas/[classId]/layout.tsx` membaca field `style` kelas, memvalidasinya, lalu memasang CSS variables pada elemen pembungkus:

```tsx
<div style={temaKeCssVars(kelas.style)} className="bg-background text-foreground min-h-dvh">
  {children}
</div>
```

1. Fungsi `temaKeCssVars` ada di `src/lib/tema.ts` dan menjadi satu-satunya tempat field `style` diubah menjadi CSS.
2. Nilai dari pengguna tidak pernah disisipkan ke CSS atau `style` tanpa validasi. Warna harus lolos pola warna, URL gambar harus berasal dari penyimpanan Klass.
3. Warna teks dihitung dari warna latar supaya kontras minimal 4,5 banding 1 (PRD F6). Bila tema tidak lolos, pakai warna teks cadangan, jangan tampilkan tema yang tak terbaca.
4. Di luar segmen kelas, tema bawaan Klass yang berlaku.

## PWA

Manifest, ikon, dan service worker untuk web push disiapkan pada setup proyek (skill `progressive-web-app`). Saat slicing, pastikan halaman nyaman di lebar 360 px, navigasi utama terjangkau ibu jari, dan ada petunjuk pemasangan ke layar utama untuk pengguna iPhone karena web push di sana hanya berjalan setelah PWA dipasang.

## Selesai bila

1. Semua keadaan halaman bisa dicapai: memuat, kosong, berisi, galat, dan tidak berhak.
2. Halaman dicoba sebagai anggota, PJ, admin kelas, dan bukan anggota.
3. Tidak ada tampilan yang ditulis langsung di `page.tsx` selain susunan tata letak.
