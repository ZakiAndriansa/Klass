import "server-only";
import { eq } from "drizzle-orm";

import { classes } from "@/server/db/schema/kelas";

import type { Transaksi } from "./query";

// Operasi yang mengubah anggota atau PJ mengunci kelas terlebih dahulu.
export async function kunciKelas(transaksi: Transaksi, classId: string) {
  const [kelas] = await transaksi
    .select()
    .from(classes)
    .where(eq(classes.id, classId))
    .for("update");
  return kelas ?? null;
}
