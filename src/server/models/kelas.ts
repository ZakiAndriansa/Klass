import "server-only";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { classMembers, classes } from "@/server/db/schema/kelas";
import { ConflictError, ValidationError } from "@/server/http/errors";

import { kunciKelas } from "./keanggotaan";
import { ambilHalaman, entriDuplikat, type Halaman, type Transaksi } from "./query";

type Kelas = typeof classes.$inferSelect;
type KelasBaru = typeof classes.$inferInsert;
type DataBuatKelas = Pick<KelasBaru, "name" | "isListed" | "inviteCode" | "memberLimit"> & {
  createdBy: NonNullable<KelasBaru["createdBy"]>;
};
type PengaturanKelas = Partial<
  Pick<KelasBaru, "name" | "isListed" | "inviteCode" | "memberLimit" | "style">
>;
type FilterPengajuan = { createdBy?: string; status?: Kelas["status"] };

async function bacaKelasPerId(
  koneksi: Pick<typeof db, "select">,
  id: string,
): Promise<Kelas | null> {
  const [kelas] = await koneksi.select().from(classes).where(eq(classes.id, id)).limit(1);
  return kelas ?? null;
}

function pastikanKodeKelasPrivat(isListed: boolean, inviteCode: KelasBaru["inviteCode"]) {
  if (!isListed && !inviteCode) {
    throw new ValidationError("Kelas yang tidak terdaftar harus memiliki kode undangan.");
  }
}

function lemparKonflikKodeUndangan(galat: unknown): never {
  if (entriDuplikat(galat)) throw new ConflictError("Kode undangan sudah dipakai kelas lain.");
  throw galat;
}

async function bacaPengajuanPending(transaksi: Transaksi, id: string) {
  const kelas = await kunciKelas(transaksi, id);
  if (kelas && kelas.status !== "pending") {
    throw new ConflictError("Pengajuan kelas ini sudah diputuskan.");
  }
  return kelas;
}

export const kelasModel = {
  async cariPerId(id: string): Promise<Kelas | null> {
    return bacaKelasPerId(db, id);
  },

  async buat({
    name,
    createdBy,
    isListed,
    inviteCode,
    memberLimit,
  }: DataBuatKelas): Promise<Kelas> {
    pastikanKodeKelasPrivat(isListed ?? true, inviteCode);
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(classes)
        .values({ name, createdBy, isListed, inviteCode, memberLimit })
        .$returningId()
        .catch(lemparKonflikKodeUndangan);
      if (!hasil) throw new Error("ID kelas yang baru dibuat tidak tersedia.");

      // Baca hasil INSERT agar nilai bawaan dari MySQL ikut dikembalikan.
      const kelas = await bacaKelasPerId(transaksi, hasil.id);
      if (!kelas) throw new Error("Kelas yang baru dibuat tidak ditemukan.");

      return kelas;
    });
  },

  async cariPerKodeUndangan(inviteCode: string) {
    const [kelas] = await db
      .select()
      .from(classes)
      .where(and(eq(classes.inviteCode, inviteCode), eq(classes.status, "active")))
      .limit(1);
    return kelas?.inviteCode === inviteCode ? kelas : null;
  },

  async daftarPublik(halaman: Halaman, pencarian?: string) {
    const kata = pencarian?.replace(/[!%_]/g, "!$&");
    const filter = and(
      eq(classes.status, "active"),
      eq(classes.isListed, true),
      kata ? sql`${classes.name} like ${"%" + kata + "%"} escape '!'` : undefined,
    );
    return ambilHalaman(halaman, db.$count(classes, filter), (limit, offset) =>
      db
        .select({ id: classes.id, name: classes.name, style: classes.style })
        .from(classes)
        .where(filter)
        .orderBy(asc(classes.name), asc(classes.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async daftarPerPengguna(userId: string, halaman: Halaman) {
    const filter = eq(classMembers.userId, userId);
    return ambilHalaman(halaman, db.$count(classMembers, filter), (limit, offset) =>
      db
        .select({ kelas: classes, role: classMembers.role })
        .from(classMembers)
        .innerJoin(classes, eq(classMembers.classId, classes.id))
        .where(filter)
        .orderBy(asc(classes.name), asc(classes.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async daftarPengajuan(halaman: Halaman, { createdBy, status }: FilterPengajuan = {}) {
    const filter = and(
      createdBy === undefined ? undefined : eq(classes.createdBy, createdBy),
      status === undefined ? undefined : eq(classes.status, status),
    );
    return ambilHalaman(halaman, db.$count(classes, filter), (limit, offset) =>
      db
        .select({ kelas: classes, namaPengaju: users.name })
        .from(classes)
        .leftJoin(users, eq(classes.createdBy, users.id))
        .where(filter)
        .orderBy(desc(classes.createdAt), asc(classes.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async setujuiPengajuan(id: string) {
    return db.transaction(async (transaksi) => {
      const kelas = await bacaPengajuanPending(transaksi, id);
      if (!kelas) return null;
      if (!kelas.createdBy) throw new ConflictError("Pengaju kelas sudah tidak tersedia.");

      await transaksi
        .insert(classMembers)
        .values({ classId: id, userId: kelas.createdBy, role: "admin" })
        .onDuplicateKeyUpdate({ set: { role: "admin" } });
      await transaksi.update(classes).set({ status: "active" }).where(eq(classes.id, id));
      return bacaKelasPerId(transaksi, id);
    });
  },

  async tolakPengajuan(id: string) {
    return db.transaction(async (transaksi) => {
      if (!(await bacaPengajuanPending(transaksi, id))) return null;
      await transaksi.update(classes).set({ status: "rejected" }).where(eq(classes.id, id));
      return bacaKelasPerId(transaksi, id);
    });
  },

  async ubahPengaturan(
    id: string,
    { name, isListed, inviteCode, memberLimit, style }: PengaturanKelas,
  ) {
    return db.transaction(async (transaksi) => {
      const kelas = await kunciKelas(transaksi, id);
      if (!kelas) return null;

      const perubahan = { name, isListed, inviteCode, memberLimit, style };
      if (Object.values(perubahan).every((nilai) => nilai === undefined)) return kelas;
      if (isListed !== undefined || inviteCode !== undefined) {
        const kode = inviteCode === undefined ? kelas.inviteCode : inviteCode;
        pastikanKodeKelasPrivat(isListed ?? kelas.isListed, kode);
      }

      await transaksi
        .update(classes)
        .set(perubahan)
        .where(eq(classes.id, id))
        .catch(lemparKonflikKodeUndangan);
      return bacaKelasPerId(transaksi, id);
    });
  },

  async arsipkan(id: string) {
    const [hasil] = await db
      .update(classes)
      .set({ status: "archived" })
      .where(and(eq(classes.id, id), eq(classes.status, "active")));
    return hasil.affectedRows > 0;
  },

  async hapusPermanen(id: string) {
    // Controller wajib memeriksa izin superadmin sebelum penghapusan berantai.
    const [hasil] = await db.delete(classes).where(eq(classes.id, id));
    return hasil.affectedRows > 0;
  },
};
