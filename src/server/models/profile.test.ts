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

const pengguna = {
  id: "user-1",
  name: "Fadlan",
  email: "fadlan@example.com",
  image: null,
  isSuperadmin: false,
};

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
    mock.limit.mockResolvedValue([pengguna]);

    const hasil = await profileModel.findById("user-1");

    expect(hasil).toEqual(pengguna);
  });

  it("hanya membaca kolom profil, termasuk penanda superadmin", async () => {
    mock.limit.mockResolvedValue([pengguna]);

    await profileModel.findById("user-1");

    const kolom = Object.keys(mock.select.mock.calls[0][0]);
    expect(kolom).toEqual(["id", "name", "email", "image", "isSuperadmin"]);
  });

  it("mengembalikan null jika pengguna tidak ada", async () => {
    mock.limit.mockResolvedValue([]);

    const hasil = await profileModel.findById("tidak-ada");

    expect(hasil).toBeNull();
  });

  it("mengubah nama pengguna", async () => {
    mock.limit.mockResolvedValue([{ ...pengguna, name: "Fadlan Baru" }]);

    const hasil = await profileModel.update("user-1", {
      name: "Fadlan Baru",
    });

    expect(mock.update).toHaveBeenCalledTimes(1);
    expect(mock.set).toHaveBeenCalledWith({
      name: "Fadlan Baru",
    });
    expect(hasil?.name).toBe("Fadlan Baru");
  });

  it("menghapus foto bila image diisi null", async () => {
    mock.limit.mockResolvedValue([pengguna]);

    await profileModel.update("user-1", { image: null });

    expect(mock.set).toHaveBeenCalledWith({ image: null });
  });

  it("tidak menyimpan kunci selain name dan image", async () => {
    mock.limit.mockResolvedValue([pengguna]);

    // Meniru controller yang keliru meneruskan objek berisi kunci tambahan.
    const masukan = { name: "Fadlan", isSuperadmin: true, email: "lain@example.com" };
    await profileModel.update("user-1", masukan);

    expect(mock.set).toHaveBeenCalledWith({ name: "Fadlan" });
  });

  it("tidak menjalankan UPDATE bila tidak ada yang diubah", async () => {
    mock.limit.mockResolvedValue([pengguna]);

    const hasil = await profileModel.update("user-1", {});

    expect(mock.update).not.toHaveBeenCalled();
    expect(hasil).toEqual(pengguna);
  });
});
