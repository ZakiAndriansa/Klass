import "server-only";
import { and, asc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { schedules, subclasses } from "@/server/db/schema/subkelas";
import { ValidationError } from "@/server/http/errors";

import { ambilHalaman, type Halaman } from "./query";

type JadwalBaru = Pick<
  typeof schedules.$inferInsert,
  "subclassId" | "weekday" | "startTime" | "endTime"
>;
type PerubahanJadwal = Partial<Omit<JadwalBaru, "subclassId">>;

const idJadwal = (subclassId: string, id: string) =>
  and(eq(schedules.subclassId, subclassId), eq(schedules.id, id));

function detikDalamHari(waktu: string) {
  if (!/^(?:[01]?\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(waktu)) {
    throw new ValidationError("Jam jadwal harus berupa waktu dalam satu hari.");
  }
  const [jam, menit, detik = 0] = waktu.split(":").map(Number);
  return jam * 3600 + menit * 60 + detik;
}

function pastikanUrutanJam(startTime: string, endTime: string) {
  if (detikDalamHari(endTime) <= detikDalamHari(startTime)) {
    throw new ValidationError("Jam selesai harus setelah jam mulai pada hari yang sama.");
  }
}

async function bacaJadwal(koneksi: Pick<typeof db, "select">, subclassId: string, id: string) {
  const [jadwal] = await koneksi.select().from(schedules).where(idJadwal(subclassId, id)).limit(1);
  return jadwal ?? null;
}

async function daftarJadwal(filter: SQL, halaman: Halaman) {
  return ambilHalaman(halaman, db.$count(schedules, filter), (limit, offset) =>
    db
      .select()
      .from(schedules)
      .where(filter)
      .orderBy(asc(schedules.weekday), asc(schedules.startTime), asc(schedules.id))
      .limit(limit)
      .offset(offset),
  );
}

export const jadwalModel = {
  cariPerId(subclassId: string, id: string) {
    return bacaJadwal(db, subclassId, id);
  },

  daftarPerSubkelas(subclassId: string, halaman: Halaman) {
    return daftarJadwal(eq(schedules.subclassId, subclassId), halaman);
  },

  daftarPerKelas(classId: string, halaman: Halaman) {
    const subkelasDiKelas = db
      .select({ id: subclasses.id })
      .from(subclasses)
      .where(eq(subclasses.classId, classId));
    return daftarJadwal(inArray(schedules.subclassId, subkelasDiKelas), halaman);
  },

  async buat({ subclassId, weekday, startTime, endTime }: JadwalBaru) {
    pastikanUrutanJam(startTime, endTime);
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(schedules)
        .values({ subclassId, weekday, startTime, endTime })
        .$returningId();
      if (!hasil) throw new Error("ID jadwal yang baru dibuat tidak tersedia.");
      const jadwal = await bacaJadwal(transaksi, subclassId, hasil.id);
      if (!jadwal) throw new Error("Jadwal yang baru dibuat tidak ditemukan.");
      return jadwal;
    });
  },

  async ubah(subclassId: string, id: string, { weekday, startTime, endTime }: PerubahanJadwal) {
    const perubahan = { weekday, startTime, endTime };
    if (Object.values(perubahan).every((nilai) => nilai === undefined))
      return bacaJadwal(db, subclassId, id);

    return db.transaction(async (transaksi) => {
      const filter = idJadwal(subclassId, id);
      if (startTime !== undefined || endTime !== undefined) {
        const [jadwal] = await transaksi.select().from(schedules).where(filter).for("update");
        if (!jadwal) return null;
        pastikanUrutanJam(startTime ?? jadwal.startTime, endTime ?? jadwal.endTime);
      }

      await transaksi.update(schedules).set(perubahan).where(filter);
      return bacaJadwal(transaksi, subclassId, id);
    });
  },

  async hapus(subclassId: string, id: string) {
    const [hasil] = await db.delete(schedules).where(idJadwal(subclassId, id));
    return hasil.affectedRows > 0;
  },
};
