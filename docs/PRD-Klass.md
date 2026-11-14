# PRD Klass

Nov 13, 2026 · @Naufal Aqil

## 1. Ringkasan Produk

Klass adalah platform komunitas untuk mengelola kelas dan kelompok, tempat anggota sendiri yang mengatur materi, jadwal, tugas, dan komunikasi dalam satu tempat. Status dokumen: draf v0.1.

Berbeda dari LMS institusional (Google Classroom, Canvas, Moodle) yang dikelola dari atas oleh institusi, Klass dikelola dari bawah oleh admin kelas dan penanggung jawab (PJ) yang berasal dari anggota sendiri. Konsepnya umum: sebuah "kelas" bisa berupa kelas kuliah, organisasi, atau komunitas apa pun, tidak terbatas pada pendidikan.

Kelas dapat saling berkolaborasi lewat community untuk siaran (broadcast) satu arah, sehingga informasi bisa menjangkau banyak kelas tanpa harus membuat grup baru.

- **Visi:** satu tempat yang rapi untuk semua hal yang sekarang tercecer di grup chat dan folder drive.
- **Pengguna utama:** mahasiswa dan pengurus kelas, lalu organisasi dan komunitas lain.
- **Pembeda:** dikelola komunitas (bottom-up), ada jaringan antar kelas, dan setiap kelas bisa dikustomisasi tampilannya.

## 2. Masalah dan Peluang

Pengelolaan kelas dan komunitas saat ini bertumpu pada grup chat, folder drive, dan spreadsheet yang terpisah-pisah, sehingga informasi penting mudah tenggelam. Gambaran ini berasal dari pengamatan umum, bukan hasil riset pengguna, dan perlu divalidasi lewat wawancara.

- **Informasi tenggelam:** pengumuman, materi, dan deadline bercampur dengan obrolan biasa.
- **Materi tercecer:** file dari dosen atau pengurus tersebar di banyak tempat dan sulit dicari kembali.
- **Pengingat bergantung pada orang:** deadline hanya diingat kalau ada yang rajin mengingatkan.
- **Tidak ada struktur peran:** siapa penanggung jawab mata kuliah atau divisi tidak tercatat jelas.
- **Antar kelas terputus:** informasi lintas kelas atau lintas organisasi harus disebar manual ke tiap grup.

**Peluang:** LMS besar dibuat top-down oleh institusi, sedangkan kebutuhan harian ada di tingkat kelas yang dikelola anggotanya sendiri. Klass mengisi celah itu dengan struktur kelas, peran per-scope, dan jaringan antar kelas.

## 3. Tujuan dan Metrik Keberhasilan

Tujuan versi awal: membuktikan bahwa satu kelas mau memakai Klass sebagai pengganti grup chat untuk materi, jadwal, dan tugas. Target angka sengaja belum diisi dan ditetapkan setelah pilot, karena belum ada data dasar.

| Metrik               | Definisi                                                                         | Target                   |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------ |
| Kelas aktif          | Kelas dengan minimal satu aktivitas (materi, tugas, atau postingan) dalam 7 hari | Ditetapkan setelah pilot |
| Aktivasi anggota     | Anggota yang membuka Klass minimal sekali seminggu                               | Ditetapkan setelah pilot |
| Tugas tepat waktu    | Tugas yang punya pengingat dan dibuka anggota sebelum deadline                   | Ditetapkan setelah pilot |
| Retensi kelas        | Kelas yang masih aktif pada semester berikutnya                                  | Ditetapkan setelah pilot |
| Jaringan antar kelas | Community yang terbentuk dan broadcast yang terkirim                             | Ditetapkan setelah pilot |

## 4. Pengguna dan Role

Role disimpan per-scope, bukan global, kecuali superadmin. Satu orang bisa menjadi siswa biasa di satu kelas dan PJ di mata kuliah lain.

| Role            | Scope                            | Cara mendapatkan                                       | Hak utama                                                                                                                                                                                    |
| --------------- | -------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Superadmin      | Seluruh website                  | Ditetapkan manual oleh pengelola                       | Menyetujui pengajuan kelas, menunjuk admin lewat email, mengelola poster, mereset tema yang disalahgunakan, melihat konten kelas (kecuali chat pribadi) untuk moderasi, menghapus data kelas |
| Admin kelas     | Satu kelas                       | Pengaju kelas yang disetujui, atau ditunjuk superadmin | Mengatur kelas dan tema, membuat subkelas, menunjuk PJ, kick dan ban anggota, kolaborasi antar kelas, mengirim broadcast                                                                     |
| PJ              | Satu subkelas (mis. mata kuliah) | Ditunjuk admin kelas                                   | Mengirim materi, mengatur jadwal mingguan, membuat tugas dengan deadline dan pengingat                                                                                                       |
| Anggota (siswa) | Satu kelas                       | Join terbuka                                           | Membaca, menulis catatan, memposting, chat kelas, chat pribadi dengan sesama anggota kelas                                                                                                   |

Admin community tidak disimpan sebagai role terpisah. Seseorang otomatis menjadi admin community jika ia admin dari kelas yang menjadi anggota community tersebut.

## 5. Ruang Lingkup

Versi awal (MVP) fokus pada struktur kelas dan alur akademik harian; fitur sosial dan jaringan menyusul bertahap.

**Masuk versi awal (MVP)**

- Autentikasi, profil, dan tiga level role (superadmin, admin kelas, anggota) plus PJ per subkelas
- Pengajuan kelas, persetujuan superadmin, dan penunjukan admin lewat email
- Join kelas terbuka, kick dan ban oleh admin kelas
- Subkelas, materi, jadwal mingguan, tugas dengan deadline dan pengingat
- Kustomisasi kelas: warna, logo, background, banner
- Poster di halaman utama

**Tahap berikutnya**

- Postingan kelas, kumpulan catatan, kas kelas, absensi QR
- Chat kelas dan chat pribadi (setelah ada moderasi)
- Community, kolaborasi antar kelas (request dan accept), dan broadcast satu arah

**Di luar cakupan**

- Aplikasi mobile native (PWA lebih dulu)
- Penilaian dan nilai resmi, ujian online, video conference
- Pembayaran dan monetisasi

## 6. Kebutuhan Fungsional

Prioritas: P0 wajib di MVP, P1 tahap berikutnya, P2 menyusul.

| ID  | Modul           | Kebutuhan                                                                                                                                                  | Prioritas |
| --- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| F1  | Akun            | Login dengan Google atau magic link; profil dengan nama dan avatar                                                                                         | P0        |
| F2  | Kelas           | Admin mengajukan pembuatan kelas; status diajukan, disetujui, ditolak, dibuka                                                                              | P0        |
| F3  | Kelas           | Superadmin menyetujui atau menolak, dan menunjuk admin lewat email; undangan aktif saat orang itu login pertama                                            | P0        |
| F4  | Kelas           | Join terbuka tanpa persetujuan dan tanpa batas anggota; admin dapat menetapkan batas anggota sebagai opsi; kelas tidak terdaftar hanya lewat kode undangan | P0        |
| F5  | Kelas           | Admin dapat kick anggota, dengan opsi ban dan unban; kelas wajib punya minimal satu admin                                                                  | P0        |
| F6  | Kustomisasi     | Admin mengatur tampilan kelas (warna, logo, background, banner) lewat satu field style berformat JSON; kontras teks dicek otomatis                         | P0        |
| F7  | Subkelas        | Admin membuat subkelas dan menunjuk satu atau lebih PJ                                                                                                     | P0        |
| F8  | Materi          | PJ dan admin mengunggah materi (file atau tautan)                                                                                                          | P0        |
| F9  | Jadwal          | PJ mengatur jadwal mingguan berulang per subkelas                                                                                                          | P0        |
| F10 | Tugas           | PJ membuat tugas dengan deadline dan pengingat (mis. 3 hari dan 1 hari sebelumnya), dikirim lewat notifikasi PWA (web push)                                | P0        |
| F11 | Poster          | Superadmin mengelola poster di halaman utama                                                                                                               | P0        |
| F12 | Postingan       | Anggota memposting, berkomentar, dan bereaksi; admin dapat menghapus                                                                                       | P1        |
| F13 | Catatan         | Anggota menulis catatan kelas dengan editor teks kaya                                                                                                      | P1        |
| F14 | Chat            | Chat kelas dan chat pribadi, hanya antar anggota yang berbagi kelas                                                                                        | P1        |
| F15 | Community       | Admin mengajukan kolaborasi; admin kelas tujuan menerima atau menolak; community terbentuk dari kelas yang menerima                                        | P1        |
| F16 | Broadcast       | Semua admin kelas yang bergabung ke community dapat mengirim broadcast satu arah; penerima hanya membaca, tanpa komentar                                   | P1        |
| F17 | Kas dan absensi | Pencatatan iuran dan pengeluaran; absensi QR per pertemuan                                                                                                 | P2        |
| F18 | Kalender        | Ekspor jadwal dan deadline ke kalender (.ics)                                                                                                              | P2        |

## 7. Kebutuhan Non-Fungsional

- **Keamanan akses:** semua aturan "siapa boleh melihat apa" ditegakkan di sisi server lewat satu lapisan izin terpusat di kode (MySQL tidak punya Row Level Security), bukan hanya di antarmuka, dan diuji per role. Perubahan sensitif (join, kick, persetujuan, kolaborasi) hanya lewat fungsi server.
- **Privasi:** superadmin dapat melihat postingan, catatan, dan chat kelas untuk moderasi; chat pribadi (DM) tertutup bagi superadmin. Karena itu kebijakan privasi harus menyatakannya dengan jelas dan akses superadmin sebaiknya dicatat (usulan). Data pribadi dikelola sesuai UU Pelindungan Data Pribadi (UU PDP).
- **Moderasi:** fitur report, block, dan penghapusan konten oleh admin kelas sudah ada sebelum chat dan postingan dibuka.
- **Penyalahgunaan kustomisasi:** unggahan gambar dibatasi ukuran dan format; superadmin dapat mereset tema kelas.
- **Responsif dan PWA:** nyaman di HP, bisa di-install, mendukung notifikasi web push.
- **Keandalan pengingat:** pengingat deadline dikirim oleh job terjadwal dan tidak dikirim ganda.
- **Aksesibilitas:** kontras warna dan ukuran teks terjaga walau tema kelas diubah.
- **Performa dan skala:** target angka (waktu muat, jumlah pengguna serentak) ditetapkan setelah pilot.

* **Retensi data:** data kelas disimpan tanpa batas waktu, termasuk kelas yang diarsipkan; hanya superadmin yang dapat menghapusnya.
* **Hosting:** server pribadi dengan Docker Compose, sehingga butuh HTTPS, backup database terjadwal ke lokasi di luar server, dan pembaruan keamanan rutin.

## 8. Alur Pengguna Utama

&#91;embedded content: alur utama · 7 langkah, 1 keputusan\]

Pengajuan yang ditolak berhenti di situ; yang disetujui membuka kelas dan menjadikan pengaju admin. Setelah itu siswa bisa join kapan saja, sementara admin membuat subkelas, PJ mengatur materi, jadwal, dan tugas, dan pengingat deadline dikirim ke anggota.

## 9. Model Data dan Aturan Akses

Skema lengkap ada di berkas `schema.sql` (PostgreSQL); berkas ini masih untuk PostgreSQL, sedangkan database yang dipilih sekarang MySQL, sehingga skema perlu ditulis ulang (tanpa Row Level Security dan fungsi PL/pgSQL; aturan akses pindah ke kode). Hierarkinya: Community berisi Kelas, Kelas berisi Subkelas; tidak ada data institusi (kampus, fakultas) sebagai level atau filter. Karena hosting pindah ke server pribadi, skema masih perlu disesuaikan (tanpa Supabase Auth); lihat bagian 14.

| Kelompok  | Tabel utama                                                                        | Aturan kunci                                                                                   |
| --------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Website   | profiles, posters                                                                  | Hanya superadmin yang menulis poster; `is_superadmin` tidak bisa diubah pengguna               |
| Kelas     | classes, class\_members, class\_bans, class\_admin\_invites                        | Join lewat fungsi `join_class`; kick lewat `kick_member`; kelas wajib punya minimal satu admin |
| Subkelas  | subclasses, subclass\_pj, schedules, materials, assignments, assignment\_reminders | Admin kelas atau PJ yang mengelola; anggota hanya membaca                                      |
| Interaksi | notes, posts, post\_comments, post\_reactions, chat\_rooms, messages               | Hanya anggota kelas; chat pribadi hanya antar pengguna yang berbagi kelas                      |
| Community | communities, community\_classes, community\_requests, broadcasts, broadcast\_reads | Admin community diturunkan dari admin kelas anggota; broadcast tanpa tabel komentar            |

Pengajuan kelas melewati status `pending`, `active`, `rejected`, `archived`. Kustomisasi tampilan disimpan di satu field style (JSON) pada kelas, berisi warna, logo, background, dan banner, dengan batas ukuran agar tidak disalahgunakan; istilah kustom disimpan terpisah.

## 10. Rekomendasi Tech Stack

Prinsipnya: satu developer atau tim kecil, biaya rendah, dan role per-scope harus aman. Diperbarui sesuai keputusan: Next.js full-stack, database MySQL, di-host di server pribadi dengan Docker Compose. Pilihan lainnya masih usulan.

| Lapisan          | Pilihan                                                                        | Catatan                                                                                           |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Aplikasi         | Next.js (App Router), TypeScript, Tailwind, shadcn/ui, dibuat sebagai PWA      | Satu kode untuk antarmuka dan backend; tema kelas diterapkan lewat CSS variables dari field style |
| Database         | MySQL dalam container                                                          | Skema perlu ditulis ulang untuk MySQL; ORM seperti Drizzle atau Prisma (usulan)                   |
| Auth             | Auth.js atau Better Auth, login Google                                         | Menggantikan Supabase Auth; magic link email ditunda karena butuh SMTP (asumsi)                   |
| Realtime         | Layanan WebSocket terpisah (mis. Socket.IO) di Compose                         | Untuk chat dan feed; umumnya dipisah dari proses Next.js                                          |
| Job pengingat    | Worker terjadwal sederhana (cron di container), atau BullMQ bila butuh antrean | Membaca `assignment_reminders` lalu mengirim web push; BullMQ butuh Redis, worker sederhana tidak |
| Notifikasi       | Web Push (PWA)                                                                 | Email dan WhatsApp ditunda                                                                        |
| Penyimpanan file | Volume lokal di server untuk MVP                                               | Pindah ke penyimpanan kompatibel S3 bila file membesar                                            |
| Server           | Docker Compose: web, database, worker, realtime, reverse proxy (mis. Caddy)    | HTTPS otomatis; backup pg\_dump terjadwal ke luar server                                          |

MySQL tidak punya Row Level Security, jadi aturan akses ditegakkan di kode Next.js lewat satu lapisan izin terpusat yang diuji per role.

## 11. Analisis Kompetitor

Pesaing sebenarnya adalah kombinasi grup WhatsApp, Google Drive, dan Discord yang dipakai mahasiswa sekarang; LMS formal adalah pesaing kedua. Ringkasan berikut berasal dari cuplikan hasil pencarian per 13 November 2026, belum dibuka penuh satu per satu, dan harga bersifat perkiraan.

| Kompetitor                    | Posisi                                                                                                   | Celah untuk Klass                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Google Classroom              | Gratis, terintegrasi erat dengan Google Workspace, kuat di K-12, tetapi bergantung pada ekosistem Google | Tidak ada fitur komunitas dan jaringan antar kelas     |
| Canvas                        | LMS lengkap, harga kustom (kisaran $5 sampai $25 per siswa per tahun menurut satu sumber)                | Mahal dan kompleks untuk kelas yang dikelola mahasiswa |
| Moodle                        | Open source, tetapi harus di-host sendiri; dipakai kampus besar                                          | Butuh tim IT, antarmuka terasa kaku                    |
| Microsoft Teams for Education | Alat kolaborasi, bukan pengganti LMS penuh                                                               | Struktur kelas dan mata kuliah tidak rapi              |
| Ruangguru, Quipper            | E-learning lokal berfokus kurikulum nasional SD sampai SMA                                               | Berbasis konten, bukan manajemen kelas kuliah          |
| WhatsApp, Drive, Discord      | Alat yang dipakai sehari-hari (pengetahuan umum, bukan dari pencarian)                                   | Pesaing utama; Klass harus lebih mudah dari ini        |

Saya tidak menemukan kompetitor lokal yang berfokus pada manajemen kelas berbasis komunitas mahasiswa, tetapi pencarian terbatas; cek langsung ke pengguna dan toko aplikasi.

**Sumber:** [AhaSlides](https://ahaslides.com/blog/best-google-classroom-alternatives/), [Teachfloor](https://www.teachfloor.com/blog/canvas-vs-google-classroom), [Edsby](https://www.edsby.com/google-classroom-alternatives-for-district-wide-management/commentary/), [Wise](https://www.wise.live/blog/?p=4452), [HashMicro](https://www.hashmicro.com/id/blog/e-learning-menjadi-trend-baru-untuk-pendidikan-indonesia)

## 12. Roadmap dan Fase Rilis

&#91;embedded content: roadmap · 4 fase, 3 gerbang\]

Tanggal belum ditetapkan dan gerbang antar fase adalah usulan: chat baru dibuka setelah report dan block berfungsi, dan fitur jaringan baru berguna kalau sudah banyak kelas aktif.

## 13. Risiko dan Mitigasi

| Risiko                                                          | Dampak                                      | Mitigasi                                                                                    |
| --------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Kelas tidak mau pindah dari grup chat                           | Adopsi rendah                               | Mulai dari satu kelas pilot; pengingat dan jadwal harus lebih berguna daripada chat         |
| Join terbuka dimasuki orang tak dikenal                         | Kelas privat bocor                          | Opsi kelas tidak terdaftar dengan kode undangan; kick dengan ban                            |
| Konten tidak pantas di postingan, chat, atau tema               | Reputasi dan risiko hukum                   | Report, block, penghapusan oleh admin, reset tema oleh superadmin                           |
| Logo institusi dipakai tanpa izin                               | Sengketa merek                              | Tombol report dan kewenangan superadmin                                                     |
| Admin menumpuk di superadmin (bottleneck)                       | Pertumbuhan lambat                          | Admin mengajukan kelas sendiri; superadmin hanya menyetujui                                 |
| Pengingat gagal atau terkirim ganda                             | Kepercayaan turun                           | Job terjadwal dengan penanda `sent_at` dan pemantauan error                                 |
| Aturan akses salah                                              | Kebocoran data                              | Satu lapisan izin terpusat di kode, diuji per role sebelum rilis                            |
| Biaya naik saat kelas bertambah                                 | Anggaran jebol                              | Pantau penyimpanan dan realtime; siapkan R2 dan layanan realtime khusus                     |
| Server pribadi mati, tanpa backup, atau diretas                 | Data kelas hilang atau bocor                | Backup database terjadwal ke luar server, HTTPS, pembaruan rutin, pemantauan uptime         |
| Superadmin dapat melihat konten kelas                           | Kepercayaan pengguna dan kepatuhan UU PDP   | Nyatakan di kebijakan privasi, catat akses superadmin, batasi siapa yang menjadi superadmin |
| Web push di iPhone hanya jalan jika PWA dipasang ke layar utama | Pengingat tidak sampai ke sebagian pengguna | Petunjuk pemasangan di aplikasi; email atau WhatsApp sebagai cadangan di tahap berikutnya   |

## 14. Pertanyaan Terbuka

Delapan pertanyaan awal sudah dijawab; jawabannya tercatat di daftar berikut dan sudah diterapkan ke bagian terkait. Yang masih terbuka ada di bawah daftar.

- [x] Apakah superadmin boleh melihat konten kelas untuk moderasi, atau hanya lewat mekanisme khusus? superadmin boleh melihat konten kelas.
- [x] Siapa yang boleh mengirim broadcast: semua admin kelas anggota, atau hanya pendiri community? semua admin kelas yang bergabung ke community
- [x] Apakah nama internal `classes` dan `subclasses` diganti ke istilah netral (mis. `spaces`)? Ya, bisa
- [x] Apakah perlu data institusi (kampus, fakultas) sebagai filter, walau konsepnya umum? Tidak perlu
- [x] Kanal pengingat awal: web push dan email saja, atau langsung WhatsApp? Untuk sekarang menggunakan PWA.
- [x] Siapa kelas pilot dan berapa anggotanya? Apa maksud kelas pilot? tidak ada batasan anggota, namun berikan opsi saja
- [x] Apakah ada rencana monetisasi (slot poster, sponsor) pada tahap awal? belum ada
- [x] Seberapa lama data kelas disimpan setelah kelas diarsipkan? Tidak terbatas, namun dapat dihapus oleh superadmin

### Keputusan yang sudah diterapkan

| Keputusan                                                                | Diterapkan di            |
| ------------------------------------------------------------------------ | ------------------------ |
| Superadmin boleh melihat konten kelas                                    | Bagian 4, 7, 13          |
| Semua admin kelas yang bergabung ke community boleh mengirim broadcast   | F16                      |
| Nama internal tabel boleh diganti ke istilah netral                      | Menunggu nama (di bawah) |
| Tanpa data institusi (kampus, fakultas)                                  | Bagian 9                 |
| Pengingat lewat PWA (web push)                                           | F10, bagian 7 dan 10     |
| Tanpa batas anggota; batas hanya sebagai opsi                            | F4                       |
| Belum ada monetisasi                                                     | Bagian 5                 |
| Data disimpan tanpa batas; superadmin dapat menghapus                    | Bagian 4 dan 7           |
| Kustomisasi lewat satu field style (JSON)                                | F6 dan bagian 9          |
| Next.js full-stack, database MySQL, server pribadi dengan Docker Compose | Bagian 10                |
| Chat pribadi (DM) tertutup bagi superadmin                               | Bagian 4 dan 7           |
| Tahap kelas pilot dipertahankan sebagai gerbang                          | Bagian 12                |
