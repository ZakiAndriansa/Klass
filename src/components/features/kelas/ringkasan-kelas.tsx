import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDot,
  Clock,
  ListChecks,
  MapPin,
  Megaphone,
  Users,
} from "lucide-react";

import { hitungProgres, labelStatus, sesiBerikutnya } from "./bantuan";
import type { KelasDetail } from "./data-contoh";
import { IkonMateri } from "./ikon-materi";

/**
 * Ringkasan kelas: pengumuman, progres pribadi, sesi terdekat, materi baru,
 * mata kuliah, tugas yang belum selesai, dan anggota.
 *
 * Semua tautan menuju halaman yang benar-benar ada. Bagian yang nanti butuh
 * data tambahan ditandai di docs, bukan dengan tautan mati di UI.
 */
export function RingkasanKelas({ kelas }: { kelas: KelasDetail }) {
  const statusSaya = Object.fromEntries(kelas.tugas.map((tugas) => [tugas.id, tugas.status]));
  const progres = hitungProgres(kelas.tugas, statusSaya);
  const selesai = kelas.tugas.filter((tugas) => tugas.status === "done").length;
  const dikerjakan = kelas.tugas.filter((tugas) => tugas.status === "doing").length;
  const belumMulai = kelas.tugas.filter((tugas) => tugas.status === "todo").length;

  const sesi = sesiBerikutnya(kelas.jadwal, kelas.hariIni, 2);
  const tugasAktif = kelas.tugas.filter((tugas) => tugas.status !== "done").slice(0, 3);
  const materiBaru = [...kelas.materi]
    .sort((a, b) => {
      if (Boolean(b.baru) !== Boolean(a.baru)) return b.baru ? 1 : -1;
      return b.minggu - a.minggu;
    })
    .slice(0, 3);
  const anggotaTampil = kelas.anggota.slice(0, 5);

  return (
    <div className="kelas-ringkasan">
      <section
        className="kelas-panel kelas-span-12 kelas-panel--pengumuman"
        aria-labelledby="judul-pengumuman"
      >
        <div className="kelas-panel__kepala">
          <h2 id="judul-pengumuman" className="kelas-panel__judul">
            <Megaphone size={18} aria-hidden="true" />
            Pengumuman
          </h2>
          <span className="kelas-lencana kelas-lencana--kuning">{kelas.pengumuman.lencana}</span>
        </div>

        <div className="kelas-pengumuman">
          <span className="kelas-avatar kelas-avatar--besar" aria-hidden="true">
            {kelas.pengumuman.inisial}
          </span>
          <div>
            <p className="kelas-pengumuman__penulis">
              <strong>{kelas.pengumuman.penulis}</strong>
              <span> · {kelas.pengumuman.peran}</span>
            </p>
            <p className="kelas-pengumuman__isi">{kelas.pengumuman.isi}</p>
          </div>
          <Link className="kelas-pengumuman__aksi" href={`/classes/${kelas.id}/schedule`}>
            Lihat jadwal
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="kelas-panel kelas-span-4" aria-labelledby="judul-progres-saya">
        <div className="kelas-panel__kepala">
          <h2 id="judul-progres-saya" className="kelas-panel__judul">
            <ListChecks size={18} aria-hidden="true" />
            Progres saya
          </h2>
        </div>

        <div className="kelas-progres-besar">
          <strong className="kelas-progres-besar__angka">
            {progres}
            <span>%</span>
          </strong>
          <p className="kelas-progres-besar__ket">
            {selesai} dari {kelas.tugas.length} tugas selesai
          </p>
        </div>

        <div
          className="kelas-progres-bar kelas-progres-bar--tebal"
          role="progressbar"
          aria-valuenow={progres}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres tugas pribadi"
        >
          <span style={{ width: `${progres}%` }} />
        </div>

        <ul className="kelas-stat-mini">
          <li>
            <strong>{selesai}</strong>
            <span>Selesai</span>
          </li>
          <li>
            <strong>{dikerjakan}</strong>
            <span>Dikerjakan</span>
          </li>
          <li>
            <strong>{belumMulai}</strong>
            <span>Belum mulai</span>
          </li>
        </ul>

        <Link className="kelas-tautan-panah" href={`/classes/${kelas.id}/progress`}>
          Buka papan progress
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="kelas-panel kelas-span-4" aria-labelledby="judul-jadwal-dekat">
        <div className="kelas-panel__kepala">
          <h2 id="judul-jadwal-dekat" className="kelas-panel__judul">
            <Clock size={18} aria-hidden="true" />
            Jadwal terdekat
          </h2>
          <Link className="kelas-tautan-kecil" href={`/classes/${kelas.id}/schedule`}>
            Semua jadwal
          </Link>
        </div>

        <ul className="kelas-sesi-dekat">
          {sesi.map((item) => (
            <li key={item.id} className="kelas-sesi-dekat__item">
              <span className={`kelas-titik kelas-titik--${item.warna}`} aria-hidden="true" />
              <div>
                <p className="kelas-sesi-dekat__waktu">
                  {item.hari} · {item.mulai}–{item.selesai}
                </p>
                <p className="kelas-sesi-dekat__judul">{item.mataKuliah}</p>
                <p className="kelas-sesi-dekat__tempat">
                  <MapPin size={13} aria-hidden="true" />
                  {item.ruang}
                  <span> · {item.mode}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="kelas-panel kelas-span-4" aria-labelledby="judul-anggota-singkat">
        <div className="kelas-panel__kepala">
          <h2 id="judul-anggota-singkat" className="kelas-panel__judul">
            <Users size={18} aria-hidden="true" />
            Anggota
          </h2>
          <Link className="kelas-tautan-kecil" href={`/classes/${kelas.id}/members`}>
            Lihat semua
          </Link>
        </div>

        <div className="kelas-anggota-singkat">
          <div className="kelas-avatar-tumpuk" aria-hidden="true">
            {anggotaTampil.map((anggota) => (
              <span key={anggota.id} className="kelas-avatar">
                {anggota.inisial}
              </span>
            ))}
            <span className="kelas-avatar kelas-avatar--sisa">+{kelas.anggota.length - 5}</span>
          </div>
          <p>
            <strong>{kelas.anggota.length} orang</strong> belajar bersama di kelas ini.{" "}
            {kelas.anggota.filter((anggota) => anggota.peran === "PJ").length} PJ menjaga materi
            tiap mata kuliah.
          </p>
        </div>

        <ul className="kelas-anggota-daftar-singkat">
          {kelas.anggota.slice(0, 3).map((anggota) => (
            <li key={anggota.id}>
              <span className="kelas-avatar kelas-avatar--kecil">{anggota.inisial}</span>
              <span className="kelas-anggota-daftar-singkat__nama">{anggota.nama}</span>
              <span className="kelas-lencana kelas-lencana--netral">{anggota.peran}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="kelas-panel kelas-span-7" aria-labelledby="judul-materi-baru">
        <div className="kelas-panel__kepala">
          <h2 id="judul-materi-baru" className="kelas-panel__judul">
            <IkonMateri jenis="catatan" size={18} />
            Materi terbaru
          </h2>
          <Link className="kelas-tautan-kecil" href={`/classes/${kelas.id}/materials`}>
            Semua materi
          </Link>
        </div>

        <ul className="kelas-materi-daftar">
          {materiBaru.map((materi) => (
            <li key={materi.id}>
              <Link
                className="kelas-materi-baris"
                href={`/classes/${kelas.id}/materials/${materi.id}`}
              >
                <span className={`kelas-materi-ikon kelas-titik--${materi.warna}`}>
                  <IkonMateri jenis={materi.jenis} size={18} />
                </span>
                <span className="kelas-materi-baris__teks">
                  <span className="kelas-materi-baris__judul">
                    {materi.judul}
                    {materi.baru ? (
                      <span className="kelas-lencana kelas-lencana--baru">Baru</span>
                    ) : null}
                  </span>
                  <span className="kelas-materi-baris__meta">
                    {materi.mataKuliah} · Minggu {materi.minggu} · {materi.tanggal}
                  </span>
                </span>
                <ChevronRight size={16} aria-hidden="true" className="kelas-materi-baris__panah" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="kelas-panel kelas-span-5" aria-labelledby="judul-tugas-dekat">
        <div className="kelas-panel__kepala">
          <h2 id="judul-tugas-dekat" className="kelas-panel__judul">
            Tugas berikutnya
          </h2>
          <Link className="kelas-tautan-kecil" href={`/classes/${kelas.id}/progress`}>
            Papan progress
          </Link>
        </div>

        {tugasAktif.length > 0 ? (
          <ul className="kelas-tugas-daftar">
            {tugasAktif.map((tugas) => (
              <li key={tugas.id} className="kelas-tugas-baris">
                {tugas.status === "doing" ? (
                  <CircleDot size={17} aria-hidden="true" className="kelas-ikon-doing" />
                ) : (
                  <Circle size={17} aria-hidden="true" className="kelas-ikon-todo" />
                )}
                <span className="kelas-tugas-baris__teks">
                  <span className="kelas-tugas-baris__judul">{tugas.judul}</span>
                  <span className="kelas-tugas-baris__meta">
                    {tugas.mataKuliah} · {tugas.deadline}
                  </span>
                </span>
                <span className={`kelas-status kelas-status--${tugas.status}`}>
                  {labelStatus[tugas.status]}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="kelas-kosong kelas-kosong--kecil">
            <CheckCircle2 size={20} aria-hidden="true" />
            <p>Semua tugas sudah selesai.</p>
          </div>
        )}
      </section>

      <section className="kelas-panel kelas-span-12" aria-labelledby="judul-mata-kuliah">
        <div className="kelas-panel__kepala">
          <h2 id="judul-mata-kuliah" className="kelas-panel__judul">
            Mata kuliah
          </h2>
          <span className="kelas-panel__catatan">{kelas.mataKuliah.length} bagian kelas</span>
        </div>

        <div className="kelas-mapel-grid">
          {kelas.mataKuliah.map((mapel) => (
            <Link key={mapel.id} className="kelas-mapel" href={`/classes/${kelas.id}/materials`}>
              <span className={`kelas-mapel__pita kelas-pita--${mapel.warna}`} aria-hidden="true" />
              <span className="kelas-mapel__kode">{mapel.kode}</span>
              <span className="kelas-mapel__nama">{mapel.nama}</span>
              <span className="kelas-mapel__pj">PJ · {mapel.pj}</span>
              <span className="kelas-mapel__meta">
                {mapel.jumlahMateri} materi · {mapel.jumlahTugas} tugas
              </span>
              <span
                className="kelas-progres-bar kelas-progres-bar--tipis"
                role="progressbar"
                aria-valuenow={mapel.progres}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progres ${mapel.nama}`}
              >
                <span style={{ width: `${mapel.progres}%` }} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
