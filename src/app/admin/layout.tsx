/**
 * Layout rute superadmin.
 *
 * Sama seperti `(app)/layout.tsx`: hanya membungkus dengan `.ds`. Pemeriksaan
 * peran superadmin belum ada karena middleware dan Better Auth belum
 * dikonfigurasi; nanti pemeriksaan itu ditaruh di server, bukan dengan
 * menyembunyikan menu (lihat skill `klass-izin`).
 */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <div className="ds ds-kolom">{children}</div>;
}
