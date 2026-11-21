# src/components/features/landing

**Pemilik:** Aqil · **Reviewer wajib:** Aqil

Komponen khusus halaman utama (`/`). Tidak dipakai halaman lain, jadi tidak
ditempatkan di `shared/`.

Arah desainnya **"Buka Mapnya"**: halaman terasa seperti isi satu map kelas —
pembatas bab bernomor, pita meja kerja untuk daftar kelas, papan pengumuman,
lalu surat undangan di meja malam. Hero (`shared/hero.tsx`) tidak termasuk dan
tidak diubah.

| Berkas             | Jenis  | Isi                                                              |
| ------------------ | ------ | ---------------------------------------------------------------- |
| `bab.tsx`          | server | `PenandaBab` (tab nomor) dan `KepalaBab` (judul + intro + aksi)   |
| `indeks-map.tsx`   | client | Indeks bab di tepi kanan; tab aktif lewat `IntersectionObserver` |
| `manifesto.tsx`    | server | "Dari anggota. Untuk anggota." + lembar tiga prinsip             |
| `isi-map.tsx`      | server | Tiga fitur sebagai artefak meja: map materi, jadwal, notifikasi   |
| `alur-arsip.tsx`   | server | Tiga langkah sebagai lembar bertab yang turun bertingkat         |
| `folder-kelas.tsx` | client | Satu map kelas: punggung bertab, tumpukan kertas, tutup depan |
| `peta-kelas.tsx`   | server | Pita "Jelajahi semua kelas" selebar layar berisi enam map        |
| `papan-kabar.tsx`  | server | Siaran satu arah + poster acara                                  |
| `tanya-jawab.tsx`  | server | FAQ dua kolom, memakai `shared/accordion.tsx`                    || `surat-ajakan.tsx` | server | Penutup: surat undangan di atas map                              |

Aturannya:

1. Satu section satu berkas. Jangan menyusun ulang section besar di
   `page.tsx`; halaman hanya mengurutkan komponen dan menyimpan data contoh.
2. Map kelas punya bentuk sendiri, bukan memakai ulang `.card--folder`.
   Bentuknya mengikuti folder fisik di referensi 21st.dev: punggung bertab,
   tumpukan kertas, lalu tutup depan berlabel. Warna tetap dari token Klass.
3. Setiap map berisi tepat tiga berkas: materi, tugas, jadwal. Semua berkas
   menaut ke rute nyata (`/login` atau `/classes`), bukan `#`.
4. Tidak ada tombol tambah berkas atau menu lain di landing. Halaman publik
   hanya memperlihatkan contoh.
5. Map tidak memakai sampul bergambar. Bentuknya mengikuti folder fisik:
   punggung bertab, tumpukan kertas, lalu tutup depan berlabel.
6. Interaksi yang butuh state jadi Client Component kecil (`indeks-map`,
   `folder-kelas`); sisanya Server Component.
7. **Kertas keluar dari map, bukan mendorong layout.** Tiga berkas
   diposisikan absolut di dalam `.folder-kelas__map`. Membuka map tidak
   mengubah tinggi kartu dan tidak menggeser baris di bawahnya. Jangan
   mengembalikannya ke pola accordion `grid-template-rows: 0fr → 1fr`.
8. **Struktur map ada tiga lapis**, seperti folder fisik:
   `__punggung` (belakang, bertab) → `__panel` berisi kertas (tengah) →
   `__depan` (tutup berlabel). Kertas harus berada di antara punggung dan
   tutup depan; kalau tidak, ilusi "keluar dari map" hilang.
9. **Tumpukan tumbuh ke bawah**, diikat ke tepi atas punggung map. Jangan
   menaikkan kertas melewati punggung: kertas akan terlihat melayang di luar
   map. Yang mengintip hanya bagian atas; sisanya tertutup tutup depan.
10. Urutan DOM: kertas → tombol → tutup depan. Tombol harus mendahului panel
    supaya Tab dari tombol langsung masuk ke tiga tautan berkas.
11. Tutup depan memakai `pointer-events: none` supaya klik menembus ke tombol
    pembuka; kertas memakai `pointer-events: auto` hanya saat terbuka.
12. Ukuran dan jarak di dalam map memakai `cqw` (container query) karena
    `.folder-kelas__map` adalah container. Jangan pakai `vw`: kartu berubah
    lebar di grid, jadi `vw` akan salah di tablet.
13. Di kartu sempit judul dan meta kertas ditumpuk lewat
    `@container (max-width: 400px)` supaya tidak terpotong elipsis.
14. Angka `--folder-angkat`, `--berkas-buka`, dan `--berkas-tutup` sudah
    disetel terhadap tinggi tutup depan (42%). Kalau tinggi tutup diubah,
    setel juga ketiganya.
15. **Sudut kiri-atas map selalu 0.** Di situlah tab punggung dan bibir
    tutup depan menempel; membulatkannya menyisakan lekuk kecil di sambungan.
    Tab dan bibir juga memakai `left: calc(-1 * var(--ds-border-thin))` supaya
    tepi luarnya sejajar dengan tepi luar border induk, bukan padding box.
16. FAQ memakai `shared/accordion.tsx` yang panelnya dianimasikan lewat
    `grid-template-rows: 0fr → 1fr` + `inert`. Jangan kembalikan ke atribut
    `hidden` — `hidden` tidak bisa dianimasikan.
17. Jangan menambah intro di bawah judul bab kalau kalimatnya hanya
    mengulang isi section. Kepala bab yang baik: judul + aksi, tanpa
    paragraf basa-basi.
