import { relations, sql } from "drizzle-orm";

import {
  bigint,
  check,
  index,
  int,
  mysqlTable,
  primaryKey,
  time,
  timestamp,
  varchar,
  text,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

import { users } from "./auth";
import { classes } from "./class";

export const subclasses = mysqlTable(
  "subclasses",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    classId: varchar("class_id", { length: 36 })
      .notNull()
      .references(() => classes.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", { length: 150 }).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [index("subclasses_class_id_idx").on(table.classId)],
);

export const subclassesRelations = relations(subclasses, ({ one, many }) => ({
  class: one(classes, {
    fields: [subclasses.classId],
    references: [classes.id],
  }),

  pj: many(subclassPj),

  materials: many(materials),

  schedules: many(schedules),

  assignments: many(assignments),
}));

export const subclassPj = mysqlTable(
  "subclass_pj",
  {
    subclassId: varchar("subclass_id", { length: 36 })
      .notNull()
      .references(() => subclasses.id, {
        onDelete: "cascade",
      }),

    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.subclassId, table.userId],
    }),

    index("subclass_pj_user_id_idx").on(table.userId),
  ],
);

export const subclassPjRelations = relations(subclassPj, ({ one }) => ({
  subclass: one(subclasses, {
    fields: [subclassPj.subclassId],
    references: [subclasses.id],
  }),

  user: one(users, {
    fields: [subclassPj.userId],
    references: [users.id],
  }),
}));

export const materials = mysqlTable(
  "materials",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    subclassId: varchar("subclass_id", { length: 36 })
      .notNull()
      .references(() => subclasses.id, {
        onDelete: "cascade",
      }),

    uploadedBy: varchar("uploaded_by", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),

    title: varchar("title", { length: 150 }).notNull(),

    fileUrl: varchar("file_url", { length: 2048 }),

    linkUrl: varchar("link_url", { length: 2048 }),

    fileName: varchar("file_name", { length: 255 }),

    fileSize: bigint("file_size", { mode: "number" }),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("materials_subclass_id_idx").on(table.subclassId),

    index("materials_uploaded_by_idx").on(table.uploadedBy),
  ],
);

export const materialsRelations = relations(materials, ({ one }) => ({
  subclass: one(subclasses, {
    fields: [materials.subclassId],
    references: [subclasses.id],
  }),

  uploader: one(users, {
    fields: [materials.uploadedBy],
    references: [users.id],
  }),
}));

export const schedules = mysqlTable(
  "schedules",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    subclassId: varchar("subclass_id", { length: 36 })
      .notNull()
      .references(() => subclasses.id, {
        onDelete: "cascade",
      }),

    weekday: int("weekday").notNull(),

    startTime: time("start_time").notNull(),

    endTime: time("end_time").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("schedules_subclass_id_idx").on(table.subclassId),

    check("schedules_weekday_check", sql`${table.weekday} BETWEEN 1 AND 7`),
  ],
);

export const schedulesRelations = relations(schedules, ({ one }) => ({
  subclass: one(subclasses, {
    fields: [schedules.subclassId],
    references: [subclasses.id],
  }),
}));

export const assignments = mysqlTable(
  "assignments",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    subclassId: varchar("subclass_id", { length: 36 })
      .notNull()
      .references(() => subclasses.id, {
        onDelete: "cascade",
      }),

    title: varchar("title", { length: 150 }).notNull(),

    description: text("description"),

    createdBy: varchar("created_by", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),

    dueAt: timestamp("due_at").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("assignments_subclass_id_idx").on(table.subclassId),

    index("assignments_created_by_idx").on(table.createdBy),

    index("assignments_due_at_idx").on(table.dueAt),
  ],
);

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  subclass: one(subclasses, {
    fields: [assignments.subclassId],
    references: [subclasses.id],
  }),

  creator: one(users, {
    fields: [assignments.createdBy],
    references: [users.id],
  }),

  reminders: many(assignmentReminders),
}));

export const assignmentReminders = mysqlTable(
  "assignment_reminders",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    assignmentId: varchar("assignment_id", { length: 36 })
      .notNull()
      .references(() => assignments.id, {
        onDelete: "cascade",
      }),

    remindAt: timestamp("remind_at").notNull(),

    sentAt: timestamp("sent_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("assignment_reminders_assignment_remind_uidx").on(
      table.assignmentId,
      table.remindAt,
    ),

    index("assignment_reminders_remind_at_idx").on(table.remindAt),

    index("assignment_reminders_sent_at_idx").on(table.sentAt),
  ],
);

export const assignmentRemindersRelations = relations(assignmentReminders, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentReminders.assignmentId],
    references: [assignments.id],
  }),
}));
