import "server-only";

import { requireAuth } from "@/server/auth";
import { NotFoundError } from "@/server/http";
import { profileModel, type Profile } from "@/server/models/profile";
import { ubahProfileSchema, type ProfileDto } from "@/types/api/profile";

function keProfileDto(baris: Profile): ProfileDto {
  return {
    id: baris.id,
    name: baris.name,
    email: baris.email,
    image: baris.image ? baris.image : null,
    isSuperadmin: baris.isSuperadmin,
  };
}

export async function ambilProfile(): Promise<ProfileDto> {
  const user = await requireAuth();
  const baris = await profileModel.cariPerId(user.id);

  if (!baris) {
    throw new NotFoundError("Profil pengguna tidak ditemukan.");
  }

  return keProfileDto(baris);
}

export async function ubahProfile(masukan: unknown): Promise<ProfileDto> {
  const { name, image } = ubahProfileSchema.parse(masukan);
  const user = await requireAuth();

  const barisBaru = await profileModel.ubah(user.id, {
    name,
    ...(image === undefined ? {} : { image }),
  });
  if (!barisBaru) {
    throw new NotFoundError("Gagal memperbarui, profil tidak ditemukan.");
  }

  return keProfileDto(barisBaru);
}
