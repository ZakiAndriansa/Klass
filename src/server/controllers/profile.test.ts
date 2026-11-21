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
      id: "user-1",
      name: "Ahmad",
      email: "ahmad@example.com",
      image: null,
      isSuperadmin: false,
    });
    expect(profileModel.cariPerId).toHaveBeenCalledWith("user-1");
  });

  it("meneruskan image dan isSuperadmin dari model", async () => {
    vi.mocked(profileModel.cariPerId).mockResolvedValue({
      ...pengguna,
      image: "https://example.com/avatar.png",
      isSuperadmin: true,
    });

    await expect(ambilProfile()).resolves.toMatchObject({
      image: "https://example.com/avatar.png",
      isSuperadmin: true,
    });
  });

  it("mengubah image kosong menjadi null", async () => {
    vi.mocked(profileModel.cariPerId).mockResolvedValue({ ...pengguna, image: "" });

    await expect(ambilProfile()).resolves.toMatchObject({ image: null });
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
    await ubahProfile({ name: "Ahmad Baru", id: "penyusup" });

    expect(profileModel.ubah).toHaveBeenCalledWith("user-1", { name: "Ahmad Baru" });
  });

  it("mengubah name dan mengembalikan ProfileDto", async () => {
    vi.mocked(profileModel.ubah).mockResolvedValue({ ...pengguna, name: "Ahmad Baru" });

    await expect(ubahProfile({ name: "Ahmad Baru" })).resolves.toMatchObject({
      name: "Ahmad Baru",
    });
  });

  it("mengirim image ke model bila diisi", async () => {
    await ubahProfile({ name: "Ahmad Baru", image: "https://example.com/a.png" });

    expect(profileModel.ubah).toHaveBeenCalledWith("user-1", {
      name: "Ahmad Baru",
      image: "https://example.com/a.png",
    });
  });

  it("tidak mengirim image bila tidak disertakan", async () => {
    await ubahProfile({ name: "Ahmad Baru" });

    expect(vi.mocked(profileModel.ubah).mock.calls[0][1]).not.toHaveProperty("image");
  });

  it("mengirim image null untuk menghapus avatar", async () => {
    await ubahProfile({ name: "Ahmad Baru", image: null });

    expect(profileModel.ubah).toHaveBeenCalledWith("user-1", {
      name: "Ahmad Baru",
      image: null,
    });
  });

  it("menolak name kurang dari 3 karakter sebelum memanggil model", async () => {
    await expect(ubahProfile({ name: "ab" })).rejects.toBeInstanceOf(ZodError);
    expect(profileModel.ubah).not.toHaveBeenCalled();
  });

  it("menolak image yang bukan http atau https", async () => {
    await expect(
      ubahProfile({ name: "Ahmad Baru", image: "ftp://example.com/a.png" }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it("meneruskan UnauthorizedError tanpa memanggil model", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());

    await expect(ubahProfile({ name: "Ahmad Baru" })).rejects.toBeInstanceOf(UnauthorizedError);
    expect(profileModel.ubah).not.toHaveBeenCalled();
  });

  it("melempar NotFoundError bila baris tidak ditemukan", async () => {
    vi.mocked(profileModel.ubah).mockResolvedValue(null);

    await expect(ubahProfile({ name: "Ahmad Baru" })).rejects.toBeInstanceOf(NotFoundError);
  });
});
