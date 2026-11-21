import "server-only";

import { requireAuth, type Sesi } from "@/server/auth";
import { ForbiddenError } from "@/server/http/errors";

/**
 * Izin superadmin. Pemilik: Zaki.
 *
 * Superadmin mengurus website: menyetujui pengajuan kelas, mengelola poster,
 * dan menghapus kelas. Statusnya disimpan di `users.is_superadmin` dan tidak
 * bisa diubah lewat endpoint mana pun.
 *
 *   belum login        401 UNAUTHORIZED
 *   bukan superadmin   403 FORBIDDEN
 */
export async function requireSuperadmin(): Promise<Sesi["user"]> {
  const user = await requireAuth();

  if (!user.isSuperadmin) {
    throw new ForbiddenError("Hanya superadmin yang boleh melakukan ini.");
  }

  return user;
}
