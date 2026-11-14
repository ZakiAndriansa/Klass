# src/server

Ini folder **backend**. Lead backend: **Zaki**. Semua perubahan di folder ini harus disetujui Zaki sebelum digabung.

| Folder         | Isi                                                   | Pemilik        |
| -------------- | ----------------------------------------------------- | -------------- |
| `controllers/` | Logika tiap endpoint: validasi, izin, memanggil model | Ahmad, Bintang |
| `models/`      | Semua query dan transaksi ke database                 | Fadlan         |
| `db/`          | Koneksi database dan definisi tabel                   | Fadlan         |
| `http/`        | Alat bantu respons dan galat API                      | Zaki           |
| `permissions/` | Aturan siapa boleh melakukan apa (nanti)              | Zaki           |
| `auth/`        | Konfigurasi login (nanti)                             | Zaki           |

## Alur satu permintaan

```
peramban
   |
   v
URL          src/app/api/v1/.../route.ts     Ahmad, Bintang
   |
   v
controller   src/server/controllers/         Ahmad, Bintang
   |
   v
model        src/server/models/              Fadlan
   |
   v
database     src/server/db/                  Fadlan
```

Alurnya satu arah dan tidak boleh melompat. URL tidak memanggil model, controller tidak menulis query. ESLint menolak impor yang melanggar.

## Aturan

1. Setiap berkas di sini diawali `import "server-only";` supaya tidak pernah ikut terkirim ke peramban.
2. Kode frontend (`src/components`, `src/lib`) tidak boleh mengimpor dari folder ini.
3. Contoh alur lengkap yang bisa ditiru: `health` di `controllers/`, `models/`, dan `src/app/api/v1/health/`.

Skill: `klass-api`, `klass-db`.
