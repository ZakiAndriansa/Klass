import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { classMembers } from "@/server/db/schema/class";
import { subclassPj, subclasses } from "@/server/db/schema/subclass";
import { ConflictError } from "@/server/http/errors";

import { lockClass } from "./membership";
import { paginate, isDuplicateEntry, type Pagination, type Transaction } from "./query";

type NewSubclass = Pick<typeof subclasses.$inferInsert, "classId" | "name" | "description">;
// Yang boleh diubah setelah subkelas dibuat. `description: null` mengosongkan deskripsi.
type SubclassChanges = Partial<Omit<NewSubclass, "classId">>;
type Pj = typeof subclassPj.$inferSelect;

const pjFilter = (subclassId: string, userId: string) =>
  and(eq(subclassPj.subclassId, subclassId), eq(subclassPj.userId, userId));

async function readSubclass(
  koneksi: Pick<typeof db, "select">,
  subclassId: string,
  classId?: string,
) {
  const [subkelas] = await koneksi
    .select()
    .from(subclasses)
    .where(
      and(
        eq(subclasses.id, subclassId),
        classId === undefined ? undefined : eq(subclasses.classId, classId),
      ),
    )
    .limit(1);
  return subkelas ?? null;
}

async function readPj(koneksi: Pick<typeof db, "select">, subclassId: string, userId: string) {
  const [pj] = await koneksi.select().from(subclassPj).where(pjFilter(subclassId, userId)).limit(1);
  return pj ?? null;
}

async function savePj(
  transaksi: Transaction,
  classId: string,
  subclassId: string,
  userIds: string[],
) {
  const jumlahAnggota = await transaksi.$count(
    classMembers,
    and(eq(classMembers.classId, classId), inArray(classMembers.userId, userIds)),
  );
  if (jumlahAnggota !== userIds.length) {
    throw new ConflictError("PJ harus terdaftar sebagai anggota kelas yang sama.");
  }

  try {
    await transaksi.insert(subclassPj).values(userIds.map((userId) => ({ subclassId, userId })));
  } catch (galat) {
    if (isDuplicateEntry(galat)) throw new ConflictError("Pengguna sudah menjadi PJ subkelas ini.");
    throw galat;
  }
}

export const subclassModel = {
  findById(subclassId: string) {
    return readSubclass(db, subclassId);
  },

  async listByClass(classId: string, halaman: Pagination) {
    const filter = eq(subclasses.classId, classId);
    return paginate(halaman, db.$count(subclasses, filter), (limit, offset) =>
      db
        .select()
        .from(subclasses)
        .where(filter)
        .orderBy(asc(subclasses.name), asc(subclasses.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async create(
    { classId, name, description }: NewSubclass,
    pjUserIds: readonly Pj["userId"][] = [],
  ) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return null;
      const [hasil] = await transaksi
        .insert(subclasses)
        .values({ classId, name, description })
        .$returningId();
      if (!hasil) throw new Error("ID subkelas yang baru dibuat tidak tersedia.");

      if (pjUserIds.length) {
        await savePj(transaksi, classId, hasil.id, [...new Set(pjUserIds)]);
      }
      const subkelas = await readSubclass(transaksi, hasil.id);
      if (!subkelas) throw new Error("Subkelas yang baru dibuat tidak ditemukan.");
      return subkelas;
    });
  },

  // Mengubah nama, deskripsi, atau keduanya. Yang tidak dikirim tidak disentuh.
  async update(classId: string, subclassId: string, { name, description }: SubclassChanges) {
    return db.transaction(async (transaksi) => {
      const perubahan = { name, description };
      if (Object.values(perubahan).some((nilai) => nilai !== undefined)) {
        await transaksi
          .update(subclasses)
          .set(perubahan)
          .where(and(eq(subclasses.classId, classId), eq(subclasses.id, subclassId)));
      }
      return readSubclass(transaksi, subclassId, classId);
    });
  },

  async remove(classId: string, subclassId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) {
        return false;
      }

      if (!(await readSubclass(transaksi, subclassId, classId))) {
        return false;
      }

      const [hasil] = await transaksi
        .delete(subclasses)
        .where(and(eq(subclasses.classId, classId), eq(subclasses.id, subclassId)));

      return hasil.affectedRows > 0;
    });
  },

  findPj(subclassId: string, userId: string) {
    return readPj(db, subclassId, userId);
  },

  // ID subkelas di satu kelas yang PJ-nya pengguna ini. Dipakai lapisan izin
  // untuk memberi tahu frontend subkelas mana yang boleh dikelola pengguna.
  async listIdsByPj(classId: string, userId: string) {
    const baris = await db
      .select({ id: subclasses.id })
      .from(subclassPj)
      .innerJoin(subclasses, eq(subclassPj.subclassId, subclasses.id))
      .where(and(eq(subclasses.classId, classId), eq(subclassPj.userId, userId)))
      .orderBy(asc(subclasses.name), asc(subclasses.id));
    return baris.map(({ id }) => id);
  },

  async listPj(subclassId: string, halaman: Pagination) {
    const filter = eq(subclassPj.subclassId, subclassId);
    return paginate(halaman, db.$count(subclassPj, filter), (limit, offset) =>
      db
        .select({ pj: subclassPj, name: users.name, image: users.image })
        .from(subclassPj)
        .innerJoin(users, eq(subclassPj.userId, users.id))
        .where(filter)
        .orderBy(asc(subclassPj.createdAt), asc(subclassPj.userId))
        .limit(limit)
        .offset(offset),
    );
  },

  async assignPj(classId: string, subclassId: string, userId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return null;
      if (!(await readSubclass(transaksi, subclassId, classId))) return null;
      await savePj(transaksi, classId, subclassId, [userId]);
      const pj = await readPj(transaksi, subclassId, userId);
      if (!pj) throw new Error("Penanggung jawab yang baru ditunjuk tidak ditemukan.");
      return pj;
    });
  },

  async unassignPj(classId: string, subclassId: string, userId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await lockClass(transaksi, classId))) return false;
      if (!(await readSubclass(transaksi, subclassId, classId))) return false;
      const [hasil] = await transaksi.delete(subclassPj).where(pjFilter(subclassId, userId));
      return hasil.affectedRows > 0;
    });
  },
};
