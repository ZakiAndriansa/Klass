/**
 * Fungsi murni seputar identitas pengguna.
 *
 * Sengaja tidak menyentuh database maupun sesi: `src/lib` dipakai Client
 * Component juga, sedangkan pembacaan sesi ada di `@/server/auth/pengguna`.
 */

/** Dua huruf awal nama, untuk avatar tanpa foto. */
export function inisialNama(nama: string): string {
  const bagian = nama
    .trim()
    .split(/\s+/)
    .filter((kata) => kata.length > 0);

  if (bagian.length === 0) return "?";
  if (bagian.length === 1) return bagian[0].slice(0, 2).toUpperCase();

  return (bagian[0][0] + bagian[bagian.length - 1][0]).toUpperCase();
}
