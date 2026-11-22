import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { ConflictError, ForbiddenError, NotFoundError } from "@/server/http/errors";
import { subclassModel } from "@/server/models/subclass";
import { requireClassAdmin } from "@/server/permissions";

import { createSubclass } from "./subclass";

// Mocking model Fadlan
vi.mock("@/server/models/subclass", () => ({
  subclassModel: {
    create: vi.fn(),
  },
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

  it("berhasil membuat subkelas bila pemanggil adalah admin kelas", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subclassModel.create).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Algoritma & Pemrograman",
      description: "Kelas praktikum semester 3",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await createSubclass("kelas-abc", {
      name: "Algoritma & Pemrograman",
      description: "Kelas praktikum semester 3",
    });

    expect(requireClassAdmin).toHaveBeenCalledWith("kelas-abc");
    expect(subclassModel.create).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Algoritma & Pemrograman",
        description: "Kelas praktikum semester 3",
      },
      [],
    );
    expect(hasil).toEqual({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Algoritma & Pemrograman",
      description: "Kelas praktikum semester 3",
      createdAt: sekarang.toISOString(),
      updatedAt: sekarang.toISOString(),
    });
  });

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
        description: "Kelas praktikum semester 3"
      },
      ["user-2"],
    );
    expect(hasil.name).toBe("Basis Data");
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

    await createSubclass("kelas-abc", 
      { 
        name: "Basis Data",
        description: "Kelas praktikum semester 3",
        pjUserIds: ["user-2", "user-3"] 
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
