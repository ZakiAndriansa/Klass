---
name: klass-api
description: Membuat atau mengubah URL dan controller REST API Klass di Next.js Route Handlers, beserta validasi Zod, format respons, kode galat, dan kontraknya untuk tim frontend. Pakai saat diminta "buat endpoint", "buat API", "REST", "route handler", "controller", "URL backend", "CRUD", atau saat mengerjakan modul F1 sampai F11 di sisi server. Pemilik area ini Ahmad dan Bintang; semua PR backend harus disetujui Zaki.
argument-hint: "[modul atau endpoint, misalnya: materi POST]"
---

# URL dan Controller REST API Klass

Sumber: `docs/PRD-Klass.md` bagian 6. Prinsip desain umum ada di skill `api-design-principles`; berkas ini berisi aturan khusus Klass dan menang bila keduanya berbeda.

## Pembagian lapisan

| Lapisan | Letak | Tugas | Pemilik |
| --- | --- | --- | --- |
| URL | `src/app/api/v1/**/route.ts` | Memetakan metode dan alamat ke satu fungsi controller, lalu membungkus hasilnya menjadi respons | Ahmad, Bintang |
| Controller | `src/server/controllers/<modul>.ts` | Validasi masukan, pemeriksaan izin, aturan bisnis, memanggil model, membentuk DTO | Ahmad, Bintang |
| Model | `src/server/models/<modul>.ts` | Semua query dan transaksi ke database | Fadlan |
| Skema | `src/server/db/schema/**` | Definisi tabel dan migrasi | Fadlan |

Berkas pendukung: `src/server/http/` berisi `ok()`, `fail()`, dan `handle()`; `src/types/api/<modul>.ts` berisi skema Zod dan tipe DTO yang dipakai juga oleh frontend.

Aturan batas:

1. URL dan controller tidak pernah mengimpor `db` atau menulis query. Butuh data berarti memanggil fungsi model.
2. Bila fungsi model yang dibutuhkan belum ada, minta ke Fadlan dengan menyebut masukan dan keluaran yang diinginkan. Jangan menulis query sendiri di controller sebagai jalan pintas.
3. Pemeriksaan izin dipanggil controller lewat `src/server/permissions` sebelum model disentuh (skill `klass-izin`).
4. Controller mengembalikan data biasa, bukan `Response`, supaya Server Component bisa memanggilnya langsung tanpa lewat HTTP.

## Pola

```ts
// src/app/api/v1/subkelas/[subclassId]/materi/route.ts   (URL)
export const POST = handle(async (req, { params }) => {
  const { subclassId } = await params;
  const materi = await buatMateri(subclassId, await req.json());
  return ok(materi, 201);
});
```

```ts
// src/server/controllers/materi.ts   (controller)
import "server-only";

export async function buatMateri(subclassId: string, masukan: unknown) {
  const input = buatMateriSchema.parse(masukan);        // 1. validasi
  const { user } = await requireSubclassManager(subclassId); // 2. izin
  const baris = await materiModel.buat({ subclassId, pengunggahId: user.id, ...input }); // 3. model
  return keMateriDto(baris);                            // 4. DTO
}
```

`params` berupa Promise pada Next.js versi sekarang, jadi selalu di-`await`. `handle()` menangkap galat Zod dan galat izin lalu mengubahnya menjadi respons sesuai tabel di bawah, sehingga `route.ts` tidak perlu `try` dan `catch`.

## Penamaan URL

1. Kata benda jamak, huruf kecil, tanda hubung bila dua kata: `/api/v1/kelas`, `/api/v1/kelas/{classId}/anggota`.
2. Sumber daya bersarang paling dalam dua tingkat: `/kelas/{classId}/subkelas`, lalu `/subkelas/{subclassId}/materi`.
3. Aksi yang bukan CRUD memakai sub-sumber-daya dengan POST: `POST /kelas/{classId}/join`, `POST /kelas/{classId}/anggota/{userId}/kick`, `POST /pengajuan-kelas/{id}/setujui`.
4. Daftar selalu berhalaman: `?page=1&limit=20`, batas atas `limit` 100.

## Format respons

Berhasil:

```json
{ "data": { }, "meta": { "page": 1, "limit": 20, "total": 57 } }
```

`meta` hanya ada pada daftar. Gagal:

```json
{ "error": { "code": "FORBIDDEN", "message": "Kamu tidak punya izin untuk aksi ini.", "details": null } }
```

| Status | `code` | Kapan |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Masukan tidak lolos Zod; `details` berisi galat per field |
| 401 | `UNAUTHORIZED` | Belum login |
| 403 | `FORBIDDEN` | Login tetapi tidak berhak |
| 404 | `NOT_FOUND` | Tidak ada, atau ada tetapi tidak boleh diketahui (kelas tidak terdaftar) |
| 409 | `CONFLICT` | Sudah menjadi anggota, kelas penuh, admin terakhir, dan sejenisnya |
| 500 | `INTERNAL_ERROR` | Galat tak terduga; rinciannya dicatat di server, tidak dikirim ke klien |

`message` berbahasa Indonesia dan layak ditampilkan ke pengguna. `code` berbahasa Inggris huruf besar dan stabil, karena frontend bercabang berdasarkan `code`.

## Aturan data

1. Jangan mengembalikan baris database mentah. Petakan ke DTO dan buang kolom yang tidak perlu (`is_superadmin`, email anggota lain, token).
2. Tanggal dikirim sebagai ISO 8601 UTC.
3. Field yang ditentukan server (`id`, `created_at`, `role`, `status`, pemilik) tidak pernah dibaca dari body.
4. Unggahan berkas (F8, logo dan banner F6) dibatasi ukuran dan jenisnya di controller sebelum disimpan.
5. Aksi yang mengubah lebih dari satu tabel dipanggil sebagai satu fungsi model yang menjalankan transaksi. Controller tidak merangkai beberapa pemanggilan model untuk satu perubahan yang harus utuh.

## Kontrak untuk frontend

Setiap endpoint baru dicatat di `docs/api.md` sebelum atau bersamaan dengan kodenya: metode, URL, siapa yang boleh, bentuk body, bentuk `data`, dan kode galat yang mungkin. Rehan, Darrel, dan Aqil bekerja dari berkas itu, jadi perubahan bentuk respons yang sudah dipakai harus diumumkan di PR.

## Pembagian modul

Supaya Ahmad dan Bintang tidak bertabrakan, satu modul dipegang satu orang dari URL sampai controller. Pembagian di bawah masih usulan; yang berlaku adalah pembagian yang ditetapkan Zaki sebagai lead backend:

| Ahmad | Bintang |
| --- | --- |
| F1 profil | F7 subkelas dan PJ |
| F2 dan F3 pengajuan kelas, persetujuan, undangan admin | F8 materi |
| F4 dan F5 join, kick, ban | F9 jadwal |
| F6 kustomisasi | F10 tugas dan pengingat |
| F11 poster | langganan web push |

## Sebelum membuka PR

1. Ada uji controller untuk jalur berhasil dan minimal satu penolakan izin.
2. `docs/api.md` sudah diperbarui.
3. Tidak ada `db`, query, atau pemeriksaan role yang ditulis tangan di `src/app/api/**` dan `src/server/controllers/**`.
4. `npm run lint`, `npm run typecheck`, dan `npm run test` lolos.
5. Minta review Zaki. PR backend tidak boleh digabung tanpa persetujuannya (skill `klass-pr`).
