/**
 * Layout halaman khusus pengembangan (`/dev/...`).
 *
 * Sama seperti layout lain: hanya membungkus dengan `.ds` supaya gaya kertas
 * design system Klass berlaku.
 */
export default function LayoutDev({ children }: { children: React.ReactNode }) {
  return <div className="ds ds-kolom ds-kolom--layar">{children}</div>;
}
