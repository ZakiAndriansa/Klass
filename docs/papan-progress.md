# Papan Progress Kelas

Papan tugas per kelas: PJ menaruh tugas, setiap anggota memperbarui progresnya sendiri, dan PJ
melihat siapa yang belum mulai, sedang berjalan, atau sudah selesai.

Dipakai di rute `/classes/[classId]/progress`. Kode:

| Berkas                                              | Isi                                                  |
| --------------------------------------------------- | ---------------------------------------------------- |
| `src/app/(app)/classes/[classId]/progress/page.tsx` | Server Component: ambil kelas, kirim potongan props  |
| `src/components/features/kelas/papan-progress.tsx`  | Client Component: papan, form tugas, tab anggota     |
| `src/components/features/kelas/data-contoh.ts`      | tipe `TugasProgress`, `AnggotaProgress`, data contoh |
| `src/app/styles/klass/kelas.css`                    | gaya `.papan-*`, `.papan-kolom-*`, `.papan-kartu`    |

Papan ini **privat per kelas**. Tidak ada rute global `/kalender` atau `/progress`; satu kelas satu
papan, alamatnya selalu di bawah kelas yang bersangkutan.

## Bentuk data

```ts
type StatusTugas = "todo" | "doing" | "done";

type TugasProgress = {
  id: string;
  judul: string;
  mataKuliah: string; // nama, bukan id — cukup untuk label kartu
  deadline: string; // teks siap tampil, mis. "28 Nov 2026"
  prioritas: "Rendah" | "Sedang" | "Tinggi";
  status: StatusTugas; // status awal pemilik papan
  deskripsi?: string;
};

type AnggotaProgress = {
  id: string;
  nama: string;
  inisial: string;
  peran: "Admin kelas" | "PJ" | "Anggota";
  mataKuliah?: string; // hanya PJ, mis. "PJ Basis Data"
  bergabung: string;
  /** Status per id tugas. Tugas yang tidak ada di peta dianggap "todo". */
  status: Record<string, StatusTugas>;
};
```

Tugas disimpan sekali per kelas, bukan per anggota. Progres anggota adalah peta
`tugasId → status`; bentuk ini membuat jumlah tugas dan jumlah baris progres tidak bisa berbeda,
dan tugas baru otomatis berstatus `todo` untuk semua orang tanpa migrasi data.

`status` pada `TugasProgress` hanya dipakai sebagai isi awal papan milik pengguna yang sedang
melihat. Sumber kebenaran progres tetap peta status.

## Peran

| Peran       | Melihat                      | Boleh                                                   |
| ----------- | ---------------------------- | ------------------------------------------------------- |
| Anggota     | papan miliknya               | ubah status tugasnya sendiri (drag atau `select`)       |
| PJ          | papan miliknya + tab anggota | semua di atas, tambah tugas, hapus tugas, lihat agregat |
| Admin kelas | sama dengan PJ               | sama dengan PJ                                          |

Aturan ini ditegakkan di komponen lewat `peran === "PJ" || peran === "Admin kelas"`. Tab "Progres
anggota", tombol "Tambah tugas", dan tombol hapus tidak dirender untuk anggota biasa — bukan hanya
disembunyikan dengan CSS. Saat API tersedia, aturan yang sama **wajib** diperiksa ulang di server;
menyembunyikan tombol bukan pengaman.

Anggota hanya mengubah barisnya sendiri. Papan tidak menyediakan jalur untuk mengubah status orang
lain, jadi tidak ada risiko salah klik pada kartu rekan sekelas.

## Arti progres

- **Persen pribadi** = tugas berstatus `done` ÷ seluruh tugas kelas, dibulatkan. Papan kosong
  menghasilkan `0%`, bukan pembagian nol.
- **Tuntas** = semua tugas berstatus `done`.
- **Sedang berjalan** = persen di atas 0 tetapi belum semua selesai.
- **Belum mulai** = persen 0.
- **Rekap per tugas** = berapa anggota `done`, `doing`, dan `todo` pada tugas itu.

Persen selalu dihitung ulang setiap render dari daftar tugas yang sedang tampil, sehingga tugas yang
baru ditambahkan langsung menurunkan persen semua orang sampai dikerjakan. Itu disengaja: progres
mengukur kelas, bukan riwayat.

## Interaksi

- **Drag antar-kolom** memindahkan status. Kartu memakai `draggable`, kolom menerima `dragover` dan
  `drop`; kolom tujuan ditandai `is-drag-over` selama kartu melayang di atasnya.
- **`select` status** ada di kaki setiap kartu. Ini jalur setara untuk keyboard dan layar sentuh —
  drag bukan satu-satunya cara.
- **Tambah tugas** membuka form di puncak kolom "Belum mulai". Judul wajib; tenggat dan prioritas
  punya nilai awal supaya form bisa dikirim cepat.
- **Hapus tugas** hanya untuk PJ/admin, dengan `aria-label` yang menyebut judul tugasnya.
- Kolom kosong menampilkan kalimat pemandu, bukan area kosong tanpa keterangan.

Kartu memakai `<article>`, judulnya `<h3>`, dan tiap kolom `<section>` dengan `aria-labelledby` ke
judul kolom. Kedua tampilan (papan dan agregat anggota) memakai `aria-pressed` pada tombol
pengalih, bukan peran `tab`, karena isinya tidak memakai pola fokus tab yang lengkap.

## Keadaan sekarang

Tugas dan status masih hidup di `useState`. Perubahan hilang saat halaman dimuat ulang; catatan di
bawah papan menyebutkan itu ke pengguna. Tidak ada penyimpanan lokal dan tidak ada API.

`TODO(api)` di `papan-progress.tsx` menandai tempat penggantian: state awal dari server, lalu setiap
aksi memanggil endpoint.

## Endpoint yang direncanakan

Kontrak resmi tetap di `docs/api.md` (pemilik Ahmad dan Bintang); daftar ini usulan bentuk agar
frontend dan backend tidak menebak-nebak. Semua di bawah `/api/v1`.

| Metode   | Alamat                                    | Siapa     | Guna                           |
| -------- | ----------------------------------------- | --------- | ------------------------------ |
| `GET`    | `/classes/{classId}/tasks`                | anggota   | daftar tugas kelas             |
| `POST`   | `/classes/{classId}/tasks`                | PJ, admin | buat tugas                     |
| `PATCH`  | `/classes/{classId}/tasks/{taskId}`       | PJ, admin | ubah judul, tenggat, prioritas |
| `DELETE` | `/classes/{classId}/tasks/{taskId}`       | PJ, admin | hapus tugas beserta progresnya |
| `GET`    | `/classes/{classId}/progress`             | PJ, admin | progres semua anggota          |
| `GET`    | `/classes/{classId}/progress/me`          | anggota   | progres sendiri                |
| `PATCH`  | `/classes/{classId}/progress/me/{taskId}` | anggota   | ubah status satu tugas sendiri |

Catatan untuk backend:

1. `PATCH .../progress/me/{taskId}` tidak menerima `userId`. Pemilik baris diambil dari sesi supaya
   anggota tidak bisa menulis progres orang lain meski menebak id.
2. Hapus tugas harus ikut menghapus baris progres untuk `taskId` itu (kunci asing dengan
   `ON DELETE CASCADE`), kalau tidak rekap menghitung tugas yang sudah tidak ada.
3. `GET .../progress` sebaiknya mengembalikan peta status per anggota, bukan satu baris per
   tugas per anggota, agar bentuknya sama dengan `AnggotaProgress`.
4. Batas `limit` bawaan berlaku untuk daftar tugas; satu kelas realistis berisi puluhan tugas,
   jadi satu halaman cukup.

## Yang belum dikerjakan

- Penyimpanan nyata dan pemeriksaan izin di server.
- Tenggat sebagai tanggal: sekarang berupa teks, belum bisa diurutkan atau dihitung sisa harinya.
- Pengingat deadline dan notifikasi PWA (F10, ditunda).
- Riwayat perubahan status dan siapa yang mengubahnya.
- Tugas berulang dan lampiran.

## Batasan yang diketahui

**Status HTTP halaman tidak dikenal.** Kelas atau materi yang tidak ada tetap menampilkan halaman
404 bergaya Klass, tetapi respons HTTP-nya `200`, bukan `404`. Penyebabnya: `notFound()` dipanggil di
dalam `<Suspense>` (wajib karena Cache Components), dan Next.js sudah mengirim status sebelum isi
selesai dirender. `dynamicParams = false` + `generateStaticParams` tidak bisa dipakai karena
konfigurasi itu ditolak saat Cache Components aktif.

Dampak nyata kecil: pengguna melihat halaman "tidak ditemukan", tetapi perayap mesin pencari dan
pemantauan melihat `200`. Saat data pindah ke API, penanganan bisa dibuat di route handler atau
middleware yang bisa menentukan status sebelum streaming. Sampai itu ada, jangan mengandalkan kode
status untuk pengujian; periksa judul halaman atau teks "Halaman tidak ditemukan".
