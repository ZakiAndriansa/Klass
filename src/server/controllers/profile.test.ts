import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { requireAuth } from "@/server/auth";
import { NotFoundError, UnauthorizedError } from "@/server/http";
import { profileModel } from "@/server/models/profile";
import { getProfile, updateProfile } from "./profile";

vi.mock("@/server/auth", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("@/server/models/profile", () => ({
  profileModel: {
    findById: vi.fn(),
    update: vi.fn(),
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
  vi.mocked(profileModel.findById).mockReset();
  vi.mocked(profileModel.update).mockReset();

  vi.mocked(requireAuth).mockResolvedValue(pengguna as never);
});

describe("getProfile", () => {
  it("memetakan baris model menjadi ProfileDto", async () => {
    vi.mocked(profileModel.findById).mockResolvedValue(pengguna);

    await expect(getProfile()).resolves.toEqual({
      id: "user-1",
      name: "Ahmad",
      email: "ahmad@example.com",
      image: null,
      isSuperadmin: false,
    });
    expect(profileModel.findById).toHaveBeenCalledWith("user-1");
  });

  it("meneruskan image dan isSuperadmin dari model", async () => {
    vi.mocked(profileModel.findById).mockResolvedValue({
      ...pengguna,
      image: "https://example.com/avatar.png",
      isSuperadmin: true,
    });

    await expect(getProfile()).resolves.toMatchObject({
      image: "https://example.com/avatar.png",
      isSuperadmin: true,
    });
  });

  it("mengubah image kosong menjadi null", async () => {
    vi.mocked(profileModel.findById).mockResolvedValue({ ...pengguna, image: "" });

    await expect(getProfile()).resolves.toMatchObject({ image: null });
  });

  it("melempar NotFoundError bila baris tidak ada", async () => {
    vi.mocked(profileModel.findById).mockResolvedValue(null);

    await expect(getProfile()).rejects.toBeInstanceOf(NotFoundError);
  });

  it("meneruskan UnauthorizedError tanpa memanggil model", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());

    await expect(getProfile()).rejects.toBeInstanceOf(UnauthorizedError);
    expect(profileModel.findById).not.toHaveBeenCalled();
  });
});

describe("updateProfile", () => {
  beforeEach(() => {
    vi.mocked(profileModel.update).mockResolvedValue(pengguna);
  });

  it("memakai id dari sesi, bukan dari body", async () => {
    await updateProfile({ name: "Ahmad Baru", id: "penyusup" });

    expect(profileModel.update).toHaveBeenCalledWith("user-1", { name: "Ahmad Baru" });
  });

  it("mengubah name dan mengembalikan ProfileDto", async () => {
    vi.mocked(profileModel.update).mockResolvedValue({ ...pengguna, name: "Ahmad Baru" });

    await expect(updateProfile({ name: "Ahmad Baru" })).resolves.toMatchObject({
      name: "Ahmad Baru",
    });
  });

  it("mengirim image ke model bila diisi", async () => {
    await updateProfile({ name: "Ahmad Baru", image: "https://example.com/a.png" });

    expect(profileModel.update).toHaveBeenCalledWith("user-1", {
      name: "Ahmad Baru",
      image: "https://example.com/a.png",
    });
  });

  it("tidak mengirim image bila tidak disertakan", async () => {
    await updateProfile({ name: "Ahmad Baru" });

    expect(vi.mocked(profileModel.update).mock.calls[0][1]).not.toHaveProperty("image");
  });

  it("mengirim image null untuk menghapus avatar", async () => {
    await updateProfile({ name: "Ahmad Baru", image: null });

    expect(profileModel.update).toHaveBeenCalledWith("user-1", {
      name: "Ahmad Baru",
      image: null,
    });
  });

  it("menolak name kurang dari 3 karakter sebelum memanggil model", async () => {
    await expect(updateProfile({ name: "ab" })).rejects.toBeInstanceOf(ZodError);
    expect(profileModel.update).not.toHaveBeenCalled();
  });

  it("menolak image yang bukan http atau https", async () => {
    await expect(
      updateProfile({ name: "Ahmad Baru", image: "ftp://example.com/a.png" }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("meneruskan UnauthorizedError tanpa memanggil model", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());

    await expect(updateProfile({ name: "Ahmad Baru" })).rejects.toBeInstanceOf(UnauthorizedError);
    expect(profileModel.update).not.toHaveBeenCalled();
  });

  it("melempar NotFoundError bila baris tidak ditemukan", async () => {
    vi.mocked(profileModel.update).mockResolvedValue(null);

    await expect(updateProfile({ name: "Ahmad Baru" })).rejects.toBeInstanceOf(NotFoundError);
  });
});
