import "server-only";

import { requireAuth } from "@/server/auth";
import { NotFoundError } from "@/server/http/errors";
import { profileModel, type Profile } from "@/server/models/profile";
import { ubahProfileSchema, type ProfileDto } from "@/types/api/profile";

function keProfileDto(baris: Profile): ProfileDto {
  return {
    idPengguna: baris.id,
    nama: baris.name,
    email: baris.email,
    avatarUrl: baris.image ? baris.image : null,
    peran: baris.isSuperadmin ? "superadmin" : "pengguna",
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
  const { nama, avatarUrl } = ubahProfileSchema.parse(masukan);
  const user = await requireAuth();

  const barisBaru = await profileModel.ubah(user.id, {
    name: nama,
    ...(avatarUrl === undefined ? {} : { image: avatarUrl }),
  });
  if (!barisBaru) {
    throw new NotFoundError("Gagal memperbarui, profil tidak ditemukan.");
  }

  return keProfileDto(barisBaru);
}
