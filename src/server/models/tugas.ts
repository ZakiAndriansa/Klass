import "server-only";
import { and, asc, eq, inArray, isNull, lte, sql, type SQL } from "drizzle-orm";

import { db } from "@/server/db";
import { classes } from "@/server/db/schema/kelas";
import { assignmentReminders, assignments, subclasses } from "@/server/db/schema/subkelas";
import { ConflictError } from "@/server/http/errors";

import { ambilHalaman, type Halaman, type Transaksi } from "./query";

type TugasBaru = Pick<
  typeof assignments.$inferInsert,
  "subclassId" | "createdBy" | "title" | "description" | "dueAt"
>;
type PerubahanTugas = Partial<Pick<TugasBaru, "title" | "description" | "dueAt">>;
type WaktuPengingat = (typeof assignmentReminders.$inferInsert)["remindAt"];

const filterPengingat = (assignmentId: string) =>
  and(eq(assignmentReminders.assignmentId, assignmentId), isNull(assignmentReminders.sentAt));

function filterKelas(classId: string) {
  const subkelasDiKelas = db
    .select({ id: subclasses.id })
    .from(subclasses)
    .where(eq(subclasses.classId, classId));
  return inArray(assignments.subclassId, subkelasDiKelas);
}

async function bacaTugas(koneksi: Pick<typeof db, "select">, id: string, kelas?: SQL) {
  const [tugas] = await koneksi
    .select()
    .from(assignments)
    .where(and(eq(assignments.id, id), kelas))
    .limit(1);
  return tugas ?? null;
}

async function daftarTugas(filter: SQL, halaman: Halaman) {
  return ambilHalaman(halaman, db.$count(assignments, filter), (limit, offset) =>
    db
      .select()
      .from(assignments)
      .where(filter)
      .orderBy(asc(assignments.dueAt), asc(assignments.id))
      .limit(limit)
      .offset(offset),
  );
}

const detik = (tanggal: Date) => Math.floor(tanggal.getTime() / 1000);

async function simpanPengingat(
  transaksi: Transaksi,
  assignmentId: string,
  dueAt: Date,
  waktuPengingat: readonly WaktuPengingat[],
) {
  if (!waktuPengingat.length) return;
  if (waktuPengingat.some((remindAt) => detik(remindAt) >= detik(dueAt))) {
    throw new ConflictError("Waktu pengingat harus sebelum tenggat tugas.");
  }

  // Kunci unik pasangan tugas dan waktu juga menjaga pengingat yang sudah terkirim.
  await transaksi
    .insert(assignmentReminders)
    .values(waktuPengingat.map((remindAt) => ({ assignmentId, remindAt })))
    .onDuplicateKeyUpdate({ set: { id: sql`${assignmentReminders.id}` } });
}

export const tugasModel = {
  cariPerId(classId: string, id: string) {
    return bacaTugas(db, id, filterKelas(classId));
  },

  daftarPerKelas(classId: string, halaman: Halaman) {
    return daftarTugas(filterKelas(classId), halaman);
  },

  daftarPerSubkelas(subclassId: string, halaman: Halaman) {
    return daftarTugas(eq(assignments.subclassId, subclassId), halaman);
  },

  async buat(
    { subclassId, createdBy, title, description, dueAt }: TugasBaru,
    waktuPengingat: readonly WaktuPengingat[] = [],
  ) {
    return db.transaction(async (transaksi) => {
      const [hasil] = await transaksi
        .insert(assignments)
        .values({ subclassId, createdBy, title, description, dueAt })
        .$returningId();
      if (!hasil) throw new Error("ID tugas yang baru dibuat tidak tersedia.");

      await simpanPengingat(transaksi, hasil.id, dueAt, waktuPengingat);
      const tugas = await bacaTugas(transaksi, hasil.id);
      if (!tugas) throw new Error("Tugas yang baru dibuat tidak ditemukan.");
      return tugas;
    });
  },

  async ubah(
    classId: string,
    id: string,
    { title, description, dueAt }: PerubahanTugas,
    waktuPengingat?: readonly WaktuPengingat[],
  ) {
    return db.transaction(async (transaksi) => {
      const filter = and(eq(assignments.id, id), filterKelas(classId));
      const [tugas] = await transaksi.select().from(assignments).where(filter).for("update");
      if (!tugas) return null;

      if (
        waktuPengingat === undefined &&
        dueAt &&
        detik(dueAt) !== detik(tugas.dueAt) &&
        (await transaksi.$count(assignmentReminders, filterPengingat(id)))
      ) {
        throw new ConflictError("Sertakan jadwal pengingat baru saat mengubah tenggat tugas.");
      }

      const perubahan = { title, description, dueAt };
      if (Object.values(perubahan).some((nilai) => nilai !== undefined)) {
        await transaksi.update(assignments).set(perubahan).where(eq(assignments.id, id));
      }

      if (waktuPengingat !== undefined) {
        await transaksi.delete(assignmentReminders).where(filterPengingat(id));
        await simpanPengingat(transaksi, id, dueAt ?? tugas.dueAt, waktuPengingat);
      }

      return bacaTugas(transaksi, id);
    });
  },

  async hapus(classId: string, id: string) {
    // MySQL menghapus pengingat terkait melalui ON DELETE CASCADE.
    const [hasil] = await db
      .delete(assignments)
      .where(and(eq(assignments.id, id), filterKelas(classId)));
    return hasil.affectedRows > 0;
  },

  // Menampilkan semua pengingat yang terhubung dengan satu tugas
  async daftarPengingat(assignmentId: string) {
    return db
      .select()
      .from(assignmentReminders)
      .where(eq(assignmentReminders.assignmentId, assignmentId))
      .orderBy(asc(assignmentReminders.remindAt), asc(assignmentReminders.id));
  },

  // Daftar ini tidak mengklaim pekerjaan. Worker harus mencegah pemrosesan paralel
  // terhadap pengingat yang sama sebelum memanggil layanan push.
  async daftarPengingatSiapKirim(batas: Date, halaman: Halaman) {
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
    return ambilHalaman(halaman, db.$count(assignmentReminders, filter), (limit, offset) =>
      db
        .select({ pengingat: assignmentReminders, tugas: assignments, classId: subclasses.classId })
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
  async tandaiPengingatTerkirim(id: string, sentAt: Date) {
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
