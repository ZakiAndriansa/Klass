import { MessageCircleQuestion } from "lucide-react";

import { Accordion } from "@/components/shared/accordion";

import { PenandaBab } from "./bab";

/**
 * FAQ dua kolom: catatan pembuka yang menempel di kiri, daftar pertanyaan
 * yang tenang di kanan. Accordion bawaan dipakai ulang, lalu dirapikan lewat
 * `.tanya` supaya baris tertutup tidak terlihat seperti kartu terpisah.
 */
export type FaqLanding = {
  tanya: string;
  jawab: React.ReactNode;
};

export function TanyaJawab({ faq }: { faq: FaqLanding[] }) {
  return (
    <section className="section section--rapat tanya-section" id="faq">
      <div className="section__inner">
        <div className="tanya">
          <div className="tanya__kiri">
            <PenandaBab nomor="06" label="Tanya jawab" />
            <h2 className="tanya__judul">Masih ada yang mengganjal?</h2>
            <p className="tanya__intro">
              Jawaban singkat, bukan halaman manual. Kalau masih kurang, tanya admin kelasmu—mereka
              yang paling tahu.
            </p>
            <p className="tanya__catatan">
              <MessageCircleQuestion size={18} strokeWidth={2} aria-hidden="true" />
              <span>Belum terjawab? Tanya di sesi kenalan atau langsung ke admin kelas.</span>
            </p>
          </div>

          <div className="tanya__kanan">
            <Accordion item={faq} terbukaAwal={null} />
          </div>
        </div>
      </div>
    </section>
  );
}
