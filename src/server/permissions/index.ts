import "server-only";

/**
 * Pintu masuk lapisan izin. Pemilik: Zaki.
 *
 * Controller mengimpor dari `@/server/permissions`, bukan dari berkas di dalamnya:
 *   import { requireClassAdmin } from "@/server/permissions";
 */
export {
  bacaAksesKelas,
  requireClassAdmin,
  requireClassMember,
  requireSubclassManager,
  requireSubclassMember,
  type AksesKelas,
  type OpsiIzin,
} from "./kelas";
export { untukHalaman, wajibLogin } from "./halaman";
export { requireSuperadmin } from "./superadmin";
