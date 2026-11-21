import "server-only";

import { NotFoundError } from "@/server/http/errors";
import { subkelasModel } from "@/server/models/subkelas";
import { requireClassAdmin } from "@/server/permissions";
import { buatSubkelasSchema, type SubkelasDto } from "@/types/api/subclass";

/**
 * Membuat subkelas baru di dalam suatu kelas.
 * Siapa yang boleh: Hanya Admin kelas tersebut
 */
export async function buatSubkelas(classId: string, bodyInput: unknown): Promise<SubkelasDto> {
  const input = buatSubkelasSchema.parse(bodyInput);

  await requireClassAdmin(classId);

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
