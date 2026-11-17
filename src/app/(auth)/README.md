# src/app/(auth)

**Pemilik:** Aqil · **Reviewer wajib:** Aqil · **Status:** tampilan selesai; login Google menunggu F1

Halaman autentikasi berbentuk buku terbuka. Di desktop, halaman kiri adalah
ilustrasi dan halaman kanan berisi formulir. Membalik lembar menukar keduanya:
formulir pindah ke kiri, ilustrasi bercermin ke kanan.

| Berkas              | Alamat      | Isi                 |
| ------------------- | ----------- | ------------------- |
| `login/page.tsx`    | `/login`    | “Masuk ke kelasmu.” |
| `register/page.tsx` | `/register` | “Buat akun Klass.”  |

Kedua halaman memakai komponen yang sama:

- `src/components/features/auth/papan-auth.tsx` — susunan buku, teks per mode,
  tombol Google, lipatan sudut, dan tautan **Daftar/Masuk**.
- `src/components/features/auth/ilustrasi-buku.tsx` — ilustrasi malam 560×700
  (bulan, awan kertas, perbukitan, buku, cangkir, pesawat kertas). Menerima
  `idPrefix` agar beberapa salinan SVG tidak berbagi id gradien/filter.
- `src/app/styles/klass/auth.css` — punggung buku, lipatan, animasi balik
  halaman, dan tata letak responsif; nilai visual memakai token `tokens.css`.

## Susunan lembar

**Desktop (≥ 900px).** Dua halaman dasar bergambar (kiri dan cerminannya di
kanan) menjadi latar. Di atasnya ada satu lembar berporos di punggung buku:

- sisi depan = formulir masuk,
- sisi belakang = formulir daftar.

Saat lembar berputar `rotateY(0 → -180deg)`, sisi belakang mendarat di halaman
kiri. Karena halaman dasar kanan berisi ilustrasi cermin, hasil akhirnya adalah
formulir di kiri dan ilustrasi di kanan. Kembali ke `/login` memutar lembar ke
arah sebaliknya (`0deg`). Punggung buku, lekuk V atas/bawah, tumpukan tepi
halaman, dan bayangan kontak tetap diam di tempat.

**Mobile (< 900px).** Satu halaman saja: pita ilustrasi ±180px di atas formulir,
tanpa punggung. Saat berganti mode, halaman lama berputar 3D dengan engsel di
kiri dan halaman tujuan sudah menunggu di bawahnya. Setelah animasi selesai,
pohon mobile di-reset ke halaman tujuan saja.

## Kelas status

| Kelas                    | Arti                                          |
| ------------------------ | --------------------------------------------- |
| `is-masuk` / `is-daftar` | sudut diam lembar dan tumpukan tepi           |
| `is-flipping`            | animasi sedang berjalan; input baru diabaikan |
| `ke-masuk` / `ke-daftar` | arah putaran dan keyframe yang dipakai        |

Kelima kelas dipasang di `.auth__book`; tumpukan tepi memakai `is-*` sendiri
supaya ketebalannya ikut bercermin setelah lembar selesai berbalik.

## Waktu dan riwayat

- `DURASI_FLIP = 900` di `papan-auth.tsx` harus sama dengan
  `--ds-auth-flip-duration: 900ms`.
- Animasi dijalankan lebih dulu; `history.pushState` baru dipanggil setelah
  putaran selesai. `document.title` ikut diperbarui di titik yang sama.
- Membuka `/register` langsung menampilkan lembar pada `-180deg` tanpa animasi.
- Tombol kembali/forward memutar ulang animasi ke arah mode tujuan. Popstate di
  tengah animasi langsung menyelesaikan ke mode terbaru tanpa menumpuk putaran.
- Selama `is-flipping`, `gantiMode` menolak input baru dan `aria-busy` aktif.

## Lipatan sudut

Lipatan adalah `button` asli berlabel `Go to register` / `Go to login`, jadi
bisa dijangkau keyboard dan memakai cincin fokus bersama. Flap di dalamnya
hanya hiasan (`aria-hidden`). Halaman memakai `clip-path` sungguhan sehingga
sudutnya benar-benar hilang; flap bergradasi lebih gelap dengan ujung
membulat, bayangan jatuh, dan membesar 20% saat hover.

- Desktop: lipatan di sudut bawah luar halaman formulir — kanan untuk masuk,
  kiri untuk daftar. Tautan **Daftar/Masuk** tetap ada dan tetap berfungsi.
- Mobile: lipatan selalu di kanan bawah.
- Saat halaman menjadi sisi pasif, tombol lipatan diberi `tabIndex=-1` dan
  tidak bisa diklik (`is-pasif`).

## Aksesibilitas

- Sisi lembar yang tidak terlihat memakai `inert` + `aria-hidden`, sehingga
  isinya tidak masuk urutan Tab dan tidak dibacakan.
- Setelah putaran, fokus dipindahkan ke `<h1>` halaman yang baru terlihat
  (`tabIndex=-1` pada judul).
- Putaran desktop memakai `aria-labelledby` judul aktif; pohon mobile punya
  judul mobile sendiri agar id tidak bentrok.
- Saat `prefers-reduced-motion: reduce`, putaran 3D diganti fade 200ms
  (`--ds-auth-settle-duration`); hasil akhirnya tetap bentangan bercermin dan
  URL tetap diperbarui.

## Variabel CSS publik

Diatur di `.ds .auth` dan dapat ditimpa per layar:

| Variabel           | Fungsi                              |
| ------------------ | ----------------------------------- |
| `--spine-width`    | lebar pita punggung buku            |
| `--fold-size`      | ukuran sisi lipatan sudut           |
| `--paper`          | warna kertas utama halaman formulir |
| `--paper-shade`    | bayangan kertas untuk gradien flap  |
| `--page-thickness` | tebal tumpukan tepi halaman         |
| `--flip-duration`  | durasi putaran lembar               |
| `--shadow-color`   | warna bayangan lipatan              |

Nilai intinya tetap tinggal di `tokens.css` sebagai `--ds-auth-*`.

Tombol Google sengaja belum diberi penanganan karena Better Auth dan
kredensial Google belum dikonfigurasi. Setelah F1 siap, sambungkan tombol ke
alur login di `src/server/auth`.

Skill: `klass-halaman`.
