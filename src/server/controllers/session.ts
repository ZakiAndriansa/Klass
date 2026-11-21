import "server-only";

import { getSession, signOut } from "@/server/auth";
import type { SessionDto } from "@/types/api/session";

/**
 * Controller sesi: siapa yang sedang login, dan keluar. Pemilik: Zaki.
 *
 * Berlaku sama untuk akun contoh (`/dev/login`) maupun login Google, karena
 * keduanya menghasilkan sesi Better Auth yang sama.
 */

/** Pengguna yang sedang login. `null` berarti belum login (bukan galat). */
export async function getMySession(): Promise<SessionDto | null> {
  const sesi = await getSession();
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
export async function endSession(): Promise<null> {
  if (await getSession()) {
    await signOut();
  }

  return null;
}
