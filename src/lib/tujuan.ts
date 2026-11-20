/**
 * Alamat tujuan setelah login. Pemilik: Zaki.
 *
 * Saat pengguna yang belum login membuka halaman yang wajib login, ia dipindahkan ke
 * `/login?next=/halaman/semula`. Setelah berhasil masuk, ia dikembalikan ke `next`.
 */

/** Halaman yang dibuka setelah login bila tidak ada `next`. */
export const TUJUAN_BAWAAN = "/dashboard";

/**
 * Memastikan `next` hanya menunjuk ke halaman Klass sendiri.
 *
 * Nilai `next` datang dari alamat, jadi bisa ditulis siapa saja. Tanpa pemeriksaan ini,
 * tautan seperti `/login?next=https://situs-jahat.test` akan membawa pengguna ke situs
 * lain setelah login. Yang diterima hanya jalur yang diawali satu garis miring.
 */
export function tujuanAman(nilai: string | null | undefined, cadangan = TUJUAN_BAWAAN): string {
  if (!nilai) return cadangan;

  const jalurLokal = nilai.startsWith("/") && !nilai.startsWith("//") && !nilai.includes("\\");
  if (!jalurLokal) return cadangan;

  // Kembali ke halaman login setelah login tidak ada gunanya.
  if (nilai === "/login" || nilai.startsWith("/login?")) return cadangan;

  return nilai;
}

/** Alamat `/login` yang mengingat halaman asal, misalnya `/login?next=%2Fclasses%2F123`. */
export function alamatLogin(asal?: string | null): string {
  const tujuan = tujuanAman(asal, "");
  return tujuan ? `/login?next=${encodeURIComponent(tujuan)}` : "/login";
}
