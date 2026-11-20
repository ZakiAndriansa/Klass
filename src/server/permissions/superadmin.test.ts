import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAuth } from "@/server/auth";
import { ForbiddenError, UnauthorizedError } from "@/server/http/errors";

import { requireSuperadmin } from "./superadmin";

vi.mock("@/server/auth", () => ({ requireAuth: vi.fn() }));

function masukSebagai(isSuperadmin: boolean) {
  vi.mocked(requireAuth).mockResolvedValue({
    id: "u-1",
    name: "Pengguna",
    email: "pengguna@klass.test",
    isSuperadmin,
  } as Awaited<ReturnType<typeof requireAuth>>);
}

describe("requireSuperadmin", () => {
  beforeEach(() => vi.resetAllMocks());

  it("meloloskan superadmin dan mengembalikan penggunanya", async () => {
    masukSebagai(true);
    await expect(requireSuperadmin()).resolves.toMatchObject({ id: "u-1", isSuperadmin: true });
  });

  it("menolak pengguna biasa dengan 403", async () => {
    masukSebagai(false);
    await expect(requireSuperadmin()).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("menolak yang belum login dengan 401", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
    await expect(requireSuperadmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
