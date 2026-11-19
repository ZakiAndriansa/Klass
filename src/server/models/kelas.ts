import "server-only";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { classes } from "@/server/db/schema/kelas";

type Kelas = typeof classes.$inferSelect;
type KelasBaru = typeof classes.$inferInsert;
type DataBuatKelas = {
  name: KelasBaru["name"];
  createdBy: NonNullable<KelasBaru["createdBy"]>;
};

async function bacaKelasPerId(
  koneksi: Pick<typeof db, "select">,
  id: string,
): Promise<Kelas | null> {
  const [kelas] = await koneksi.select().from(classes).where(eq(classes.id, id)).limit(1);
  return kelas ?? null;
}

export const kelasModel = {
  async cariPerId(id: string): Promise<Kelas | null> {
    return bacaKelasPerId(db, id);
  },

  async buat({ name, createdBy }: DataBuatKelas): Promise<Kelas> {
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi.insert(classes).values({ name, createdBy }).$returningId();
      if (!hasil) throw new Error("ID kelas yang baru dibuat tidak tersedia.");

      // Baca hasil INSERT agar nilai bawaan dari MySQL ikut dikembalikan.
      const kelas = await bacaKelasPerId(transaksi, hasil.id);
      if (!kelas) throw new Error("Kelas yang baru dibuat tidak ditemukan.");

      return kelas;
    });
  },
};
