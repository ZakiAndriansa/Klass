import { z } from "zod";

export const ubahProfileSchema = z.object({
  nama: z.string().trim().min(3, "Nama minimal 3 karakter.").max(50, "Nama maksimal 50 karakter."),
  avatarUrl: z
    .url({ protocol: /^https?$/ })
    .max(2048, "URL avatar maksimal 2048 karakter.")
    .nullable()
    .optional(),
});

export type UbahProfileInput = z.infer<typeof ubahProfileSchema>;

export type PeranProfile = "superadmin" | "pengguna";

export type ProfileDto = {
  idPengguna: string;
  nama: string;
  email: string;
  avatarUrl: string | null;
  peran: PeranProfile;
};
