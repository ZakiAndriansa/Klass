import "server-only";

import { requireAuth, type Session } from "@/server/auth";
import { ConflictError, ForbiddenError, NotFoundError } from "@/server/http/errors";
import { classMemberModel } from "@/server/models/class-member";
import { classModel } from "@/server/models/class";
import { subclassModel } from "@/server/models/subclass";
import type { ClassRole } from "@/types/api/class-access";

/**
 * Izin tingkat kelas. Pemilik: Zaki.
 *
 * Controller memanggil salah satu fungsi `require...` SEBELUM memanggil model:
 *
 *   const { user, classData } = await requireClassAdmin(classId);
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

type User = Session["user"];
type ClassRow = NonNullable<Awaited<ReturnType<typeof classModel.findById>>>;

export type ClassAccess = {
  user: User;
  classData: ClassRow;
  /** `null` berarti bukan anggota kelas ini. */
  role: ClassRole | null;
};

/** Untuk endpoint yang hanya membaca: kelas yang diarsipkan tetap boleh dibuka. */
export type PermissionOptions = { allowArchived?: boolean };

const MESSAGE_NOT_FOUND = "Kelas tidak ditemukan.";
const MESSAGE_NOT_ADMIN = "Hanya admin kelas yang boleh melakukan ini.";
const MESSAGE_NOT_MANAGER = "Hanya admin kelas atau PJ subkelas ini yang boleh melakukan ini.";

/**
 * Siapa pengguna ini di kelas tersebut. Tidak menolak yang bukan anggota;
 * penolakan dilakukan fungsi `require...` di bawah.
 */
async function loadAccess(classId: string, pengguna?: User): Promise<ClassAccess> {
  // Login diperiksa paling dulu, supaya yang belum login selalu mendapat 401.
  const user = pengguna ?? (await requireAuth());

  const kelas = await classModel.findById(classId);
  // Pengajuan yang belum disetujui atau ditolak belum menjadi kelas.
  if (!kelas || kelas.status === "pending" || kelas.status === "rejected") {
    throw new NotFoundError(MESSAGE_NOT_FOUND);
  }

  const anggota = await classMemberModel.findMember(classId, user.id);

  return { user, classData: kelas, role: anggota?.role ?? null };
}

/** Kelas yang tidak terdaftar dianggap tidak ada bagi orang luar. */
function rejectOutsider(kelas: ClassRow): never {
  if (!kelas.isListed) throw new NotFoundError(MESSAGE_NOT_FOUND);
  throw new ForbiddenError("Kamu belum menjadi anggota kelas ini.");
}

function ensureEditable(kelas: ClassRow, { allowArchived = false }: PermissionOptions) {
  if (kelas.status === "archived" && !allowArchived) {
    throw new ConflictError("Kelas ini sudah diarsipkan, jadi isinya tidak bisa diubah.");
  }
}

/**
 * Boleh MELIHAT isi kelas: anggota kelas itu, atau superadmin (untuk moderasi).
 * Superadmin yang bukan anggota mendapat `role: null`.
 */
export async function requireClassMember(classId: string): Promise<ClassAccess> {
  return ensureCanView(await loadAccess(classId));
}

function ensureCanView(akses: ClassAccess): ClassAccess {
  if (akses.role === null && !akses.user.isSuperadmin) rejectOutsider(akses.classData);
  return akses;
}

/**
 * Boleh MENGATUR kelas: hanya admin kelas itu. Superadmin tidak termasuk,
 * karena superadmin mengurus website, bukan isi kelas.
 *
 * Kelas yang diarsipkan ditolak, kecuali `allowArchived: true` (endpoint baca saja).
 */
export async function requireClassAdmin(
  classId: string,
  opsi: PermissionOptions = {},
): Promise<ClassAccess & { role: "admin" }> {
  const akses = await loadAccess(classId);

  if (akses.role === null) {
    // Superadmin boleh tahu kelasnya ada, jadi jawabannya 403, bukan 404.
    if (akses.user.isSuperadmin) throw new ForbiddenError(MESSAGE_NOT_ADMIN);
    rejectOutsider(akses.classData);
  }
  if (akses.role !== "admin") throw new ForbiddenError(MESSAGE_NOT_ADMIN);
  ensureEditable(akses.classData, opsi);

  return { ...akses, role: "admin" };
}

/**
 * Boleh MENGELOLA satu subkelas (materi, jadwal, tugas): admin kelasnya, atau
 * PJ subkelas ITU. PJ subkelas lain di kelas yang sama tidak boleh.
 */
export async function requireSubclassManager(subclassId: string, opsi: PermissionOptions = {}) {
  const { akses, subkelas } = await loadSubclassAccess(subclassId);

  if (akses.role !== "admin") {
    const pj = await subclassModel.findPj(subclassId, akses.user.id);
    if (!pj) throw new ForbiddenError(MESSAGE_NOT_MANAGER);
  }
  ensureEditable(akses.classData, opsi);

  return { ...akses, subclass: subkelas };
}

/** Boleh MELIHAT isi satu subkelas: anggota kelasnya, atau superadmin. */
export async function requireSubclassMember(subclassId: string) {
  const { akses, subkelas } = await loadSubclassAccess(subclassId);
  return { ...akses, subclass: subkelas };
}

async function loadSubclassAccess(subclassId: string) {
  const user = await requireAuth();

  const subkelas = await subclassModel.findById(subclassId);
  if (!subkelas) throw new NotFoundError("Subkelas tidak ditemukan.");

  let akses: ClassAccess;
  try {
    akses = ensureCanView(await loadAccess(subkelas.classId, user));
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
export async function readClassAccess(classId: string) {
  const akses = await loadAccess(classId);

  if (akses.role === null && !akses.classData.isListed && !akses.user.isSuperadmin) {
    throw new NotFoundError(MESSAGE_NOT_FOUND);
  }

  const pjSubclassIds =
    akses.role === null ? [] : await subclassModel.listIdsByPj(classId, akses.user.id);

  return { ...akses, pjSubclassIds };
}
