import "server-only";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";

// Kolom yang boleh dibaca sebagai profil. Kolom lain di `users` tidak ikut dikirim.
const profileColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  image: users.image,
  isSuperadmin: users.isSuperadmin,
};

/** Satu baris profil pengguna, seperti yang dikembalikan model ini. */
export type Profile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isSuperadmin: boolean;
};

type ProfileChanges = {
  name?: string;
  image?: string | null;
};

export const profileModel = {
  // Mencari profil pengguna berdasarkan ID
  async findById(id: string): Promise<Profile | null> {
    const [profil] = await db.select(profileColumns).from(users).where(eq(users.id, id)).limit(1);

    return profil ?? null;
  },

  // Mengubah nama atau foto profil
  async update(id: string, data: ProfileChanges): Promise<Profile | null> {
    if (data.name !== undefined || data.image !== undefined) {
      // Kolomnya ditulis satu per satu, bukan `.set(data)`. Dengan begitu kunci lain
      // yang ikut terkirim (misalnya `isSuperadmin` atau `email`) tidak pernah tersimpan.
      await db.update(users).set({ name: data.name, image: data.image }).where(eq(users.id, id));
    }

    return profileModel.findById(id);
  },
};
