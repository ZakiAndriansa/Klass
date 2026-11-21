import { BellRing, CalendarDays, FileText, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";

import { KepalaBab } from "./bab";

/**
 * Tiga fitur utama, masing-masing ditunjukkan lewat artefak kecil di atas
 * meja: map materi yang terbuka, potongan jadwal, dan notifikasi di layar HP.
 * Artefaknya dekoratif; teks di bawahnya yang membawa informasi.
 */
export type JenisFitur = "materi" | "jadwal" | "pengingat";

export type FiturLanding = {
  jenis: JenisFitur;
  kode: string;
  judul: string;
  deskripsi: string;
};

function ArtefakMateri() {
  return (
    <div className="mini-map">
      <span className="mini-map__tab">Materi / 05</span>
      <div className="mini-map__badan">
        <span className="mini-map__berkas mini-map__berkas--3">
          <FileText size={13} strokeWidth={2.2} aria-hidden="true" />
          Rekaman sesi
        </span>
        <span className="mini-map__berkas mini-map__berkas--2">
          <FileText size={13} strokeWidth={2.2} aria-hidden="true" />
          Modul PDF
        </span>
        <span className="mini-map__berkas mini-map__berkas--1">
          <FileText size={13} strokeWidth={2.2} aria-hidden="true" />
          Slide 05
        </span>
        <span className="mini-map__label">
          <FolderOpen size={13} strokeWidth={2.2} aria-hidden="true" />
          IF-24A
        </span>
      </div>
    </div>
  );
}

function ArtefakJadwal() {
  return (
    <div className="jadwal-mini">
      <div className="jadwal-mini__kepala">
        <span>Jadwal / minggu 12</span>
        <CalendarDays size={14} strokeWidth={2.2} aria-hidden="true" />
      </div>
      <div className="jadwal-mini__hari" aria-hidden="true">
        <span>Sen</span>
        <span>Sel</span>
        <span>Rab</span>
        <span>Kam</span>
        <span>Jum</span>
      </div>
      <div className="jadwal-mini__baris">
        <span className="jadwal-mini__jam">08.00</span>
        <span className="jadwal-mini__blok">Pemrograman Web</span>
      </div>
      <div className="jadwal-mini__baris jadwal-mini__baris--aktif">
        <span className="jadwal-mini__jam">10.00</span>
        <span className="jadwal-mini__blok">Basis Data · Lab 3</span>
        <span className="jadwal-mini__pj">PJ</span>
      </div>
      <div className="jadwal-mini__baris">
        <span className="jadwal-mini__jam">13.00</span>
        <span className="jadwal-mini__blok">Jaringan Komputer</span>
      </div>
    </div>
  );
}

function ArtefakPengingat() {
  return (
    <div className="notif-mini">
      <div className="notif-mini__layar">
        <span className="notif-mini__jam">09.41</span>
        <span className="notif-mini__kamera" aria-hidden="true" />
        <div className="notif-mini__kartu">
          <span className="notif-mini__ikon">
            <BellRing size={14} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <div>
            <strong>Klass · Basis Data</strong>
            <p>Tugas Normalisasi besok 23.59</p>
          </div>
        </div>
        <span className="notif-mini__petunjuk">geser untuk buka</span>
      </div>
    </div>
  );
}

const artefak = {
  materi: ArtefakMateri,
  jadwal: ArtefakJadwal,
  pengingat: ArtefakPengingat,
} as const;

export function IsiMap({ fitur }: { fitur: FiturLanding[] }) {
  return (
    <section className="section section--rapat isi-map-section" id="features">
      <div className="section__inner">
        <KepalaBab
          nomor="02"
          label="Isi map"
          judul={
            <>
              Tiga hal yang bikin kelas <span className="sorot">nggak berantakan.</span>
            </>
          }
        />

        <div className="isi-map">
          {fitur.map((item) => {
            const Artefak = artefak[item.jenis];
            return (
              <article className={cn("isi-map__fitur", `isi-map__fitur--${item.jenis}`)} key={item.kode}>
                <div className="isi-map__panggung" aria-hidden="true">
                  <Artefak />
                </div>
                <div className="isi-map__teks">
                  <span className="isi-map__kode">{item.kode}</span>
                  <h3>{item.judul}</h3>
                  <p>{item.deskripsi}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
