import { relations } from "drizzle-orm";
import { users } from "./auth";

import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
  index,
  text,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const posters = mysqlTable("posters", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  title: varchar("title", { length: 150 }).notNull(),

  imageUrl: varchar("image_url", { length: 2048 }).notNull(),

  isActive: boolean("is_active").notNull().default(true),

  sortOrder: int("sort_order").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const pushSubscriptions = mysqlTable(
  "push_subscriptions",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    endpoint: varchar("endpoint", {
      length: 512,
    }).notNull(),

    p256dh: text("p256dh").notNull(),

    auth: text("auth").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("push_subscriptions_endpoint_uidx").on(table.endpoint),

    index("push_subscriptions_user_id_idx").on(table.userId),
  ],
);

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [pushSubscriptions.userId],
    references: [users.id],
  }),
}));
