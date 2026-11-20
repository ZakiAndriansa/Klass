import "server-only";

/**
 * Pintu masuk folder auth. Pemilik: Zaki.
 *
 * Kode lain mengimpor dari `@/server/auth`, bukan dari berkas di dalamnya:
 *   import { requireAuth } from "@/server/auth";
 */
export { ambilAuth, penanganAuth, type Sesi } from "./konfigurasi";
export { ambilSesi, keluar, requireAuth } from "./sesi";
export { AKUN_DEV, cariAkunDev, masukAkunDev } from "./akun-dev";
