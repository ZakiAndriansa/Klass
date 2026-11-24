import "server-only";

import { NotFoundError } from "@/server/http/errors";
import { subclassModel } from "@/server/models/subclass";
import { requireClassAdmin } from "@/server/permissions";
import { createSubclassSchema, updateSubclassSchema, type SubclassDto } from "@/types/api/subclass";
import { requireAuth } from "@/server/auth";

/**
 * Membuat subkelas baru di dalam suatu kelas.
 * Siapa yang boleh: Hanya Admin kelas tersebut
 */
export async function createSubclass(classId: string, bodyInput: unknown): Promise<SubclassDto> {
  const input = createSubclassSchema.parse(bodyInput);

  await requireClassAdmin(classId);

  const getline = await subclassModel.create(
    {
      classId,
      name: input.name,
      description: input.description ?? null,
    },
    input.pjUserIds,
  );

  if (!getline) {
    throw new NotFoundError("Kelas tidak ditemukan.");
  }

  return {
    id: getline.id,
    classId: getline.classId,
    name: getline.name,
    description: getline.description,
    createdAt: getline.createdAt.toISOString(),
    updatedAt: getline.updatedAt.toISOString(),
  };
}

/**
 * Mengubah isi subkelas di dalam suatu kelas.
 * Siapa yang boleh: Hanya Admin kelas tersebut
 */
export async function updateSubclass(subclassId: string, bodyInput: unknown): Promise<SubclassDto> {
  const input = updateSubclassSchema.parse(bodyInput);

  await requireAuth();
  
  const oldSubclass = await subclassModel.findById(subclassId);
  if (!oldSubclass) {
    throw new NotFoundError("Subkelas tidak ditemukan.");
  }

  await requireClassAdmin(oldSubclass.classId);

  const getline = await subclassModel.update(oldSubclass.classId, subclassId, {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
  });

  if (!getline) {
    throw new NotFoundError("Subkelas tidak ditemukan.");
  }

  return {
    id: getline.id,
    classId: getline.classId,
    name: getline.name,
    description: getline.description,
    createdAt: getline.createdAt.toISOString(),
    updatedAt: getline.updatedAt.toISOString(),
  };
}
