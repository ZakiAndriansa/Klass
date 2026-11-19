import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  ListChecks,
  User,
} from "lucide-react";

import { labelStatus } from "./bantuan";
import type { KelasDetail, Materi, TugasProgress } from "./data-contoh";
import { IkonMateri, labelJenisMateri } from "./ikon-materi";

/**
 * Isi satu materi: ringkasan, tujuan, poin kunci, latihan, catatan, tugas
 * terkait, dan navigasi ke materi sebelum/sesudah.
 *
 * Materi contoh belum punya berkas lampiran; karena itu isi utamanya disusun
 * sebagai halaman bacaan, bukan pemutar PDF. Saat API siap, bagian ini bisa
 * menambahkan pratinjau lampiran tanpa mengubah kerangka halaman.
 */
export function IsiMateri({
  kelas,
  materi,
  sebelumnya,
  berikutnya,
  terkait,
  tugas,
}: {
  kelas: KelasDetail;
  materi: Materi;
  sebelumnya?: Materi;
  berikutnya?: Materi;
  terkait: Materi[];
  tugas?: TugasProgress;
}) {
  return (
    <div className="kelas-isi-materi">
      <article className="kelas-artikel">
        <Link className="kelas-crumb" href={`/classes/${kelas.id}/materials`}>
          <ArrowLeft size={15} aria-hidden="true" />
          Semua materi
        </Link>

        <div className="kelas-artikel__labelbaris">
          <span
            className={`kelas-materi-ikon kelas-materi-ikon--besar kelas-pita--${materi.warna}`}
          >
            <IkonMateri jenis={materi.jenis} size={22} />
          </span>
          <span className="kelas-lencana kelas-lencana--netral">
            {labelJenisMateri[materi.jenis]}
          </span>
          <span className="kelas-lencana kelas-lencana--lembut">{materi.mataKuliah}</span>
          {materi.baru ? <span className="kelas-lencana kelas-lencana--baru">Baru</span> : null}
        </div>

        <h2 className="kelas-artikel__judul">{materi.judul}</h2>
        <p className="kelas-artikel__ringkasan">{materi.ringkasan}</p>

        <ul className="kelas-artikel__meta">
          <li>
            <User size={14} aria-hidden="true" />
            {materi.penulis}
          </li>
          <li>
            <CalendarDays size={14} aria-hidden="true" />
            {materi.tanggal}
          </li>
          <li>
            <Clock size={14} aria-hidden="true" />
            {materi.durasi}
          </li>
          <li>Minggu {materi.minggu}</li>
        </ul>

        <div className="kelas-artikel__garis" aria-hidden="true" />

        {materi.tujuan.length > 0 ? (
          <section className="kelas-artikel__bagian" id="tujuan" aria-labelledby="judul-tujuan">
            <h3 id="judul-tujuan" className="kelas-artikel__subjudul">
              Setelah membaca ini
            </h3>
            <ul className="kelas-daftar-centang">
              {materi.tujuan.map((tujuan) => (
                <li key={tujuan}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>{tujuan}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {materi.poin.length > 0 ? (
          <section className="kelas-artikel__bagian" id="poin" aria-labelledby="judul-poin">
            <h3 id="judul-poin" className="kelas-artikel__subjudul">
              Poin kunci
            </h3>
            <ol className="kelas-daftar-poin">
              {materi.poin.map((poin, indeks) => (
                <li key={poin}>
                  <span className="kelas-daftar-poin__angka" aria-hidden="true">
                    {String(indeks + 1).padStart(2, "0")}
                  </span>
                  <span>{poin}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {materi.latihan.length > 0 ? (
          <section className="kelas-artikel__bagian" id="latihan" aria-labelledby="judul-latihan">
            <h3 id="judul-latihan" className="kelas-artikel__subjudul">
              Latihan
            </h3>
            <ol className="kelas-daftar-latihan">
              {materi.latihan.map((latihan, indeks) => (
                <li key={latihan}>
                  <span className="kelas-daftar-latihan__nomor" aria-hidden="true">
                    {indeks + 1}
                  </span>
                  <span>{latihan}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {materi.catatan.length > 0 ? (
          <aside className="kelas-catatan-materi" aria-label="Catatan penting">
            <span className="kelas-catatan-materi__label">Catatan</span>
            <p>{materi.catatan}</p>
          </aside>
        ) : null}

        {tugas ? (
          <section className="kelas-tugas-terkait" aria-labelledby="judul-tugas-terkait">
            <div className="kelas-tugas-terkait__utama">
              <span className={`kelas-status kelas-status--${tugas.status}`}>
                {tugas.status === "done" ? (
                  <CheckCircle2 size={14} aria-hidden="true" />
                ) : tugas.status === "doing" ? (
                  <CircleDot size={14} aria-hidden="true" />
                ) : (
                  <Circle size={14} aria-hidden="true" />
                )}
                {labelStatus[tugas.status]}
              </span>
              <h3 id="judul-tugas-terkait">{tugas.judul}</h3>
              <p>
                {tugas.mataKuliah} · Tenggat {tugas.deadline}
              </p>
            </div>
            <Link className="kelas-tautan-panah" href={`/classes/${kelas.id}/progress`}>
              Buka papan progress
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        ) : null}

        <nav className="kelas-artikel__nav" aria-label="Materi sebelumnya dan berikutnya">
          {sebelumnya ? (
            <Link
              className="kelas-artikel__nav-tautan"
              href={`/classes/${kelas.id}/materials/${sebelumnya.id}`}
            >
              <span className="kelas-artikel__nav-label">
                <ArrowLeft size={14} aria-hidden="true" />
                Sebelumnya
              </span>
              <span className="kelas-artikel__nav-judul">{sebelumnya.judul}</span>
            </Link>
          ) : (
            <span className="kelas-artikel__nav-tautan is-kosong">Awal kumpulan materi</span>
          )}

          {berikutnya ? (
            <Link
              className="kelas-artikel__nav-tautan kelas-artikel__nav-tautan--kanan"
              href={`/classes/${kelas.id}/materials/${berikutnya.id}`}
            >
              <span className="kelas-artikel__nav-label">
                Berikutnya
                <ArrowRight size={14} aria-hidden="true" />
              </span>
              <span className="kelas-artikel__nav-judul">{berikutnya.judul}</span>
            </Link>
          ) : (
            <span className="kelas-artikel__nav-tautan kelas-artikel__nav-tautan--kanan is-kosong">
              Akhir kumpulan materi
            </span>
          )}
        </nav>
      </article>

      <aside className="kelas-artikel__sisi">
        <section className="kelas-panel kelas-panel--rapat" aria-labelledby="judul-daftar-isi">
          <h3 id="judul-daftar-isi" className="kelas-panel__judul kelas-panel__judul--kecil">
            <ListChecks size={16} aria-hidden="true" />
            Di materi ini
          </h3>
          <ul className="kelas-daftar-isi">
            {materi.tujuan.length > 0 ? (
              <li>
                <a href="#tujuan">Tujuan belajar</a>
              </li>
            ) : null}
            {materi.poin.length > 0 ? (
              <li>
                <a href="#poin">Poin kunci</a>
              </li>
            ) : null}
            {materi.latihan.length > 0 ? (
              <li>
                <a href="#latihan">Latihan</a>
              </li>
            ) : null}
            {tugas ? (
              <li>
                <a href="#judul-tugas-terkait">Tugas terkait</a>
              </li>
            ) : null}
          </ul>
        </section>

        {terkait.length > 0 ? (
          <section className="kelas-panel kelas-panel--rapat" aria-labelledby="judul-terkait">
            <h3 id="judul-terkait" className="kelas-panel__judul kelas-panel__judul--kecil">
              Materi terkait
            </h3>
            <ul className="kelas-terkait-daftar">
              {terkait.map((item) => (
                <li key={item.id}>
                  <Link href={`/classes/${kelas.id}/materials/${item.id}`}>
                    <span
                      className={`kelas-materi-ikon kelas-materi-ikon--kecil kelas-pita--${item.warna}`}
                    >
                      <IkonMateri jenis={item.jenis} size={14} />
                    </span>
                    <span>
                      <strong>{item.judul}</strong>
                      <span>{item.mataKuliah}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="kelas-panel kelas-panel--rapat kelas-panel--bantuan">
          <h3 className="kelas-panel__judul kelas-panel__judul--kecil">Butuh bantuan?</h3>
          <p>
            Tanyakan di sesi kelas atau hubungi PJ {materi.mataKuliah}. Jadwal dan ruang ada di
            halaman jadwal.
          </p>
          <Link className="kelas-tautan-kecil" href={`/classes/${kelas.id}/schedule`}>
            Lihat jadwal kelas
          </Link>
        </section>
      </aside>
    </div>
  );
}
