import { cn } from "@/lib/utils";

/**
 * Footer lembar kertas: merek + tagline di kiri, tautan di kanan, lalu baris
 * hak cipta di bawah garis putus-putus.
 */
type TautanFooter = { label: string; href: string };

type FooterProps = {
  merek?: string;
  tagline: string;
  tautan: TautanFooter[];
  /** Teks hak cipta di kiri bawah. */
  hakCipta: string;
  /** Lencana kecil di kanan bawah. */
  lencana?: string;
  className?: string;
};

export function Footer({
  merek = "KLASS",
  tagline,
  tautan,
  hakCipta,
  lencana,
  className,
}: FooterProps) {
  return (
    <footer className={cn("footer", className)}>
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__brand-col">
            <span className="footer__brand">{merek}</span>
            <p className="footer__tagline">{tagline}</p>
          </div>
          <nav className="footer__links" aria-label="Tautan footer">
            {tautan.map((item) => (
              <a key={item.href} href={item.href} className="footer__link">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer__bottom">
          <span className="footer__copy">{hakCipta}</span>
          {lencana ? <span className="badge">{lencana}</span> : null}
        </div>
      </div>
    </footer>
  );
}
