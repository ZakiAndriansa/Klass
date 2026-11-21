import "server-only";

import { readClassAccess } from "@/server/permissions";
import type { ClassAccessDto } from "@/types/api/class-access";

/**
 * Hak pengguna yang sedang login di satu kelas. Pemilik: Zaki.
 *
 * Dipanggil frontend untuk memutuskan tombol yang ditampilkan. Aturan izinnya
 * sendiri ada di `src/server/permissions`.
 */
export async function getMyClassAccess(classId: string): Promise<ClassAccessDto> {
  const { classData, role, pjSubclassIds } = await readClassAccess(classId);

  return {
    classId: classData.id,
    role,
    pjSubclassIds,
    readOnly: classData.status === "archived",
  };
}
