import "server-only";
import { asc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { posters } from "@/server/db/schema/website";
import { ValidationError } from "@/server/http/errors";

import { paginate, type Pagination } from "./query";

type Poster = typeof posters.$inferSelect;
type NewPoster = Pick<typeof posters.$inferInsert, "title" | "imageUrl" | "isActive" | "sortOrder">;
type PosterChanges = Partial<Omit<NewPoster, "sortOrder">>;
type PosterOrder = Pick<Poster, "id" | "sortOrder">;

async function readPoster(koneksi: Pick<typeof db, "select">, id: string) {
  const [poster] = await koneksi.select().from(posters).where(eq(posters.id, id)).limit(1);
  return poster ?? null;
}

async function listPosters(halaman: Pagination, filter?: SQL) {
  return paginate(halaman, db.$count(posters, filter), (limit, offset) =>
    db
      .select()
      .from(posters)
      .where(filter)
      .orderBy(asc(posters.sortOrder), asc(posters.id))
      .limit(limit)
      .offset(offset),
  );
}

export const posterModel = {
  findById(id: string) {
    return readPoster(db, id);
  },

  list(halaman: Pagination) {
    return listPosters(halaman);
  },

  listActive(halaman: Pagination) {
    return listPosters(halaman, eq(posters.isActive, true));
  },

  async create({ title, imageUrl, isActive, sortOrder }: NewPoster) {
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(posters)
        .values({ title, imageUrl, isActive, sortOrder })
        .$returningId();
      if (!hasil) throw new Error("ID poster yang baru dibuat tidak tersedia.");
      const poster = await readPoster(transaksi, hasil.id);
      if (!poster) throw new Error("Poster yang baru dibuat tidak ditemukan.");
      return poster;
    });
  },

  async update(id: string, { title, imageUrl, isActive }: PosterChanges) {
    const perubahan = { title, imageUrl, isActive };
    if (Object.values(perubahan).every((nilai) => nilai === undefined)) return readPoster(db, id);

    return db.transaction(async (transaksi) => {
      await transaksi.update(posters).set(perubahan).where(eq(posters.id, id));
      return readPoster(transaksi, id);
    });
  },

  async reorder(urutan: readonly PosterOrder[]) {
    if (!urutan.length) return true;
    const ids = urutan.map(({ id }) => id);
    if (new Set(ids).size !== ids.length) {
      throw new ValidationError("Satu poster hanya boleh muncul sekali dalam perubahan urutan.");
    }

    return db.transaction(async (transaksi) => {
      const tersedia = await transaksi
        .select({ id: posters.id })
        .from(posters)
        .where(inArray(posters.id, ids))
        .orderBy(asc(posters.id))
        .for("update");
      if (tersedia.length !== ids.length) return false;

      for (const { id, sortOrder } of urutan) {
        await transaksi.update(posters).set({ sortOrder }).where(eq(posters.id, id));
      }
      return true;
    });
  },

  async remove(id: string) {
    const [hasil] = await db.delete(posters).where(eq(posters.id, id));
    return hasil.affectedRows > 0;
  },
};
