"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Accordion / FAQ bergaya tumpukan kertas.
 *
 * Perilaku dari galeri: satu item terbuka pada satu waktu; tombol +/− ikut
 * berganti glyph dan berputar 45° lewat CSS saat terbuka.
 *
 * Panel tidak memakai atribut `hidden` karena `hidden` tidak bisa
 * dianimasikan. Sebagai gantinya panel selalu ada di DOM, tingginya
 * dianimasikan lewat `grid-template-rows: 0fr → 1fr`, dan saat tertutup
 * diberi `inert` supaya isinya keluar dari urutan Tab dan pohon aksesibilitas.
 */
type ItemFaq = {
  tanya: string;
  jawab: React.ReactNode;
};

type AccordionProps = {
  item: ItemFaq[];
  /** Indeks yang terbuka pertama kali. `null` berarti semua tertutup. */
  terbukaAwal?: number | null;
  className?: string;
};

export function Accordion({ item, terbukaAwal = 0, className }: AccordionProps) {
  const [terbuka, setTerbuka] = useState<number | null>(terbukaAwal);
  const dasarId = useId();

  return (
    <div className={cn("accordion", className)}>
      {item.map((faq, indeks) => {
        const sedangTerbuka = terbuka === indeks;
        return (
          <div key={faq.tanya} className={cn("accordion__item", sedangTerbuka && "is-open")}>
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={sedangTerbuka}
              aria-controls={`${dasarId}-panel-${indeks}`}
              id={`${dasarId}-tombol-${indeks}`}
              onClick={() => setTerbuka(sedangTerbuka ? null : indeks)}
            >
              <span>{faq.tanya}</span>
              <span className="accordion__chevron" aria-hidden="true">
                {sedangTerbuka ? "\u2212" : "+"}
              </span>
            </button>

            <div
              className="accordion__panel"
              id={`${dasarId}-panel-${indeks}`}
              role="region"
              aria-labelledby={`${dasarId}-tombol-${indeks}`}
              inert={!sedangTerbuka}
            >
              <div className="accordion__panel-inner">
                <div className="accordion__body">{faq.jawab}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
