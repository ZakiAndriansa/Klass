import { Navbar } from "@/components/shared/navbar";

/**
 * Rangka kelas yang tampil selagi `params` dan data kelas dimuat.
 *
 * Susunannya sengaja meniru hero + tab + panel asli, jadi tidak ada lompatan
 * tata letak saat isi sebenarnya muncul.
 */
export function RangkaKelasMemuat() {
  return (
    <div className="kelas-page" aria-busy="true">
      <Navbar
        className="navbar--dash"
        merek="Klass"
        merekHref="/dashboard"
        aksi={{ label: "Meja", href: "/dashboard" }}
      />

      <header className="kelas-hero kelas-hero--memuat" aria-hidden="true">
        <div className="kelas-hero__inner container">
          <div className="kelas-hero__utama">
            <div className="kelas-memuat__bar kelas-memuat__bar--crumb" />
            <div className="kelas-memuat__bar kelas-memuat__bar--judul" />
            <div className="kelas-memuat__bar kelas-memuat__bar--teks" />
            <div className="kelas-memuat__bar kelas-memuat__bar--teks-pendek" />
          </div>
          <div className="kelas-hero__sisi">
            <div className="kelas-memuat__kotak" />
            <div className="kelas-memuat__kotak" />
          </div>
        </div>
      </header>

      <div className="kelas-navbar">
        <div className="container" aria-hidden="true">
          <div className="kelas-memuat__nav" />
        </div>
      </div>

      <main className="kelas-main">
        <div className="kelas-main__inner container">
          <span className="sr-only">Memuat kelas…</span>
          <div className="kelas-memuat__panel" aria-hidden="true" />
          <div className="kelas-memuat__panel kelas-memuat__panel--pendek" aria-hidden="true" />
        </div>
      </main>
    </div>
  );
}
