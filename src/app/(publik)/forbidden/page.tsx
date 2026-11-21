import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Navbar } from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: "Tidak punya izin",
  description: "Kamu sudah masuk, tetapi tidak punya izin untuk membuka halaman itu.",
  robots: { index: false, follow: false },
};

/**
 * Halaman "tidak punya izin", beralamat `/forbidden`.
 *
 * Dibuka otomatis oleh `forPage()` (`src/server/permissions`) saat controller
 * menolak dengan 403: pengguna sudah login, tetapi perannya tidak cukup.
 *
 * Tampilannya sengaja memakai kelas yang sama dengan halaman 404 (`not-found.tsx`).
 */
export default function HalamanTanpaIzin() {
  return (
    <>
      <Navbar
        className="navbar--dash"
        merek="Klass"
        merekHref="/dashboard"
        aksi={{ label: "Ke Meja", href: "/dashboard" }}
      />

      <main className="halaman-404">
        <div className="container">
          <div className="halaman-404__kartu">
            <span className="halaman-404__kode" aria-hidden="true">
              403
            </span>
            <h1 className="halaman-404__judul">Kamu tidak punya izin</h1>
            <p className="halaman-404__teks">
              Halaman itu hanya untuk peran tertentu, misalnya admin kelas atau PJ. Kalau menurutmu
              ini keliru, hubungi admin kelasmu.
            </p>

            <div className="halaman-404__aksi">
              <Link className="btn btn--primary btn--md" href="/classes">
                <ArrowLeft size={16} aria-hidden="true" />
                Daftar kelas
              </Link>
              <Link className="btn btn--secondary btn--md" href="/dashboard">
                <Compass size={16} aria-hidden="true" />
                Meja
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
