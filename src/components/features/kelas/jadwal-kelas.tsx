"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { URUTAN_HARI } from "./bantuan";
import type { HariKelas, SesiJadwal } from "./data-contoh";
import { cn } from "@/lib/utils";

/**
 * Jadwal mingguan dengan filter hari.
 *
 * Semua sesi ditampilkan sekaligus; filter hanya menyembunyikan hari lain.
 * Hari ini diberi penanda "Hari ini" supaya pengguna tidak perlu menghitung
 * hari sendiri.
 */
export function JadwalKelas({ jadwal, hariIni }: { jadwal: SesiJadwal[]; hariIni: HariKelas }) {
  const [filter, setFilter] = useState<HariKelas | "Semua">("Semua");

  const hariTampil = filter === "Semua" ? URUTAN_HARI : [filter];
  const jumlahPerHari = useMemo(() => {
    const peta = new Map<HariKelas, number>();
    for (const sesi of jadwal) {
      peta.set(sesi.hari, (peta.get(sesi.hari) ?? 0) + 1);
    }
    return peta;
  }, [jadwal]);

  const jumlahMapel = new Set(jadwal.map((sesi) => sesi.mataKuliahId)).size;
  const totalJam = jadwal.length * 2;

  return (
    <div className="kelas-jadwal">
      <div className="kelas-toolbar kelas-toolbar--jadwal">
        <div className="kelas-filter" role="group" aria-label="Filter hari jadwal">
          <button
            type="button"
            className={cn("kelas-filter__chip", filter === "Semua" && "is-active")}
            aria-pressed={filter === "Semua"}
            onClick={() => setFilter("Semua")}
          >
            Semua
            <span className="kelas-filter__hitung">{jadwal.length}</span>
          </button>
          {URUTAN_HARI.map((hari) => (
            <button
              key={hari}
              type="button"
              className={cn("kelas-filter__chip", filter === hari && "is-active")}
              aria-pressed={filter === hari}
              onClick={() => setFilter(hari)}
              disabled={(jumlahPerHari.get(hari) ?? 0) === 0}
            >
              {hari}
              <span className="kelas-filter__hitung">{jumlahPerHari.get(hari) ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      <dl className="kelas-ringkas-strip">
        <div>
          <dt>
            <CalendarDays size={15} aria-hidden="true" />
            Sesi per minggu
          </dt>
          <dd>{jadwal.length} sesi</dd>
        </div>
        <div>
          <dt>
            <Clock size={15} aria-hidden="true" />
            Perkiraan jam kelas
          </dt>
          <dd>{totalJam} jam</dd>
        </div>
        <div>
          <dt>
            <Users size={15} aria-hidden="true" />
            Mata kuliah
          </dt>
          <dd>{jumlahMapel} bagian</dd>
        </div>
      </dl>

      <div className="kelas-hari-daftar">
        {hariTampil.map((hari) => {
          const sesi = jadwal
            .filter((item) => item.hari === hari)
            .sort((a, b) => a.mulai.localeCompare(b.mulai));

          if (sesi.length === 0) return null;

          return (
            <section key={hari} className="kelas-hari" aria-labelledby={`hari-${hari}`}>
              <header className="kelas-hari__kepala">
                <h2 id={`hari-${hari}`} className="kelas-hari__nama">
                  {hari}
                </h2>
                {hari === hariIni ? (
                  <span className="kelas-lencana kelas-lencana--kuning">Hari ini</span>
                ) : null}
                <span className="kelas-hari__jumlah">{sesi.length} sesi</span>
              </header>

              <ul className="kelas-hari__daftar">
                {sesi.map((item) => (
                  <li key={item.id} className="kelas-jadwal-baris">
                    <div className="kelas-jadwal-baris__jam">
                      <strong>{item.mulai}</strong>
                      <span>{item.selesai}</span>
                    </div>

                    <span
                      className={`kelas-jadwal-baris__aksen kelas-pita--${item.warna}`}
                      aria-hidden="true"
                    />

                    <div className="kelas-jadwal-baris__utama">
                      <div className="kelas-jadwal-baris__atas">
                        <span className="kelas-jadwal-baris__mapel">{item.mataKuliah}</span>
                        <span className="kelas-lencana kelas-lencana--netral">{item.mode}</span>
                      </div>
                      <h3 className="kelas-jadwal-baris__topik">{item.topik}</h3>
                      <p className="kelas-jadwal-baris__meta">
                        <MapPin size={14} aria-hidden="true" />
                        {item.ruang}
                        <span>·</span>
                        <Users size={14} aria-hidden="true" />
                        PJ {item.pj}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {hariTampil.every((hari) => !jadwal.some((item) => item.hari === hari)) ? (
        <div className="kelas-kosong">
          <CalendarDays size={22} aria-hidden="true" />
          <h3>Tidak ada sesi di hari ini</h3>
          <p>Pilih hari lain atau lihat seluruh jadwal minggu.</p>
        </div>
      ) : null}

      <p className="kelas-catatan-kaki">
        Jadwal bersifat mingguan. Perubahan ruang atau jam diumumkan di beranda kelas.
      </p>
    </div>
  );
}
