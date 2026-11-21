import "server-only";
import { and, asc, desc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { materials, subclasses } from "@/server/db/schema/subclass";
import { ValidationError } from "@/server/http/errors";

import { paginate, type Pagination } from "./query";

type Material = typeof materials.$inferSelect;
type NewMaterial = Pick<
  typeof materials.$inferInsert,
  "subclassId" | "uploadedBy" | "title" | "fileUrl" | "linkUrl" | "fileName" | "fileSize"
>;
type MaterialChanges = Partial<Omit<NewMaterial, "subclassId" | "uploadedBy">>;

const materialFilter = (subclassId: string, id: string) =>
  and(eq(materials.subclassId, subclassId), eq(materials.id, id));

async function readMaterial(koneksi: Pick<typeof db, "select">, subclassId: string, id: string) {
  const [materi] = await koneksi
    .select()
    .from(materials)
    .where(materialFilter(subclassId, id))
    .limit(1);
  return materi ?? null;
}

function ensureHasSource(
  fileUrl: Material["fileUrl"] | undefined,
  linkUrl: Material["linkUrl"] | undefined,
) {
  if (!fileUrl && !linkUrl) throw new ValidationError("Materi harus memiliki file atau tautan.");
}

async function listMaterials(filter: SQL, halaman: Pagination) {
  return paginate(halaman, db.$count(materials, filter), (limit, offset) =>
    db
      .select()
      .from(materials)
      .where(filter)
      .orderBy(desc(materials.createdAt), asc(materials.id))
      .limit(limit)
      .offset(offset),
  );
}

export const materialModel = {
  findById(subclassId: string, id: string) {
    return readMaterial(db, subclassId, id);
  },

  listBySubclass(subclassId: string, halaman: Pagination) {
    return listMaterials(eq(materials.subclassId, subclassId), halaman);
  },

  listByClass(classId: string, halaman: Pagination) {
    const subkelasDiKelas = db
      .select({ id: subclasses.id })
      .from(subclasses)
      .where(eq(subclasses.classId, classId));
    return listMaterials(inArray(materials.subclassId, subkelasDiKelas), halaman);
  },

  async create({
    subclassId,
    uploadedBy,
    title,
    fileUrl,
    linkUrl,
    fileName,
    fileSize,
  }: NewMaterial) {
    ensureHasSource(fileUrl, linkUrl);
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(materials)
        .values({ subclassId, uploadedBy, title, fileUrl, linkUrl, fileName, fileSize })
        .$returningId();
      if (!hasil) throw new Error("ID materi yang baru dibuat tidak tersedia.");
      const materi = await readMaterial(transaksi, subclassId, hasil.id);
      if (!materi) throw new Error("Materi yang baru dibuat tidak ditemukan.");
      return materi;
    });
  },

  async update(
    subclassId: string,
    id: string,
    { title, fileUrl, linkUrl, fileName, fileSize }: MaterialChanges,
  ) {
    return db.transaction(async (transaksi) => {
      const filter = materialFilter(subclassId, id);
      const [materi] = await transaksi.select().from(materials).where(filter).for("update");
      if (!materi) return null;

      const perubahan = { title, fileUrl, linkUrl, fileName, fileSize };
      if (Object.values(perubahan).every((nilai) => nilai === undefined)) return materi;
      if (fileUrl !== undefined || linkUrl !== undefined) {
        ensureHasSource(
          fileUrl === undefined ? materi.fileUrl : fileUrl,
          linkUrl === undefined ? materi.linkUrl : linkUrl,
        );
      }

      await transaksi.update(materials).set(perubahan).where(filter);
      return readMaterial(transaksi, subclassId, id);
    });
  },

  async remove(subclassId: string, id: string) {
    const [hasil] = await db.delete(materials).where(materialFilter(subclassId, id));
    return hasil.affectedRows > 0;
  },
};
