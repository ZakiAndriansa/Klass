import { ambilProfile, ubahProfile } from "@/server/controllers/profile";
import { handle, ok } from "@/server/http";

export const GET = handle(async () => {
  const profile = await ambilProfile();
  return ok(profile);
});

export const PATCH = handle(async (req) => {
  const body = await req.json();
  const profileBaru = await ubahProfile(body);
  return ok(profileBaru);
});
