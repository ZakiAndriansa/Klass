# src/components/shared

**Pemilik:** Rehan, Darrel · **Reviewer wajib:** Aqil

Komponen design system Klass yang dipakai lebih dari satu halaman. Semua
gayanya ada di `src/app/styles/klass/components/` dan seluruh nilainya memakai
token `--ds-*` dari `src/app/styles/klass/tokens.css`.

Halaman `/` memakai komponen ini untuk menyusun landing page; galeri lengkap
beserta semua variannya ada di `/components`.

| Berkas                 | Isi                                                        |
| ---------------------- | ---------------------------------------------------------- |
| `accordion.tsx`        | FAQ tumpukan kertas, satu item terbuka                     |
| `ajakan-bergabung.tsx` | Pita ajakan bergabung selebar layar                        |
| `alert.tsx`            | Notifikasi sebaris dengan empat varian                     |
| `breadcrumb.tsx`       | Jejak navigasi                                             |
| `dialog.tsx`           | Dialog/modal native `<dialog>`                             |
| `feed.tsx`             | Siaran komunitas berisi daftar `Alert`                     |
| `footer.tsx`           | Footer lembar kertas                                       |
| `form.tsx`             | `Field`, input, select, textarea, checkbox, radio, toggle  |
| `hero.tsx`             | Wordmark KLASS, lima lencana, dan dua CTA                  |
| `kartu-fitur.tsx`      | Kartu indeks tiga warna untuk "Fitur utama"                |
| `kartu-status.tsx`     | Kartu status ringkas untuk dashboard                       |
| `kartu.tsx`            | Map manila (`KartuFolder`), catatan, kertas, dan gridnya   |
| `langkah.tsx`          | Daftar langkah bernomor ("Cara kerja")                     |
| `lambang-klass.tsx`    | Lambang map Klass (SVG dari Figma) untuk navbar dan auth   |
| `lencana.tsx`          | Lencana/stabilo dengan enam varian                         |
| `navbar.tsx`           | Navigasi tab folder + drawer seluler                       |
| `pagination.tsx`       | Penomoran halaman                                          |
| `poster.tsx`           | Papan informasi biru lebar                                 |
| `section-heading.tsx`  | `SectionHeading` (garis/polos/pisah/tulisan) dan `InkLink` |
| `section.tsx`          | `Section`, `SectionInner`, `SectionHead`                   |
| `tabs.tsx`             | Tab subkelas                                               |
| `toast.tsx`            | Notifikasi mengambang + `useToast`                         |
| `tombol-kertas.tsx`    | Tombol kertas (primary, secondary, ghost, danger)          |
| `tooltip.tsx`          | Tooltip CSS untuk hover dan fokus                          |

Komponen yang hanya dipakai satu fitur tempatnya di `features/<fitur>/`.

Semua tombol dan tautan berbentuk tombol memakai `TombolKertas` /
`TautanTombolKertas` dari `tombol-kertas.tsx`; jangan menulis ulang gaya
`.btn` di komponen lain. Dengan begitu perubahan gaya tombol otomatis ikut ke
seluruh halaman.

Karena dipakai banyak halaman, komponen baru di sini disepakati dulu dengan
Aqil sebelum dikerjakan.

Skill: `klass-komponen`.
