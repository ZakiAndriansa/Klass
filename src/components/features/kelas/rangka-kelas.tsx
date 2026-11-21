import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Users,
} from "lucide-react";

import { Navbar } from "@/components/shared/navbar";
import type { PenggunaNavbar } from "@/components/shared/navbar";
import { hakKelas, type AksesKelas } from "@/lib/akses-kelas";

import type { KelasDetail } from "./data-contoh";
import { cn } from "@/lib/utils";

export type TabKelas = "ringkasan" | "jadwal" | "materi" | "progress" | "anggota";

const tabKelas: {
  id: TabKelas;
  label: string;
  segmen: string;
  ikon: typeof LayoutDashboard;
}[] = [
  { id: "ringkasan", label: "Ringkasan", segmen: "", ikon: LayoutDashboard },
  { id: "jadwal", label: "Jadwal", segmen: "schedule", ikon: CalendarDays },
  { id: "materi", label: "Materi", segmen: "materials", ikon: BookOpen },
  { id: "progress", label: "Progress", segmen: "progress", ikon: ListChecks },
  { id: "anggota", label: "Anggota", segmen: "members", ikon: Users },
];

/**
 * Rangka halaman kelas: header tipis, hero map kelas, tab navigasi, dan isi.
 *
 * Satu rangka dipakai kelima halaman kelas supaya perpindahan tab tidak
 * mengubah posisi judul atau navigasi. `aktif` ditentukan halaman masing-masing
 * karena Server Component tidak punya `usePathname`.
 */
export function RangkaKelas({
  kelas,
  aktif,
  pengguna,
  akses,
  children,
}: {
  kelas: KelasDetail;
  aktif: TabKelas;
  /** Identitas pengguna untuk navbar. Kosong berarti belum terbaca. */
  pengguna?: PenggunaNavbar | null;
  /**
   * Hak pengguna di kelas ini. Bila kosong, semua tombol ubah disembunyikan
   * dan kode undangan tidak ditampilkan.
   */
  akses?: AksesKelas | null;
  children: React.ReactNode;
}) {
  const hak = hakKelas(akses ?? null);
  return (
    <div className={`kelas-page kelas-aksen--${kelas.warna}`}>
      <Navbar
        className="navbar--dash"
        merek="Klass"
        merekHref="/dashboard"
        aksi={{ label: "Meja", href: "/dashboard" }}
        pengguna={pengguna ?? null}
      />

      <header className="kelas-hero">
        <div className="kelas-hero__inner container">
          <div className="kelas-hero__utama">
            <Link className="kelas-crumb" href="/classes">
              <ArrowLeft size={15} aria-hidden="true" />
              Semua kelas
            </Link>

            <div className="kelas-hero__labelbaris">
              <span className="kelas-tab">{kelas.jenis}</span>
              <span className="kelas-peran">{kelas.peran}</span>
            </div>

            <h1 className="kelas-hero__judul">{kelas.nama}</h1>
            <p className="kelas-hero__deskripsi">{kelas.deskripsi}</p>

            <ul className="kelas-hero__meta">
              <li>
                <GraduationCap size={15} aria-hidden="true" />
                {kelas.semester} · {kelas.angkatan}
              </li>
              <li>
                <Users size={15} aria-hidden="true" />
                {kelas.anggota.length} anggota
              </li>
              <li>
                <CalendarDays size={15} aria-hidden="true" />
                Berikutnya {kelas.jadwalBerikutnya}
              </li>
            </ul>
          </div>

          <div className="kelas-hero__sisi">
            {hak.sudahAnggota ? (
              <div className="kelas-kode">
                <span className="kelas-kode__label">Kode undangan</span>
                <code className="kelas-kode__nilai">{kelas.kodeUndangan}</code>
                <span className="kelas-kode__catatan">Bagikan ke teman satu kelas.</span>
              </div>
            ) : (
              <div className="kelas-kode kelas-kode--privat">
                <span className="kelas-kode__label">Kode undangan</span>
                <span className="kelas-kode__catatan">
                  Hanya anggota kelas yang bisa melihat kode ini.
                </span>
              </div>
            )}

            <div className="kelas-progres-mini">
              <div className="kelas-progres-mini__atas">
                <span>Progres saya</span>
                <strong>{kelas.progres}%</strong>
              </div>
              <div
                className="kelas-progres-mini__bar"
                role="progressbar"
                aria-valuenow={kelas.progres}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progres tugas pribadi"
              >
                <span style={{ width: `${kelas.progres}%` }} />
              </div>
              <Link className="kelas-progres-mini__tautan" href={`/classes/${kelas.id}/progress`}>
                Buka papan progress
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="kelas-navbar">
        <div className="container">
          <nav className="kelas-nav" aria-label="Navigasi kelas">
            {tabKelas.map((tab) => {
              const Ikon = tab.ikon;
              const tujuan = tab.segmen
                ? `/classes/${kelas.id}/${tab.segmen}`
                : `/classes/${kelas.id}`;
              const dipilih = tab.id === aktif;

              return (
                <Link
                  key={tab.id}
                  href={tujuan}
                  className={cn("kelas-nav__tautan", dipilih && "is-active")}
                  aria-current={dipilih ? "page" : undefined}
                >
                  <Ikon size={16} aria-hidden="true" />
                  {tab.label}
                  {tab.id === "materi" ? (
                    <span className="kelas-nav__jumlah">{kelas.materi.length}</span>
                  ) : null}
                  {tab.id === "progress" ? (
                    <span className="kelas-nav__jumlah">{kelas.tugas.length}</span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="kelas-main">
        <div className="kelas-main__inner container">{children}</div>
      </main>
    </div>
  );
}
