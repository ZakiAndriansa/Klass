import "server-only";
import { and, asc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { schedules, subclasses } from "@/server/db/schema/subclass";
import { ValidationError } from "@/server/http/errors";

import { paginate, type Pagination } from "./query";

type NewSchedule = Pick<
  typeof schedules.$inferInsert,
  "subclassId" | "weekday" | "startTime" | "endTime"
>;
type ScheduleChanges = Partial<Omit<NewSchedule, "subclassId">>;

const scheduleFilter = (subclassId: string, id: string) =>
  and(eq(schedules.subclassId, subclassId), eq(schedules.id, id));

function secondsInDay(waktu: string) {
  if (!/^(?:[01]?\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(waktu)) {
    throw new ValidationError("Jam jadwal harus berupa waktu dalam satu hari.");
  }
  const [jam, menit, detik = 0] = waktu.split(":").map(Number);
  return jam * 3600 + menit * 60 + detik;
}

// 1 = Senin sampai 7 = Minggu, sama dengan CHECK `schedules_weekday_check` di database.
function ensureWeekday(weekday: number) {
  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    throw new ValidationError("Hari jadwal harus antara 1 (Senin) dan 7 (Minggu).");
  }
}

function ensureTimeOrder(startTime: string, endTime: string) {
  if (secondsInDay(endTime) <= secondsInDay(startTime)) {
    throw new ValidationError("Jam selesai harus setelah jam mulai pada hari yang sama.");
  }
}

async function readSchedule(koneksi: Pick<typeof db, "select">, subclassId: string, id: string) {
  const [jadwal] = await koneksi
    .select()
    .from(schedules)
    .where(scheduleFilter(subclassId, id))
    .limit(1);
  return jadwal ?? null;
}

async function listSchedules(filter: SQL, halaman: Pagination) {
  return paginate(halaman, db.$count(schedules, filter), (limit, offset) =>
    db
      .select()
      .from(schedules)
      .where(filter)
      .orderBy(asc(schedules.weekday), asc(schedules.startTime), asc(schedules.id))
      .limit(limit)
      .offset(offset),
  );
}

export const scheduleModel = {
  findById(subclassId: string, id: string) {
    return readSchedule(db, subclassId, id);
  },

  listBySubclass(subclassId: string, halaman: Pagination) {
    return listSchedules(eq(schedules.subclassId, subclassId), halaman);
  },

  listByClass(classId: string, halaman: Pagination) {
    const subkelasDiKelas = db
      .select({ id: subclasses.id })
      .from(subclasses)
      .where(eq(subclasses.classId, classId));
    return listSchedules(inArray(schedules.subclassId, subkelasDiKelas), halaman);
  },

  async create({ subclassId, weekday, startTime, endTime }: NewSchedule) {
    ensureWeekday(weekday);
    ensureTimeOrder(startTime, endTime);
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(schedules)
        .values({ subclassId, weekday, startTime, endTime })
        .$returningId();
      if (!hasil) throw new Error("ID jadwal yang baru dibuat tidak tersedia.");
      const jadwal = await readSchedule(transaksi, subclassId, hasil.id);
      if (!jadwal) throw new Error("Jadwal yang baru dibuat tidak ditemukan.");
      return jadwal;
    });
  },

  async update(subclassId: string, id: string, { weekday, startTime, endTime }: ScheduleChanges) {
    const perubahan = { weekday, startTime, endTime };
    if (Object.values(perubahan).every((nilai) => nilai === undefined))
      return readSchedule(db, subclassId, id);
    if (weekday !== undefined) ensureWeekday(weekday);

    return db.transaction(async (transaksi) => {
      const filter = scheduleFilter(subclassId, id);
      if (startTime !== undefined || endTime !== undefined) {
        const [jadwal] = await transaksi.select().from(schedules).where(filter).for("update");
        if (!jadwal) return null;
        ensureTimeOrder(startTime ?? jadwal.startTime, endTime ?? jadwal.endTime);
      }

      await transaksi.update(schedules).set(perubahan).where(filter);
      return readSchedule(transaksi, subclassId, id);
    });
  },

  async remove(subclassId: string, id: string) {
    const [hasil] = await db.delete(schedules).where(scheduleFilter(subclassId, id));
    return hasil.affectedRows > 0;
  },
};
