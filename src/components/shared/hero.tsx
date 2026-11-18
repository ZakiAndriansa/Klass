import { cn } from "@/lib/utils";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Hero halaman utama: wordmark "KLASS." di dalam kotak tinta merah, lima badge
 * status yang tersebar mengikuti koordinat Figma, dan dua CTA.
 *
 * Di layar <=900px komposisi absolut diganti tumpukan: kotak lebih kecil,
 * badge berbaris, lalu CTA melebar penuh (lihat hero.css).
 *
 * Teks hero tetap ada di DOM sebagai `<h1>` tersembunyi supaya pembaca layar
 * mendapat judul halaman; wordmark hanya hiasan.
 */
type HeroProps = {
  /** Judul untuk pembaca layar. */
  judul: string;
  /** Badge status yang ditempel di sekitar kotak tinta. */
  lencana: { label: string; varian: "primary" | "info" | "success" | "warning" | "error" }[];
  aksi: { label: string; href: string }[];
  className?: string;
};

/** Posisi absolut lima badge dari Figma 60:649, berurutan. */
const posisiLencana = ["pj", "besok", "terlewat", "admin", "terkumpul"] as const;

export function Hero({ judul, lencana, aksi, className }: HeroProps) {
  return (
    <section className={cn("hero", className)} aria-labelledby="hero-judul">
      <h1 className="sr-only" id="hero-judul">
        {judul}
      </h1>

      <div className="hero__stage">
        <div className="hero__lockup">
          <div className="hero__sketch" aria-hidden="true" />
          <p className="hero__wordmark" aria-hidden="true">
            KLASS.
          </p>
        </div>

        <ul className="hero__badges">
          {lencana.map((item, indeks) => (
            <li
              key={item.label}
              className={cn("hero__badge", `hero__badge--${posisiLencana[indeks] ?? "pj"}`)}
            >
              <span className={cn("badge", `badge--${item.varian}`)}>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="hero__actions">
          {aksi.map((tombol, indeks) => (
            <TautanTombolKertas
              key={tombol.href}
              href={tombol.href}
              variant={indeks === 0 ? "primary" : "secondary"}
            >
              {tombol.label}
            </TautanTombolKertas>
          ))}
        </div>
      </div>
    </section>
  );
}
