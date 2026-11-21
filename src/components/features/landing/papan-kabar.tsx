import { Pin } from "lucide-react";

import { Lencana } from "@/components/shared/lencana";
import { cn } from "@/lib/utils";

import { KepalaBab } from "./bab";

/**
 * Papan pengumuman: tiga siaran yang ditusuk pin di kiri, satu poster acara
 * yang ditempel di kanan. Siaran tetap satu arah, tanpa komentar.
 */
export type SiaranLanding = {
  varian: "info" | "success" | "warning";
  label: string;
  judul: string;
  pesan: string;
  sumber: string;
};

export function PapanKabar({ siaran }: { siaran: SiaranLanding[] }) {
  return (
    <section className="section section--rapat papan-kabar-section" id="broadcast">
      <div className="section__inner">
        <KepalaBab
          nomor="05"
          label="Papan pengumuman"
          judul={
            <>
              Kabar dari <span className="sorot">kelas lain.</span>
            </>
          }
        />

        <div className="papan-kabar">
          <div className="papan-kabar__siaran">
            <div className="papan-kabar__kepala">
              <span>Siaran / 03</span>
              <span>satu arah</span>
            </div>

            <ul className="siaran-list">
              {siaran.map((item) => (
                <li key={`${item.label}-${item.judul}`}>
                  <article className={cn("siaran", `siaran--${item.varian}`)}>
                    <span className="siaran__pin" aria-hidden="true">
                      <Pin size={13} strokeWidth={2.2} />
                    </span>
                    <div className="siaran__kepala">
                      <Lencana variant={item.varian}>{item.label}</Lencana>
                      <span className="siaran__sumber">{item.sumber}</span>
                    </div>
                    <h3>{item.judul}</h3>
                    <p>{item.pesan}</p>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <aside className="poster-agenda" aria-label="Papan informasi: sesi kenalan Klass">
            <span className="poster-agenda__tape" aria-hidden="true" />
            <span className="poster-agenda__label">Papan informasi / 01</span>
            <p className="poster-agenda__kicker">Sesi kenalan Klass</p>
            <h3 className="poster-agenda__judul">
              Ide bagus <br />
              tumbuh <br />
              kalau dibagi.
            </h3>

            <dl className="poster-agenda__detail">
              <div>
                <dt>Tanggal</dt>
                <dd>Sabtu, 21 Nov 2026</dd>
              </div>
              <div>
                <dt>Waktu</dt>
                <dd>15.00 WIB</dd>
              </div>
              <div>
                <dt>Tempat</dt>
                <dd>Online · tanpa biaya</dd>
              </div>
            </dl>

            <div className="poster-agenda__kaki">
              <span>Terbuka untuk calon pengurus kelas</span>
              <span className="poster-agenda__cap">Terbuka</span>
            </div>

            <div className="poster-agenda__robek" aria-hidden="true">
              21 NOV · 15.00 · ONLINE · 21 NOV · 15.00 · ONLINE
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
