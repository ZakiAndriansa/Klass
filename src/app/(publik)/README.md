# src/app/(publik)

**Pemilik:** Aqil · **Reviewer wajib:** Aqil

Halaman yang bisa dibuka siapa saja tanpa login: halaman utama dan poster (F11).

| Rute          | Berkas                | Isi                                                                                                                                           |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`           | `page.tsx`            | Halaman utama (landing) — hero + "Buka Mapnya": manifesto, isi map, alur arsip, jelajah kelas, papan kabar, tanya jawab, surat ajakan, footer |
| `/components` | `components/page.tsx` | Galeri seluruh komponen dan varian design system Klass, sekaligus ruang uji interaksi (dialog, toast, tooltip, tab)                           |

`layout.tsx` membungkus kedua halaman dengan `.ds` supaya gaya kertas design
system Klass tidak bocor ke halaman lain.

Jangan menaruh halaman yang butuh login di sini; tempatnya di `(app)/`.

Skill: `klass-halaman`.

## Navbar landing saat sudah login

`NavbarLanding` membaca sesi lewat `ambilSesiSaya()` di dalam `<Suspense>`.
Tombol kanannya menyesuaikan keadaan:

| Keadaan     | Tombol kanan          |
| ----------- | --------------------- |
| Belum login | `Masuk` → `/login`    |
| Sudah login | `Meja` → `/dashboard` |

Sesi dibaca di dalam `<Suspense>` supaya sisa halaman tetap bisa diprerender
walau pembacaan cookie membuat halaman dinamis.
