import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { requireAuth } from "@/server/auth";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/server/http/errors";
import { subclassModel } from "@/server/models/subclass";
import { requireClassAdmin } from "@/server/permissions";

import { createSubclass, updateSubclass } from "./subclass";

// Mocking model Fadlan
vi.mock("@/server/models/subclass", () => ({
  subclassModel: {
    create: vi.fn(),
    update: vi.fn(),
    findById: vi.fn(),
  },
}));
// Mocking auth Zaki
vi.mock("@/server/auth", () => ({
  requireAuth: vi.fn(),
}));
// Mocking lapisan izin Zaki
vi.mock("@/server/permissions", () => ({
  requireClassAdmin: vi.fn(),
}));

type AksesAdmin = Awaited<ReturnType<typeof requireClassAdmin>>;

const mockAksesAdmin = {
  user: {
    id: "user-admin",
    name: "Admin",
    email: "admin@test.com",
    image: null,
    isSuperadmin: false,
  },
  role: "admin" as const,
  pjSubclassIds: [],
} as unknown as AksesAdmin;

describe("subkelas controller - createSubclass", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Tes TANPA description (description otomatis null)
  it("berhasil membuat subkelas tanpa deskripsi bila pemanggil adalah admin kelas", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Algoritma & Pemrograman",
      description: null,
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await createSubclass("kelas-abc", {
      name: "Algoritma & Pemrograman",
    });

    expect(requireClassAdmin).toHaveBeenCalledWith("kelas-abc");
    expect(subclassModel.create).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Algoritma & Pemrograman",
        description: null,
      },
      [],
    );
    expect(hasil).toEqual({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Algoritma & Pemrograman",
      description: null,
      createdAt: sekarang.toISOString(),
      updatedAt: sekarang.toISOString(),
    });
  });

  // 2. Tes DENGAN description
  it("berhasil membuat subkelas sekaligus menunjuk PJ awal", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Basis Data",
      description: "Kelas praktikum semester 3",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await createSubclass("kelas-abc", {
      name: "Basis Data",
      description: "Kelas praktikum semester 3",
      pjUserIds: ["user-2"],
    });

    expect(subclassModel.create).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Basis Data",
        description: "Kelas praktikum semester 3",
      },
      ["user-2"],
    );
    expect(hasil.name).toBe("Basis Data");
    expect(hasil.description).toBe("Kelas praktikum semester 3");
  });

  // 3. Tes BARU: mengubah deskripsi kosong atau hanya spasi menjadi null
  it("mengubah deskripsi kosong atau hanya spasi menjadi null", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Jaringan Komputer",
      description: null,
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await createSubclass("kelas-abc", {
      name: "Jaringan Komputer",
      description: "   ",
    });

    expect(subclassModel.create).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Jaringan Komputer",
        description: null,
      },
      [],
    );
    expect(hasil.description).toBeNull();
  });

  it("menolak pembuatan dan tidak memanggil model bila pemanggil bukan admin kelas", async () => {
    vi.mocked(requireClassAdmin).mockRejectedValue(
      new ForbiddenError("Kamu tidak punya izin untuk aksi ini."),
    );

    await expect(createSubclass("kelas-abc", { name: "Basis Data" })).rejects.toThrow(
      ForbiddenError,
    );

    expect(subclassModel.create).not.toHaveBeenCalled();
  });

  it("melempar NotFoundError bila kelas tidak ditemukan di database", async () => {
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockResolvedValue(null);

    await expect(createSubclass("kelas-palsu", { name: "Basis Data" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("meneruskan ConflictError bila PJ awal bukan anggota kelas", async () => {
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockRejectedValue(
      new ConflictError("PJ harus terdaftar sebagai anggota kelas yang sama."),
    );

    await expect(
      createSubclass("kelas-abc", {
        name: "Basis Data",
        description: "Kelas praktikum semester 3",
        pjUserIds: ["user-luar"],
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("menolak pembuatan jika nama subkelas kosong (validasi Zod)", async () => {
    await expect(createSubclass("kelas-abc", { name: "" })).rejects.toThrow(ZodError);
    expect(subclassModel.create).not.toHaveBeenCalled();
  });

  // 4. Tes BARU: menolak jika deskripsi melebihi 125 karakter
  it("menolak pembuatan jika deskripsi melebihi 125 karakter (validasi Zod)", async () => {
    const deskripsiPanjang = "a".repeat(126);
    await expect(
      createSubclass("kelas-abc", {
        name: "Basis Data",
        description: deskripsiPanjang,
      }),
    ).rejects.toThrow(ZodError);
    expect(subclassModel.create).not.toHaveBeenCalled();
  });

  it("menerima dua PJ awal", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Basis Data",
      description: "Kelas praktikum semester 3",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    await createSubclass("kelas-abc", {
      name: "Basis Data",
      description: "Kelas praktikum semester 3",
      pjUserIds: ["user-2", "user-3"],
    });

    expect(subclassModel.create).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Basis Data",
        description: "Kelas praktikum semester 3",
      },
      ["user-2", "user-3"],
    );
  });

  it("menolak pembuatan jika PJ awal lebih dari 2 orang (validasi Zod)", async () => {
    await expect(
      createSubclass("kelas-abc", {
        name: "Basis Data",
        description: "Kelas praktikum semester 3",
        pjUserIds: ["user-2", "user-3", "user-4"],
      }),
    ).rejects.toThrow(ZodError);
    expect(subclassModel.create).not.toHaveBeenCalled();
  });

  it("menolak pembuatan jika nama subkelas melebihi 150 karakter (validasi Zod)", async () => {
    const namaPanjang = "a".repeat(151);
    await expect(createSubclass("kelas-abc", { name: namaPanjang })).rejects.toThrow(ZodError);
    expect(subclassModel.create).not.toHaveBeenCalled();
  });
});

describe("subkelas controller - updateSubclass", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(mockAksesAdmin.user as never);
  });

  it("menolak pengubahan dan tidak mencari subkelas bila pemanggil belum login", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError("Belum login."));

    await expect(updateSubclass("sub-1", { name: "PPW" })).rejects.toThrow(UnauthorizedError);

    expect(subclassModel.findById).not.toHaveBeenCalled();
    expect(subclassModel.update).not.toHaveBeenCalled();
  });

  it("berhasil mengubah nama dan deskripsi subkelas bila pemanggil adalah admin kelas", async () => {
    const sekarang = new Date();
    vi.mocked(subclassModel.findById).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: "Ini kelas DPBO",
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.update).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "PPW",
      description: "Ini kelas PPW",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await updateSubclass("sub-1", { name: "PPW", description: "Ini kelas PPW" });

    expect(requireAuth).toHaveBeenCalled();
    expect(subclassModel.findById).toHaveBeenCalledWith("sub-1");
    expect(requireClassAdmin).toHaveBeenCalledWith("kelas-abc");
    expect(subclassModel.update).toHaveBeenCalledWith("kelas-abc", "sub-1", {
      name: "PPW",
      description: "Ini kelas PPW",
    });
    expect(hasil.name).toBe("PPW");
    expect(hasil.description).toBe("Ini kelas PPW");
  });

  it("berhasil mengubah hanya deskripsi tanpa mengirim nama", async () => {
    const sekarang = new Date();
    vi.mocked(subclassModel.findById).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: "Deskripsi Lama",
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.update).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: "Deskripsi Baru",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await updateSubclass("sub-1", { description: "Deskripsi Baru" });

    expect(subclassModel.update).toHaveBeenCalledWith("kelas-abc", "sub-1", {
      description: "Deskripsi Baru",
    });
    expect(hasil.description).toBe("Deskripsi Baru");
  });

  it("berhasil mengubah hanya nama tanpa menyentuh deskripsi", async () => {
    const sekarang = new Date();
    vi.mocked(subclassModel.findById).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: "Deskripsi Lama",
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.update).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO Lanjut",
      description: "Deskripsi Lama",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await updateSubclass("sub-1", { name: "DPBO Lanjut" });

    expect(subclassModel.update).toHaveBeenCalledWith("kelas-abc", "sub-1", {
      name: "DPBO Lanjut",
    });
    expect(hasil.name).toBe("DPBO Lanjut");
  });

  it("mengosongkan deskripsi bila dikirim string kosong", async () => {
    const sekarang = new Date();
    vi.mocked(subclassModel.findById).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: "Deskripsi Lama",
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.update).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: null,
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    await updateSubclass("sub-1", { description: "" });

    expect(subclassModel.update).toHaveBeenCalledWith("kelas-abc", "sub-1", {
      description: null,
    });
  });

  it("menolak pengubahan dan tidak memanggil model bila pemanggil bukan admin kelas", async () => {
    const sekarang = new Date();
    vi.mocked(subclassModel.findById).mockResolvedValue({
      id: "sub-1",
      classId: "kelas-abc",
      name: "DPBO",
      description: "Ini kelas DPBO",
      createdAt: sekarang,
      updatedAt: sekarang,
    });
    vi.mocked(requireClassAdmin).mockRejectedValue(
      new ForbiddenError("Kamu tidak punya izin untuk aksi ini."),
    );

    await expect(updateSubclass("sub-1", { name: "Nama Baru" })).rejects.toThrow(ForbiddenError);

    expect(subclassModel.update).not.toHaveBeenCalled();
  });

  it("melempar NotFoundError bila subkelas tidak ditemukan", async () => {
    vi.mocked(subclassModel.findById).mockResolvedValue(null as never);

    await expect(updateSubclass("sub-palsu", { name: "Nama Baru" })).rejects.toThrow(NotFoundError);

    expect(requireClassAdmin).not.toHaveBeenCalled();
    expect(subclassModel.update).not.toHaveBeenCalled();
  });

  it("menolak pengubahan jika nama dikirim sebagai string kosong (validasi Zod)", async () => {
    await expect(updateSubclass("sub-1", { name: "" })).rejects.toThrow(ZodError);

    expect(subclassModel.update).not.toHaveBeenCalled();
  });

  it("menolak pengubahan jika nama melebihi 150 karakter (validasi Zod)", async () => {
    const namaPanjang = "a".repeat(151);
    await expect(updateSubclass("sub-1", { name: namaPanjang })).rejects.toThrow(ZodError);

    expect(subclassModel.update).not.toHaveBeenCalled();
  });

  it("menolak pengubahan jika deskripsi melebihi 125 karakter (validasi Zod)", async () => {
    const deskripsiPanjang = "a".repeat(126);
    await expect(updateSubclass("sub-1", { description: deskripsiPanjang })).rejects.toThrow(
      ZodError,
    );

    expect(subclassModel.update).not.toHaveBeenCalled();
  });
});
