"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Tabs bergaya pembatas map. Bisa dikendalikan dengan keyboard:
 * panah kiri/kanan berpindah tab, Home/End ke ujung.
 *
 * Isi tiap panel diberikan lewat props supaya komponen ini tidak perlu tahu
 * bentuk datanya.
 */
type TabItem = {
  label: string;
  isi: React.ReactNode;
  /** Angka kecil di kanan label, misalnya jumlah materi. */
  jumlah?: number;
};

type TabsProps = {
  item: TabItem[];
  /** Untuk `aria-label` daftar tab, misalnya "Menu subkelas". */
  label: string;
  className?: string;
};

export function Tabs({ item, label, className }: TabsProps) {
  const [aktif, setAktif] = useState(0);
  const dasarId = useId();
  const tombolRef = useRef<(HTMLButtonElement | null)[]>([]);

  function pindah(indeks: number) {
    const jumlah = item.length;
    const tujuan = (indeks + jumlah) % jumlah;
    setAktif(tujuan);
    tombolRef.current[tujuan]?.focus();
  }

  function saatTombolDitekan(e: React.KeyboardEvent<HTMLButtonElement>, indeks: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      pindah(indeks + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      pindah(indeks - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      pindah(0);
    } else if (e.key === "End") {
      e.preventDefault();
      pindah(item.length - 1);
    }
  }

  return (
    <div className={cn("tabs", className)}>
      <div className="tabs__list" role="tablist" aria-label={label}>
        {item.map((tab, indeks) => {
          const dipilih = indeks === aktif;
          return (
            <button
              key={tab.label}
              ref={(el) => {
                tombolRef.current[indeks] = el;
              }}
              type="button"
              role="tab"
              id={`${dasarId}-tab-${indeks}`}
              aria-selected={dipilih}
              aria-controls={`${dasarId}-panel-${indeks}`}
              tabIndex={dipilih ? 0 : -1}
              className={cn("tabs__tab", dipilih && "is-active")}
              onClick={() => setAktif(indeks)}
              onKeyDown={(e) => saatTombolDitekan(e, indeks)}
            >
              {tab.label}
              {typeof tab.jumlah === "number" ? ` ${tab.jumlah}` : null}
            </button>
          );
        })}
      </div>

      {item.map((tab, indeks) => (
        <div
          key={tab.label}
          className="tabs__panel"
          role="tabpanel"
          id={`${dasarId}-panel-${indeks}`}
          aria-labelledby={`${dasarId}-tab-${indeks}`}
          hidden={indeks !== aktif}
        >
          {typeof tab.isi === "string" ? <p className="tabs__text">{tab.isi}</p> : tab.isi}
        </div>
      ))}
    </div>
  );
}
