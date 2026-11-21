import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { classAdminInvites, classBans, classMembers } from "@/server/db/schema/class";
import { subclassPj, subclasses } from "@/server/db/schema/subclass";
import { ConflictError } from "@/server/http/errors";

import { lockClass } from "./membership";
import { paginate, type Pagination, type Transaction } from "./query";

type Member = typeof classMembers.$inferSelect;
type NewInvite = Pick<typeof classAdminInvites.$inferInsert, "classId" | "email" | "invitedBy">;
type RemoveOptions = { ban?: { reason?: (typeof classBans.$inferInsert)["reason"] } };

const memberFilter = (classId: string, userId: string) =>
  and(eq(classMembers.classId, classId), eq(classMembers.userId, userId));
const banFilter = (classId: string, userId: string) =>
  and(eq(classBans.classId, classId), eq(classBans.userId, userId));

async function readMember(koneksi: Pick<typeof db, "select">, classId: string, userId: string) {
  const [anggota] = await koneksi
    .select()
    .from(classMembers)
    .where(memberFilter(classId, userId))
    .limit(1);
  return anggota ?? null;
}

async function readBan(koneksi: Pick<typeof db, "select">, classId: string, userId: string) {
  const [ban] = await koneksi.select().from(classBans).where(banFilter(classId, userId)).limit(1);
  return ban ?? null;
}

async function guardLastAdmin(transaksi: Transaction, anggota: Member) {
  if (anggota.role !== "admin") return;

  const jumlah = await transaksi.$count(
    classMembers,
    and(eq(classMembers.classId, anggota.classId), eq(classMembers.role, "admin")),
  );
  if (jumlah <= 1) throw new ConflictError("Kelas harus memiliki minimal satu admin.");
}

async function ensureCapacity(transaksi: Transaction, classId: string, memberLimit: number | null) {
  if (memberLimit === null) return;
  const jumlah = await transaksi.$count(classMembers, eq(classMembers.classId, classId));
  if (jumlah >= memberLimit) throw new ConflictError("Kelas sudah penuh.");
}

export const classMemberModel = {
  findMember(classId: string, userId: string) {
    return readMember(db, classId, userId);
  },

  findBan(classId: string, userId: string) {
    return readBan(db, classId, userId);
  },

  async listMembers(classId: string, halaman: Pagination) {
    const filter = eq(classMembers.classId, classId);
    return paginate(halaman, db.$count(classMembers, filter), (limit, offset) =>
      db
        .select({ member: classMembers, name: users.name, image: users.image })
        .from(classMembers)
        .innerJoin(users, eq(classMembers.userId, users.id))
        .where(filter)
        .orderBy(asc(classMembers.createdAt), asc(classMembers.userId))
        .limit(limit)
        .offset(offset),
    );
  },

  async listBans(classId: string, halaman: Pagination) {
    const filter = eq(classBans.classId, classId);
    return paginate(halaman, db.$count(classBans, filter), (limit, offset) =>
      db
        .select({ ban: classBans, name: users.name })
        .from(classBans)
        .innerJoin(users, eq(classBans.userId, users.id))
        .where(filter)
        .orderBy(asc(classBans.createdAt), asc(classBans.userId))
        .limit(limit)
        .offset(offset),
    );
  },

  async join(classId: string, userId: string, inviteCode?: string) {
    return db.transaction(async (transaksi) => {
      const kelas = await lockClass(transaksi, classId);
      if (!kelas || kelas.status !== "active") return null;
      if (
        (inviteCode !== undefined || !kelas.isListed) &&
        (!kelas.inviteCode || kelas.inviteCode !== inviteCode)
      ) {
        return null;
      }

      if (await readBan(transaksi, classId, userId)) {
        throw new ConflictError("Pengguna diblokir dari kelas ini.");
      }
      if (await readMember(transaksi, classId, userId)) {
        throw new ConflictError("Pengguna sudah menjadi anggota kelas ini.");
      }
      await ensureCapacity(transaksi, classId, kelas.memberLimit);

      await transaksi.insert(classMembers).values({ classId, userId, role: "member" });
      const anggota = await readMember(transaksi, classId, userId);
      if (!anggota) throw new Error("Keanggotaan yang baru dibuat tidak ditemukan.");
      return anggota;
    });
  },

  async updateRole(classId: string, userId: string, role: Member["role"]) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return null;
      const anggota = await readMember(transaksi, classId, userId);
      if (!anggota || anggota.role === role) return anggota;

      if (role === "member") await guardLastAdmin(transaksi, anggota);
      await transaksi.update(classMembers).set({ role }).where(memberFilter(classId, userId));
      return { ...anggota, role };
    });
  },

  async removeMember(classId: string, userId: string, { ban }: RemoveOptions = {}) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return null;
      const anggota = await readMember(transaksi, classId, userId);
      if (!anggota) return null;
      await guardLastAdmin(transaksi, anggota);

      const subkelasDiKelas = transaksi
        .select({ id: subclasses.id })
        .from(subclasses)
        .where(eq(subclasses.classId, classId));
      await transaksi
        .delete(subclassPj)
        .where(and(eq(subclassPj.userId, userId), inArray(subclassPj.subclassId, subkelasDiKelas)));
      await transaksi.delete(classMembers).where(memberFilter(classId, userId));
      if (ban) {
        const reason = ban.reason ?? null;
        await transaksi
          .insert(classBans)
          .values({ classId, userId, reason })
          .onDuplicateKeyUpdate({ set: { reason } });
      }

      return anggota;
    });
  },

  async unban(classId: string, userId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return false;
      const [hasil] = await transaksi.delete(classBans).where(banFilter(classId, userId));
      return hasil.affectedRows > 0;
    });
  },

  async createAdminInvite({ classId, email, invitedBy }: NewInvite) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return null;
      const filter = and(
        eq(classAdminInvites.classId, classId),
        eq(classAdminInvites.email, email),
      );
      // Email yang masih menunggu penerimaan tidak boleh diundang ulang.
      const [undanganLama] = await transaksi
        .select()
        .from(classAdminInvites)
        .where(filter)
        .limit(1);
      if (undanganLama?.status === "pending") {
        throw new ConflictError("Undangan admin untuk email ini masih menunggu penerimaan.");
      }

      // Undangan lama yang dicabut atau sudah diterima dapat digunakan kembali.
      if (undanganLama) {
        const perubahan = { status: "pending" as const, invitedBy: invitedBy ?? null };
        await transaksi
          .update(classAdminInvites)
          .set(perubahan)
          .where(eq(classAdminInvites.id, undanganLama.id));
        return { ...undanganLama, ...perubahan };
      }

      // Belum pernah diundang: buat baris baru.
      await transaksi.insert(classAdminInvites).values({ classId, email, invitedBy });
      const [undangan] = await transaksi.select().from(classAdminInvites).where(filter).limit(1);
      if (!undangan) throw new Error("Undangan yang baru dibuat tidak ditemukan.");
      return undangan;
    });
  },

  async listInvitesByClass(classId: string, halaman: Pagination) {
    const filter = eq(classAdminInvites.classId, classId);

    return paginate(halaman, db.$count(classAdminInvites, filter), (limit, offset) =>
      db
        .select()
        .from(classAdminInvites)
        .where(filter)
        .orderBy(asc(classAdminInvites.createdAt), asc(classAdminInvites.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async listAdminInvites(email: string, halaman: Pagination) {
    const filter = and(eq(classAdminInvites.email, email), eq(classAdminInvites.status, "pending"));
    return paginate(halaman, db.$count(classAdminInvites, filter), (limit, offset) =>
      db
        .select()
        .from(classAdminInvites)
        .where(filter)
        .orderBy(asc(classAdminInvites.createdAt), asc(classAdminInvites.id))
        .limit(limit)
        .offset(offset),
    );
  },

  // Controller memberikan ID dan email terverifikasi dari pengguna yang sama.
  async acceptAdminInvite(classId: string, id: string, email: string, userId: string) {
    return db.transaction(async (transaksi) => {
      const kelas = await lockClass(transaksi, classId);
      if (!kelas || kelas.status !== "active") return null;

      const filter = and(
        eq(classAdminInvites.id, id),
        eq(classAdminInvites.classId, classId),
        eq(classAdminInvites.email, email),
        eq(classAdminInvites.status, "pending"),
      );
      const [hasil] = await transaksi
        .select({ invite: classAdminInvites })
        .from(classAdminInvites)
        .innerJoin(users, and(eq(users.id, userId), eq(users.email, classAdminInvites.email)))
        .where(filter)
        .for("update");
      if (!hasil) return null;
      if (await readBan(transaksi, classId, userId)) {
        throw new ConflictError("Pengguna diblokir dari kelas ini.");
      }
      if (kelas.memberLimit !== null && !(await readMember(transaksi, classId, userId))) {
        await ensureCapacity(transaksi, classId, kelas.memberLimit);
      }

      await transaksi
        .insert(classMembers)
        .values({ classId, userId, role: "admin" })
        .onDuplicateKeyUpdate({ set: { role: "admin" } });
      await transaksi.update(classAdminInvites).set({ status: "accepted" }).where(filter);
      return { ...hasil.invite, status: "accepted" as const };
    });
  },

  async revokeAdminInvite(classId: string, id: string) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return false;
      const [hasil] = await transaksi
        .update(classAdminInvites)
        .set({ status: "revoked" })
        .where(
          and(
            eq(classAdminInvites.classId, classId),
            eq(classAdminInvites.id, id),
            eq(classAdminInvites.status, "pending"),
          ),
        );
      return hasil.affectedRows > 0;
    });
  },
};
