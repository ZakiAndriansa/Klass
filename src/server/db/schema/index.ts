/**
 * Daftar semua tabel. Pemilik: Fadlan (kecuali `auth.ts`, milik Zaki).
 *
 * Tabel ditulis satu berkas per kelompok di folder ini, lalu diekspor ulang dari sini:
 *
 *   export * from "./kelas";     // classes, class_members, class_bans, class_admin_invites
 *   export * from "./subkelas";  // subclasses, subclass_pj, schedules, materials, assignments, ...
 *   export * from "./website";   // posters, push_subscriptions
 *
 * Setelah mengubah tabel: `npm run db:generate`, baca SQL di folder `drizzle/`, lalu `npm run db:migrate`.
 * Aturan lengkap ada di `.claude/skills/klass-db/SKILL.md`.
 */

// users, sessions, accounts, verifications. Dibuat dari konfigurasi Better Auth, jangan diubah.
export * from "./auth";
export * from "./kelas";
export * from "./subkelas";
export * from "./website";
