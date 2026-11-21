import { buatSubkelas } from "@/server/controllers/subclass";
import { bacaJson, handle, ok } from "@/server/http";

/**
 * POST /api/v1/classes/[classId]/subclasses
 * Membuat subkelas baru di dalam kelas.
 */
export const POST = handle(
  async (req, ctx: { params: Promise<{ classId: string }> }) => {
  const { classId } = await ctx.params;
  const body = await bacaJson(req);

  const data = await buatSubkelas(classId, body);
  return ok(data, 201);
});
