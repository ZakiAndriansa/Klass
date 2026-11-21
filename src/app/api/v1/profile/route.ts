import { getProfile, updateProfile } from "@/server/controllers/profile";
import { handle, ok, readJson } from "@/server/http";

export const GET = handle(async () => {
  const profile = await getProfile();
  return ok(profile);
});

export const PATCH = handle(async (req) => {
  const body = await readJson(req);
  const updatedProfile = await updateProfile(body);
  return ok(updatedProfile);
});
