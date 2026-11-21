import "server-only";
import { eq } from "drizzle-orm";

import { classes } from "@/server/db/schema/class";

import type { Transaction } from "./query";

// Operasi yang mengubah anggota atau PJ mengunci kelas terlebih dahulu.
export async function lockClass(transaksi: Transaction, classId: string) {
  const [kelas] = await transaksi
    .select()
    .from(classes)
    .where(eq(classes.id, classId))
    .for("update");
  return kelas ?? null;
}
