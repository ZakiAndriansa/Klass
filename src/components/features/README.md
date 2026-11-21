# src/components/features

**Pemilik:** Rehan, Darrel · **Reviewer wajib:** Aqil

Komponen milik satu fitur. Satu fitur satu subfolder:

```
features/
  kelas/        daftar kelas, beranda kelas, jadwal, materi, progress, anggota
  landing/      section halaman utama "Buka Mapnya"
  meja/         isi /dashboard: Meja (pengguna) dan Loket (superadmin)
  profil/       halaman /profile berbentuk buku (identitas + catatan kelas)
  dev/          daftar akun contoh untuk /dev/login (khusus pengembangan)
```

Satu subfolder dikerjakan satu orang supaya Rehan dan Darrel tidak mengubah berkas yang sama.
Pembagiannya ditentukan Aqil. Subfolder dibuat saat fiturnya mulai dikerjakan.

## features/landing

Section halaman utama (`/`) setelah hero, dengan arah "Buka Mapnya". Rinciannya
ada di `landing/README.md`.

| Berkas             | Isi                                                  |
| ------------------ | ---------------------------------------------------- |
| `bab.tsx`          | penanda bab + kepala bab dua kolom                   |
| `indeks-map.tsx`   | Client Component: indeks bab di tepi kanan           |
| `manifesto.tsx`    | pernyataan + tiga prinsip kelas                      |
| `isi-map.tsx`      | tiga fitur sebagai artefak meja                      |
| `alur-arsip.tsx`   | tiga langkah bertab                                  |
| `folder-kelas.tsx` | Client Component: map kelas buka/tutup + tiga berkas |
| `peta-kelas.tsx`   | pita "Jelajahi semua kelas"                          |
| `papan-kabar.tsx`  | siaran satu arah + poster acara                      |
| `tanya-jawab.tsx`  | FAQ landing memakai `shared/accordion.tsx`           |
| `surat-ajakan.tsx` | penutup undangan di meja malam                       |

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

## features/meja

Isi `/dashboard`: satu rute dengan dua tampilan menurut peran global. Rincian
ada di `meja/README.md`.

| Berkas                     | Peran      | Isi                                               |
| -------------------------- | ---------- | ------------------------------------------------- |
| `meja.tsx`                 | pengguna   | agenda hari ini + keadaan onboarding              |
| `agenda.tsx`               | pengguna   | agenda hari ini dan pita minggu                   |
| `kolom-kanan.tsx`          | pengguna   | perhatian, tab map kelas, kabar, strip pengajuan  |
| `loket.tsx`                | superadmin | antrean pengajuan, undangan admin, kondisi situs  |
| `antrean-pengajuan.tsx`    | superadmin | Client Component: setujui, tolak beralasan, undo  |
| `form-masuk-kelas.tsx`     | pengguna   | Client Component: masuk kelas pakai kode undangan |
| `form-pengajuan-kelas.tsx` | pengguna   | Client Component: formulir pengajuan + validasi   |
| `data-contoh.ts`           | dua        | data dummy per akun sampai controller siap        |

Aturannya:

1. Satu rute, dua tampilan. Tidak ada lagi `/admin`; halaman memilih isi dari
   `pengguna.isSuperadmin`, dan superadmin tetap punya agenda pribadinya.
2. Meja hanya memuat yang tidak bisa dijawab halaman lain. Katalog kelas tetap
   di `/classes`; riwayat pengajuan menyusul di halaman profil.
3. Jangan mencampur isi: superadmin tidak mengurus isi kelas, anggota biasa
   tidak mendapat alat pengelolaan apa pun.
4. Data masih dummy dan ditandai `TODO(api)` di `data-contoh.ts`.
5. Interaksi yang butuh state jadi Client Component kecil; sisanya Server Component.

Gaya ada di `src/app/styles/klass/meja.css`; tidak ada token `--ds-dash-*` baru.

Skill: `klass-komponen`.
