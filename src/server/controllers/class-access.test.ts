import { beforeEach, describe, expect, it, vi } from "vitest";

import { ForbiddenError, UnauthorizedError } from "@/server/http/errors";
import { readClassAccess } from "@/server/permissions";

import { getMyClassAccess } from "./class-access";

/** Lapisan izin diganti tiruan; aturan izinnya sendiri diuji di `src/server/permissions`. */
vi.mock("@/server/permissions", () => ({ readClassAccess: vi.fn() }));

type Akses = Awaited<ReturnType<typeof readClassAccess>>;

function akses(isi: { status?: string; role: "admin" | "member" | null; pj?: string[] }) {
  vi.mocked(readClassAccess).mockResolvedValue({
    user: { id: "u-1" },
    classData: { id: "kelas-a", status: isi.status ?? "active", inviteCode: "RAHASIA" },
    role: isi.role,
    pjSubclassIds: isi.pj ?? [],
  } as unknown as Akses);
}

describe("getMyClassAccess", () => {
  beforeEach(() => vi.resetAllMocks());

  it("mengembalikan peran dan subkelas yang dipegang, tanpa data kelas lain", async () => {
    akses({ role: "member", pj: ["sub-a"] });

    await expect(getMyClassAccess("kelas-a")).resolves.toEqual({
      classId: "kelas-a",
      role: "member",
      pjSubclassIds: ["sub-a"],
      readOnly: false,
    });
  });

  it("menandai kelas yang diarsipkan sebagai hanya-baca", async () => {
    akses({ role: "admin", status: "archived" });

    await expect(getMyClassAccess("kelas-a")).resolves.toMatchObject({ readOnly: true });
  });

  it("mengembalikan role null untuk yang belum menjadi anggota", async () => {
    akses({ role: null });

    await expect(getMyClassAccess("kelas-a")).resolves.toMatchObject({ role: null });
  });

  it.each([new UnauthorizedError(), new ForbiddenError()])(
    "meneruskan penolakan dari lapisan izin",
    async (galat) => {
      vi.mocked(readClassAccess).mockRejectedValue(galat);

      await expect(getMyClassAccess("kelas-a")).rejects.toBe(galat);
    },
  );
});
