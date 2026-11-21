"use client";

import { useId, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronDown, ClipboardCheck, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Satu map kelas di landing, mengikuti struktur folder di referensi:
 *
 *   1. punggung map bertab (belakang)
 *   2. tiga lembar berkas (tengah) — hanya tepinya yang mengintip saat tertutup
 *   3. tutup depan berlabel + satu kendali (depan)
 *
 * Map tidak berubah ukuran. Saat dibuka hanya kertas yang bergerak: tiga
 * lembar naik keluar dari balik tutup depan lalu menyebar. Karena itu baris
 * map di bawahnya tidak pernah melompat.
 *
 * Tombol pembuka menutup seluruh map (sasaran klik yang besar). Saat terbuka
 * panel berkas naik ke atas tombol, jadi ketiga tautan tetap bisa diklik.
 */
const ikonBerkas = {
  Materi: FileText,
  Tugas: ClipboardCheck,
  Jadwal: CalendarDays,
} as const;

export type JenisBerkas = keyof typeof ikonBerkas;

export type BerkasKelas = {
  jenis: JenisBerkas;
  judul: string;
  meta: string;
  href: string;
};

export type KelasPilihan = {
  nomor: string;
  kode: string;
  anggota: number;
  judul: string;
  deskripsi: string;
  warna: "manila" | "lilac" | "green";
  berkas: BerkasKelas[];
};

export function FolderKelas({ kelas }: { kelas: KelasPilihan }) {
  const [terbuka, setTerbuka] = useState(false);
  const idPanel = `berkas-${useId().replaceAll(":", "")}`;
  const { kode, anggota, judul, deskripsi, warna, berkas } = kelas;

  return (
    <li className={cn("folder-kelas", terbuka && "is-open")}>
      <article
        className={cn("folder-kelas__map", warna !== "manila" && `folder-kelas__map--${warna}`)}
      >
        <span className="folder-kelas__punggung" aria-hidden="true" />

        {/* Tepi kertas yang mengintip di balik tutup depan saat tertutup. */}
        <span className="folder-kelas__intip" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        <button
          type="button"
          className="folder-kelas__toggle"
          aria-expanded={terbuka}
          aria-controls={idPanel}
          aria-label={`${terbuka ? "Tutup" : "Buka"} map ${judul}, ${kode}, ${anggota} anggota`}
          onClick={() => setTerbuka((sebelumnya) => !sebelumnya)}
        />

        <div className="folder-kelas__panel" id={idPanel} inert={!terbuka}>
          {berkas.map((item, urutan) => {
            const Ikon = ikonBerkas[item.jenis];
            return (
              <a
                key={`${item.jenis}-${item.judul}`}
                href={item.href}
                className={cn("berkas-kelas", `berkas-kelas--${item.jenis.toLowerCase()}`)}
                style={{ "--berkas-urutan": urutan } as React.CSSProperties}
                aria-label={`${item.jenis}: ${item.judul} — buka kelas`}
              >
                {/* Judul dan meta ada di pita atas: itu yang terlihat saat
                    kertas bertumpuk, jadi tiap lembar tetap terbaca. */}
                <span className="berkas-kelas__kepala">
                  <span className="berkas-kelas__judul">{item.judul}</span>
                  <span className="berkas-kelas__meta">{item.meta}</span>
                </span>

                <span className="berkas-kelas__badan">
                  <span className="berkas-kelas__jenis">
                    <Ikon size={11} strokeWidth={2.4} aria-hidden="true" />
                    {item.jenis}
                  </span>

                  <span className="berkas-kelas__garis" aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </span>

                <ArrowUpRight
                  className="berkas-kelas__panah"
                  size={14}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>

        <div className="folder-kelas__depan">
          <div className="folder-kelas__label">
            <h3 className="folder-kelas__judul">{judul}</h3>
            <p className="folder-kelas__meta">
              {kode} · {anggota} anggota
            </p>
          </div>

          <span className="folder-kelas__kendali" aria-hidden="true">
            <ChevronDown size={17} strokeWidth={2.4} />
          </span>
        </div>
      </article>

      <p className="sr-only">{deskripsi}</p>
    </li>
  );
}
