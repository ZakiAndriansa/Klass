/**
 * Layout halaman setelah login.
 *
 * Sama seperti `(publik)/layout.tsx`: membungkus isi dengan `.ds` supaya gaya
 * kertas design system Klass berlaku, dan membuat kolom penuh setinggi layar.
 *
 * Pemeriksaan login TIDAK ditaruh di sini. Next.js merender layout dan halaman
 * secara terpisah, jadi layout tidak bisa menahan isi halaman. Penjagaannya dua lapis:
 *
 * 1. `src/proxy.ts` memindahkan pengunjung tanpa cookie sesi ke `/login`.
 * 2. Halaman yang mengambil data memanggil controller lewat `forPage()`
 *    (`@/server/permissions`). Controller memeriksa sesi dan peran; bila ditolak,
 *    pengguna dipindahkan ke `/login`, halaman 404, atau `/forbidden`.
 */
export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return <div className="ds ds-kolom">{children}</div>;
}
