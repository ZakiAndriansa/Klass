# src/app/(app)

**Pemilik:** Aqil · **Reviewer wajib:** Aqil · **Status:** UI siap, backend belum

Semua halaman yang hanya bisa dibuka setelah login: dasbor, halaman kelas, materi, jadwal, progress,
dan anggota. Alamatnya bahasa Inggris (`/dashboard`, `/classes`); teks di dalam halaman tetap bahasa
Indonesia.

## Yang sudah ada

```
(app)/
  layout.tsx                                pembungkus .ds untuk semua halaman login
  dashboard/page.tsx                        /dashboard — dasbor pengguna tanpa peran
  classes/page.tsx                          /classes — daftar kelas yang diikuti
  classes/[classId]/page.tsx                /classes/123 — beranda kelas (ringkasan)
  classes/[classId]/schedule/page.tsx       /classes/123/schedule — jadwal mingguan
  classes/[classId]/materials/page.tsx      /classes/123/materials — daftar materi
  classes/[classId]/materials/[materialId]/page.tsx   /classes/123/materials/456 — isi materi
  classes/[classId]/progress/page.tsx       /classes/123/progress — papan progress
  classes/[classId]/members/page.tsx        /classes/123/members — anggota kelas
```

Setiap `page.tsx` hanya membungkus komponen isi dengan `<Suspense fallback={<RangkaKelasMemuat />}>`
(kecuali `/classes` yang memakai kerangka daftar). Pemisahan ini wajib: Cache Components aktif, dan
membaca `params` di luar `<Suspense>` memicu galat
`Next.js encountered runtime data during prerendering` (lihat skill `klass-halaman`).

## Satu kelas, lima tab

Kelima halaman kelas memakai `RangkaKelas` dari `src/components/features/kelas`: navbar logo saja,
hero map kelas dengan kode undangan dan progres pribadi, lalu tab Ringkasan, Jadwal, Materi,
Progress, dan Anggota. Tab aktif ditentukan halaman masing-masing lewat prop `aktif`, bukan
`usePathname`, karena rangka ini Server Component.

Hero memakai warna aksen kelas (`kelas-aksen--kuning|biru|lila|hijau`), jadi pindah kelas terasa
pindah map, bukan pindah aplikasi.

## Dasbor per peran

| Rute                 | Peran      | Bisa apa saja                                      |
| -------------------- | ---------- | -------------------------------------------------- |
| `/dashboard`         | pengguna   | ajukan kelas, masuk kelas, buka kelas yang diikuti |
| `/classes`           | semua      | cari, filter, dan buka kelas                       |
| `/classes/[classId]` | semua      | ringkasan, jadwal, materi, progress, anggota       |
| `/admin`             | superadmin | setujui pengajuan, poster, moderasi                |

`/dashboard` adalah kondisi "belum punya peran": pengguna baru yang belum jadi PJ maupun admin
kelas. Formulir pengajuan kelas tinggal di sana, bukan di halaman utama — pengajuan butuh akun
karena status dan riwayatnya terikat ke pengguna. CTA di landing page mengarah ke `/login`.

Subkelas (mata kuliah) **bukan** rute terpisah. Ia data di dalam kelas dan dipakai sebagai filter
materi serta label jadwal dan tugas, jadi tidak ada `/classes/123/subclasses/456`.

## Rencana susunan berikutnya

```
(app)/
  profile/page.tsx                    /profile
  classes/request/page.tsx            /classes/request
  classes/join/page.tsx               /classes/join
```

Folder berkurung siku seperti `[classId]` berarti bagian alamat itu berubah-ubah (id kelas).

## Izin

Pengunjung yang belum login dipindahkan ke `/login` oleh `src/proxy.ts`. Itu hanya pengalihan
cepat. Pengaman sesungguhnya ada di controller: halaman yang mengambil data memanggil controller
lewat `forPage()` dari `@/server/permissions`, dan bila ditolak pengguna dipindahkan ke
`/login`, halaman 404, atau `/forbidden`. Halaman di grup ini masih memakai data contoh, jadi
belum memanggil controller.

Untuk tahu tombol mana yang ditampilkan, pakai `GET /api/v1/classes/{classId}/access`
(`docs/api.md` bagian "Peran di sebuah kelas"). Menyembunyikan tombol hanya tampilan; server tetap
memeriksa izin di setiap endpoint. Lihat `src/server/permissions/README.md`.

Peta lengkap rute ada di skill `klass-halaman`.
