import "server-only";

import { requireAuth, type Sesi } from "@/server/auth";
import { ConflictError, ForbiddenError, NotFoundError } from "@/server/http/errors";
import { anggotaKelasModel } from "@/server/models/anggota-kelas";
import { kelasModel } from "@/server/models/kelas";
import { subkelasModel } from "@/server/models/subkelas";
import type { PeranKelas } from "@/types/api/class-access";

/**
 * Izin tingkat kelas. Pemilik: Zaki.
 *
 * Controller memanggil salah satu fungsi `require...` SEBELUM memanggil model:
 *
 *   const { user, kelas } = await requireClassAdmin(classId);
 *
 * Bila lolos, fungsi mengembalikan siapa penggunanya dan kelasnya. Bila tidak,
 * fungsi melempar galat yang diubah `handle()` menjadi respons:
 *
 *   belum login                                  401 UNAUTHORIZED
 *   kelas tidak ada, atau belum disetujui        404 NOT_FOUND
 *   bukan anggota, kelasnya tidak terdaftar      404 NOT_FOUND (supaya keberadaannya tidak bocor)
 *   bukan anggota, kelasnya terdaftar            403 FORBIDDEN
 *   anggota, tetapi perannya kurang              403 FORBIDDEN
 *   kelas sudah diarsipkan dan aksinya mengubah  409 CONFLICT
 *
 * Peran berlaku per kelas. Orang yang sama bisa admin di satu kelas dan anggota
 * biasa di kelas lain, jadi yang diperiksa selalu `classId` yang diminta.
 */

type Pengguna = Sesi["user"];
type Kelas = NonNullable<Awaited<ReturnType<typeof kelasModel.cariPerId>>>;

export type AksesKelas = {
  user: Pengguna;
  kelas: Kelas;
  /** `null` berarti bukan anggota kelas ini. */
  role: PeranKelas | null;
};

/** Untuk endpoint yang hanya membaca: kelas yang diarsipkan tetap boleh dibuka. */
export type OpsiIzin = { bolehArsip?: boolean };

const PESAN_TIDAK_ADA = "Kelas tidak ditemukan.";
const PESAN_BUKAN_ADMIN = "Hanya admin kelas yang boleh melakukan ini.";
const PESAN_BUKAN_PENGELOLA = "Hanya admin kelas atau PJ subkelas ini yang boleh melakukan ini.";

/**
 * Siapa pengguna ini di kelas tersebut. Tidak menolak yang bukan anggota;
 * penolakan dilakukan fungsi `require...` di bawah.
 */
async function muatAkses(classId: string, pengguna?: Pengguna): Promise<AksesKelas> {
  // Login diperiksa paling dulu, supaya yang belum login selalu mendapat 401.
  const user = pengguna ?? (await requireAuth());

  const kelas = await kelasModel.cariPerId(classId);
  // Pengajuan yang belum disetujui atau ditolak belum menjadi kelas.
  if (!kelas || kelas.status === "pending" || kelas.status === "rejected") {
    throw new NotFoundError(PESAN_TIDAK_ADA);
  }

  const anggota = await anggotaKelasModel.cariAnggota(classId, user.id);

  return { user, kelas, role: anggota?.role ?? null };
}

/** Kelas yang tidak terdaftar dianggap tidak ada bagi orang luar. */
function tolakOrangLuar(kelas: Kelas): never {
  if (!kelas.isListed) throw new NotFoundError(PESAN_TIDAK_ADA);
  throw new ForbiddenError("Kamu belum menjadi anggota kelas ini.");
}

function pastikanBolehDiubah(kelas: Kelas, { bolehArsip = false }: OpsiIzin) {
  if (kelas.status === "archived" && !bolehArsip) {
    throw new ConflictError("Kelas ini sudah diarsipkan, jadi isinya tidak bisa diubah.");
  }
}

/**
 * Boleh MELIHAT isi kelas: anggota kelas itu, atau superadmin (untuk moderasi).
 * Superadmin yang bukan anggota mendapat `role: null`.
 */
export async function requireClassMember(classId: string): Promise<AksesKelas> {
  return pastikanBolehMelihat(await muatAkses(classId));
}

function pastikanBolehMelihat(akses: AksesKelas): AksesKelas {
  if (akses.role === null && !akses.user.isSuperadmin) tolakOrangLuar(akses.kelas);
  return akses;
}

/**
 * Boleh MENGATUR kelas: hanya admin kelas itu. Superadmin tidak termasuk,
 * karena superadmin mengurus website, bukan isi kelas.
 *
 * Kelas yang diarsipkan ditolak, kecuali `bolehArsip: true` (endpoint baca saja).
 */
export async function requireClassAdmin(
  classId: string,
  opsi: OpsiIzin = {},
): Promise<AksesKelas & { role: "admin" }> {
  const akses = await muatAkses(classId);

  if (akses.role === null) {
    // Superadmin boleh tahu kelasnya ada, jadi jawabannya 403, bukan 404.
    if (akses.user.isSuperadmin) throw new ForbiddenError(PESAN_BUKAN_ADMIN);
    tolakOrangLuar(akses.kelas);
  }
  if (akses.role !== "admin") throw new ForbiddenError(PESAN_BUKAN_ADMIN);
  pastikanBolehDiubah(akses.kelas, opsi);

  return { ...akses, role: "admin" };
}

/**
 * Boleh MENGELOLA satu subkelas (materi, jadwal, tugas): admin kelasnya, atau
 * PJ subkelas ITU. PJ subkelas lain di kelas yang sama tidak boleh.
 */
export async function requireSubclassManager(subclassId: string, opsi: OpsiIzin = {}) {
  const { akses, subkelas } = await muatAksesSubkelas(subclassId);

  if (akses.role !== "admin") {
    const pj = await subkelasModel.cariPj(subclassId, akses.user.id);
    if (!pj) throw new ForbiddenError(PESAN_BUKAN_PENGELOLA);
  }
  pastikanBolehDiubah(akses.kelas, opsi);

  return { ...akses, subkelas };
}

/** Boleh MELIHAT isi satu subkelas: anggota kelasnya, atau superadmin. */
export async function requireSubclassMember(subclassId: string) {
  const { akses, subkelas } = await muatAksesSubkelas(subclassId);
  return { ...akses, subkelas };
}

async function muatAksesSubkelas(subclassId: string) {
  const user = await requireAuth();

  const subkelas = await subkelasModel.cariPerId(subclassId);
  if (!subkelas) throw new NotFoundError("Subkelas tidak ditemukan.");

  let akses: AksesKelas;
  try {
    akses = pastikanBolehMelihat(await muatAkses(subkelas.classId, user));
  } catch (galat) {
    // Kelasnya tidak boleh diketahui, maka subkelasnya juga tidak.
    if (galat instanceof NotFoundError) throw new NotFoundError("Subkelas tidak ditemukan.");
    throw galat;
  }

  return { akses, subkelas };
}

/**
 * Ringkasan hak pengguna di satu kelas, untuk dikirim ke frontend
 * (`GET /api/v1/classes/{classId}/access`). Berbeda dari `requireClassMember`,
 * orang luar di kelas TERDAFTAR tidak ditolak: ia mendapat `role: null`,
 * supaya halaman bisa menampilkan tombol gabung.
 */
export async function bacaAksesKelas(classId: string) {
  const akses = await muatAkses(classId);

  if (akses.role === null && !akses.kelas.isListed && !akses.user.isSuperadmin) {
    throw new NotFoundError(PESAN_TIDAK_ADA);
  }

  const pjSubclassIds =
    akses.role === null ? [] : await subkelasModel.daftarIdPerPj(classId, akses.user.id);

  return { ...akses, pjSubclassIds };
}
