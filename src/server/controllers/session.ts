import "server-only";

import { ambilSesi, keluar } from "@/server/auth";
import type { SesiDto } from "@/types/api/session";

/**
 * Controller sesi: siapa yang sedang login, dan keluar. Pemilik: Zaki.
 *
 * Berlaku sama untuk akun contoh (`/dev/login`) maupun login Google, karena
 * keduanya menghasilkan sesi Better Auth yang sama.
 */

/** Pengguna yang sedang login. `null` berarti belum login (bukan galat). */
export async function sesiSaya(): Promise<SesiDto | null> {
  const sesi = await ambilSesi();
  if (!sesi) return null;

  const { user } = sesi;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    isSuperadmin: user.isSuperadmin,
  };
}

/** Mengakhiri sesi dan menghapus cookie-nya. Aman dipanggil walau belum login. */
export async function keluarSesi(): Promise<null> {
  if (await ambilSesi()) {
    await keluar();
  }

  return null;
}
