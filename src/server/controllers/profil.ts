import "server-only";

import { requireAuth } from "@/server/auth";
import { NotFoundError } from "@/server/http/errors";
import { profilModel, type UserRow } from "@/server/models/profil";
import { ubahProfilSchema, type ProfilDto } from "@/types/api/profil";

function keProfilDto(baris: UserRow): ProfilDto {
  return {
    id: baris.id,
    nama: baris.name,
    email: baris.email,
    avatarUrl: baris.image ? baris.image : null,
    role: baris.isSuperadmin ? "superadmin" : "user",
  };
}

export async function ambilProfil(): Promise<ProfilDto> {
  const user = await requireAuth();
  const baris = await profilModel.cariPerId(user.id);

  if (!baris) {
    throw new NotFoundError("Profil pengguna tidak ditemukan.");
  }

  return keProfilDto(baris);
}

export async function ubahProfil(masukan: unknown): Promise<ProfilDto> {
  const user = await requireAuth();
  const dataValid = ubahProfilSchema.parse(masukan);

  const barisBaru = await profilModel.ubah(user.id, dataValid);
  if (!barisBaru) {
    throw new NotFoundError("Gagal memperbarui, profil tidak ditemukan.");
  }

  return keProfilDto(barisBaru);
}
