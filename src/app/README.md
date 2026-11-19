# src/app

Folder ini menentukan **alamat (URL)** aplikasi. Nama folder menjadi alamat: `app/classes/page.tsx` dibuka di `/classes`.

| Folder                      | Isi                                                            | Pemilik        | Reviewer wajib |
| --------------------------- | -------------------------------------------------------------- | -------------- | -------------- |
| `(publik)/`                 | Halaman yang bisa dibuka tanpa login                           | Aqil           | Aqil           |
| `(auth)/`                   | Halaman login                                                  | Aqil           | Aqil           |
| `(app)/`                    | Halaman setelah login                                          | Aqil           | Aqil           |
| `admin/`                    | Halaman superadmin                                             | Aqil           | Aqil           |
| `api/`                      | URL backend (REST API)                                         | Ahmad, Bintang | Zaki           |
| `dev/`                      | Halaman bantu pengembangan (`/dev/login`), mati di produksi    | Zaki           | Zaki, Aqil     |
| `layout.tsx`, `globals.css` | Bingkai dan gaya seluruh aplikasi                              | Aqil           | Aqil           |
| `styles/`                   | Gaya design system Klass: `klass.css`, token, CSS per komponen | Aqil           | Aqil           |
| `fonts/`                    | Berkas font lokal, dimuat di `layout.tsx`                      | Aqil           | Aqil           |

Nama folder dalam kurung, seperti `(publik)`, hanya untuk mengelompokkan dan **tidak muncul di alamat**.

## Nama berkas yang punya arti khusus

| Berkas        | Arti                                                          |
| ------------- | ------------------------------------------------------------- |
| `page.tsx`    | Isi halaman                                                   |
| `layout.tsx`  | Bingkai yang membungkus halaman di folder itu dan di bawahnya |
| `loading.tsx` | Tampilan saat halaman dimuat                                  |
| `error.tsx`   | Tampilan saat terjadi galat                                   |
| `route.ts`    | URL backend, hanya di dalam `api/`                            |

## Aturan

1. Halaman merakit komponen dari `src/components`. Tampilan baru dibuat sebagai komponen, bukan ditulis panjang di `page.tsx`.
2. Halaman mengambil data dengan memanggil controller (`@/server/controllers`), bukan model atau database.
3. Bagian halaman yang butuh data dibungkus `<Suspense>`. Polanya ada di skill `klass-halaman`.
4. Halaman yang memakai gaya kertas harus berada di dalam elemen berkelas `ds`, yang dipasang di `layout.tsx` kelompoknya (lihat `(publik)/layout.tsx`).

Skill: `klass-halaman` untuk halaman, `klass-api` untuk `api/`.
