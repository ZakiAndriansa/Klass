import "server-only";
import { and, asc, desc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { materials, subclasses } from "@/server/db/schema/subkelas";
import { ConflictError } from "@/server/http/errors";

import { ambilHalaman, type Halaman } from "./query";

type Materi = typeof materials.$inferSelect;
type MateriBaru = Pick<
  typeof materials.$inferInsert,
  "subclassId" | "uploadedBy" | "title" | "fileUrl" | "linkUrl" | "fileName" | "fileSize"
>;
type PerubahanMateri = Partial<Omit<MateriBaru, "subclassId" | "uploadedBy">>;

const idMateri = (subclassId: string, id: string) =>
  and(eq(materials.subclassId, subclassId), eq(materials.id, id));

async function bacaMateri(koneksi: Pick<typeof db, "select">, subclassId: string, id: string) {
  const [materi] = await koneksi.select().from(materials).where(idMateri(subclassId, id)).limit(1);
  return materi ?? null;
}

function pastikanAdaSumber(
  fileUrl: Materi["fileUrl"] | undefined,
  linkUrl: Materi["linkUrl"] | undefined,
) {
  if (!fileUrl && !linkUrl) throw new ConflictError("Materi harus memiliki file atau tautan.");
}

async function daftarMateri(filter: SQL, halaman: Halaman) {
  return ambilHalaman(halaman, db.$count(materials, filter), (limit, offset) =>
    db
      .select()
      .from(materials)
      .where(filter)
      .orderBy(desc(materials.createdAt), asc(materials.id))
      .limit(limit)
      .offset(offset),
  );
}

export const materiModel = {
  cariPerId(subclassId: string, id: string) {
    return bacaMateri(db, subclassId, id);
  },

  daftarPerSubkelas(subclassId: string, halaman: Halaman) {
    return daftarMateri(eq(materials.subclassId, subclassId), halaman);
  },

  daftarPerKelas(classId: string, halaman: Halaman) {
    const subkelasDiKelas = db
      .select({ id: subclasses.id })
      .from(subclasses)
      .where(eq(subclasses.classId, classId));
    return daftarMateri(inArray(materials.subclassId, subkelasDiKelas), halaman);
  },

  async buat({ subclassId, uploadedBy, title, fileUrl, linkUrl, fileName, fileSize }: MateriBaru) {
    pastikanAdaSumber(fileUrl, linkUrl);
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(materials)
        .values({ subclassId, uploadedBy, title, fileUrl, linkUrl, fileName, fileSize })
        .$returningId();
      if (!hasil) throw new Error("ID materi yang baru dibuat tidak tersedia.");
      const materi = await bacaMateri(transaksi, subclassId, hasil.id);
      if (!materi) throw new Error("Materi yang baru dibuat tidak ditemukan.");
      return materi;
    });
  },

  async ubah(
    subclassId: string,
    id: string,
    { title, fileUrl, linkUrl, fileName, fileSize }: PerubahanMateri,
  ) {
    return db.transaction(async (transaksi) => {
      const filter = idMateri(subclassId, id);
      const [materi] = await transaksi.select().from(materials).where(filter).for("update");
      if (!materi) return null;

      const perubahan = { title, fileUrl, linkUrl, fileName, fileSize };
      if (Object.values(perubahan).every((nilai) => nilai === undefined)) return materi;
      if (fileUrl !== undefined || linkUrl !== undefined) {
        pastikanAdaSumber(
          fileUrl === undefined ? materi.fileUrl : fileUrl,
          linkUrl === undefined ? materi.linkUrl : linkUrl,
        );
      }

      await transaksi.update(materials).set(perubahan).where(filter);
      return bacaMateri(transaksi, subclassId, id);
    });
  },

  async hapus(subclassId: string, id: string) {
    const [hasil] = await db.delete(materials).where(idMateri(subclassId, id));
    return hasil.affectedRows > 0;
  },
};
