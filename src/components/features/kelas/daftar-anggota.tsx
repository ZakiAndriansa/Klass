"use client";

import { useMemo, useState } from "react";
import { Search, Users, X } from "lucide-react";

import { TombolKertas } from "@/components/shared/tombol-kertas";

import type { AnggotaKelas, PeranKelas } from "./data-contoh";
import { cn } from "@/lib/utils";

const filterPeran: (PeranKelas | "Semua")[] = ["Semua", "PJ", "Anggota"];

/**
 * Daftar anggota kelas dengan pencarian dan filter peran.
 *
 * Peran "Admin kelas" tetap ditampilkan bila ada di data, walau chip filter
 * hanya menyediakan PJ dan Anggota; pengguna bisa menemukannya lewat
 * pencarian. Kartu menampilkan mata kuliah yang dipegang PJ.
 */
export function DaftarAnggota({
  anggota,
  kodeUndangan,
}: {
  anggota: AnggotaKelas[];
  kodeUndangan: string;
}) {
  const [cari, setCari] = useState("");
  const [peran, setPeran] = useState<(typeof filterPeran)[number]>("Semua");

  const hasil = useMemo(() => {
    const kueri = cari.trim().toLowerCase();

    return anggota.filter((item) => {
      const cocokPeran = peran === "Semua" || item.peran === peran;
      const cocokCari =
        kueri.length === 0 ||
        [item.nama, item.peran, item.mataKuliah ?? ""].join(" ").toLowerCase().includes(kueri);
      return cocokPeran && cocokCari;
    });
  }, [anggota, cari, peran]);

  const jumlahPJ = anggota.filter((item) => item.peran === "PJ").length;
  const jumlahAdmin = anggota.filter((item) => item.peran === "Admin kelas").length;

  return (
    <div className="kelas-anggota">
      <dl className="kelas-ringkas-strip kelas-ringkas-strip--anggota">
        <div>
          <dt>
            <Users size={15} aria-hidden="true" />
            Total anggota
          </dt>
          <dd>{anggota.length} orang</dd>
        </div>
        <div>
          <dt>PJ mata kuliah</dt>
          <dd>{jumlahPJ} orang</dd>
        </div>
        <div>
          <dt>Admin kelas</dt>
          <dd>{jumlahAdmin} orang</dd>
        </div>
        <div className="kelas-strip-kode">
          <dt>Kode undangan</dt>
          <dd>
            <code>{kodeUndangan}</code>
          </dd>
        </div>
      </dl>

      <div className="kelas-toolbar">
        <div className="kelas-cari">
          <Search size={17} aria-hidden="true" className="kelas-cari__ikon" />
          <label className="sr-only" htmlFor="cari-anggota">
            Cari anggota
          </label>
          <input
            id="cari-anggota"
            type="search"
            className="kelas-cari__input"
            placeholder="Cari nama atau mata kuliah…"
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

        <div className="kelas-filter" role="group" aria-label="Filter peran anggota">
          {filterPeran.map((item) => (
            <button
              key={item}
              type="button"
              className={cn("kelas-filter__chip", peran === item && "is-active")}
              aria-pressed={peran === item}
              onClick={() => setPeran(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {hasil.length > 0 ? (
        <div className="kelas-anggota-grid">
          {hasil.map((item) => (
            <article key={item.id} className="kelas-anggota-kartu">
              <span className="kelas-avatar kelas-avatar--besar" aria-hidden="true">
                {item.inisial}
              </span>
              <div className="kelas-anggota-kartu__teks">
                <h2 className="kelas-anggota-kartu__nama">{item.nama}</h2>
                <p className="kelas-anggota-kartu__peran">
                  <span
                    className={`kelas-lencana ${
                      item.peran === "PJ"
                        ? "kelas-lencana--biru"
                        : item.peran === "Admin kelas"
                          ? "kelas-lencana--kuning"
                          : "kelas-lencana--netral"
                    }`}
                  >
                    {item.peran}
                  </span>
                  {item.mataKuliah ? <span>{item.mataKuliah}</span> : null}
                </p>
                <p className="kelas-anggota-kartu__gabung">Bergabung {item.bergabung}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="kelas-kosong">
          <Search size={22} aria-hidden="true" />
          <h3>Tidak ada anggota yang cocok</h3>
          <p>Coba nama lain atau kembali ke semua peran.</p>
          <TombolKertas
            variant="secondary"
            size="sm"
            onClick={() => {
              setCari("");
              setPeran("Semua");
            }}
          >
            Hapus filter
          </TombolKertas>
        </div>
      )}
    </div>
  );
}
