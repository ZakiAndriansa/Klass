# src/components/features

**Pemilik:** Rehan, Darrel · **Reviewer wajib:** Aqil

Komponen milik satu fitur. Satu fitur satu subfolder:

```
features/
  kelas/        daftar kelas, beranda kelas, jadwal, materi, progress, anggota
  dasbor/       kerangka + isi dasbor pengguna dan superadmin
  admin/        tabel pengajuan kelas
```

Satu subfolder dikerjakan satu orang supaya Rehan dan Darrel tidak mengubah berkas yang sama.
Pembagiannya ditentukan Aqil. Subfolder dibuat saat fiturnya mulai dikerjakan.

## features/kelas

Seluruh pengalaman kelas ada di sini, dipakai rute `/classes` dan `/classes/[classId]/*`.

| Berkas                    | Isi                                                             |
| ------------------------- | --------------------------------------------------------------- |
| `rangka-kelas.tsx`        | hero kelas, kode undangan, progres, lima tab navigasi           |
| `rangka-kelas-memuat.tsx` | fallback `<Suspense>` berbentuk kerangka kelas                  |
| `daftar-kelas.tsx`        | Client Component: pencarian + filter daftar kelas               |
| `kartu-kelas.tsx`         | satu kartu kelas, membawa aksen warnanya sendiri                |
| `ringkasan-kelas.tsx`     | beranda kelas: pengumuman, progres, jadwal dekat, materi, tugas |
| `jadwal-kelas.tsx`        | Client Component: jadwal mingguan, filter hari, ringkasan jam   |
| `daftar-materi.tsx`       | Client Component: pencarian judul + filter jenis materi         |
| `isi-materi.tsx`          | artikel materi, tugas terkait, materi sebelumnya/berikutnya     |
| `papan-progress.tsx`      | Client Component: papan tugas, status per anggota, rekap PJ     |
| `daftar-anggota.tsx`      | Client Component: direktori anggota + pencarian peran           |
| `ikon-materi.tsx`         | ikon per jenis materi                                           |
| `bantuan.ts`              | hitung progres, sesi terdekat, urutan hari, inisial             |
| `data-contoh.ts`          | tipe + data contoh sampai controller siap                       |

Aturannya:

1. Satu kelas satu rangka. Jangan menyalin hero atau tab per halaman; kelima halaman hanya mengirim
   prop `aktif`.
2. Data contoh hanya diimpor Server Component. Client Component menerima potongan lewat props agar
   seluruh isi contoh tidak ikut ke bundel peramban.
3. Subkelas tetap data `MataKuliah`, bukan rute. Ia muncul sebagai filter materi dan label jadwal
   serta tugas.
4. Interaksi yang butuh state jadi Client Component kecil; sisanya Server Component.
5. Halaman detail memakai `notFound()` saat id tidak dikenal. Rangka kelas tidak perlu tahu soal itu.

Rincian papan tugas, arti progres, dan endpoint yang direncanakan ada di `docs/papan-progress.md`.

Gaya ada di `src/app/styles/klass/kelas.css`; token `--ds-*` di `tokens.css`.

## features/dasbor

| Berkas                       | Peran      | Isi                                                 |
| ---------------------------- | ---------- | --------------------------------------------------- |
| `kerangka-dasbor.tsx`        | dua        | `KepalaDasbor` + sidebar + kolom konten             |
| `sisi-dasbor.tsx`            | dua        | navigasi peran; item tanpa rute ditandai `nonaktif` |
| `kerangka-dasbor-memuat.tsx` | dua        | fallback `<Suspense>` saat `params`/data dimuat     |
| `dasbor-pengguna.tsx`        | pengguna   | kelas diikuti, masuk kelas, ajukan kelas, riwayat   |
| `form-pengajuan-kelas.tsx`   | pengguna   | Client Component: formulir pengajuan + validasi     |
| `form-masuk-kelas.tsx`       | pengguna   | Client Component: masuk kelas pakai kode undangan   |
| `dasbor-superadmin.tsx`      | superadmin | ringkasan, antrean pengajuan, poster, moderasi      |
| `tabel-pengajuan.tsx`        | superadmin | Client Component: setujui/tolak + toast             |
| `kartu-ringkasan.tsx`        | dua        | kotak angka ringkasan di puncak dasbor              |
| `data-contoh.ts`             | dua        | data contoh sampai controller siap                  |

Aturannya:

1. Kerangka satu, isi terpisah. Jangan menyalin `kerangka-dasbor.tsx` per peran.
2. Header dasbor hanya logo dan tombol keluar — `KepalaDasbor` di `kerangka-dasbor.tsx`, dipakai juga
   oleh `kerangka-dasbor-memuat.tsx` supaya tidak ada lompatan tinggi header saat data dimuat.
   Navigasi peran ada di sidebar, jadi `Navbar` dipanggil tanpa `item`.
3. Jangan mencampur isi: superadmin tidak mengurus isi kelas, anggota biasa tidak mendapat alat
   pengelolaan apa pun.
4. Data masih contoh dan ditandai `TODO(api)` di komponennya. Saat backend siap, ganti impor
   `data-contoh` dengan data dari controller.
5. Interaksi yang butuh state jadi Client Component kecil; sisanya Server Component.

Gaya ada di `src/app/styles/klass/dashboard.css`; token `--ds-dash-*` di `tokens.css`.

Skill: `klass-komponen`.
