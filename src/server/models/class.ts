import "server-only";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { classMembers, classes } from "@/server/db/schema/class";
import { ConflictError, ValidationError } from "@/server/http/errors";

import { lockClass } from "./membership";
import { paginate, isDuplicateEntry, type Pagination, type Transaction } from "./query";

type ClassRow = typeof classes.$inferSelect;
type NewClass = typeof classes.$inferInsert;
type CreateClassData = Pick<NewClass, "name" | "isListed" | "inviteCode" | "memberLimit"> & {
  createdBy: NonNullable<NewClass["createdBy"]>;
};
type ClassSettings = Partial<
  Pick<NewClass, "name" | "isListed" | "inviteCode" | "memberLimit" | "style">
>;
type RequestFilter = { createdBy?: string; status?: ClassRow["status"] };

async function readClassById(
  koneksi: Pick<typeof db, "select">,
  id: string,
): Promise<ClassRow | null> {
  const [kelas] = await koneksi.select().from(classes).where(eq(classes.id, id)).limit(1);
  return kelas ?? null;
}

function ensurePrivateClassCode(isListed: boolean, inviteCode: NewClass["inviteCode"]) {
  if (!isListed && !inviteCode) {
    throw new ValidationError("Kelas yang tidak terdaftar harus memiliki kode undangan.");
  }
}

function throwInviteCodeConflict(galat: unknown): never {
  if (isDuplicateEntry(galat)) throw new ConflictError("Kode undangan sudah dipakai kelas lain.");
  throw galat;
}

async function readPendingRequest(transaksi: Transaction, id: string) {
  const kelas = await lockClass(transaksi, id);
  if (kelas && kelas.status !== "pending") {
    throw new ConflictError("Pengajuan kelas ini sudah diputuskan.");
  }
  return kelas;
}

export const classModel = {
  async findById(id: string): Promise<ClassRow | null> {
    return readClassById(db, id);
  },

  async create({
    name,
    createdBy,
    isListed,
    inviteCode,
    memberLimit,
  }: CreateClassData): Promise<ClassRow> {
    ensurePrivateClassCode(isListed ?? true, inviteCode);
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(classes)
        .values({ name, createdBy, isListed, inviteCode, memberLimit })
        .$returningId()
        .catch(throwInviteCodeConflict);
      if (!hasil) throw new Error("ID kelas yang baru dibuat tidak tersedia.");

      // Baca hasil INSERT agar nilai bawaan dari MySQL ikut dikembalikan.
      const kelas = await readClassById(transaksi, hasil.id);
      if (!kelas) throw new Error("Kelas yang baru dibuat tidak ditemukan.");

      return kelas;
    });
  },

  async findByInviteCode(inviteCode: string) {
    const [kelas] = await db
      .select()
      .from(classes)
      .where(and(eq(classes.inviteCode, inviteCode), eq(classes.status, "active")))
      .limit(1);
    return kelas?.inviteCode === inviteCode ? kelas : null;
  },

  async listPublic(halaman: Pagination, pencarian?: string) {
    const kata = pencarian?.replace(/[!%_]/g, "!$&");
    const filter = and(
      eq(classes.status, "active"),
      eq(classes.isListed, true),
      kata ? sql`${classes.name} like ${"%" + kata + "%"} escape '!'` : undefined,
    );
    return paginate(halaman, db.$count(classes, filter), (limit, offset) =>
      db
        .select({ id: classes.id, name: classes.name, style: classes.style })
        .from(classes)
        .where(filter)
        .orderBy(asc(classes.name), asc(classes.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async listByUser(userId: string, halaman: Pagination) {
    const filter = eq(classMembers.userId, userId);
    return paginate(halaman, db.$count(classMembers, filter), (limit, offset) =>
      db
        .select({ classData: classes, role: classMembers.role })
        .from(classMembers)
        .innerJoin(classes, eq(classMembers.classId, classes.id))
        .where(filter)
        .orderBy(asc(classes.name), asc(classes.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async listRequests(halaman: Pagination, { createdBy, status }: RequestFilter = {}) {
    const filter = and(
      createdBy === undefined ? undefined : eq(classes.createdBy, createdBy),
      status === undefined ? undefined : eq(classes.status, status),
    );
    return paginate(halaman, db.$count(classes, filter), (limit, offset) =>
      db
        .select({ classData: classes, requesterName: users.name })
        .from(classes)
        .leftJoin(users, eq(classes.createdBy, users.id))
        .where(filter)
        .orderBy(desc(classes.createdAt), asc(classes.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async approveRequest(id: string) {
    return db.transaction(async (transaksi) => {
      const kelas = await readPendingRequest(transaksi, id);
      if (!kelas) return null;
      if (!kelas.createdBy) throw new ConflictError("Pengaju kelas sudah tidak tersedia.");

      await transaksi
        .insert(classMembers)
        .values({ classId: id, userId: kelas.createdBy, role: "admin" })
        .onDuplicateKeyUpdate({ set: { role: "admin" } });
      await transaksi.update(classes).set({ status: "active" }).where(eq(classes.id, id));
      return readClassById(transaksi, id);
    });
  },

  async rejectRequest(id: string) {
    return db.transaction(async (transaksi) => {
      if (!(await readPendingRequest(transaksi, id))) return null;
      await transaksi.update(classes).set({ status: "rejected" }).where(eq(classes.id, id));
      return readClassById(transaksi, id);
    });
  },

  async updateSettings(
    id: string,
    { name, isListed, inviteCode, memberLimit, style }: ClassSettings,
  ) {
    return db.transaction(async (transaksi) => {
      const kelas = await lockClass(transaksi, id);
      if (!kelas) return null;

      const perubahan = { name, isListed, inviteCode, memberLimit, style };
      if (Object.values(perubahan).every((nilai) => nilai === undefined)) return kelas;
      if (isListed !== undefined || inviteCode !== undefined) {
        const kode = inviteCode === undefined ? kelas.inviteCode : inviteCode;
        ensurePrivateClassCode(isListed ?? kelas.isListed, kode);
      }

      await transaksi
        .update(classes)
        .set(perubahan)
        .where(eq(classes.id, id))
        .catch(throwInviteCodeConflict);
      return readClassById(transaksi, id);
    });
  },

  async archive(id: string) {
    const [hasil] = await db
      .update(classes)
      .set({ status: "archived" })
      .where(and(eq(classes.id, id), eq(classes.status, "active")));
    return hasil.affectedRows > 0;
  },

  async deletePermanently(id: string) {
    // Controller wajib memeriksa izin superadmin sebelum penghapusan berantai.
    const [hasil] = await db.delete(classes).where(eq(classes.id, id));
    return hasil.affectedRows > 0;
  },
};
