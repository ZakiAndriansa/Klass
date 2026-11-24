import { updateSubclass } from "@/server/controllers/subclass";
import { readJson, handle, ok } from "@/server/http";

/**
 * PATCH /api/v1/subclasses/[subclassId]
 * mengubah isi subkelas.
 */
export const PATCH = handle(async (req, ctx: { params: Promise<{ subclassId: string }> }) => {
  const { subclassId } = await ctx.params;
  const body = await readJson(req);

  const data = await updateSubclass(subclassId, body);
  return ok(data);
});
