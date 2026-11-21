import "server-only";
import { and, asc, eq, inArray, isNull, lte, sql, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { classes } from "@/server/db/schema/class";
import { assignmentReminders, assignments, subclasses } from "@/server/db/schema/subclass";
import { ConflictError, ValidationError } from "@/server/http/errors";

import { paginate, type Pagination, type Transaction } from "./query";

type NewAssignment = Pick<
  typeof assignments.$inferInsert,
  "subclassId" | "createdBy" | "title" | "description" | "dueAt"
>;
type AssignmentChanges = Partial<Pick<NewAssignment, "title" | "description" | "dueAt">>;
type ReminderTime = (typeof assignmentReminders.$inferInsert)["remindAt"];

const reminderFilter = (assignmentId: string) =>
  and(eq(assignmentReminders.assignmentId, assignmentId), isNull(assignmentReminders.sentAt));

function classFilter(classId: string) {
  const subkelasDiKelas = db
    .select({ id: subclasses.id })
    .from(subclasses)
    .where(eq(subclasses.classId, classId));
  return inArray(assignments.subclassId, subkelasDiKelas);
}

async function readAssignment(koneksi: Pick<typeof db, "select">, id: string, kelas?: SQL) {
  const [tugas] = await koneksi
    .select()
    .from(assignments)
    .where(and(eq(assignments.id, id), kelas))
    .limit(1);
  return tugas ?? null;
}

async function listAssignments(filter: SQL, halaman: Pagination) {
  return paginate(halaman, db.$count(assignments, filter), (limit, offset) =>
    db
      .select()
      .from(assignments)
      .where(filter)
      .orderBy(asc(assignments.dueAt), asc(assignments.id))
      .limit(limit)
      .offset(offset),
  );
}

const toSeconds = (tanggal: Date) => Math.floor(tanggal.getTime() / 1000);

async function saveReminders(
  transaksi: Transaction,
  assignmentId: string,
  dueAt: Date,
  waktuPengingat: readonly ReminderTime[],
) {
  if (!waktuPengingat.length) return;
  if (waktuPengingat.some((remindAt) => toSeconds(remindAt) >= toSeconds(dueAt))) {
    throw new ValidationError("Waktu pengingat harus sebelum tenggat tugas.");
  }

  // Kunci unik pasangan tugas dan waktu juga menjaga pengingat yang sudah terkirim.
  await transaksi
    .insert(assignmentReminders)
    .values(waktuPengingat.map((remindAt) => ({ assignmentId, remindAt })))
    .onDuplicateKeyUpdate({ set: { id: sql`${assignmentReminders.id}` } });
}

export const assignmentModel = {
  findById(classId: string, id: string) {
    return readAssignment(db, id, classFilter(classId));
  },

  listByClass(classId: string, halaman: Pagination) {
    return listAssignments(classFilter(classId), halaman);
  },

  listBySubclass(subclassId: string, halaman: Pagination) {
    return listAssignments(eq(assignments.subclassId, subclassId), halaman);
  },

  async create(
    { subclassId, createdBy, title, description, dueAt }: NewAssignment,
    waktuPengingat: readonly ReminderTime[] = [],
  ) {
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(assignments)
        .values({ subclassId, createdBy, title, description, dueAt })
        .$returningId();
      if (!hasil) throw new Error("ID tugas yang baru dibuat tidak tersedia.");

      await saveReminders(transaksi, hasil.id, dueAt, waktuPengingat);
      const tugas = await readAssignment(transaksi, hasil.id);
      if (!tugas) throw new Error("Tugas yang baru dibuat tidak ditemukan.");
      return tugas;
    });
  },

  async update(
    classId: string,
    id: string,
    { title, description, dueAt }: AssignmentChanges,
    waktuPengingat?: readonly ReminderTime[],
  ) {
    return db.transaction(async (transaksi) => {
      const filter = and(eq(assignments.id, id), classFilter(classId));
      const [tugas] = await transaksi.select().from(assignments).where(filter).for("update");
      if (!tugas) return null;

      if (
        waktuPengingat === undefined &&
        dueAt &&
        toSeconds(dueAt) !== toSeconds(tugas.dueAt) &&
        (await transaksi.$count(assignmentReminders, reminderFilter(id)))
      ) {
        throw new ConflictError("Sertakan jadwal pengingat baru saat mengubah tenggat tugas.");
      }

      const perubahan = { title, description, dueAt };
      if (Object.values(perubahan).some((nilai) => nilai !== undefined)) {
        await transaksi.update(assignments).set(perubahan).where(eq(assignments.id, id));
      }

      if (waktuPengingat !== undefined) {
        await transaksi.delete(assignmentReminders).where(reminderFilter(id));
        await saveReminders(transaksi, id, dueAt ?? tugas.dueAt, waktuPengingat);
      }

      return readAssignment(transaksi, id);
    });
  },

  async remove(classId: string, id: string) {
    // MySQL menghapus pengingat terkait melalui ON DELETE CASCADE.
    const [hasil] = await db
      .delete(assignments)
      .where(and(eq(assignments.id, id), classFilter(classId)));
    return hasil.affectedRows > 0;
  },

  // Menampilkan semua pengingat yang terhubung dengan satu tugas
  async listReminders(assignmentId: string) {
    return db
      .select()
      .from(assignmentReminders)
      .where(eq(assignmentReminders.assignmentId, assignmentId))
      .orderBy(asc(assignmentReminders.remindAt), asc(assignmentReminders.id));
  },

  // Daftar ini tidak mengklaim pekerjaan. Worker harus mencegah pemrosesan paralel
  // terhadap pengingat yang sama sebelum memanggil layanan push.
  async listDueReminders(batas: Date, halaman: Pagination) {
    const tugasDiKelasAktif = db
      .select({ id: assignments.id })
      .from(assignments)
      .innerJoin(subclasses, eq(assignments.subclassId, subclasses.id))
      .innerJoin(classes, eq(subclasses.classId, classes.id))
      .where(eq(classes.status, "active"));
    const filter = and(
      isNull(assignmentReminders.sentAt),
      lte(assignmentReminders.remindAt, batas),
      inArray(assignmentReminders.assignmentId, tugasDiKelasAktif),
    );
    return paginate(halaman, db.$count(assignmentReminders, filter), (limit, offset) =>
      db
        .select({
          reminder: assignmentReminders,
          assignment: assignments,
          classId: subclasses.classId,
        })
        .from(assignmentReminders)
        .innerJoin(assignments, eq(assignmentReminders.assignmentId, assignments.id))
        .innerJoin(subclasses, eq(assignments.subclassId, subclasses.id))
        .where(filter)
        .orderBy(asc(assignmentReminders.remindAt), asc(assignmentReminders.id))
        .limit(limit)
        .offset(offset),
    );
  },

  // Panggil setelah pengiriman berhasil. Kondisi sent_at hanya menjaga catatan kirim.
  async markReminderSent(id: string, sentAt: Date) {
    const [hasil] = await db
      .update(assignmentReminders)
      .set({ sentAt })
      .where(
        and(
          eq(assignmentReminders.id, id),
          isNull(assignmentReminders.sentAt),
          lte(assignmentReminders.remindAt, sentAt),
        ),
      );
    return hasil.affectedRows > 0;
  },
};
