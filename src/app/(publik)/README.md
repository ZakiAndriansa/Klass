# src/app/(publik)

**Pemilik:** Aqil · **Reviewer wajib:** Aqil

Halaman yang bisa dibuka siapa saja tanpa login: halaman utama dan poster (F11).

| Rute        | Berkas              | Isi                                                                                                                         |
| ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/`         | `page.tsx`          | Halaman utama (landing) — hero, prinsip, fitur, cara kerja, jelajah, siaran, papan informasi, FAQ, ajakan bergabung, footer |
| `/komponen` | `komponen/page.tsx` | Galeri seluruh komponen dan varian design system Klass, sekaligus ruang uji interaksi (dialog, toast, tooltip, tab)         |

`layout.tsx` membungkus kedua halaman dengan `.ds` supaya gaya kertas design
system Klass tidak bocor ke halaman lain.

Jangan menaruh halaman yang butuh login di sini; tempatnya di `(app)/`.

Skill: `klass-halaman`.
