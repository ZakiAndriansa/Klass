import { cn } from "@/lib/utils";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Papan informasi / poster: bidang biru lebar dengan judul besar di kiri dan
 * meta + CTA di kanan. Di layar <900px keduanya ditumpuk.
 */
type PosterProps = {
  label: string;
  judul: React.ReactNode;
  /** Teks baris-baris di kolom kanan (tanggal, tempat). */
  meta: React.ReactNode;
  aksi?: { label: string; href: string };
  className?: string;
};

export function Poster({ label, judul, meta, aksi, className }: PosterProps) {
  return (
    <aside className={cn("poster", className)}>
      <div className="poster__main">
        <span className="poster__label">{label}</span>
        <h2 className="poster__title">{judul}</h2>
      </div>
      <div className="poster__aside">
        <p className="poster__meta">{meta}</p>
        {aksi ? (
          <TautanTombolKertas href={aksi.href} variant="secondary">
            {aksi.label}
          </TautanTombolKertas>
        ) : null}
      </div>
    </aside>
  );
}
