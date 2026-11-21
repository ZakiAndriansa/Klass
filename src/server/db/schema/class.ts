import { relations } from "drizzle-orm";

import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

import { users } from "./auth";

export const classes = mysqlTable(
  "classes",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    name: varchar("name", { length: 150 }).notNull(),

    createdBy: varchar("created_by", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),

    status: mysqlEnum("status", ["pending", "active", "rejected", "archived"])
      .notNull()
      .default("pending"),

    isListed: boolean("is_listed").notNull().default(true),

    inviteCode: varchar("invite_code", { length: 32 }).unique(),

    memberLimit: int("member_limit"),

    style: json("style"),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [index("classes_created_by_idx").on(table.createdBy)],
);

export const classesRelations = relations(classes, ({ one, many }) => ({
  creator: one(users, {
    fields: [classes.createdBy],
    references: [users.id],
  }),

  members: many(classMembers),

  bans: many(classBans),

  adminInvites: many(classAdminInvites),
}));

export const classMembers = mysqlTable(
  "class_members",
  {
    classId: varchar("class_id", { length: 36 })
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),

    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    role: mysqlEnum("role", ["admin", "member"]).notNull().default("member"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.classId, table.userId],
    }),

    index("class_members_user_id_idx").on(table.userId),
  ],
);

export const classMembersRelations = relations(classMembers, ({ one }) => ({
  class: one(classes, {
    fields: [classMembers.classId],
    references: [classes.id],
  }),

  user: one(users, {
    fields: [classMembers.userId],
    references: [users.id],
  }),
}));

export const classBans = mysqlTable(
  "class_bans",
  {
    classId: varchar("class_id", { length: 36 })
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),

    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    reason: text("reason"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.classId, table.userId],
    }),

    index("class_bans_user_id_idx").on(table.userId),
  ],
);

export const classBansRelations = relations(classBans, ({ one }) => ({
  class: one(classes, {
    fields: [classBans.classId],
    references: [classes.id],
  }),

  user: one(users, {
    fields: [classBans.userId],
    references: [users.id],
  }),
}));

export const classAdminInvites = mysqlTable(
  "class_admin_invites",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    classId: varchar("class_id", { length: 36 })
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),

    email: varchar("email", { length: 255 }).notNull(),

    status: mysqlEnum("status", ["pending", "accepted", "revoked"]).notNull().default("pending"),

    invitedBy: varchar("invited_by", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("class_admin_invites_email_class_uidx").on(table.email, table.classId),

    index("class_admin_invites_invited_by_idx").on(table.invitedBy),
  ],
);

export const classAdminInvitesRelations = relations(classAdminInvites, ({ one }) => ({
  class: one(classes, {
    fields: [classAdminInvites.classId],
    references: [classes.id],
  }),

  inviter: one(users, {
    fields: [classAdminInvites.invitedBy],
    references: [users.id],
  }),
}));
