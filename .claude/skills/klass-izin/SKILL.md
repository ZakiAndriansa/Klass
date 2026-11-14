---
name: klass-izin
description: Lapisan izin terpusat Klass, yaitu aturan siapa boleh melihat dan mengubah apa per role dan per scope (superadmin, admin kelas, PJ, anggota). Pakai setiap kali menulis atau meninjau controller, endpoint, Server Component, atau Server Action yang membaca atau mengubah data kelas, dan saat menulis uji per role. Kata pemicu "izin", "permission", "role", "akses", "siapa boleh", "admin kelas", "PJ", "superadmin", "kick", "ban", "join".
---

# Lapisan Izin Klass

MySQL tidak punya Row Level Security, jadi PRD bagian 7 mewajibkan satu lapisan izin terpusat di kode, ditegakkan di server dan diuji per role. Menyembunyikan tombol di antarmuka bukan pengamanan.

## Letak

```
src/server/permissions/
  session.ts        getSession, requireUser
  kelas.ts          requireClassMember, requireClassAdmin
  subkelas.ts       requireSubclassManager (admin kelas atau PJ subkelas itu)
  superadmin.ts     requireSuperadmin
  *.test.ts         uji per role
```

Kelas galat (`UnauthorizedError`, `ForbiddenError`, `NotFoundError`) sudah ada di `src/server/http/errors.ts` dan diimpor dari `@/server/http`.

Semua pemeriksaan izin ada di folder ini. Controller memanggilnya sebelum memanggil model. Jangan menulis `if (user.role === ...)` di route handler, komponen, controller, atau model. Fungsi izin membaca keanggotaan lewat fungsi model, tidak lewat `db` langsung.

## Matriks hak

| Aksi | Superadmin | Admin kelas | PJ subkelas | Anggota | Bukan anggota |
| --- | --- | --- | --- | --- | --- |
| Mengajukan kelas | ya | ya | ya | ya | ya, asal login |
| Menyetujui atau menolak pengajuan, menunjuk admin lewat email | ya | tidak | tidak | tidak | tidak |
| Mengelola poster | ya | tidak | tidak | tidak | tidak |
| Melihat isi kelas | ya, untuk moderasi | ya | ya | ya | tidak |
| Mengatur kelas dan tema | reset tema saja | ya | tidak | tidak | tidak |
| Membuat subkelas, menunjuk PJ | tidak | ya | tidak | tidak | tidak |
| Kick, ban, unban | tidak | ya | tidak | tidak | tidak |
| Mengunggah materi, mengatur jadwal, membuat tugas | tidak | ya | ya, di subkelasnya | tidak | tidak |
| Join kelas terbuka | ya | ya | ya | ya | ya, asal login dan tidak di-ban |
| Menghapus data kelas permanen | ya | tidak | tidak | tidak | tidak |
| Membaca chat pribadi orang lain (P1) | tidak | tidak | tidak | tidak | tidak |

Catatan penting:

1. Role per scope. Orang yang sama bisa menjadi anggota di satu kelas dan PJ di subkelas lain. Selalu periksa terhadap `classId` atau `subclassId` yang diminta, bukan terhadap "role pengguna".
2. Admin community bukan role tersimpan. Ia diturunkan: admin dari kelas yang menjadi anggota community.
3. Superadmin boleh melihat postingan, catatan, dan chat kelas, tetapi tidak chat pribadi. Catat akses superadmin ke isi kelas (usulan PRD).
4. Kelas tidak terdaftar hanya bisa dimasuki dengan kode undangan. Bagi yang bukan anggota, kelas itu dijawab 404, bukan 403, supaya keberadaannya tidak bocor.
5. Kelas wajib punya minimal satu admin. Aksi yang akan menghabiskan admin harus ditolak.
6. `is_superadmin` tidak pernah diubah lewat endpoint mana pun.

## Pola pemakaian

```ts
// src/server/controllers/materi.ts
import "server-only";

export async function buatMateri(subclassId: string, masukan: unknown) {
  const input = buatMateriSchema.parse(masukan);
  const { user } = await requireSubclassManager(subclassId); // izin dulu
  return materiModel.buat({ subclassId, pengunggahId: user.id, ...input }); // baru model
}
```

Fungsi `require*` mengembalikan konteks (pengguna, keanggotaan) bila lolos dan melempar galat bila tidak. Route handler mengubah galat itu menjadi respons lewat helper di `src/server/http` (skill `klass-api`).

Perubahan sensitif (join, kick, ban, persetujuan, kolaborasi) dikerjakan satu fungsi controller yang memanggil satu fungsi model bertransaksi, tidak dirangkai dari beberapa pemanggilan di klien.

## Uji per role

Setiap fungsi `require*` dan setiap controller yang sensitif punya uji Vitest dengan satu kasus per kolom matriks: superadmin, admin kelas, PJ subkelas itu, PJ subkelas lain, anggota, pengguna yang di-ban, bukan anggota, dan tanpa login. Kasus "PJ subkelas lain" dan "admin kelas lain" paling sering terlupa dan paling sering bocor.

PR yang menambah aksi baru tanpa menambah baris pada matriks ini dan tanpa uji per role tidak boleh digabung. Perubahan pada matriks dan pada `src/server/permissions/**` hanya berlaku setelah disetujui Zaki sebagai lead backend.
