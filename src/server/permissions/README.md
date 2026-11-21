# src/server/permissions

**Pemilik:** Zaki · **Reviewer wajib:** Zaki

Tempat aturan "siapa boleh melakukan apa". Semua pemeriksaan peran ada di folder ini. Controller, `route.ts`, halaman, dan komponen **tidak** menulis `if (role === ...)` sendiri.

| Berkas          | Isi                                                                 |
| --------------- | ------------------------------------------------------------------- |
| `index.ts`      | Pintu masuk folder. Kode lain mengimpor dari `@/server/permissions` |
| `class.ts`      | Izin tingkat kelas dan subkelas                                     |
| `superadmin.ts` | Izin superadmin                                                     |
| `page.ts`       | Penjaga untuk halaman (Server Component)                            |

## Untuk controller

Panggil satu fungsi `require...` setelah validasi dan sebelum model:

```ts
import { requireClassAdmin } from "@/server/permissions";

export async function createSubclass(classId: string, masukan: unknown) {
  const input = createSubclassSchema.parse(masukan); // 1. validasi
  await requireClassAdmin(classId); // 2. izin
  const baris = await subclassModel.create({ classId, name: input.name }); // 3. model
  // 4. bentuk DTO
}
```

Bila lolos, fungsi mengembalikan `{ user, classData, role }`. Bila tidak, fungsi melempar galat dan `handle()` mengubahnya menjadi respons. Controller tidak perlu `try` dan `catch`.

| Fungsi                                 | Siapa yang lolos                         | Dipakai untuk                        |
| -------------------------------------- | ---------------------------------------- | ------------------------------------ |
| `requireAuth()` (dari `@/server/auth`) | Siapa saja yang sudah login              | Profil, mengajukan kelas, gabung     |
| `requireClassMember(classId)`          | Anggota kelas itu, atau superadmin       | Melihat isi kelas                    |
| `requireClassAdmin(classId)`           | Admin kelas itu                          | Atur kelas, subkelas, PJ, kick, ban  |
| `requireSubclassMember(subclassId)`    | Anggota kelasnya, atau superadmin        | Melihat materi, jadwal, tugas        |
| `requireSubclassManager(subclassId)`   | Admin kelasnya, atau PJ subkelas **itu** | Mengubah materi, jadwal, tugas       |
| `requireSuperadmin()`                  | Superadmin                               | Pengajuan kelas, poster, hapus kelas |

Jawaban saat ditolak:

| Keadaan                                          | Status | `code`         |
| ------------------------------------------------ | ------ | -------------- |
| Belum login                                      | 401    | `UNAUTHORIZED` |
| Kelas tidak ada, atau masih berupa pengajuan     | 404    | `NOT_FOUND`    |
| Bukan anggota, kelasnya tidak terdaftar (privat) | 404    | `NOT_FOUND`    |
| Bukan anggota, kelasnya terdaftar                | 403    | `FORBIDDEN`    |
| Anggota, tetapi perannya kurang                  | 403    | `FORBIDDEN`    |
| Mengubah kelas yang sudah diarsipkan             | 409    | `CONFLICT`     |

Hal yang sering keliru:

1. **Peran berlaku per kelas.** Yang diperiksa selalu `classId` atau `subclassId` dari URL, bukan "peran pengguna".
2. **Superadmin bukan admin kelas.** Superadmin boleh melihat isi kelas untuk moderasi, tetapi `requireClassAdmin` dan `requireSubclassManager` menolaknya.
3. **PJ subkelas lain ditolak.** PJ Basis Data tidak boleh mengubah materi Jaringan, walaupun satu kelas.
4. **Kelas yang diarsipkan hanya bisa dibaca.** `requireClassAdmin` dan `requireSubclassManager` menolaknya dengan 409. Untuk endpoint yang hanya membaca, pakai `requireClassAdmin(classId, { allowArchived: true })`.
5. **Yang di-ban** sudah bukan anggota, jadi diperlakukan sama dengan orang luar.

## Untuk halaman

Halaman tidak punya `handle()`, jadi penolakan diterjemahkan menjadi perpindahan halaman:

| Fungsi                    | Guna                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `forPage(fn)`             | Membungkus pemanggilan controller: 401 ke `/login`, 404 ke halaman 404, 403 ke `/forbidden` |
| `requirePageLogin()`      | Untuk halaman yang belum mengambil data tetapi wajib login                                  |
| `requirePageSuperadmin()` | Untuk halaman di bawah `/admin`; yang bukan superadmin mendapat 404                         |

```tsx
export default function Halaman({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<Rangka />}>
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const akses = await forPage(() => getMyClassAccess(classId));
  // ...
}
```

Ketiga fungsi membaca cookie, jadi pemanggilnya harus di dalam `<Suspense>`.

**Penjagaan ditaruh di halaman, bukan di `layout.tsx`.** Next.js merender layout dan halaman secara terpisah, sehingga layout tidak bisa menahan isi halaman di bawahnya. Contohnya ada di `src/app/admin/page.tsx`.

## Tiga lapis penjagaan

| Lapis         | Letak                       | Yang diperiksa                                                                  |
| ------------- | --------------------------- | ------------------------------------------------------------------------------- |
| 1. Proxy      | `src/proxy.ts`              | Ada cookie sesi atau tidak. Hanya untuk mengalihkan cepat, **bukan** pengamanan |
| 2. Halaman    | `forPage`, `wajib...`       | Sesi masih berlaku, dan penolakan controller                                    |
| 3. Controller | `requireAuth`, `require...` | Sesi dan peran. **Inilah pengaman yang sesungguhnya**                           |

Lapis 3 wajib ada di setiap controller yang membaca atau mengubah data, karena API bisa dipanggil langsung tanpa melewati halaman.

## Menambah aturan

1. Tambahkan fungsinya di folder ini, beserta ujinya. Setiap fungsi `require...` diuji untuk: tanpa login, superadmin, admin kelas, PJ subkelas itu, PJ subkelas lain, anggota, dan orang luar.
2. Fungsi izin membaca data lewat model, tidak mengimpor `db` (dijaga ESLint).
3. Perubahan di folder ini hanya berlaku setelah disetujui Zaki.

Skill: `klass-izin`.
