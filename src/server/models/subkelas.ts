import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { classMembers } from "@/server/db/schema/kelas";
import { subclassPj, subclasses } from "@/server/db/schema/subkelas";
import { ConflictError } from "@/server/http/errors";

import { kunciKelas } from "./keanggotaan";
import { ambilHalaman, entriDuplikat, type Halaman, type Transaksi } from "./query";

type SubkelasBaru = Pick<typeof subclasses.$inferInsert, "classId" | "name">;
type Pj = typeof subclassPj.$inferSelect;

const idPj = (subclassId: string, userId: string) =>
  and(eq(subclassPj.subclassId, subclassId), eq(subclassPj.userId, userId));

async function bacaSubkelas(
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

async function bacaPj(koneksi: Pick<typeof db, "select">, subclassId: string, userId: string) {
  const [pj] = await koneksi.select().from(subclassPj).where(idPj(subclassId, userId)).limit(1);
  return pj ?? null;
}

async function simpanPj(
  transaksi: Transaksi,
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
    if (entriDuplikat(galat)) throw new ConflictError("Pengguna sudah menjadi PJ subkelas ini.");
    throw galat;
  }
}

export const subkelasModel = {
  cariPerId(subclassId: string) {
    return bacaSubkelas(db, subclassId);
  },

  async daftarPerKelas(classId: string, halaman: Halaman) {
    const filter = eq(subclasses.classId, classId);
    return ambilHalaman(halaman, db.$count(subclasses, filter), (limit, offset) =>
      db
        .select()
        .from(subclasses)
        .where(filter)
        .orderBy(asc(subclasses.name), asc(subclasses.id))
        .limit(limit)
        .offset(offset),
    );
  },

  async buat({ classId, name }: SubkelasBaru, pjAwal: readonly Pj["userId"][] = []) {
    return db.transaction(async (transaksi) => {
      if (!(await kunciKelas(transaksi, classId))) return null;
      const [hasil] = await transaksi.insert(subclasses).values({ classId, name }).$returningId();
      if (!hasil) throw new Error("ID subkelas yang baru dibuat tidak tersedia.");

      if (pjAwal.length) {
        await simpanPj(transaksi, classId, hasil.id, [...new Set(pjAwal)]);
      }
      const subkelas = await bacaSubkelas(transaksi, hasil.id);
      if (!subkelas) throw new Error("Subkelas yang baru dibuat tidak ditemukan.");
      return subkelas;
    });
  },

  async ubahNama(classId: string, subclassId: string, name: SubkelasBaru["name"]) {
    return db.transaction(async (transaksi) => {
      await transaksi
        .update(subclasses)
        .set({ name })
        .where(and(eq(subclasses.classId, classId), eq(subclasses.id, subclassId)));
      return bacaSubkelas(transaksi, subclassId, classId);
    });
  },

  async hapus(classId: string, subclassId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await kunciKelas(transaksi, classId))) {
        return false;
      }

      if (!(await bacaSubkelas(transaksi, subclassId, classId))) {
        return false;
      }

      const [hasil] = await transaksi
        .delete(subclasses)
        .where(
          and(
            eq(subclasses.classId, classId),
            eq(subclasses.id, subclassId),
          ),
        );

      return hasil.affectedRows > 0;
    });
  },

  cariPj(subclassId: string, userId: string) {
    return bacaPj(db, subclassId, userId);
  },

  async daftarPj(subclassId: string, halaman: Halaman) {
    const filter = eq(subclassPj.subclassId, subclassId);
    return ambilHalaman(halaman, db.$count(subclassPj, filter), (limit, offset) =>
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

  async tunjukPj(classId: string, subclassId: string, userId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await kunciKelas(transaksi, classId))) return null;
      if (!(await bacaSubkelas(transaksi, subclassId, classId))) return null;
      await simpanPj(transaksi, classId, subclassId, [userId]);
      const pj = await bacaPj(transaksi, subclassId, userId);
      if (!pj) throw new Error("Penanggung jawab yang baru ditunjuk tidak ditemukan.");
      return pj;
    });
  },

  async cabutPj(classId: string, subclassId: string, userId: string) {
    return db.transaction(async (transaksi) => {
      if (!(await kunciKelas(transaksi, classId))) return false;
      if (!(await bacaSubkelas(transaksi, subclassId, classId))) return false;
      const [hasil] = await transaksi.delete(subclassPj).where(idPj(subclassId, userId));
      return hasil.affectedRows > 0;
    });
  },
};
