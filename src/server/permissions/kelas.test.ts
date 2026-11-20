import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAuth } from "@/server/auth";
import { UnauthorizedError } from "@/server/http/errors";
import { anggotaKelasModel } from "@/server/models/anggota-kelas";
import { kelasModel } from "@/server/models/kelas";
import { subkelasModel } from "@/server/models/subkelas";

import {
  bacaAksesKelas,
  requireClassAdmin,
  requireClassMember,
  requireSubclassManager,
  requireSubclassMember,
} from "./kelas";

/**
 * Uji izin per peran. Sesi dan model diganti tiruan, jadi uji ini tidak butuh database.
 *
 * Satu kelas ("kelas-a") dengan satu subkelas ("sub-a"), lalu dicoba oleh tiap peran:
 * tanpa login, superadmin, admin kelas, PJ subkelas itu, PJ subkelas lain, anggota,
 * dan orang luar (termasuk admin kelas lain dan yang di-ban, karena keduanya bukan anggota).
 */
vi.mock("@/server/auth", () => ({ requireAuth: vi.fn() }));
vi.mock("@/server/models/kelas", () => ({ kelasModel: { cariPerId: vi.fn() } }));
vi.mock("@/server/models/anggota-kelas", () => ({ anggotaKelasModel: { cariAnggota: vi.fn() } }));
vi.mock("@/server/models/subkelas", () => ({
  subkelasModel: { cariPerId: vi.fn(), cariPj: vi.fn(), daftarIdPerPj: vi.fn() },
}));

type Peran = "superadmin" | "admin" | "pj" | "pjLain" | "anggota" | "orangLuar";
type StatusKelas = "pending" | "active" | "rejected" | "archived";

const waktu = new Date("2026-11-20T03:00:00Z");

// Tipe hasil beberapa fungsi model tidak menyebut `null`, padahal nilainya bisa `null`
// bila barisnya tidak ada. Pembantu ini dipakai supaya tiruannya boleh mengembalikan `null`.
const atauNull = <T>(nilai: T | null) => nilai as T;

/** Menyiapkan keadaan: siapa yang login, dan seperti apa kelasnya. */
function sebagai(
  peran: Peran | "tanpaLogin",
  kelas: { status?: StatusKelas; isListed?: boolean } | null = {},
) {
  if (peran === "tanpaLogin") {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
  } else {
    vi.mocked(requireAuth).mockResolvedValue({
      id: `u-${peran}`,
      name: peran,
      email: `${peran}@klass.test`,
      isSuperadmin: peran === "superadmin",
    } as Awaited<ReturnType<typeof requireAuth>>);
  }

  vi.mocked(kelasModel.cariPerId).mockResolvedValue(
    kelas === null
      ? null
      : ({
          id: "kelas-a",
          name: "Kelas A",
          status: kelas.status ?? "active",
          isListed: kelas.isListed ?? true,
        } as Awaited<ReturnType<typeof kelasModel.cariPerId>>),
  );

  const role = peran === "admin" ? "admin" : "member";
  const anggota = ["admin", "pj", "pjLain", "anggota"].includes(peran);
  vi.mocked(anggotaKelasModel.cariAnggota).mockResolvedValue(
    atauNull(anggota ? { classId: "kelas-a", userId: `u-${peran}`, role, createdAt: waktu } : null),
  );

  vi.mocked(subkelasModel.cariPerId).mockImplementation(async (id) =>
    atauNull(
      id === "sub-a"
        ? {
            id: "sub-a",
            classId: "kelas-a",
            name: "Basis Data",
            createdAt: waktu,
            updatedAt: waktu,
          }
        : null,
    ),
  );
  // "pj" memegang sub-a; "pjLain" memegang subkelas lain di kelas yang sama.
  vi.mocked(subkelasModel.cariPj).mockImplementation(async (subclassId, userId) =>
    atauNull(
      subclassId === "sub-a" && userId === "u-pj" ? { subclassId, userId, createdAt: waktu } : null,
    ),
  );
  vi.mocked(subkelasModel.daftarIdPerPj).mockImplementation(async (_classId, userId) =>
    userId === "u-pj" ? ["sub-a"] : userId === "u-pjLain" ? ["sub-b"] : [],
  );
}

/** Status HTTP dari galat yang dilempar, atau 200 bila lolos. */
async function status(aksi: () => Promise<unknown>): Promise<number> {
  try {
    await aksi();
    return 200;
  } catch (galat) {
    return (galat as { status?: number }).status ?? 500;
  }
}

beforeEach(() => vi.resetAllMocks());

describe("requireClassMember (melihat isi kelas)", () => {
  it.each<[Peran | "tanpaLogin", number]>([
    ["tanpaLogin", 401],
    ["superadmin", 200],
    ["admin", 200],
    ["pj", 200],
    ["anggota", 200],
    ["orangLuar", 403],
  ])("%s -> %i", async (peran, harapan) => {
    sebagai(peran);
    expect(await status(() => requireClassMember("kelas-a"))).toBe(harapan);
  });

  it("orang luar mendapat 404 di kelas yang tidak terdaftar, supaya keberadaannya tidak bocor", async () => {
    sebagai("orangLuar", { isListed: false });
    expect(await status(() => requireClassMember("kelas-a"))).toBe(404);
  });

  it("superadmin tetap boleh melihat kelas yang tidak terdaftar, dengan role null", async () => {
    sebagai("superadmin", { isListed: false });
    await expect(requireClassMember("kelas-a")).resolves.toMatchObject({ role: null });
  });

  it("anggota masih boleh membaca kelas yang diarsipkan", async () => {
    sebagai("anggota", { status: "archived" });
    expect(await status(() => requireClassMember("kelas-a"))).toBe(200);
  });

  it.each<StatusKelas>(["pending", "rejected"])(
    "kelas berstatus %s dianggap tidak ada, bahkan untuk admin",
    async (statusKelas) => {
      sebagai("admin", { status: statusKelas });
      expect(await status(() => requireClassMember("kelas-a"))).toBe(404);
    },
  );

  it("kelas yang tidak ada dijawab 404", async () => {
    sebagai("admin", null);
    expect(await status(() => requireClassMember("tidak-ada"))).toBe(404);
  });

  it("yang belum login mendapat 401 walaupun kelasnya tidak ada", async () => {
    sebagai("tanpaLogin", null);
    expect(await status(() => requireClassMember("tidak-ada"))).toBe(401);
    expect(kelasModel.cariPerId).not.toHaveBeenCalled();
  });
});

describe("requireClassAdmin (mengatur kelas)", () => {
  it.each<[Peran | "tanpaLogin", number]>([
    ["tanpaLogin", 401],
    ["superadmin", 403],
    ["admin", 200],
    ["pj", 403],
    ["anggota", 403],
    ["orangLuar", 403],
  ])("%s -> %i", async (peran, harapan) => {
    sebagai(peran);
    expect(await status(() => requireClassAdmin("kelas-a"))).toBe(harapan);
  });

  it("mengembalikan pengguna, kelas, dan perannya bila lolos", async () => {
    sebagai("admin");
    await expect(requireClassAdmin("kelas-a")).resolves.toMatchObject({
      user: { id: "u-admin" },
      kelas: { id: "kelas-a" },
      role: "admin",
    });
  });

  it("orang luar mendapat 404 di kelas yang tidak terdaftar", async () => {
    sebagai("orangLuar", { isListed: false });
    expect(await status(() => requireClassAdmin("kelas-a"))).toBe(404);
  });

  it("menolak mengubah kelas yang diarsipkan dengan 409", async () => {
    sebagai("admin", { status: "archived" });
    expect(await status(() => requireClassAdmin("kelas-a"))).toBe(409);
  });

  it("admin boleh membaca kelas yang diarsipkan bila bolehArsip", async () => {
    sebagai("admin", { status: "archived" });
    expect(await status(() => requireClassAdmin("kelas-a", { bolehArsip: true }))).toBe(200);
  });

  it("anggota biasa tetap 403 di kelas yang diarsipkan, bukan 409", async () => {
    sebagai("anggota", { status: "archived" });
    expect(await status(() => requireClassAdmin("kelas-a"))).toBe(403);
  });
});

describe("requireSubclassManager (mengelola materi, jadwal, tugas)", () => {
  it.each<[Peran | "tanpaLogin", number]>([
    ["tanpaLogin", 401],
    ["superadmin", 403],
    ["admin", 200],
    ["pj", 200],
    ["pjLain", 403],
    ["anggota", 403],
    ["orangLuar", 403],
  ])("%s -> %i", async (peran, harapan) => {
    sebagai(peran);
    expect(await status(() => requireSubclassManager("sub-a"))).toBe(harapan);
  });

  it("mengembalikan subkelas dan kelasnya bila lolos", async () => {
    sebagai("pj");
    await expect(requireSubclassManager("sub-a")).resolves.toMatchObject({
      user: { id: "u-pj" },
      kelas: { id: "kelas-a" },
      subkelas: { id: "sub-a" },
      role: "member",
    });
  });

  it("subkelas yang tidak ada dijawab 404", async () => {
    sebagai("admin");
    expect(await status(() => requireSubclassManager("tidak-ada"))).toBe(404);
  });

  it("orang luar mendapat 404 bila kelasnya tidak terdaftar", async () => {
    sebagai("orangLuar", { isListed: false });
    expect(await status(() => requireSubclassManager("sub-a"))).toBe(404);
  });

  it("PJ tidak bisa mengubah subkelas di kelas yang diarsipkan (409)", async () => {
    sebagai("pj", { status: "archived" });
    expect(await status(() => requireSubclassManager("sub-a"))).toBe(409);
  });
});

describe("requireSubclassMember (melihat isi subkelas)", () => {
  it.each<[Peran | "tanpaLogin", number]>([
    ["tanpaLogin", 401],
    ["superadmin", 200],
    ["admin", 200],
    ["pj", 200],
    ["pjLain", 200],
    ["anggota", 200],
    ["orangLuar", 403],
  ])("%s -> %i", async (peran, harapan) => {
    sebagai(peran);
    expect(await status(() => requireSubclassMember("sub-a"))).toBe(harapan);
  });
});

describe("bacaAksesKelas (ringkasan hak untuk frontend)", () => {
  it("admin kelas", async () => {
    sebagai("admin");
    await expect(bacaAksesKelas("kelas-a")).resolves.toMatchObject({
      role: "admin",
      pjSubclassIds: [],
    });
  });

  it("PJ mendapat daftar subkelas yang dipegangnya", async () => {
    sebagai("pj");
    await expect(bacaAksesKelas("kelas-a")).resolves.toMatchObject({
      role: "member",
      pjSubclassIds: ["sub-a"],
    });
  });

  it("orang luar di kelas terdaftar tidak ditolak, tetapi role-nya null", async () => {
    sebagai("orangLuar");
    await expect(bacaAksesKelas("kelas-a")).resolves.toMatchObject({
      role: null,
      pjSubclassIds: [],
    });
    expect(subkelasModel.daftarIdPerPj).not.toHaveBeenCalled();
  });

  it("orang luar di kelas tidak terdaftar mendapat 404", async () => {
    sebagai("orangLuar", { isListed: false });
    expect(await status(() => bacaAksesKelas("kelas-a"))).toBe(404);
  });

  it("yang belum login mendapat 401", async () => {
    sebagai("tanpaLogin");
    expect(await status(() => bacaAksesKelas("kelas-a"))).toBe(401);
  });
});
