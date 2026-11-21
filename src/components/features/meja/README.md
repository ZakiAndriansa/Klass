# src/components/features/meja

**Pemilik:** Aqil · **Reviewer wajib:** Aqil

Isi `/dashboard` — satu rute, dua tampilan yang dipilih dari peran global
pengguna. Tidak ada lagi `/admin`: peran website dan peran kelas itu dua hal
berbeda, jadi superadmin memakai rute yang sama dengan tampilan berbeda.

| Peran      | Tampilan | Pertanyaan yang dijawab                                     |
| ---------- | -------- | ----------------------------------------------------------- |
| pengguna   | Meja     | "Hari ini aku ke mana dan mengerjakan apa, di semua kelas?" |
| superadmin | Loket    | "Ada yang menunggu aku putuskan?"                           |

| Berkas                     | Jenis  | Isi                                                          |
| -------------------------- | ------ | ------------------------------------------------------------ |
| `meja.tsx`                 | server | Meja + keadaan onboarding (belum punya kelas)                |
| `agenda.tsx`               | server | Agenda hari ini dan pita minggu                              |
| `kolom-kanan.tsx`          | server | Sticky note perhatian, tab map kelas, kabar, strip pengajuan |
| `loket.tsx`                | server | Loket: antrean, undangan admin, kondisi situs                |
| `antrean-pengajuan.tsx`    | client | Antrean kartu: setujui, tolak beralasan, undo                |
| `form-masuk-kelas.tsx`     | client | Formulir kode undangan                                       |
| `form-pengajuan-kelas.tsx` | client | Formulir pengajuan kelas baru                                |
| `data-contoh.ts`           | server | Data dummy per akun + antrean Loket                          |

## Aturan

1. **Meja hanya berisi yang tidak bisa dijawab halaman lain.** Katalog kelas
   ada di `/classes`, riwayat pengajuan di `/profile`, isi kelas di beranda
   kelas. Jangan menyalin daftar lengkap ke sini.
2. **Superadmin tidak dialihkan.** Halaman ini memilih tampilan dari
   `pengguna.isSuperadmin`. Hapus redirect lama ke `/admin` beserta rutenya.
3. **Dua keadaan Meja, bukan satu.** Tanpa kelas, halaman menjadi onboarding
   (kode undangan + ajukan kelas). Sudah punya kelas, formulir pindah ke
   bagian bawah supaya agenda tetap di layar pertama.
4. **Angka penting adalah umur pengajuan tertua**, bukan jumlah kelas aktif.
   Loket tidak punya kartu statistik; rekapnya satu kalimat di kepala antrean,
   dan berubah merah setelah 48 jam.
5. **Penolakan wajib beralasan.** Alasan itu yang dibaca pengaju lewat
   `PengajuanMeja.catatan`, jadi jangan pernah menolak tanpa isi.
6. **Aksi destruktif tidak di halaman indeks.** Reset tema, arsipkan, dan hapus
   kelas menunggu rute berkas kelas, bukan tombol mengambang di antrean.
7. **Strip pengajuan hanya muncul saat menunggu.** Kalau tidak ada yang
   menunggu, blok dihilangkan — bukan kotak kosong.
8. Data masih dummy dan ditandai `TODO(api)` di `data-contoh.ts`. Ganti dengan
   controller `me/*` dan `admin/*` saat endpoint tersedia.

Gaya ada di `src/app/styles/klass/meja.css`, memakai token `--ds-*` yang sudah
ada. Jangan menambah token `--ds-dash-*` baru.

Skill: `klass-halaman`, `klass-komponen`.
