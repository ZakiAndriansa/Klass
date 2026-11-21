import Link from "next/link";
import { CalendarClock, ChevronRight, ClipboardCheck, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import type { HariMeja, ItemAgenda } from "./data-contoh";

/**
 * "Hari ini": sesi dan tenggat hari ini, diurutkan per jam.
 *
 * Ini bagian terpenting Meja. Ia menjawab satu pertanyaan yang tidak bisa
 * dijawab halaman kelas mana pun: "hari ini aku harus ke mana dan
 * mengerjakan apa, di semua kelas sekaligus".
 *
 * Baris memakai pola yang sama dengan jadwal di buku profil: jam monospace,
 * pita warna kelas di kiri, dan latar kertas cekung. Baris tenggat yang jatuh
 * hari ini diberi latar kuning supaya tidak terlewat.
 */
export function AgendaHariIni({ agenda }: { agenda: ItemAgenda[] }) {
  return (
    <section className="meja-panel meja-panel--agenda" aria-labelledby="meja-hari-ini">
      <div className="meja-panel__kepala">
        <h2 className="meja-panel__judul" id="meja-hari-ini">
          <CalendarClock size={17} strokeWidth={2.2} aria-hidden="true" />
          Hari ini
        </h2>
        <span className="meja-panel__meta">
          {agenda.length > 0 ? `${agenda.length} kegiatan` : "kosong"}
        </span>
      </div>

      {agenda.length > 0 ? (
        <ol className="meja-agenda">
          {agenda.map((item) => (
            <li key={item.id}>
              <Link
                className={cn(
                  "meja-agenda__baris",
                  `meja-warna--${item.warna}`,
                  item.mendesak && "is-mendesak",
                )}
                href={item.href}
              >
                <span className="meja-agenda__jam">{item.jam}</span>

                <span className="meja-agenda__isi">
                  <span className="meja-agenda__judul">
                    {item.jenis === "tugas" ? (
                      <ClipboardCheck
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="meja-agenda__ikon"
                      />
                    ) : (
                      <MapPin
                        size={13}
                        strokeWidth={2.4}
                        aria-hidden="true"
                        className="meja-agenda__ikon"
                      />
                    )}
                    {item.judul}
                  </span>
                  <span className="meja-agenda__ket">{item.keterangan}</span>
                </span>

                <ChevronRight size={15} aria-hidden="true" className="meja-agenda__panah" />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="meja-kosong-mini">
          Tidak ada sesi atau tenggat hari ini. Waktu yang bagus untuk mengejar materi yang
          tertinggal.
        </p>
      )}
    </section>
  );
}

/**
 * Pita tujuh hari: jumlah kegiatan per hari, diwarnai per kelas.
 *
 * Sengaja bukan tabel kalender penuh. Tujuannya hanya menjawab "minggu ini
 * padat di hari apa", dan bisa digeser mendatar di layar sempit.
 */
export function PitaMinggu({ minggu }: { minggu: HariMeja[] }) {
  if (minggu.length === 0) return null;

  return (
    <section className="meja-panel" aria-labelledby="meja-minggu">
      <div className="meja-panel__kepala">
        <h2 className="meja-panel__judul" id="meja-minggu">
          Minggu ini
        </h2>
        <span className="meja-panel__meta">sesi &amp; tenggat</span>
      </div>

      <ol className="meja-minggu">
        {minggu.map((hari) => (
          <li
            key={hari.id}
            className={cn("meja-minggu__hari", hari.ini && "is-ini")}
            aria-current={hari.ini ? "date" : undefined}
          >
            <span className="meja-minggu__label">{hari.label}</span>
            <span className="meja-minggu__titik" aria-hidden="true">
              {hari.warna.map((warna, indeks) => (
                <span
                  key={`${hari.id}-${warna}-${indeks}`}
                  className={`meja-titik meja-warna--${warna}`}
                />
              ))}
            </span>
            <span className="meja-minggu__jumlah">
              {hari.jumlah > 0 ? hari.jumlah : "—"}
              <span className="sr-only"> kegiatan</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
