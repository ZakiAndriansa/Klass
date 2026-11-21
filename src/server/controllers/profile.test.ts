import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { requireAuth } from "@/server/auth";
import { NotFoundError, UnauthorizedError } from "@/server/http/errors";
import { profileModel } from "@/server/models/profile";
import { ambilProfile, ubahProfile } from "./profile";

vi.mock("@/server/auth", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/server/models/profile", () => ({
  profileModel: {
    cariPerId: vi.fn(),
    ubah: vi.fn(),
  },
}));

const pengguna = {
  id: "user-1",
  name: "Ahmad",
  email: "ahmad@example.com",
  image: null as string | null,
  isSuperadmin: false,
};

beforeEach(() => {
  vi.mocked(requireAuth).mockReset();
  vi.mocked(profileModel.cariPerId).mockReset();
  vi.mocked(profileModel.ubah).mockReset();

  vi.mocked(requireAuth).mockResolvedValue(pengguna as never);
});

describe("ambilProfile", () => {
  it("memetakan baris model menjadi ProfileDto", async () => {
    vi.mocked(profileModel.cariPerId).mockResolvedValue(pengguna);

    await expect(ambilProfile()).resolves.toEqual({
      idPengguna: "user-1",
      nama: "Ahmad",
      email: "ahmad@example.com",
      avatarUrl: null,
      peran: "pengguna",
    });
    expect(profileModel.cariPerId).toHaveBeenCalledWith("user-1");
  });

  it("menurunkan peran superadmin dari isSuperadmin", async () => {
    vi.mocked(profileModel.cariPerId).mockResolvedValue({
      ...pengguna,
      image: "https://example.com/avatar.png",
      isSuperadmin: true,
    });

    await expect(ambilProfile()).resolves.toMatchObject({
      avatarUrl: "https://example.com/avatar.png",
      peran: "superadmin",
    });
  });

  it("mengubah image kosong menjadi null", async () => {
    vi.mocked(profileModel.cariPerId).mockResolvedValue({ ...pengguna, image: "" });

    await expect(ambilProfile()).resolves.toMatchObject({ avatarUrl: null });
  });

  it("melempar NotFoundError bila baris tidak ada", async () => {
    vi.mocked(profileModel.cariPerId).mockResolvedValue(null);

    await expect(ambilProfile()).rejects.toBeInstanceOf(NotFoundError);
  });

  it("meneruskan UnauthorizedError tanpa memanggil model", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());

    await expect(ambilProfile()).rejects.toBeInstanceOf(UnauthorizedError);
    expect(profileModel.cariPerId).not.toHaveBeenCalled();
  });
});

describe("ubahProfile", () => {
  beforeEach(() => {
    vi.mocked(profileModel.ubah).mockResolvedValue(pengguna);
  });

  it("memakai id dari sesi, bukan dari body", async () => {
    await ubahProfile({ nama: "Ahmad Baru", id: "penyusup" });

    expect(profileModel.ubah).toHaveBeenCalledWith("user-1", { name: "Ahmad Baru" });
  });

  it("memetakan nama menjadi name", async () => {
    vi.mocked(profileModel.ubah).mockResolvedValue({ ...pengguna, name: "Ahmad Baru" });

    await expect(ubahProfile({ nama: "Ahmad Baru" })).resolves.toMatchObject({
      nama: "Ahmad Baru",
    });
  });

  it("memetakan avatarUrl menjadi image", async () => {
    await ubahProfile({ nama: "Ahmad Baru", avatarUrl: "https://example.com/a.png" });

    expect(profileModel.ubah).toHaveBeenCalledWith("user-1", {
      name: "Ahmad Baru",
      image: "https://example.com/a.png",
    });
  });

  it("tidak mengirim image bila avatarUrl tidak ada", async () => {
    await ubahProfile({ nama: "Ahmad Baru" });

    expect(vi.mocked(profileModel.ubah).mock.calls[0][1]).not.toHaveProperty("image");
  });

  it("mengirim image null untuk menghapus avatar", async () => {
    await ubahProfile({ nama: "Ahmad Baru", avatarUrl: null });

    expect(profileModel.ubah).toHaveBeenCalledWith("user-1", {
      name: "Ahmad Baru",
      image: null,
    });
  });

  it("menolak nama kurang dari 3 karakter sebelum memanggil model", async () => {
    await expect(ubahProfile({ nama: "ab" })).rejects.toBeInstanceOf(ZodError);
    expect(profileModel.ubah).not.toHaveBeenCalled();
  });

  it("menolak avatarUrl yang bukan http atau https", async () => {
    await expect(
      ubahProfile({ nama: "Ahmad Baru", avatarUrl: "ftp://example.com/a.png" }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("melempar NotFoundError bila baris tidak ditemukan", async () => {
    vi.mocked(profileModel.ubah).mockResolvedValue(null);

    await expect(ubahProfile({ nama: "Ahmad Baru" })).rejects.toBeInstanceOf(NotFoundError);
  });
});
