/**
 * Layout rute superadmin.
 *
 * Sama seperti `(app)/layout.tsx`: hanya membungkus dengan `.ds`.
 *
 * Pemeriksaan superadmin TIDAK ditaruh di sini. Next.js merender layout dan halaman
 * secara terpisah, jadi layout tidak bisa menahan isi halaman. Setiap halaman di
 * bawah `/admin` memeriksanya sendiri dengan `wajibSuperadmin()` (lihat `page.tsx`),
 * dan controller yang dipanggilnya memakai `requireSuperadmin()`.
 * Menyembunyikan menu bukan pengamanan.
 */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <div className="ds ds-kolom">{children}</div>;
}
