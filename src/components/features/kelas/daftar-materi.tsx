"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";

import { TombolKertas } from "@/components/shared/tombol-kertas";

import type { JenisMateri, Materi } from "./data-contoh";
import { IkonMateri, labelJenisMateri } from "./ikon-materi";
import { cn } from "@/lib/utils";

const semuaJenis: (JenisMateri | "Semua")[] = [
  "Semua",
  "pdf",
  "video",
  "slide",
  "tautan",
  "catatan",
];

/**
 * Kumpulan materi dengan pencarian, filter mata kuliah, dan filter jenis.
 *
 * Pencarian mencakup judul, ringkasan, dan nama penulis. Filter mata kuliah
 * dibuat dari data, bukan daftar tetap, supaya kelas lain tetap benar.
 */
export function DaftarMateri({ kelasId, materi }: { kelasId: string; materi: Materi[] }) {
  const [cari, setCari] = useState("");
  const [mapel, setMapel] = useState("Semua");
  const [jenis, setJenis] = useState<(typeof semuaJenis)[number]>("Semua");

  const daftarMapel = useMemo(() => {
    const unik = new Map<string, string>();
    for (const item of materi) unik.set(item.mataKuliahId, item.mataKuliah);
    return [...unik.entries()];
  }, [materi]);

  const hasil = useMemo(() => {
    const kueri = cari.trim().toLowerCase();

    return [...materi]
      .filter((item) => {
        const cocokMapel = mapel === "Semua" || item.mataKuliahId === mapel;
        const cocokJenis = jenis === "Semua" || item.jenis === jenis;
        const cocokCari =
          kueri.length === 0 ||
          [item.judul, item.ringkasan, item.mataKuliah, item.penulis]
            .join(" ")
            .toLowerCase()
            .includes(kueri);

        return cocokMapel && cocokJenis && cocokCari;
      })
      .sort((a, b) => {
        if (Boolean(b.baru) !== Boolean(a.baru)) return b.baru ? 1 : -1;
        return b.minggu - a.minggu;
      });
  }, [cari, jenis, mapel, materi]);

  const adaFilter = cari.trim().length > 0 || mapel !== "Semua" || jenis !== "Semua";

  function reset() {
    setCari("");
    setMapel("Semua");
    setJenis("Semua");
  }

  return (
    <div className="kelas-materi">
      <div className="kelas-toolbar">
        <div className="kelas-cari">
          <Search size={17} aria-hidden="true" className="kelas-cari__ikon" />
          <label className="sr-only" htmlFor="cari-materi">
            Cari materi
          </label>
          <input
            id="cari-materi"
            type="search"
            className="kelas-cari__input"
            placeholder="Cari judul, ringkasan, atau penulis…"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
          {cari.length > 0 ? (
            <button
              type="button"
              className="kelas-cari__hapus"
              onClick={() => setCari("")}
              aria-label="Hapus pencarian"
            >
              <X size={15} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="kelas-filter" role="group" aria-label="Filter mata kuliah">
          <button
            type="button"
            className={cn("kelas-filter__chip", mapel === "Semua" && "is-active")}
            aria-pressed={mapel === "Semua"}
            onClick={() => setMapel("Semua")}
          >
            Semua mapel
          </button>
          {daftarMapel.map(([id, nama]) => (
            <button
              key={id}
              type="button"
              className={cn("kelas-filter__chip", mapel === id && "is-active")}
              aria-pressed={mapel === id}
              onClick={() => setMapel(id)}
            >
              {nama}
            </button>
          ))}
        </div>

        <div className="kelas-filter-jenis">
          <label htmlFor="filter-jenis-materi">Jenis</label>
          <select
            id="filter-jenis-materi"
            className="kelas-pilih"
            value={jenis}
            onChange={(e) => setJenis(e.target.value as (typeof semuaJenis)[number])}
          >
            {semuaJenis.map((item) => (
              <option key={item} value={item}>
                {item === "Semua" ? "Semua jenis" : labelJenisMateri[item]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="kelas-hasil-baris">
        <p className="kelas-hasil-teks">
          <strong>{hasil.length}</strong> materi{adaFilter ? " sesuai filter" : ""}
        </p>
        {adaFilter ? (
          <button type="button" className="kelas-tombol-teks" onClick={reset}>
            Reset filter
          </button>
        ) : null}
      </div>

      {hasil.length > 0 ? (
        <div className="kelas-materi-grid">
          {hasil.map((item) => (
            <Link
              key={item.id}
              className="kelas-materi-kartu"
              href={`/classes/${kelasId}/materials/${item.id}`}
            >
              <div className="kelas-materi-kartu__atas">
                <span className={`kelas-materi-ikon kelas-pita--${item.warna}`}>
                  <IkonMateri jenis={item.jenis} size={19} />
                </span>
                <span className="kelas-lencana kelas-lencana--netral">
                  {labelJenisMateri[item.jenis]}
                </span>
                {item.baru ? <span className="kelas-lencana kelas-lencana--baru">Baru</span> : null}
                <ArrowUpRight size={17} aria-hidden="true" className="kelas-materi-kartu__panah" />
              </div>

              <h3 className="kelas-materi-kartu__judul">{item.judul}</h3>
              <p className="kelas-materi-kartu__ringkasan">{item.ringkasan}</p>

              <div className="kelas-materi-kartu__meta">
                <span>{item.mataKuliah}</span>
                <span>Minggu {item.minggu}</span>
                <span>{item.durasi}</span>
              </div>

              <div className="kelas-materi-kartu__kaki">
                <span>{item.penulis}</span>
                <span>{item.tanggal}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="kelas-kosong">
          <Search size={22} aria-hidden="true" />
          <h3>Tidak ada materi yang cocok</h3>
          <p>Ubah kata kunci, mata kuliah, atau jenis materi.</p>
          <TombolKertas variant="secondary" size="sm" onClick={reset}>
            Hapus filter
          </TombolKertas>
        </div>
      )}
    </div>
  );
}
