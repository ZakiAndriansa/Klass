import "server-only";
import { and, asc, eq, inArray, sql, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { classMembers } from "@/server/db/schema/kelas";
import { pushSubscriptions } from "@/server/db/schema/website";
import { ConflictError } from "@/server/http/errors";

import { ambilHalaman, type Halaman } from "./query";

type LanggananBaru = Pick<
  typeof pushSubscriptions.$inferInsert,
  "userId" | "endpoint" | "p256dh" | "auth"
>;

async function daftarLangganan(filter: SQL, halaman: Halaman) {
  return ambilHalaman(halaman, db.$count(pushSubscriptions, filter), (limit, offset) =>
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
  async simpan({ userId, endpoint, p256dh, auth }: LanggananBaru) {
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
  daftarPerPengguna(userId: string, halaman: Halaman) {
    return daftarLangganan(eq(pushSubscriptions.userId, userId), halaman);
  },

  daftarPerKelas(classId: string, halaman: Halaman) {
    const anggotaKelas = db
      .select({ userId: classMembers.userId })
      .from(classMembers)
      .where(eq(classMembers.classId, classId));
    return daftarLangganan(inArray(pushSubscriptions.userId, anggotaKelas), halaman);
  },

  async hapus(userId: string, endpoint: string) {
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
