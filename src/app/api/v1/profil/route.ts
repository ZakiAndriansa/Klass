import { ambilProfil, ubahProfil } from "@/server/controllers/profil";
import { handle, ok } from "@/server/http";

export const GET = handle(async () => {
  const profil = await ambilProfil();
  return ok(profil);
});

export const PATCH = handle(async (req) => {
  const body = await req.json();
  const profilBaru = await ubahProfil(body);
  return ok(profilBaru);
});
