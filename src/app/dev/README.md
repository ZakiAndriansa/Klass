# src/app/dev

**Pemilik:** Zaki · **Reviewer wajib:** Zaki untuk alurnya, Aqil untuk tampilannya · **Status:** aktif, hanya saat pengembangan

Halaman bantu untuk pengembangan, beralamat `/dev/...`. Di produksi semua halaman di sini menjawab 404.

| Rute         | Berkas           | Isi                                                                     |
| ------------ | ---------------- | ----------------------------------------------------------------------- |
| `/dev/login` | `login/page.tsx` | Daftar akun contoh, satu per peran. Klik satu akun untuk langsung masuk |

`layout.tsx` membungkus halaman dengan `.ds` supaya gaya kertas design system Klass berlaku.

## Cara pakai

1. Jalankan `npm run dev` dan pastikan MySQL menyala.
2. Buka http://localhost:3000/dev/login.
3. Klik akun dengan peran yang ingin dicoba. Kamu langsung dibawa ke halaman peran itu.
4. Untuk berganti peran, kembali ke `/dev/login` lalu klik akun lain.

Tampilannya dirakit dari `src/components/features/dev/pilih-akun-dev.tsx`. Daftar akun dan cara kerjanya dijelaskan di `src/server/auth/README.md`, dan endpoint-nya di `docs/api.md` bagian "Akun contoh".

Halaman ini akan tetap berguna setelah login Google jadi, karena menguji lima peran dengan lima akun Google sungguhan tidak praktis.
