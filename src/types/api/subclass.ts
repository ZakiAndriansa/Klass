import { z } from "zod";

/**
 * SKEMA ZOD (POST /api/v1/classes/[classId]/subclasses)
 */
export const createSubclassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama subkelas tidak boleh kosong.")
    .max(150, "Nama subkelas maksimal 150 karakter"),
  pjUserIds: z
    .array(z.string().trim().min(1, "ID pengguna tidak boleh kosong."))
    .max(2, "PJ awal maksimal 2 orang.")
    .optional()
    .default([]),
});

export type CreateSubclassInput = z.infer<typeof createSubclassSchema>;

export type SubclassDto = {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
