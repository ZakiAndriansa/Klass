import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError, NotFoundError } from "@/server/http/errors";
import { subkelasModel } from "@/server/models/subkelas";

import { buatSubkelas } from "./subclass";

// Mocking model Fadlan
vi.mock("@/server/models/subkelas", () => ({
  subkelasModel: {
    buat: vi.fn(),
  },
}));

describe("subkelas controller - buatSubkelas (tanpa izin Zaki)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("berhasil membuat subkelas bila masukan valid", async () => {
    const sekarang = new Date();
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

  it("melempar NotFoundError bila kelas tidak ditemukan di database", async () => {
    vi.mocked(subkelasModel.buat).mockResolvedValue(null);

    await expect(buatSubkelas("kelas-palsu", { name: "Basis Data" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("meneruskan ConflictError bila PJ awal bukan anggota kelas", async () => {
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
    await expect(buatSubkelas("kelas-abc", { name: "" })).rejects.toThrow();
    expect(subkelasModel.buat).not.toHaveBeenCalled();
  });

  it("menolak pembuatan jika nama subkelas melebihi 150 karakter (validasi Zod)", async () => {
    const namaPanjang = "a".repeat(151);
    await expect(buatSubkelas("kelas-abc", { name: namaPanjang })).rejects.toThrow();
    expect(subkelasModel.buat).not.toHaveBeenCalled();
  });
});
