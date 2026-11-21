import { z } from "zod";

/**
 * SKEMA ZOD (POST /api/v1/classes/[classId]/subclasses)
 */
export const buatSubkelasSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama subkelas tidak boleh kosong.")
    .max(150, "Nama subkelas maksimal 150 karakter"),
  pjAwal: z
    .array(z.string().trim().min(1, "ID pengguna tidak boleh kosong."))
    .max(2, "Pj awal maksimal 1 orang")
    .optional()
    .default([]),
});

export type BuatSubkelasInput = z.infer<typeof buatSubkelasSchema>;

export type SubkelasDto = {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
