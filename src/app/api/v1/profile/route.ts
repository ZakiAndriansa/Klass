import { ambilProfile, ubahProfile } from "@/server/controllers/profile";
import { bacaJson, handle, ok } from "@/server/http";

export const GET = handle(async () => {
  const profile = await ambilProfile();
  return ok(profile);
});

export const PATCH = handle(async (req) => {
  const body = await bacaJson(req);
  const profileBaru = await ubahProfile(body);
  return ok(profileBaru);
});
