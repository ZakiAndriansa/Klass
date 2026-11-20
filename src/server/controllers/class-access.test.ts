import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForbiddenError, UnauthorizedError } from "@/server/http/errors";
import { bacaAksesKelas } from "@/server/permissions";

import { aksesKelasSaya } from "./class-access";

/** Lapisan izin diganti tiruan; aturan izinnya sendiri diuji di `src/server/permissions`. */
vi.mock("@/server/permissions", () => ({ bacaAksesKelas: vi.fn() }));

type Akses = Awaited<ReturnType<typeof bacaAksesKelas>>;

function akses(isi: { status?: string; role: "admin" | "member" | null; pj?: string[] }) {
  vi.mocked(bacaAksesKelas).mockResolvedValue({
    user: { id: "u-1" },
    kelas: { id: "kelas-a", status: isi.status ?? "active", inviteCode: "RAHASIA" },
    role: isi.role,
    pjSubclassIds: isi.pj ?? [],
  } as unknown as Akses);
}

describe("aksesKelasSaya", () => {
  beforeEach(() => vi.resetAllMocks());

  it("mengembalikan peran dan subkelas yang dipegang, tanpa data kelas lain", async () => {
    akses({ role: "member", pj: ["sub-a"] });

    await expect(aksesKelasSaya("kelas-a")).resolves.toEqual({
      classId: "kelas-a",
      role: "member",
      pjSubclassIds: ["sub-a"],
      readOnly: false,
    });
  });

  it("menandai kelas yang diarsipkan sebagai hanya-baca", async () => {
    akses({ role: "admin", status: "archived" });

    await expect(aksesKelasSaya("kelas-a")).resolves.toMatchObject({ readOnly: true });
  });

  it("mengembalikan role null untuk yang belum menjadi anggota", async () => {
    akses({ role: null });

    await expect(aksesKelasSaya("kelas-a")).resolves.toMatchObject({ role: null });
  });

  it.each([new UnauthorizedError(), new ForbiddenError()])(
    "meneruskan penolakan dari lapisan izin",
    async (galat) => {
      vi.mocked(bacaAksesKelas).mockRejectedValue(galat);

      await expect(aksesKelasSaya("kelas-a")).rejects.toBe(galat);
    },
  );
});
