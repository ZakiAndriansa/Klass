import { cn } from "@/lib/utils";

/**
 * Kepala section: eyebrow tulisan tangan, judul, dan subjudul.
 *
 * Varian:
 * - `garis` (default): dengan garis putus-putus di bawah.
 * - `polos`: tanpa garis, untuk heading yang berdiri sendiri di atas kartu.
 * - `pisah`: dua kolom di desktop; judul tulisan tangan di kiri, keterangan di
 *   kanan. Dipakai bagian "Dari anggota. Untuk anggota."
 * - `tulisan`: satu judul tulisan tangan tanpa garis. Dipakai "Cara kerja".
 */
type SectionHeadingProps = React.ComponentProps<"div"> & {
  eyebrow?: string;
  judul: React.ReactNode;
  subjudul?: React.ReactNode;
  varian?: "garis" | "polos" | "pisah" | "tulisan";
};

export function SectionHeading({
  eyebrow,
  judul,
  subjudul,
  varian = "garis",
  className,
  children,
  ...props
}: SectionHeadingProps) {
  const kelasVarian =
    varian === "polos"
      ? "section-heading--plain"
      : varian === "pisah"
        ? "section-heading--split"
        : varian === "tulisan"
          ? "section-heading--tulisan"
          : undefined;

  return (
    <div className={cn("section-heading", kelasVarian, className)} {...props}>
      {eyebrow ? <span className="section-heading__eyebrow">{eyebrow}</span> : null}
      <h2 className="section-heading__title">{judul}</h2>
      {subjudul ? <p className="section-heading__subtitle">{subjudul}</p> : null}
      {children}
    </div>
  );
}

/** Tautan tinta bergaris bawah. */
export function InkLink({ className, children, ...props }: React.ComponentProps<"a">) {
  return (
    <a className={cn("ink-link", className)} {...props}>
      {children}
    </a>
  );
}
