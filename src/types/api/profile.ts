import { z } from "zod";

export const ubahProfileSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(50, "Nama maksimal 50 karakter."),
  image: z
    .url({ protocol: /^https?$/ })
    .max(2048, "URL avatar maksimal 2048 karakter.")
    .nullable()
    .optional(),
});

export type UbahProfileInput = z.infer<typeof ubahProfileSchema>;

export type ProfileDto = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isSuperadmin: boolean;
};
