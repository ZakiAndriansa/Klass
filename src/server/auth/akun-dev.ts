import "server-only";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/server/db";
import { accounts, users } from "@/server/db/schema/auth";
import type { AkunDevDto } from "@/types/api/dev-auth";

import { ambilAuth } from "./konfigurasi";

/**
 * Akun contoh untuk pengembangan. Pemilik: Zaki.
 *
 * Satu peran punya satu akun. Daftarnya ditulis langsung di sini (hardcode) supaya
 * semua anggota tim memakai akun yang sama dengan `id` yang sama di laptop masing-masing.
 * Karena `id`-nya tetap, data contoh tabel lain boleh merujuk ke `id` ini.
 *
 * Akun baru dimasukkan ke tabel `users` saat pertama kali dipakai masuk, lalu sesinya
 * dibuat Better Auth seperti login biasa. Tidak ada tabel atau kolom tambahan.
 *
 * CATATAN: peran admin kelas, PJ, dan anggota di sini baru berupa label. Tabel
 * `class_members` dan `subclass_pj` belum ada, jadi akun ini belum benar-benar
 * tergabung di kelas mana pun. Setelah tabelnya ada, keanggotaan akun ini diisi
 * lewat data contoh.
 */
export const AKUN_DEV: readonly AkunDevDto[] = [
  {
    id: "dev-superadmin",
    nama: "Superadmin Contoh",
    email: "superadmin@klass.test",
    peran: "superadmin",
    labelPeran: "Superadmin",
    keterangan: "Mengurus website: menyetujui pengajuan kelas dan mengelola poster.",
    tujuan: "/admin",
  },
  {
    id: "dev-admin-kelas",
    nama: "Admin Kelas Contoh",
    email: "admin.kelas@klass.test",
    peran: "admin_kelas",
    labelPeran: "Admin kelas",
    keterangan: "Mengatur satu kelas: tema, subkelas, PJ, serta kick dan ban anggota.",
    tujuan: "/classes",
  },
  {
    id: "dev-pj",
    nama: "PJ Contoh",
    email: "pj@klass.test",
    peran: "pj",
    labelPeran: "PJ subkelas",
    keterangan: "Mengisi materi, jadwal, dan tugas di subkelas yang dipegangnya.",
    tujuan: "/classes",
  },
  {
    id: "dev-anggota",
    nama: "Anggota Contoh",
    email: "anggota@klass.test",
    peran: "anggota",
    labelPeran: "Anggota",
    keterangan: "Sudah bergabung di kelas: melihat materi, jadwal, dan tugas.",
    tujuan: "/classes",
  },
  {
    id: "dev-pengguna",
    nama: "Pengguna Baru Contoh",
    email: "pengguna@klass.test",
    peran: "pengguna",
    labelPeran: "Pengguna baru",
    keterangan: "Sudah punya akun tetapi belum bergabung di kelas mana pun.",
    tujuan: "/dashboard",
  },
];

/**
 * Kata sandi bersama semua akun contoh. Sengaja ditulis di kode: akun ini hanya
 * hidup saat pengembangan, dan login kata sandi dimatikan di produksi
 * (`emailAndPassword` di `konfigurasi.ts`). Pengguna tidak pernah mengetiknya;
 * halaman `/dev/login` cukup diklik.
 */
const KATA_SANDI_DEV = "klass-akun-contoh";

export function cariAkunDev(id: string): AkunDevDto | undefined {
  return AKUN_DEV.find((akun) => akun.id === id);
}

/** Memasukkan akun contoh ke tabel `users` bila belum ada. Aman dipanggil berulang. */
async function siapkanAkunDev(akun: AkunDevDto): Promise<void> {
  const [ada] = await db.select({ id: users.id }).from(users).where(eq(users.id, akun.id)).limit(1);
  if (ada) return;

  const kataSandi = await hashPassword(KATA_SANDI_DEV);

  await db.transaction(async (tx) => {
    await tx.insert(users).values({
      id: akun.id,
      name: akun.nama,
      email: akun.email,
      emailVerified: true,
      isSuperadmin: akun.peran === "superadmin",
    });

    // Better Auth menyimpan kata sandi di tabel `accounts` dengan penyedia `credential`.
    await tx.insert(accounts).values({
      id: `${akun.id}-akun`,
      userId: akun.id,
      accountId: akun.id,
      providerId: "credential",
      password: kataSandi,
    });
  });
}

/** Masuk sebagai akun contoh: membuat sesi dan memasang cookie-nya. */
export async function masukAkunDev(akun: AkunDevDto): Promise<void> {
  await siapkanAkunDev(akun);

  await ambilAuth().api.signInEmail({
    body: { email: akun.email, password: KATA_SANDI_DEV },
    headers: await headers(),
  });
}
