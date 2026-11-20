
import "server-only";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";

type DataUbahProfil = {
  name?: string;
  image?: string | null;
};

export const profileModel = {
  // Mencari profil pengguna berdasarkan ID
  async cariPerId(id: string) {
    const [profil] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return profil ?? null;
  },

  // Mengubah nama atau foto profil
  async ubah(id: string, data: DataUbahProfil) {
    if (data.name !== undefined || data.image !== undefined) {
      await db
        .update(users)
        .set(data)
        .where(eq(users.id, id));
    }

    return profileModel.cariPerId(id);
  },
};
