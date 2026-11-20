import { aksesKelasSaya } from "@/server/controllers/class-access";
import { handle, ok } from "@/server/http";

/**
 * `GET /api/v1/classes/{classId}/access`: peran pengguna yang sedang login di kelas ini.
 */
export const GET = handle(async (_req, { params }: { params: Promise<{ classId: string }> }) => {
  const { classId } = await params;

  return ok(await aksesKelasSaya(classId));
});
