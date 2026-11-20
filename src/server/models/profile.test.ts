
import { beforeEach, describe, expect, it, vi } from "vitest";
import { profileModel } from "./profile";

// Membuat database tiruan agar tidak mengubah MySQL asli
const mock = vi.hoisted(() => ({
  select: vi.fn(),
  from: vi.fn(),
  whereBaca: vi.fn(),
  limit: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
  whereUbah: vi.fn(),
}));

vi.mock("@/server/db", () => ({
  db: {
    select: mock.select,
    update: mock.update,
  },
}));

describe("profileModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mock.select.mockReturnValue({ from: mock.from });
    mock.from.mockReturnValue({ where: mock.whereBaca });
    mock.whereBaca.mockReturnValue({ limit: mock.limit });

    mock.update.mockReturnValue({ set: mock.set });
    mock.set.mockReturnValue({ where: mock.whereUbah });
    mock.whereUbah.mockResolvedValue([]);
  });

  it("mengambil profil berdasarkan ID", async () => {
    const pengguna = {
      id: "user-1",
      name: "Fadlan",
      email: "fadlan@example.com",
      image: null,
    };

    mock.limit.mockResolvedValue([pengguna]);

    const hasil = await profileModel.cariPerId("user-1");

    expect(hasil).toEqual(pengguna);
  });

  it("mengembalikan null jika pengguna tidak ada", async () => {
    mock.limit.mockResolvedValue([]);

    const hasil = await profileModel.cariPerId("tidak-ada");

    expect(hasil).toBeNull();
  });

  it("mengubah nama pengguna", async () => {
    const profilBaru = {
      id: "user-1",
      name: "Fadlan Baru",
      email: "fadlan@example.com",
      image: null,
    };

    mock.limit.mockResolvedValue([profilBaru]);

    const hasil = await profileModel.ubah("user-1", {
      name: "Fadlan Baru",
    });

    expect(mock.update).toHaveBeenCalledTimes(1);
    expect(mock.set).toHaveBeenCalledWith({
      name: "Fadlan Baru",
    });
    expect(hasil?.name).toBe("Fadlan Baru");
  });
});
