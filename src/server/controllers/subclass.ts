import "server-only";

import { NotFoundError } from "@/server/http/errors";
import { subclassModel } from "@/server/models/subclass";
import { requireClassAdmin } from "@/server/permissions";
import { createSubclassSchema, type SubclassDto } from "@/types/api/subclass";

/**
 * Membuat subkelas baru di dalam suatu kelas.
 * Siapa yang boleh: Hanya Admin kelas tersebut
 */
export async function createSubclass(classId: string, bodyInput: unknown): Promise<SubclassDto> {
  const input = createSubclassSchema.parse(bodyInput);

  await requireClassAdmin(classId);

  const baris = await subclassModel.create(
    {
      classId,
      name: input.name,
    },
    input.pjUserIds,
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
