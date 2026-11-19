/**
 * Layout halaman publik.
 *
 * Membungkus semua halaman di grup ini dengan `.ds` supaya gaya kertas design
 * system Klass tidak bocor ke halaman lain (dashboard, dsb.). Pembungkusnya
 * juga flex-column penuh supaya footer selalu menempel di bawah layar.
 */
export default function LayoutPublik({ children }: { children: React.ReactNode }) {
  return <div className="ds ds-kolom">{children}</div>;
}
