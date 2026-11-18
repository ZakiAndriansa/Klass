/**
 * Tabel autentikasi milik Better Auth. Pemilik: Zaki.
 *
 * JANGAN DIUBAH DENGAN TANGAN. Bentuk keempat tabel ini ditentukan Better Auth
 * (versi 1.7) dan harus selalu cocok dengan konfigurasi di `src/server/auth/index.ts`.
 * Bila konfigurasi auth berubah (misalnya menambah plugin), berkas ini dibuat ulang oleh Zaki.
 *
 * Untuk Fadlan: tabel lain yang merujuk ke pengguna cukup mengimpor `users` dari sini.
 * `users.id` bertipe varchar(36), jadi kolom FK-nya juga harus varchar(36):
 *
 *   import { users } from "./auth";
 *
 *   userId: varchar("user_id", { length: 36 })
 *     .notNull()
 *     .references(() => users.id, { onDelete: "cascade" }),
 *
 * Tidak ada tabel `profiles`. Nama dan avatar pengguna ada di `users.name` dan `users.image`,
 * dan penanda superadmin ada di `users.is_superadmin`.
 */
import { relations } from "drizzle-orm";
import { boolean, index, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/** Pengguna. Satu baris per orang yang pernah login. */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  /** Hanya diubah langsung lewat database oleh pengelola, tidak pernah lewat API. */
  isSuperadmin: boolean("is_superadmin").default(false).notNull(),
});

/** Sesi login. Dihapus otomatis bila penggunanya dihapus. */
export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

/** Akun dari penyedia login (Google). Satu pengguna bisa punya lebih dari satu akun. */
export const accounts = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

/** Kode verifikasi sementara yang dipakai Better Auth selama proses login. */
export const verifications = mysqlTable(
  "verifications",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
