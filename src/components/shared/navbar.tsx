"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { AvatarPengguna } from "@/components/shared/avatar-pengguna";
import { LambangKlass } from "@/components/shared/lambang-klass";
import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Navbar bergaya tab folder. Di layar < 768px menu pindah ke drawer.
 *
 * Perilaku yang dipertahankan dari galeri:
 * - tombol menu mengubah `aria-expanded` dan menyembunyikan drawer;
 * - menekan Escape menutup drawer;
 * - menu otomatis tertutup bila layar dilebarkan ke >= 768px.
 *
 * `item` boleh kosong. Halaman kelas dan dedikasi memakai navbar tanpa tab
 * tengah karena navigasinya ada di hero halaman, jadi header cukup menampilkan
 * logo, tombol Meja, dan identitas pengguna.
 *
 * `aksi` sengaja hanya tautan biasa. Mengakhiri sesi bukan urusan navbar:
 * keluar hanya bisa dilakukan dari buku profil, supaya tidak ada tombol
 * berbahaya yang menempel di setiap halaman.
 *
 * `pengguna` diisi Server Component dari `getMySession()`. Bila ada, navbar
 * menampilkan avatar dan tautan ke `/profile`; bila tidak, hanya tombol masuk.
 * Komponen ini tidak mengambil sesi sendiri karena Client Component tidak
 * boleh membaca database.
 *
 * `Client Component` karena butuh state. Jangan taruh pengambilan data di sini.
 */
type ItemNavigasi = {
  label: string;
  href: string;
  /** Tandai tab yang sedang dibuka. */
  aktif?: boolean;
};

/** Identitas ringkas untuk sudut kanan navbar. */
export type PenggunaNavbar = {
  name: string;
  image: string | null;
};

type NavbarProps = {
  merek?: string;
  /** Tujuan logo. Di halaman publik cukup `#top`; di area login arahkan ke `/dashboard`. */
  merekHref?: string;
  /** Tautan tengah. Kosongkan bila navigasi sudah ada di tempat lain. */
  item?: ItemNavigasi[];
  /** Tombol di kanan, misalnya "Ajukan kelas" atau "Meja". Selalu tautan biasa. */
  aksi?: { label: string; href: string };
  /** Identitas pengguna yang sedang login. Kosong berarti belum masuk. */
  pengguna?: PenggunaNavbar | null;
  /** Tandai halaman profil sedang dibuka. */
  profilAktif?: boolean;
  className?: string;
};

export function Navbar({
  merek = "Klass",
  merekHref = "#top",
  item = [],
  aksi,
  pengguna,
  profilAktif = false,
  className,
}: NavbarProps) {
  const adaMenu = item.length > 0;
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
        <a href={merekHref} className="navbar__brand" aria-label={`${merek} Beranda`}>
          <LambangKlass className="navbar__logo" />
          <span className="navbar__brand-text">{merek}</span>
        </a>

        {adaMenu ? (
          <nav className="navbar__nav" aria-label="Navigasi utama">
            {item.map((tautan) => (
              <a
                key={tautan.label}
                href={tautan.href}
                className={cn("navbar__tab", tautan.aktif && "is-active")}
                aria-current={tautan.aktif ? "page" : undefined}
              >
                {tautan.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="navbar__actions">
          {pengguna ? (
            <a
              href="/profile"
              className={cn("navbar__profil", profilAktif && "is-active")}
              aria-current={profilAktif ? "page" : undefined}
            >
              <AvatarPengguna nama={pengguna.name} image={pengguna.image} ukuran={30} />
              <span className="navbar__profil-nama">{pengguna.name}</span>
            </a>
          ) : null}

          {aksi ? (
            <TautanTombolKertas
              className="navbar__aksi"
              href={aksi.href}
              variant="primary"
              size="sm"
            >
              {aksi.label}
            </TautanTombolKertas>
          ) : null}

          {adaMenu ? (
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
          ) : null}
        </div>
      </div>

      {adaMenu ? (
        <div ref={panelRef} className="navbar__drawer" id="navbar-drawer" hidden={!terbuka}>
          <nav className="navbar__drawer-nav" aria-label="Navigasi seluler">
            {item.map((tautan) => (
              <a
                key={tautan.label}
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
      ) : null}
    </header>
  );
}
