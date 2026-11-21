import Link from "next/link";
import { ArrowRight, BellRing, CheckCircle2, Mail, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

import type { AntreanPengajuan as Antrean, KondisiSitus, UndanganAdmin } from "./data-contoh";
import { AntreanPengajuan } from "./antrean-pengajuan";

/**
 * Loket superadmin: hanya pekerjaan website.
 *
 * Peran ini bukan "dashboard" berisi statistik, melainkan loket: ada yang
 * masuk, diputuskan, lalu selesai. Karena itu tidak ada kartu angka dan tidak
 * ada grafik — yang dipantau adalah umur pengajuan tertua, dan itu ditulis
 * sebagai kalimat di kepala antrean.
 *
 * Halaman ini sengaja hanya memuat yang menunggu. Memantau seluruh kelas,
 * poster, dan moderasi punya rutenya sendiri supaya halaman indeks tetap
 * ringkas dan tombol berbahaya tidak mengambang tanpa objek.
 */
export function Loket({
  antrean,
  undangan,
  kondisi,
}: {
  antrean: Antrean[];
  undangan: UndanganAdmin[];
  kondisi: KondisiSitus;
}) {
  return (
    <div className="meja loket">
      <AntreanPengajuan awal={antrean} />

      <div className="loket-bawah">
        <section className="loket-panel" aria-labelledby="loket-undangan">
          <div className="meja-panel__kepala">
            <h2 className="meja-panel__judul" id="loket-undangan">
              <Mail size={16} strokeWidth={2.2} aria-hidden="true" />
              Undangan admin
            </h2>
            <span className="meja-panel__meta">{undangan.length} menunggu</span>
          </div>

          {undangan.length > 0 ? (
            <ul className="loket-undangan">
              {undangan.map((baris) => (
                <li key={baris.id} className="loket-undangan__baris">
                  <span className="loket-undangan__nama">{baris.nama}</span>
                  <span className="loket-undangan__kelas">{baris.kelas}</span>
                  <span className="loket-undangan__umur">{baris.umurHari} hari</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="meja-kosong-mini">Semua undangan sudah diterima.</p>
          )}
        </section>

        <section className="loket-panel" aria-labelledby="loket-kondisi">
          <div className="meja-panel__kepala">
            <h2 className="meja-panel__judul" id="loket-kondisi">
              <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
              Kondisi situs
            </h2>
          </div>

          <ul className="loket-kondisi">
            <li className={cn("loket-kondisi__baris", kondisi.gagal > 0 && "is-gagal")}>
              <BellRing size={14} strokeWidth={2.2} aria-hidden="true" />
              <span className="loket-kondisi__teks">
                Pengingat {kondisi.pengingatAktif ? "aktif" : "mati"}
                <span className="loket-kondisi__sub">terakhir kirim {kondisi.terakhirKirim}</span>
              </span>
            </li>
            <li className={cn("loket-kondisi__baris", kondisi.gagal > 0 && "is-gagal")}>
              <CheckCircle2 size={14} strokeWidth={2.2} aria-hidden="true" />
              <span className="loket-kondisi__teks">
                {kondisi.gagal > 0 ? `${kondisi.gagal} pengiriman gagal` : "Tidak ada kegagalan"}
                <span className="loket-kondisi__sub">24 jam terakhir</span>
              </span>
            </li>
          </ul>
        </section>
      </div>

      <nav className="loket-pintu" aria-label="Alat website">
        <Link className="loket-pintu__tautan" href="/profile">
          Profil &amp; riwayat pengajuan
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link className="loket-pintu__tautan" href="/classes">
          Semua kelas yang diikuti
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </nav>

      <p className="meja-isi-kelas__kaki">
        Persetujuan menjadikan pengaju admin kelas. Undangan email aktif saat login pertama.
      </p>
    </div>
  );
}
