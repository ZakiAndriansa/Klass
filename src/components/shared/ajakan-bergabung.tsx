import { cn } from "@/lib/utils";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Pita ajakan bergabung selebar layar, berwarna map manila.
 *
 * Di desktop tinggi pita dikunci 250px dan CTA duduk 35px di bawah awal blok
 * teks, persis Figma 60:766.
 */
type AjakanBergabungProps = {
  judul: string;
  salinan: string;
  aksi: { label: string; href: string };
  className?: string;
};

export function AjakanBergabung({ judul, salinan, aksi, className }: AjakanBergabungProps) {
  return (
    <section className={cn("invite", className)} aria-labelledby="invite-judul">
      <div className="invite__inner">
        <div>
          <h2 className="invite__title" id="invite-judul">
            {judul}
          </h2>
          <p className="invite__copy">{salinan}</p>
        </div>
        <TautanTombolKertas href={aksi.href} className="invite__cta">
          {aksi.label}
        </TautanTombolKertas>
      </div>
    </section>
  );
}
