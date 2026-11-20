import "server-only";

import { bacaAksesKelas } from "@/server/permissions";
import type { AksesKelasDto } from "@/types/api/class-access";

/**
 * Hak pengguna yang sedang login di satu kelas. Pemilik: Zaki.
 *
 * Dipanggil frontend untuk memutuskan tombol yang ditampilkan. Aturan izinnya
 * sendiri ada di `src/server/permissions`.
 */
export async function aksesKelasSaya(classId: string): Promise<AksesKelasDto> {
  const { kelas, role, pjSubclassIds } = await bacaAksesKelas(classId);

  return {
    classId: kelas.id,
    role,
    pjSubclassIds,
    readOnly: kelas.status === "archived",
  };
}
