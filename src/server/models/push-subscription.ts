import "server-only";
import { and, asc, eq, inArray, sql, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { classMembers } from "@/server/db/schema/class";
import { pushSubscriptions } from "@/server/db/schema/website";
import { ConflictError } from "@/server/http/errors";

import { paginate, type Pagination } from "./query";

type NewSubscription = Pick<
  typeof pushSubscriptions.$inferInsert,
  "userId" | "endpoint" | "p256dh" | "auth"
>;

async function listSubscriptions(filter: SQL, halaman: Pagination) {
  return paginate(halaman, db.$count(pushSubscriptions, filter), (limit, offset) =>
    db
      .select()
      .from(pushSubscriptions)
      .where(filter)
      .orderBy(asc(pushSubscriptions.createdAt), asc(pushSubscriptions.id))
      .limit(limit)
      .offset(offset),
  );
}

export const pushSubscriptionModel = {
  async save({ userId, endpoint, p256dh, auth }: NewSubscription) {
    return db.transaction(async (transaksi) => {
      // Saat endpoint sudah ada, kunci baris tanpa mengubah pemilik atau kunci push.
      await transaksi
        .insert(pushSubscriptions)
        .values({ userId, endpoint, p256dh, auth })
        .onDuplicateKeyUpdate({ set: { id: sql`${pushSubscriptions.id}` } });
      const [langganan] = await transaksi
        .select()
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, endpoint))
        .for("update");
      if (!langganan) throw new Error("Langganan push yang disimpan tidak ditemukan.");

      if (langganan.userId !== userId || langganan.endpoint !== endpoint) {
        throw new ConflictError("Endpoint push sudah terdaftar.");
      }
      if (langganan.p256dh !== p256dh || langganan.auth !== auth) {
        await transaksi
          .update(pushSubscriptions)
          .set({ p256dh, auth })
          .where(eq(pushSubscriptions.id, langganan.id));
      }
      return { ...langganan, p256dh, auth };
    });
  },

  // Hasil berisi kunci push untuk pemrosesan internal dan perlu dipetakan sebelum ke API.
  listByUser(userId: string, halaman: Pagination) {
    return listSubscriptions(eq(pushSubscriptions.userId, userId), halaman);
  },

  listByClass(classId: string, halaman: Pagination) {
    const anggotaKelas = db
      .select({ userId: classMembers.userId })
      .from(classMembers)
      .where(eq(classMembers.classId, classId));
    return listSubscriptions(inArray(pushSubscriptions.userId, anggotaKelas), halaman);
  },

  async remove(userId: string, endpoint: string) {
    const [hasil] = await db
      .delete(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.userId, userId),
          eq(pushSubscriptions.endpoint, endpoint),
          sql`cast(${pushSubscriptions.endpoint} as binary) = cast(${endpoint} as binary)`,
        ),
      );
    return hasil.affectedRows > 0;
  },
};
