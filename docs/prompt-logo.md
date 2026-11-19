# Prompt Pembuatan Logo Klass

Dokumen kerja untuk membuat logo. Isinya: filosofi yang harus diterjemahkan, batasan visual dari
design token, prompt siap tempel, tiga arah konsep, dan checklist penilaian.

Status: **logo sudah ada.** Rancangan final diekspor dari Figma node `130:1433` ("Klass Logo",
berkas `PPW-Bismillah`) dan dipasang sebagai `public/logo/klass-mark.svg`. Dokumen ini disimpan
sebagai catatan arah desain: kalau logo perlu dirombak, alasan dan batasannya ada di sini.

Logo yang berjalan sekarang adalah map manila bertab dengan label kertas bertinta `K` — arah
konsep **B** di bagian 4. Sebelumnya header hanya memakai kotak CSS 34px berisi huruf `K`
(`navbar__logo`, `auth__logo`); kotak itu sudah diganti aset SVG.

---

## 1. Filosofi yang harus masuk ke logo

Klass bukan LMS kampus. Ini yang membedakannya, dan yang harus terlihat dari lambangnya.

**Pertama, dikelola dari bawah, bukan dari atas.** Google Classroom, Canvas, dan Moodle dipegang
institusi: ada kampus, fakultas, admin IT. Klass dipegang admin kelas dan PJ yang berasal dari
anggota itu sendiri. Karena itu lambangnya **tidak boleh** memakai bahasa visual institusi:
perisai, lambang, pita, toga, gedung, atau segel. Bahasa itu mengatakan "ini milik lembaga".
Klass harus mengatakan "ini milik kalian".

**Kedua, tugasnya merapikan yang tercecer.** Visi PRD: satu tempat rapi untuk semua hal yang
sekarang tersebar di grup chat, folder drive, dan spreadsheet. Jadi metafora intinya bukan
"ruang kelas", melainkan **wadah yang menampung dan menata**: map, lembaran, tab, label.
Satu map manila yang menampung banyak lembaran lebih jujur daripada ikon buku atau papan tulis.

**Ketiga, mediumnya kertas, bukan layar.** Seluruh design system memakai kertas bergaris, map
manila, selotip, spidol stabilo, dan tombol yang bisa ditekan. Pilihan ini bukan sekadar gaya:
kertas terasa bisa dimiliki, ditulisi, dan ditempel sendiri — persis semangat bottom-up. Logo harus
ikut bahasa itu, bukan bahasa SaaS (gradien ungu, kaca buram, cahaya neon).

**Keempat, kelas bisa berupa apa saja.** PRD menegaskan kelas tidak terbatas pada pendidikan:
bisa organisasi, komunitas, divisi. Karena itu hindari ikon yang terlalu akademik (topi wisuda,
kapur, rumus). Map dan label aman untuk semua jenis kelompok.

**Kalimat inti yang harus bisa diucapkan logo ini: "kelasmu, map yang kamu beri label sendiri."**

---

## 2. Batasan visual dari design token

Semua nilai di bawah sudah ada di `src/app/styles/klass/tokens.css`. Jangan mengarang warna baru.

| Peran                  | Nilai     | Catatan                                  |
| ---------------------- | --------- | ---------------------------------------- |
| Kuning utama           | `#F5C542` | warna aksen utama, "stabilo"             |
| Tepi kuning (bayangan) | `#B8860B` | hanya untuk kedalaman, bukan garis utama |
| Tinta                  | `#1C1917` | garis, teks, semua outline               |
| Map manila             | `#EDE5D0` | badan map                                |
| Tepi map               | `#C9BD9F` | garis lipatan                            |
| Biru sekunder          | `#7EB8DA` | aksen kedua, dipakai hemat               |
| Kertas                 | `#FDFDFB` | latar                                    |
| Garis tepi buku tulis  | `#E8B4B4` | merah pudar, ciri khas kertas            |

Aturan bentuk yang sudah berlaku di UI dan sebaiknya dipertahankan di logo:

- Sudut membulat kecil, **6px** (`--ds-radius-sm`), bukan bulat penuh dan bukan tajam.
- Garis luar **2px tinta**, tebal dan rata, seperti spidol menekan.
- Bayangan **keras tanpa blur** (`0 4px 0`), bukan bayangan lembut.
- Dua warna sudah cukup. Tiga maksimum. Bayangan arah tetap satu: kanan bawah.

Tipografi: nama ditulis **Plus Jakarta Sans** (judul tebal). `Space Mono` untuk kode, `Caveat`
untuk tulisan tangan, `Handjet` (piksel) hanya untuk wordmark hero. **Logo jangan memakai Handjet** —
wordmark hero sudah memakainya, dan lambang yang piksel akan bertabrakan dengan itu.

---

## 3. Prompt utama (siap tempel)

Ditulis dalam bahasa Inggris karena model gambar lebih patuh pada deskripsi Inggris. Bagian
filosofinya tetap dibawa masuk supaya model tidak jatuh ke klise LMS.

```
Design a logo mark for "Klass", a community-run class and group manager.

WHAT THE PRODUCT IS
Klass replaces the mess of group chats, shared drive folders, and spreadsheets that
students use to run a class. Unlike institutional learning systems owned by a
university, a Klass class is created and governed by its own members: one member
applies, becomes the admin, appoints subject leads, and everyone else joins with a
code. A class can also be an organisation, a club, or any group that needs one tidy
place. The product's promise is: your class, in one tidy place.

THE IDEA THE MARK MUST CARRY
"Your class is a folder you label yourself."
A manila folder is the right metaphor because it is a container that holds loose
sheets and gives them order, it is cheap, ordinary and owned by whoever holds it,
and it is the opposite of an institutional crest. It is a thing a student labels by
hand, not a badge handed down by an authority.

VISUAL LANGUAGE
Warm stationery, not software. A physical desk in daylight: manila card, ruled
notebook paper, masking tape, a yellow highlighter, a red pencil, a hand-written
label. Tactile and printed, like a stamp or a screen print, with flat solid fills
and a thick confident outline. Slightly imperfect geometry is welcome: edges that
are almost straight, a label that is almost level.

COLOURS (use exactly these)
ink black #1C1917 for every outline and for the letterform
highlighter yellow #F5C542 as the single dominant accent
manila card #EDE5D0 for the folder body
folder edge #C9BD9F for fold lines only
paper white #FDFDFB background
Use at most three colours plus white. No gradients anywhere.

FORM REQUIREMENTS
- A folder shape whose tab or fold reads as the letter K, OR a paper label stuck on a
  folder with a bold K drawn on it. The K must be geometric and constructed, not a
  font sample.
- Rounded corners of roughly 6px at a 34px render size: soft, never fully round, never
  a sharp spike.
- Outline weight around 2px at 34px render size, even and hand-inked, not tapered.
- One hard offset shadow only, straight down-right, no blur, like a rubber stamp
  pressed on paper. The mark must also work with the shadow removed.
- Compact and centred. It sits in a 34x34 pixel box in a website header, immediately
  left of the word "Klass".
- Must survive at 16x16 pixels and in pure black on white.

DELIVERABLE
A single square logo mark, centred, generous clear space, on a plain paper-white
background. Flat vector look, no photorealism, no mockup, no 3D render, no text other
than the K.
```

---

## 4. Tiga arah konsep (pilih satu, atau minta ketiganya lalu bandingkan)

**A. Tab yang menjadi K.** Tab map manila di sisi atas, dan potongan tab itu membentuk kaki
huruf K. Paling dekat dengan metafora, paling kuat di ukuran kecil karena siluetnya tetap
"map". Risiko: K-nya bisa tenggelam kalau tab terlalu kecil — jaga agar batang K menyentuh
tepi bawah tab.

**B. Label bertinta K.** Persegi label kertas kuning menempel miring sedikit di badan map,
bertuliskan K tebal. Ini paling jujur ke kalimat "folder yang kamu beri label sendiri", dan
paling gampang dikenali di 16px. Risiko: terlalu mirip sticky note biasa — bedakan dengan
lipatan map yang jelas di belakang label.

**C. Lipatan halaman menjadi K.** Sudut kertas yang terlipat (dog-ear), dan lipatannya
membentuk dua kaki K. Paling elegan dan paling "kertas", tapi paling abstrak; hanya berhasil
kalau garis lipatannya tegas.

Saran: mulai dari **B** karena paling terbaca di header 34px dan paling jelas bercerita,
lalu uji **A** sebagai cadangan.

---

## 5. Negative prompt

```
crest, shield, seal, banner ribbon, graduation cap, mortarboard, diploma, university
building, columns, book stack, chalkboard, apple, pencil cup, calculator, atom, trophy,
laurel wreath, globe, speech bubble, chat icon, cloud icon, folder of a corporate file
manager, glassmorphism, frosted glass, gradient, neon glow, 3D render, isometric mockup,
drop shadow with blur, thin hairline stroke, sharp spikes, fully rounded pill shape,
handwriting scribble, pixel font, script lettering, latin lorem text, watermark, frame,
multiple logo variations on one canvas
```

---

## 6. Cara memasang di aplikasi (sudah dilakukan)

Rancangan final diekspor dari Figma sebagai SVG dengan latar transparan, bukan digambar ulang
manual. Berkas dan pemasangannya:

| Hal        | Lokasi                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| Aset SVG   | `public/logo/klass-mark.svg` (849×663, latar transparan)                         |
| Komponen   | `src/components/shared/lambang-klass.tsx` → `LambangKlass`                       |
| Dipakai di | `navbar.tsx` (semua halaman) dan `papan-auth.tsx` (`/login`, `/register`)        |
| Favicon    | `src/app/favicon.ico`, dibuat dari SVG yang sama (64/48/32/16, latar transparan) |

Favicon sengaja tidak diberi latar kertas dan lambangnya diperbesar selebar kanvas, supaya di tab
tidak tampak seperti kotak kecil.

Karena rasionya 849:663 dan bukan persegi, CSS hanya mengatur **tinggi** (34px) dan `width: auto`.
Kalau lebar dan tinggi dipaksa sekaligus, gambarnya akan gepeng — aset ekspor memakai
`preserveAspectRatio="none"`.

Bingkai kuning, garis tinta, dan bayangan tombol yang dulu ada di `.navbar__logo` dan `.auth__logo`
sudah dihapus: semuanya sudah tergambar di dalam aset. Yang tersisa hanya ukuran.

Belum dibuat: versi satu warna (`klass-mark-mono.svg`). Diperlukan kalau nanti logo harus tampil
hitam-putih, misalnya untuk cetak atau favicon mode gelap.

---

## 7. Checklist penilaian

Lambang lolos kalau semua ini benar:

- [ ] Terbaca di 16px tanpa menebak.
- [ ] Terbaca sebagai hitam-putih murni.
- [ ] Tidak memakai lebih dari tiga warna, tanpa gradien.
- [ ] Tidak memuat perisai, toga, gedung, atau piala.
- [ ] Tidak memakai font piksel (itu wilayah wordmark hero).
- [ ] Sejajar visual dengan teks "Klass" di sebelahnya, tidak lebih tinggi dari kapital teks.
- [ ] Masih enak dilihat tanpa bayangan.
- [ ] Bisa dijelaskan dalam satu kalimat: "map yang diberi label sendiri".
