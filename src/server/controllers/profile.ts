import "server-only";

import { requireAuth } from "@/server/auth";
import { NotFoundError } from "@/server/http";
import { profileModel, type Profile } from "@/server/models/profile";
import { updateProfileSchema, type ProfileDto } from "@/types/api/profile";

function toProfileDto(row: Profile): ProfileDto {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image ? row.image : null,
    isSuperadmin: row.isSuperadmin,
  };
}

export async function getProfile(): Promise<ProfileDto> {
  const user = await requireAuth();
  const row = await profileModel.findById(user.id);

  if (!row) {
    throw new NotFoundError("Profil pengguna tidak ditemukan.");
  }

  return toProfileDto(row);
}

export async function updateProfile(input: unknown): Promise<ProfileDto> {
  const { name, image } = updateProfileSchema.parse(input);
  const user = await requireAuth();

  const updatedRow = await profileModel.update(user.id, {
    name,
    ...(image === undefined ? {} : { image }),
  });
  if (!updatedRow) {
    throw new NotFoundError("Gagal memperbarui, profil tidak ditemukan.");
  }

  return toProfileDto(updatedRow);
}
