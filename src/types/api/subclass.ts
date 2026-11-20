import { z } from "zod";

/**
 * SKEMA ZOD (POST /api/v1/kelas/[classId]/subkelas)
 */
export const BuatSubkelasSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama subkelas tidak boleh kosong.")
    .max(150, "Nama subkelas maksimal 150 karakter"),
  pjAwal: z
    .array(z.string().trim().min(1, "ID pengguna tidak boleh kosong."))
    .optional()
    .default([]),
});

export type BuatSubkelas = z.infer<typeof BuatSubkelasSchema>;

export type SubkelasDto = {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
