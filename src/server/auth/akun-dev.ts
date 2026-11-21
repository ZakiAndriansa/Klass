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
 * CATATAN: peran admin kelas, PJ, dan anggota di sini baru berupa label. Akun ini
 * belum tergabung di kelas mana pun, karena belum ada data contoh untuk tabel
 * `class_members` dan `subclass_pj`. Sampai data contohnya dibuat, yang benar-benar
 * berbeda hanya superadmin (`users.is_superadmin`).
 */
export const AKUN_DEV: readonly AkunDevDto[] = [
  {
    id: "dev-superadmin",
    name: "Superadmin Contoh",
    email: "superadmin@klass.test",
    role: "superadmin",
    roleLabel: "Superadmin",
    description: "Mengurus website: menyetujui pengajuan kelas dan mengelola poster.",
    redirectTo: "/dashboard",
  },
  {
    id: "dev-admin-kelas",
    name: "Admin Kelas Contoh",
    email: "admin.kelas@klass.test",
    role: "class_admin",
    roleLabel: "Admin kelas",
    description: "Mengatur satu kelas: tema, subkelas, PJ, serta kick dan ban anggota.",
    redirectTo: "/classes",
  },
  {
    id: "dev-pj",
    name: "PJ Contoh",
    email: "pj@klass.test",
    role: "subclass_pj",
    roleLabel: "PJ subkelas",
    description: "Mengisi materi, jadwal, dan tugas di subkelas yang dipegangnya.",
    redirectTo: "/classes",
  },
  {
    id: "dev-anggota",
    name: "Anggota Contoh",
    email: "anggota@klass.test",
    role: "member",
    roleLabel: "Anggota",
    description: "Sudah bergabung di kelas: melihat materi, jadwal, dan tugas.",
    redirectTo: "/classes",
  },
  {
    id: "dev-pengguna",
    name: "Pengguna Baru Contoh",
    email: "pengguna@klass.test",
    role: "user",
    roleLabel: "Pengguna baru",
    description: "Sudah punya akun tetapi belum bergabung di kelas mana pun.",
    redirectTo: "/dashboard",
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
      name: akun.name,
      email: akun.email,
      emailVerified: true,
      isSuperadmin: akun.role === "superadmin",
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
