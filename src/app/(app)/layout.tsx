/**
 * Layout halaman setelah login.
 *
 * Sama seperti `(publik)/layout.tsx`: membungkus isi dengan `.ds` supaya gaya
 * kertas design system Klass berlaku, dan membuat kolom penuh setinggi layar.
 *
 * Pemeriksaan login belum ada (middleware dan Better Auth belum dikonfigurasi).
 * Saat lapisan izin siap, pemeriksaan sesi ditaruh di sini, bukan di tiap
 * halaman — lihat skill `klass-izin`.
 */
export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return <div className="ds ds-kolom">{children}</div>;
}
