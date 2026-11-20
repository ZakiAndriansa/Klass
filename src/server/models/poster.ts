import "server-only";
import { asc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { posters } from "@/server/db/schema/website";
import { ValidationError } from "@/server/http/errors";

import { ambilHalaman, type Halaman } from "./query";

type Poster = typeof posters.$inferSelect;
type PosterBaru = Pick<
  typeof posters.$inferInsert,
  "title" | "imageUrl" | "isActive" | "sortOrder"
>;
type PerubahanPoster = Partial<Omit<PosterBaru, "sortOrder">>;
type UrutanPoster = Pick<Poster, "id" | "sortOrder">;

async function bacaPoster(koneksi: Pick<typeof db, "select">, id: string) {
  const [poster] = await koneksi.select().from(posters).where(eq(posters.id, id)).limit(1);
  return poster ?? null;
}

async function daftarPoster(halaman: Halaman, filter?: SQL) {
  return ambilHalaman(halaman, db.$count(posters, filter), (limit, offset) =>
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
  cariPerId(id: string) {
    return bacaPoster(db, id);
  },

  daftar(halaman: Halaman) {
    return daftarPoster(halaman);
  },

  daftarAktif(halaman: Halaman) {
    return daftarPoster(halaman, eq(posters.isActive, true));
  },

  async buat({ title, imageUrl, isActive, sortOrder }: PosterBaru) {
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(posters)
        .values({ title, imageUrl, isActive, sortOrder })
        .$returningId();
      if (!hasil) throw new Error("ID poster yang baru dibuat tidak tersedia.");
      const poster = await bacaPoster(transaksi, hasil.id);
      if (!poster) throw new Error("Poster yang baru dibuat tidak ditemukan.");
      return poster;
    });
  },

  async ubah(id: string, { title, imageUrl, isActive }: PerubahanPoster) {
    const perubahan = { title, imageUrl, isActive };
    if (Object.values(perubahan).every((nilai) => nilai === undefined)) return bacaPoster(db, id);

    return db.transaction(async (transaksi) => {
      await transaksi.update(posters).set(perubahan).where(eq(posters.id, id));
      return bacaPoster(transaksi, id);
    });
  },

  async ubahUrutan(urutan: readonly UrutanPoster[]) {
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

  async hapus(id: string) {
    const [hasil] = await db.delete(posters).where(eq(posters.id, id));
    return hasil.affectedRows > 0;
  },
};
