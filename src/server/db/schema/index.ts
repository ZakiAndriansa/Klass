/**
 * Daftar semua tabel. Pemilik: Fadlan.
 *
 * Tabel ditulis satu berkas per kelompok di folder ini, lalu diekspor ulang dari sini:
 *
 *   export * from "./website";   // profiles, posters
 *   export * from "./kelas";     // classes, class_members, class_bans, class_admin_invites
 *   export * from "./subkelas";  // subclasses, subclass_pj, schedules, materials, assignments, ...
 *
 * Setelah mengubah tabel: `npm run db:generate`, baca SQL di folder `drizzle/`, lalu `npm run db:migrate`.
 * Aturan lengkap ada di `.claude/skills/klass-db/SKILL.md`.
 */
export {};
