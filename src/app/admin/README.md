# src/app/admin

**Pemilik:** Aqil · **Reviewer wajib:** Aqil · **Status:** UI siap, backend belum

Halaman khusus superadmin, beralamat `/admin/...`: menyetujui pengajuan kelas (F3) dan mengelola poster (F11).

## Yang sudah ada

```
admin/
  layout.tsx     pembungkus .ds untuk rute superadmin
  page.tsx       /admin — dasbor superadmin
```

Dasbor superadmin berisi ringkasan angka, antrean pengajuan kelas yang bisa disetujui/ditolak
(ubah status di layar + toast), poster halaman utama, dan moderasi tema kelas.
Isinya dirakit dari `src/components/features/dasbor` dengan data contoh; tiap bagian yang masih
contoh ditandai `TODO(api)`.

Kerangkanya sama persis dengan `/classes/[classId]`: satu `KerangkaDasbor` dengan header berisi logo
dan tombol keluar saja, sidebar 216px di kiri yang memanjang sampai dasar halaman, lalu kolom
konten. Yang berbeda hanya daftar menu di sidebar dan isi kolom konten.

Menu yang belum punya rute (`Semua kelas`, `Poster`, `Moderasi & tema`) sengaja dirender sebagai
teks nonaktif, bukan tautan mati.

## Batas peran

Superadmin mengurus website, bukan isi kelas. Karena itu dasbor ini **tidak** memuat folder
subkelas, agenda, atau jadwal — semuanya milik admin kelas di `/classes/[classId]`.

Pemeriksaan "apakah pengguna ini superadmin" dilakukan di server lewat lapisan izin milik backend,
bukan dengan menyembunyikan menu. Belum aktif karena middleware dan Better Auth belum dikonfigurasi;
UI sengaja terbuka. Lihat skill `klass-izin`.

Skill: `klass-halaman`.
