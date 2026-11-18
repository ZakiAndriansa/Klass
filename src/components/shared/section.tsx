import { cn } from "@/lib/utils";

/**
 * Section halaman bergaya kertas.
 *
 * `Section` memberi jarak vertikal 64px (mobile) / 96px (desktop).
 * `SectionInner` memusatkan isi: 1200px pada frame 1440px, lalu melebar
 * sampai 1440px di layar yang lebih besar.
 * `SectionHead` menaruh judul di kiri dan tautan aksi di kanan.
 */
type SectionProps = React.ComponentProps<"section"> & {
  /** Tempel ke section sebelumnya (tanpa padding atas). */
  rapatAtas?: boolean;
  /**
   * Ritme jarak vertikal.
   * - `normal` (default): 64px di ponsel, 96px di desktop — dipakai galeri.
   * - `rapat`: 48px di semua lebar — dipakai halaman utama yang mengikuti
   *   tumpukan section Figma.
   */
  jarak?: "normal" | "rapat";
};

export function Section({
  className,
  rapatAtas = false,
  jarak = "normal",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "section",
        rapatAtas && "section--flush-top",
        jarak === "rapat" && "section--rapat",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionInner({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("section__inner", className)} {...props}>
      {children}
    </div>
  );
}

type SectionHeadProps = React.ComponentProps<"div"> & {
  judul: React.ReactNode;
  /** Tautan "Lihat semua" di kanan judul. */
  tautan?: { href: string; label: string };
};

export function SectionHead({ judul, tautan, className, children, ...props }: SectionHeadProps) {
  return (
    <div className={cn("section__head", className)} {...props}>
      <h2 className="section__head-title">{judul}</h2>
      {tautan ? (
        <a className="section__head-link" href={tautan.href}>
          {tautan.label}
        </a>
      ) : null}
      {children}
    </div>
  );
}
