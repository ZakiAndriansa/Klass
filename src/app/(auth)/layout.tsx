/**
 * Layout halaman autentikasi.
 *
 * Membungkus `/login` dan `/register` dengan `.ds` supaya kertas bergaris dan
 * token design system Klass berlaku, tanpa navbar atau footer.
 */
export default function LayoutAuth({ children }: { children: React.ReactNode }) {
  return <div className="ds flex min-h-dvh flex-1 flex-col">{children}</div>;
}
