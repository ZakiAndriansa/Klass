import { z } from "zod";

export const ubahProfilSchema = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter.").max(50, "Nama maksimal 50 karakter."),
  avatarUrl: z
    .url({ protocol: /^https?$/ })
    .max(2048, "URL avatar maksimal 2048 karakter.")
    .nullable()
    .optional(),
});

export type UbahProfilInput = z.infer<typeof ubahProfilSchema>;

export type ProfilDto = {
  id: string;
  nama: string;
  email: string;
  avatarUrl: string | null;
  role: "superadmin" | "user";
};
