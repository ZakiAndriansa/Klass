import "server-only";

/**
 * Pintu masuk folder auth. Pemilik: Zaki.
 *
 * Kode lain mengimpor dari `@/server/auth`, bukan dari berkas di dalamnya:
 *   import { requireAuth } from "@/server/auth";
 */
export { getAuth, authHandler, type Session } from "./config";
export { getSession, signOut, requireAuth } from "./session";
export { DEV_ACCOUNTS, findDevAccount, signInDevAccount } from "./dev-accounts";
