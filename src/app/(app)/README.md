# src/app/(app)

**Pemilik:** Aqil · **Reviewer wajib:** Aqil · **Status:** dikerjakan nanti

Semua halaman yang hanya bisa dibuka setelah login: beranda, profil, halaman kelas, subkelas, materi, jadwal, dan tugas.

Rencana susunannya:

```
(app)/
  layout.tsx                          memeriksa login, navigasi utama
  beranda/page.tsx                    /beranda
  profil/page.tsx                     /profil
  kelas/ajukan/page.tsx               /kelas/ajukan
  kelas/gabung/page.tsx               /kelas/gabung
  kelas/[classId]/page.tsx            /kelas/123
  kelas/[classId]/sub/[subclassId]/   /kelas/123/sub/456
```

Folder berkurung siku seperti `[classId]` berarti bagian alamat itu berubah-ubah (id kelas).

Peta lengkapnya ada di skill `klass-halaman`.
