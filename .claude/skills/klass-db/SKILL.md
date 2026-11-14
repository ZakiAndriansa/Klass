---
name: klass-db
description: Aturan arsitektur database dan model Klass dengan Drizzle dan MySQL. Pakai saat membuat atau mengubah tabel, kolom, relasi, indeks, migrasi, seed, fungsi model (query dan transaksi), atau saat menulis ulang schema.sql PostgreSQL ke MySQL. Kata pemicu "buat tabel", "tambah kolom", "skema", "model", "query", "migrasi", "relasi", "drizzle". Pemilik area ini Fadlan; semua PR backend harus disetujui Zaki.
---

# Database dan Model Klass

Sumber: `docs/PRD-Klass.md` bagian 4, 6, dan 9. Untuk sintaks Drizzle umum, lihat skill `drizzle-orm-expert`, tetapi contoh di sana banyak memakai PostgreSQL. Di proyek ini selalu pakai `drizzle-orm/mysql-core` dan `drizzle-orm/mysql2`.

## Letak berkas

```
src/server/db/
  index.ts            koneksi (pool mysql2) dan ekspor `db`
  schema/
    index.ts          ekspor ulang semua tabel
    website.ts        profiles, posters
    kelas.ts          classes, class_members, class_bans, class_admin_invites
    subkelas.ts       subclasses, subclass_pj, schedules, materials, assignments, assignment_reminders
    interaksi.ts      notes, posts, post_comments, post_reactions, chat_rooms, messages   (P1)
    community.ts      communities, community_classes, community_requests, broadcasts, broadcast_reads   (P1)
src/server/models/
  kelas.ts            query dan transaksi untuk kelas, anggota, ban, undangan
  subkelas.ts         subkelas dan PJ
  materi.ts, jadwal.ts, tugas.ts, poster.ts, profil.ts
drizzle/              migrasi hasil `npm run db:generate`
```

## Model

Model adalah satu-satunya lapisan yang mengimpor `db`. Ahmad dan Bintang menulis URL dan controller, lalu memanggil fungsi model; mereka tidak menulis query.

1. Satu berkas per modul, mengekspor satu objek, misalnya `materiModel` dengan fungsi `buat`, `cariPerId`, `daftarPerSubkelas`, `ubah`, `hapus`.
2. Fungsi model menerima nilai yang sudah divalidasi dan mengembalikan baris bertipe (`typeof materials.$inferSelect`) atau `null`. Model tidak tahu soal HTTP, sesi, atau role.
3. Model tidak memeriksa izin. Izin diperiksa controller sebelum model dipanggil (skill `klass-izin`). Fungsi pembaca keanggotaan yang dipakai lapisan izin juga berada di model.
4. Perubahan yang harus utuh ditulis sebagai satu fungsi model dengan `db.transaction`, misalnya `kelasModel.gabung`, `kelasModel.keluarkanAnggota`, `kelasModel.setujuiPengajuan`.
5. Aturan keutuhan data yang butuh transaksi dijaga di model dan dilaporkan dengan melempar `ConflictError`, misalnya menolak mengeluarkan admin terakhir atau menolak join saat kelas penuh.
6. Daftar selalu menerima `page` dan `limit` dan mengembalikan `{ baris, total }`.
7. Bila controller butuh fungsi baru, sepakati dulu nama, masukan, dan keluarannya, lalu tulis fungsinya di sini.

MVP hanya butuh `website.ts`, `kelas.ts`, dan `subkelas.ts` ditambah tabel auth dan langganan web push. Jangan membuat tabel P1 sebelum fasenya dibuka.

## Konvensi

1. Nama tabel dan kolom `snake_case` jamak, properti TypeScript `camelCase`. Nama `classes` dan `subclasses` dipakai sampai tim memutuskan istilah netral (PRD bagian 14); jangan mengganti sepihak.
2. Kunci utama `varchar(36)` berisi UUID yang dibuat di aplikasi (`$defaultFn(() => crypto.randomUUID())`). Alasannya: id pengguna dari Better Auth berupa string, dan skema asal memakai UUID.
3. Setiap tabel punya `created_at`; tabel yang bisa diubah punya `updated_at` dengan `.onUpdateNow()`. Simpan waktu dalam UTC, tampilkan WIB di antarmuka.
4. Status memakai `mysqlEnum`, misalnya status kelas `pending`, `active`, `rejected`, `archived`.
5. Setiap kunci asing ditulis eksplisit dengan aturan `onDelete`. Data kelas tidak dihapus berantai oleh aksi pengguna biasa; penghapusan permanen hanya oleh superadmin.
6. Tabel penghubung memakai kunci utama gabungan, misalnya `class_members (class_id, user_id)`.
7. Indeks untuk setiap kolom yang dipakai pada filter daftar: `class_id`, `subclass_id`, `user_id`, `due_at`, `sent_at`.

## Aturan data yang wajib dijaga skema

1. Role disimpan per scope: admin kelas pada `class_members.role`, PJ pada `subclass_pj`. Hanya `is_superadmin` yang global, dan kolom itu tidak pernah diterima dari masukan pengguna.
2. Tema kelas disimpan pada satu kolom `style` bertipe `json` di `classes` (warna, logo, background, banner). Bentuknya divalidasi Zod di controller dan ukurannya dibatasi.
3. `class_admin_invites` menyimpan email yang ditunjuk superadmin; undangan aktif saat pemilik email login pertama.
4. `class_bans` terpisah dari `class_members` agar ban tetap ada setelah anggota dikeluarkan.
5. `assignment_reminders` punya `remind_at` dan `sent_at`. Tambahkan kunci unik `(assignment_id, remind_at)` supaya pengingat tidak terkirim ganda.
6. Kelas tidak terdaftar punya `invite_code` unik; batas anggota berupa kolom opsional `member_limit` yang boleh kosong.

## Hal yang tidak ada di MySQL

| PostgreSQL di skema asal | Pengganti di Klass |
| --- | --- |
| Row Level Security | Lapisan izin di `src/server/permissions` (skill `klass-izin`) |
| Fungsi PL/pgSQL `join_class`, `kick_member` | Fungsi model dalam satu transaksi (`db.transaction`) |
| `uuid`, `gen_random_uuid()` | `varchar(36)` dengan UUID dari aplikasi |
| `jsonb` | `json` |
| `timestamptz` | `timestamp` dalam UTC |
| `RETURNING` | Buat id di aplikasi, lalu baca ulang bila perlu |
| Supabase Auth (`auth.users`) | Tabel Better Auth, dengan `profiles` merujuk ke id penggunanya |

Aturan "kelas wajib punya minimal satu admin" diperiksa di model dalam transaksi yang sama dengan perubahan role atau kick, bukan lewat trigger.

## Alur kerja perubahan skema

1. Ubah berkas di `src/server/db/schema/`.
2. `npm run db:generate`, lalu baca SQL hasilnya di `drizzle/` sebelum di-commit.
3. `npm run db:migrate` pada database lokal.
4. Jangan pernah mengubah berkas migrasi yang sudah masuk `main`. Buat migrasi baru.
5. Jangan memakai `drizzle-kit push` selain pada database lokal milik sendiri.
6. Kabari Ahmad dan Bintang bila perubahan mengubah masukan atau keluaran fungsi model yang dipakai controller, dan tulis ringkasannya di deskripsi PR.
7. Setiap perubahan skema harus disetujui Zaki sebagai lead backend sebelum digabung (skill `klass-pr`).

## Sebelum membuka PR

1. Migrasi berjalan dari database kosong sampai akhir tanpa galat.
2. Setiap tabel baru punya relasi Drizzle (`relations`) dan diekspor dari `schema/index.ts`.
3. Tidak ada aturan akses yang dititipkan di skema; aturan akses ada di kode.
