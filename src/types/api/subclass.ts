import { z } from "zod";

/**
 * SKEMA ZOD (POST /api/v1/classes/[classId]/subclasses)
 */
export const createSubclassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama subkelas tidak boleh kosong.")
    .max(150, "Nama subkelas maksimal 150 karakter."),
  description: z
    .string()
    .trim()
    .max(125, "Deskripsi maksimal 125 karakter.")
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
  pjUserIds: z
    .array(z.string().trim().min(1, "ID pengguna tidak boleh kosong."))
    .max(2, "PJ awal maksimal 2 orang.")
    .optional()
    .default([]),
});

export type CreateSubclassInput = z.infer<typeof createSubclassSchema>;

/**
 * SKEMA ZOD (PATCH /api/v1/subclasses/[subclassId])
 */
export const updateSubclassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama subkelas tidak boleh kosong.")
    .max(150, "Nama subkelas maksimal 150 karakter."),
  description: z
    .string()
    .trim()
    .max(125, "Deskripsi maksimal 125 karakter.")
    .transform((val) => (val === "" ? null : val))
    .nullable()
    .optional(),
});

export type UpdateSubclassInput = z.infer<typeof updateSubclassSchema>;

export type SubclassDto = {
  id: string;
  classId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
