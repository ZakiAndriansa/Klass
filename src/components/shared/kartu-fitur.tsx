import { cn } from "@/lib/utils";

/**
 * Kartu indeks untuk "Fitur utama": label monospace di kiri-atas, judul, dan
 * satu paragraf. Tiga warna dari Figma: folder (manila), blue, yellow.
 *
 * Tinggi minimum dikunci 266px lewat token supaya tiga kartu sejajar meski
 * panjang teksnya berbeda.
 */
type KartuFiturProps = {
  nomor: string;
  judul: string;
  deskripsi: string;
  warna?: "folder" | "blue" | "yellow" | "orange";
  className?: string;
};

export function KartuFitur({
  nomor,
  judul,
  deskripsi,
  warna = "folder",
  className,
}: KartuFiturProps) {
  return (
    <article className={cn("stat-card", `stat-card--${warna}`, className)}>
      <span className="stat-card__num">{nomor}</span>
      <h3 className="stat-card__title">{judul}</h3>
      <p className="stat-card__desc">{deskripsi}</p>
    </article>
  );
}

/** Pembungkus grid tiga kolom untuk KartuFitur. */
export function GridFitur({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("stats-grid", className)} {...props}>
      {children}
    </div>
  );
}
