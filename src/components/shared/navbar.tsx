"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Navbar bergaya tab folder. Di layar < 768px menu pindah ke drawer.
 *
 * Perilaku yang dipertahankan dari galeri:
 * - tombol menu mengubah `aria-expanded` dan menyembunyikan drawer;
 * - menekan Escape menutup drawer;
 * - menu otomatis tertutup bila layar dilebarkan ke >= 768px.
 *
 * `Client Component` karena butuh state. Jangan taruh pengambilan data di sini.
 */
type ItemNavigasi = {
  label: string;
  href: string;
  /** Tandai tab yang sedang dibuka. */
  aktif?: boolean;
};

type NavbarProps = {
  merek?: string;
  item: ItemNavigasi[];
  /** Tombol di kanan, misalnya "Ajukan kelas". */
  aksi?: { label: string; href: string };
  className?: string;
};

export function Navbar({ merek = "Klass", item, aksi, className }: NavbarProps) {
  const [terbuka, setTerbuka] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function saatTombolDitekan(e: KeyboardEvent) {
      if (e.key === "Escape") setTerbuka(false);
    }

    function saatLayarBerubah(e: MediaQueryListEvent) {
      if (e.matches) setTerbuka(false);
    }

    const lebarLayar = window.matchMedia("(min-width: 768px)");

    document.addEventListener("keydown", saatTombolDitekan);
    lebarLayar.addEventListener("change", saatLayarBerubah);

    return () => {
      document.removeEventListener("keydown", saatTombolDitekan);
      lebarLayar.removeEventListener("change", saatLayarBerubah);
    };
  }, []);

  return (
    <header className={cn("navbar", className)}>
      <div className="navbar__inner container">
        <a href="#atas" className="navbar__brand" aria-label={`${merek} Beranda`}>
          <span className="navbar__logo" aria-hidden="true">
            K
          </span>
          <span className="navbar__brand-text">{merek}</span>
        </a>

        <nav className="navbar__nav" aria-label="Navigasi utama">
          {item.map((tautan) => (
            <a
              key={tautan.href}
              href={tautan.href}
              className={cn("navbar__tab", tautan.aktif && "is-active")}
              aria-current={tautan.aktif ? "page" : undefined}
            >
              {tautan.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          {aksi ? (
            <TautanTombolKertas href={aksi.href} variant="primary" size="sm">
              {aksi.label}
            </TautanTombolKertas>
          ) : null}

          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setTerbuka((nilai) => !nilai)}
            aria-expanded={terbuka}
            aria-controls="navbar-drawer"
            aria-label={terbuka ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              {terbuka ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div ref={panelRef} className="navbar__drawer" id="navbar-drawer" hidden={!terbuka}>
        <nav className="navbar__drawer-nav" aria-label="Navigasi seluler">
          {item.map((tautan) => (
            <a
              key={tautan.href}
              href={tautan.href}
              className={cn("navbar__drawer-link", tautan.aktif && "is-active")}
              aria-current={tautan.aktif ? "page" : undefined}
              onClick={() => setTerbuka(false)}
            >
              {tautan.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
