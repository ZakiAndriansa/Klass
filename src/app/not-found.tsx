import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Navbar } from "@/components/shared/navbar";

/**
 * Halaman 404 global.
 *
 * Dipakai untuk alamat yang tidak dikenal, termasuk kelas atau materi yang
 * tidak ada. Karena berada di luar grup `(app)`, pembungkus `.ds` dipasang di
 * sini agar gaya kertas Klass tetap berlaku.
 */
export default function HalamanTidakDitemukan() {
  return (
    <div className="ds ds-kolom">
      <Navbar
        className="navbar--dash"
        merek="Klass"
        merekHref="/dashboard"
        aksi={{ label: "Ke dasbor", href: "/dashboard" }}
      />

      <main className="halaman-404">
        <div className="container">
          <div className="halaman-404__kartu">
            <span className="halaman-404__kode" aria-hidden="true">
              404
            </span>
            <h1 className="halaman-404__judul">Halaman tidak ditemukan</h1>
            <p className="halaman-404__teks">
              Alamat ini tidak ada, atau kelas dan materi yang kamu cari sudah dipindahkan. Coba
              kembali ke daftar kelas untuk menemukan jalannya.
            </p>

            <div className="halaman-404__aksi">
              <Link className="btn btn--primary btn--md" href="/classes">
                <ArrowLeft size={16} aria-hidden="true" />
                Daftar kelas
              </Link>
              <Link className="btn btn--secondary btn--md" href="/dashboard">
                <Compass size={16} aria-hidden="true" />
                Dasbor
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
