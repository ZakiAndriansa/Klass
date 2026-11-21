import "server-only";

/**
 * Pintu masuk lapisan izin. Pemilik: Zaki.
 *
 * Controller mengimpor dari `@/server/permissions`, bukan dari berkas di dalamnya:
 *   import { requireClassAdmin } from "@/server/permissions";
 */
export {
  readClassAccess,
  requireClassAdmin,
  requireClassMember,
  requireSubclassManager,
  requireSubclassMember,
  type ClassAccess,
  type PermissionOptions,
} from "./class";
export { forPage, requirePageLogin, requirePageSuperadmin } from "./page";
export { requireSuperadmin } from "./superadmin";
