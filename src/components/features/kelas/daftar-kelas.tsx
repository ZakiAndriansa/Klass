"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { TombolKertas } from "@/components/shared/tombol-kertas";

import type { JenisKelas, KelasRingkas } from "./data-contoh";
import { KartuKelas } from "./kartu-kelas";
import { cn } from "@/lib/utils";

const semuaJenis: (JenisKelas | "Semua")[] = [
  "Semua",
  "Kelas kuliah",
  "Komunitas belajar",
  "Organisasi",
];

/**
 * Daftar kelas dengan pencarian dan filter jenis.
 *
 * Pencarian mencakup nama, deskripsi, dan nama mata kuliah supaya pengguna
 * yang mengingat "Basis Data" tetap menemukan kelasnya. Daftar kosong selalu
 * punya tombol reset, bukan hanya pesan.
 */
export function DaftarKelas({ kelas }: { kelas: KelasRingkas[] }) {
  const [cari, setCari] = useState("");
  const [jenis, setJenis] = useState<(typeof semuaJenis)[number]>("Semua");

  const hasil = useMemo(() => {
    const kueri = cari.trim().toLowerCase();

    return kelas.filter((item) => {
      const cocokJenis = jenis === "Semua" || item.jenis === jenis;
      const cocokCari =
        kueri.length === 0 ||
        [item.nama, item.deskripsi, item.semester, item.angkatan, ...item.mataKuliah]
          .join(" ")
          .toLowerCase()
          .includes(kueri);

      return cocokJenis && cocokCari;
    });
  }, [cari, jenis, kelas]);

  const adaFilter = cari.trim().length > 0 || jenis !== "Semua";

  function reset() {
    setCari("");
    setJenis("Semua");
  }

  return (
    <section className="kelas-daftar" aria-labelledby="judul-daftar-kelas">
      <div className="kelas-daftar__kepala">
        <h2 id="judul-daftar-kelas" className="kelas-seksi-judul">
          Semua kelas
          <span className="kelas-jumlah-hasil">{hasil.length}</span>
        </h2>
        <p className="kelas-seksi-desc">Pilih kelas untuk melihat jadwal, materi, dan progress.</p>
      </div>

      <div className="kelas-toolbar">
        <div className="kelas-cari">
          <Search size={17} aria-hidden="true" className="kelas-cari__ikon" />
          <label className="sr-only" htmlFor="cari-kelas">
            Cari kelas
          </label>
          <input
            id="cari-kelas"
            type="search"
            className="kelas-cari__input"
            placeholder="Cari kelas atau mata kuliah…"
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

        <div className="kelas-filter" role="group" aria-label="Filter jenis kelas">
          {semuaJenis.map((item) => (
            <button
              key={item}
              type="button"
              className={cn("kelas-filter__chip", jenis === item && "is-active")}
              aria-pressed={jenis === item}
              onClick={() => setJenis(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {hasil.length > 0 ? (
        <div className="kelas-grid-kartu">
          {hasil.map((item) => (
            <KartuKelas key={item.id} kelas={item} />
          ))}
        </div>
      ) : (
        <div className="kelas-kosong">
          <span className="kelas-kosong__ikon" aria-hidden="true">
            <Search size={22} />
          </span>
          <h3>Tidak ada kelas yang cocok</h3>
          <p>Coba kata kunci lain atau hapus filter yang sedang aktif.</p>
          {adaFilter ? (
            <TombolKertas variant="secondary" size="sm" onClick={reset}>
              Hapus filter
            </TombolKertas>
          ) : null}
        </div>
      )}
    </section>
  );
}
