# src/components/features/profil

**Pemilik:** Aqil · **Reviewer wajib:** Aqil

Halaman profil `/profile` berbentuk buku terbuka, memakai bahasa visual yang
sama dengan halaman masuk: meja kertas, lembar berporos, dan punggung buku.

Buku punya **empat halaman dalam dua bentangan**:

| Halaman | Posisi                | Isi                                      |
| ------- | --------------------- | ---------------------------------------- |
| 1       | kiri, dasar           | data diri, NIM, deskripsi, tombol keluar |
| 2       | kanan, lembar depan   | peran kelas                              |
| 3       | kiri, lembar belakang | update terbaru + jadwal                  |
| 4       | kanan, dasar          | pintasan ke kelas                        |

| Berkas            | Jenis  | Isi                                            |
| ----------------- | ------ | ---------------------------------------------- |
| `buku-profil.tsx` | client | Buku empat halaman + navigasi sticky note sisi |
| `ubah-profil.tsx` | client | Dialog ubah nama + avatar (`PATCH /profile`)   |
| `data-contoh.ts`  | server | Kelas, peran, catatan, dan jadwal (sementara)  |

Aturannya:

1. **Satu lembar, dua sisi, empat halaman.** Lembar hanya menempati halaman
   kanan dan berporos di punggung buku. Halaman 1 dan 4 adalah halaman dasar;
   halaman 2 dan 3 adalah sisi depan/belakang lembar. Kalau lembarnya dibuat
   selebar buku, kedua muka akan menutupi dua halaman sekaligus.
2. **Navigasi hanya sticky note**, tidak ada tombol halaman terpisah. Dua note
   persegi panjang menempel di sisi luar buku (bukan di atas), dengan sisi
   tetap: **Identitas di tepi kiri, Catatan di tepi kanan**. Saat lembar
   dibalik posisinya tidak berpindah, hanya note aktif yang berubah kuning.
   Bentuk dan bahannya mengikuti tab indeks landing (`indeks-map.css`): border
   tinta, nomor mono, label kapital, note aktif kuning. Sisa note yang menempel
   di kertas digambar dengan `clip-path` supaya terlihat seperti lembaran yang
   benar-benar ditempel. Di layar sempit kedua note pindah ke bawah buku dan
   halaman ditumpuk. Urutan tumpuk memakai `order` karena urutan DOM mengikuti
   fisik buku (1, 4, 2, 3).
3. **Sisi non-aktif memakai `inert`.** Tautan shortcut di balik halaman yang
   tidak terlihat tidak boleh bisa di-Tab.
4. **Di bawah 900px jangan diputar.** Rotasi 3D di kolom sempit membuat teks
   tidak terbaca; halaman bentangan aktif ditumpuk dan sticky note tetap
   menjadi navigasinya.
5. **Nama field mengikuti API bahasa Inggris** (`name`, `image`), sedangkan
   teks yang dilihat pengguna tetap bahasa Indonesia.
6. Identitas berasal dari `GET /api/v1/profile`, bukan dari sesi: nama dan
   avatar hanya bisa diubah lewat endpoint itu. Dialog "Ubah profil" memanggil
   `PATCH /api/v1/profile` lalu `router.refresh()` supaya halaman membaca ulang
   dari server. Daftar kelas dan catatan masih data contoh, ditandai
   `TODO(api)` di `page.tsx`.
7. **Halaman ini satu-satunya jalan keluar.** Tombol "Keluar dari akun" di
   halaman 1 memakai `TombolKeluar` (`DELETE /api/v1/session`). Navbar di
   halaman lain hanya menautkan `Meja`, jadi jangan menambahkan tombol keluar
   di navbar atau halaman lain.

Gaya ada di `src/app/styles/klass/profil.css`; token `--ds-auth-*` dipakai
ulang supaya buku profil dan buku masuk terlihat satu keluarga.

Skill: `klass-halaman`, `klass-komponen`.
