import { ArrowUpRight, Paperclip } from "lucide-react";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

import { PenandaBab } from "./bab";

/**
 * Penutup halaman: meja malam, satu surat undangan di atas map manila.
 * Suratnya dekoratif (aria-hidden) karena pesan yang sama sudah ada di kolom
 * kiri; CTA tetap tautan biasa yang bisa difokus keyboard.
 */
export function SuratAjakan() {
  return (
    <section className="surat-ajakan" id="gabung">
      <div className="section__inner surat-ajakan__inner">
        <div className="surat-ajakan__kiri">
          <PenandaBab nomor="07" label="Undangan" nada="terang" />
          <h2 className="surat-ajakan__judul">
            Kelas rapi <span className="surat-ajakan__aksen">dimulai dari kamu.</span>
          </h2>
          <p className="surat-ajakan__salinan">Bawa teman-temanmu. Sisanya, kita rapikan bareng.</p>

          <div className="surat-ajakan__aksi">
            <TautanTombolKertas href="/login" size="lg">
              Ajukan kelas baru
              <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </TautanTombolKertas>
            <a href="/login" className="surat-ajakan__masuk">
              Sudah punya akun? Masuk
            </a>
          </div>

          <p className="surat-ajakan__catatan">
            Butuh akun dulu. Pengajuan dan statusnya ada di Meja.
          </p>
        </div>

        <div className="surat-ajakan__kanan" aria-hidden="true">
          <div className="surat__map">
            <span className="surat__tab">Untuk kelasmu</span>
            <div className="surat">
              <span className="surat__klip">
                <Paperclip size={26} strokeWidth={2} />
              </span>
              <span className="surat__stamp">
                <strong>K</strong>
                <span>2026</span>
              </span>

              <div className="surat__kepada">
                <span>Kepada</span>
                <strong>Kamu yang mau bikin kelas rapi</strong>
              </div>

              <p className="surat__perihal">Perihal: satu map untuk kelasmu</p>
              <p className="surat__isi">
                Materi, jadwal, tugas, dan kabar kelas—semuanya di satu tempat. Dikelola oleh
                orang-orang di dalamnya.
              </p>

              <div className="surat__ttd">
                <span>— tim Klass</span>
                <span className="surat__segel">K</span>
              </div>

              <div className="surat__perforasi">
                <span>Ajukan</span>
                <span>Rapatkan</span>
                <span>Bagikan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
