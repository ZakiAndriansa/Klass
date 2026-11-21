# src/app/(app)

**Pemilik:** Aqil · **Reviewer wajib:** Aqil · **Status:** Auth aktif, data kelas masih contoh

Semua halaman yang hanya bisa dibuka setelah login: dasbor, halaman kelas, materi, jadwal, progress,
dan anggota. Alamatnya bahasa Inggris (`/dashboard`, `/classes`); teks di dalam halaman tetap bahasa
Indonesia.

## Yang sudah ada

```
(app)/
  layout.tsx                                pembungkus .ds untuk semua halaman login
  dashboard/page.tsx                        /dashboard — Meja (pengguna) / Loket (superadmin)
  profile/page.tsx                          /profile — buku profil (identitas + catatan kelas)
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

## Meja per peran

`/dashboard` adalah satu rute dengan dua tampilan, dipilih dari
`pengguna.isSuperadmin`. Tidak ada rute `/admin` terpisah.

| Rute                 | Peran      | Bisa apa saja                                     |
| -------------------- | ---------- | ------------------------------------------------- |
| `/dashboard`         | pengguna   | agenda lintas kelas, tenggat, gabung kelas, kabar |
| `/dashboard`         | superadmin | antrean pengajuan, undangan admin, kondisi situs  |
| `/classes`           | semua      | cari, filter, dan buka kelas                      |
| `/classes/[classId]` | semua      | ringkasan, jadwal, materi, progress, anggota      |

Meja adalah keadaan "hari ini": pengguna baru yang belum punya kelas melihat
onboarding di halaman yang sama (masuk lewat kode undangan atau ajukan kelas).
Pengajuan butuh akun karena status dan riwayatnya terikat ke pengguna; CTA di
landing page mengarah ke `/login`.

Superadmin **tidak** dialihkan keluar dari `/dashboard`. Peran website dan
peran kelas itu dua hal berbeda, jadi superadmin yang juga anggota kelas tetap
punya agenda pribadi; yang berubah hanya isi halaman.

Subkelas (mata kuliah) **bukan** rute terpisah. Ia data di dalam kelas dan dipakai sebagai filter
materi serta label jadwal dan tugas, jadi tidak ada `/classes/123/subclasses/456`.

## Rencana susunan berikutnya

```
(app)/
  classes/request/page.tsx            /classes/request
  classes/join/page.tsx               /classes/join
```

Folder berkurung siku seperti `[classId]` berarti bagian alamat itu berubah-ubah (id kelas).

## Izin

Pengunjung yang belum login dipindahkan ke `/login` oleh `src/proxy.ts`. Itu hanya pengalihan
cepat. Pengaman sesungguhnya ada di controller: halaman yang mengambil data memanggil controller
lewat `untukHalaman()` dari `@/server/permissions`, dan bila ditolak pengguna dipindahkan ke
`/login`, halaman 404, atau `/forbidden`. Halaman di grup ini masih memakai data contoh, jadi
belum memanggil controller.

Untuk tahu tombol mana yang ditampilkan, pakai `GET /api/v1/classes/{classId}/access`
(`docs/api.md` bagian "Peran di sebuah kelas") lalu terjemahkan dengan `hakKelas()` dari
`src/lib/akses-kelas.ts`. Jangan menulis `if (role === ...)` di komponen. Menyembunyikan tombol
hanya tampilan; server tetap memeriksa izin di setiap endpoint. Lihat
`src/server/permissions/README.md`.

## Sesi di navbar

Komponen di `src/components` tidak boleh menyentuh backend (aturan folder di `eslint.config.mjs`).
Karena itu navbar **tidak** membaca sesi sendiri: halaman yang membaca sesi lewat
`ambilSesiSaya()` (`@/server/auth`) lalu mengirim `pengguna` sebagai prop ke `Navbar`.

Karena membaca cookie, bagian navbar yang butuh sesi harus berada di dalam `<Suspense>`; dengan
begitu sisa halaman tetap bisa diprerender. Pola ini dipakai di `/classes`, `/profile`, dan kelima halaman kelas (lewat `RangkaKelasSesi`).

## Profil

`/profile` berbentuk buku terbuka. Sisi depan berisi identitas (avatar, nama, email, NIM, peran
kelas), sisi belakang berisi catatan kelas dan shortcut. Satu lembar berporos di punggung buku;
tombol di samping buku membaliknya. Di bawah 900px lembar tidak diputar secara fisik, melainkan
kedua sisi ditumpuk dan sticky note mengganti sisi yang terlihat.

- Identitas berasal dari sesi nyata.
- Daftar kelas, peran per kelas, dan catatan masih data contoh (`features/profil/data-contoh.ts`)
  sampai `GET /api/v1/classes` tersedia.
- NIM belum ada di kolom `users`; yang tampil "Belum diisi".
- **`/profile` adalah satu-satunya tempat keluar.** Tombol "Keluar dari akun" ada di halaman 1
  buku dan memanggil `DELETE /api/v1/session`. Di halaman lain, tombol kanan atas di navbar
  adalah tautan ke Meja, bukan tombol keluar.

## Tombol kanan di navbar

Semua halaman area login memakai pola yang sama:

| Halaman                               | Tombol kanan             |
| ------------------------------------- | ------------------------ |
| `/dashboard`                          | `Beranda` → `/`          |
| `/classes`, halaman kelas, `/profile` | `Meja` → `/dashboard`    |
| 404 dan `/forbidden`                  | `Ke Meja` → `/dashboard` |

Di `/dashboard` tombolnya `Beranda`, bukan `Meja`: tombol yang menunjuk halaman
yang sedang dibuka tidak ada gunanya.

Tombol aksi navbar memakai radius pil (`--ds-radius-pill`), sama dengan chip
profil di sebelahnya, supaya keduanya terbaca satu kelompok.

Peta lengkap rute ada di skill `klass-halaman`.
