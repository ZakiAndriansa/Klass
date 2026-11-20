# src/lib

**Pemilik:** Zaki · **Reviewer wajib:** Zaki (Aqil untuk berkas yang hanya dipakai frontend)

Fungsi bantu kecil yang **aman dijalankan di peramban**. Folder ini tidak boleh mengimpor dari `@/server`.

| Berkas           | Guna                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `utils.ts`       | `cn()` untuk menggabungkan kelas Tailwind (dari shadcn)                                              |
| `api-client.ts`  | `api()` untuk memanggil REST API dari Client Component. Jawaban 401 otomatis memindahkan ke `/login` |
| `auth-client.ts` | `masukDenganGoogle()` untuk tombol login Google                                                      |
| `tujuan.ts`      | `tujuanAman()` dan `alamatLogin()`: alamat `?next=` setelah login, dibatasi ke halaman Klass sendiri |

Fungsi bantu yang hanya dipakai backend tempatnya di `src/server`, bukan di sini.
