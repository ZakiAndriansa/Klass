import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { ConflictError, ForbiddenError, NotFoundError } from "@/server/http/errors";
import { subkelasModel } from "@/server/models/subkelas";
import { requireClassAdmin } from "@/server/permissions";

import { buatSubkelas } from "./subclass";

// Mocking model Fadlan
vi.mock("@/server/models/subkelas", () => ({
  subkelasModel: {
    buat: vi.fn(),
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

describe("subkelas controller - buatSubkelas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("berhasil membuat subkelas bila pemanggil adalah admin kelas", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subkelasModel.buat).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Algoritma & Pemrograman",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await buatSubkelas("kelas-abc", {
      name: "Algoritma & Pemrograman",
    });

    expect(requireClassAdmin).toHaveBeenCalledWith("kelas-abc");
    expect(subkelasModel.buat).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Algoritma & Pemrograman",
      },
      [],
    );
    expect(hasil).toEqual({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Algoritma & Pemrograman",
      createdAt: sekarang.toISOString(),
      updatedAt: sekarang.toISOString(),
    });
  });

  it("berhasil membuat subkelas sekaligus menunjuk PJ awal", async () => {
    const sekarang = new Date();
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subkelasModel.buat).mockResolvedValue({
      id: "sub-123",
      classId: "kelas-abc",
      name: "Basis Data",
      createdAt: sekarang,
      updatedAt: sekarang,
    });

    const hasil = await buatSubkelas("kelas-abc", {
      name: "Basis Data",
      pjAwal: ["user-2"],
    });

    expect(subkelasModel.buat).toHaveBeenCalledWith(
      {
        classId: "kelas-abc",
        name: "Basis Data",
      },
      ["user-2"],
    );
    expect(hasil.name).toBe("Basis Data");
  });

  it("menolak pembuatan dan tidak memanggil model bila pemanggil bukan admin kelas", async () => {
    vi.mocked(requireClassAdmin).mockRejectedValue(
      new ForbiddenError("Kamu tidak punya izin untuk aksi ini."),
    );

    await expect(buatSubkelas("kelas-abc", { name: "Basis Data" })).rejects.toThrow(ForbiddenError);

    expect(subkelasModel.buat).not.toHaveBeenCalled();
  });

  it("melempar NotFoundError bila kelas tidak ditemukan di database", async () => {
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subkelasModel.buat).mockResolvedValue(null);

    await expect(buatSubkelas("kelas-palsu", { name: "Basis Data" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("meneruskan ConflictError bila PJ awal bukan anggota kelas", async () => {
    vi.mocked(requireClassAdmin).mockResolvedValue(mockAksesAdmin);
    vi.mocked(subkelasModel.buat).mockRejectedValue(
      new ConflictError("PJ harus terdaftar sebagai anggota kelas yang sama."),
    );

    await expect(
      buatSubkelas("kelas-abc", {
        name: "Basis Data",
        pjAwal: ["user-luar"],
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("menolak pembuatan jika nama subkelas kosong (validasi Zod)", async () => {
    await expect(buatSubkelas("kelas-abc", { name: "" })).rejects.toThrow(ZodError);
    expect(subkelasModel.buat).not.toHaveBeenCalled();
  });

  it("menolak pembuatan jika nama subkelas melebihi 150 karakter (validasi Zod)", async () => {
    const namaPanjang = "a".repeat(151);
    await expect(buatSubkelas("kelas-abc", { name: namaPanjang })).rejects.toThrow(ZodError);
    expect(subkelasModel.buat).not.toHaveBeenCalled();
  });
});
