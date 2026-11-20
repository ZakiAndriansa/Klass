import "server-only";

import { NotFoundError } from "@/server/http/errors";
import { subkelasModel } from "@/server/models/subkelas";
// permission jaki
import { BuatSubkelasSchema, type SubkelasDto } from "@/types/api/subclass";

/**
 * Membuat subkelas baru di dalam suatu kelas.
 * Siapa yang boleh: Hanya Admin kelas tersebut
 */
export async function buatSubkelas(classId: string, bodyInput: unknown): Promise<SubkelasDto> {
  const input = BuatSubkelasSchema.parse(bodyInput);

  // permission jaki

  const baris = await subkelasModel.buat(
    {
      classId,
      name: input.name,
    },
    input.pjAwal,
  );

  if (!baris) {
    throw new NotFoundError("Kelas tidak ditemukan");
  }

  return {
    id: baris.id,
    classId: baris.classId,
    name: baris.name,
    createdAt: baris.createdAt.toISOString(),
    updatedAt: baris.updatedAt.toISOString(),
  };
}
