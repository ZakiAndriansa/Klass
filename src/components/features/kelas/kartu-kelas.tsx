import Link from "next/link";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  ListChecks,
  Users,
} from "lucide-react";

import type { KelasRingkas } from "./data-contoh";

const ikonJenis = {
  "Kelas kuliah": GraduationCap,
  "Komunitas belajar": Users,
  Organisasi: Building2,
} as const;

/**
 * Kartu folder kelas di halaman `/classes`.
 *
 * Seluruh kartu adalah satu tautan supaya area klik besar dan perilaku
 * keyboard-nya sederhana. Warna pita mengikuti warna kelas, sedangkan isi
 * (nama, jenis, progres) tetap memakai tinta yang sama.
 */
export function KartuKelas({ kelas }: { kelas: KelasRingkas }) {
  const Ikon = ikonJenis[kelas.jenis];

  return (
    <Link href={`/classes/${kelas.id}`} className={`kelas-kartu kelas-aksen--${kelas.warna}`}>
      <span className="kelas-kartu__pita" aria-hidden="true" />

      <div className="kelas-kartu__atas">
        <span className="kelas-kartu__jenis">
          <Ikon size={15} aria-hidden="true" />
          {kelas.jenis}
        </span>
        <span className="kelas-kartu__peran">{kelas.peran}</span>
      </div>

      <h2 className="kelas-kartu__judul">{kelas.nama}</h2>
      <p className="kelas-kartu__deskripsi">{kelas.deskripsi}</p>

      <ul className="kelas-kartu__meta">
        <li>
          <GraduationCap size={14} aria-hidden="true" />
          {kelas.semester} · {kelas.angkatan}
        </li>
        <li>
          <CalendarDays size={14} aria-hidden="true" />
          {kelas.jadwalBerikutnya}
        </li>
      </ul>

      <div className="kelas-kartu__progres">
        <div className="kelas-kartu__progres-atas">
          <span>Progres tugas</span>
          <strong>{kelas.progres}%</strong>
        </div>
        <div
          className="kelas-progres-bar"
          role="progressbar"
          aria-valuenow={kelas.progres}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progres tugas ${kelas.nama}`}
        >
          <span style={{ width: `${kelas.progres}%` }} />
        </div>
      </div>

      <div className="kelas-kartu__kaki">
        <span>
          <Users size={14} aria-hidden="true" />
          {kelas.anggota}
        </span>
        <span>
          <BookOpen size={14} aria-hidden="true" />
          {kelas.jumlahMateri} materi
        </span>
        <span>
          <ListChecks size={14} aria-hidden="true" />
          {kelas.jumlahTugas} tugas
        </span>
        <span className="kelas-kartu__buka">
          Buka
          <ChevronRight size={15} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
