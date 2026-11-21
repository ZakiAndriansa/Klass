import { Paperclip } from "lucide-react";

import { InkLink } from "@/components/shared/section-heading";
import { Section, SectionInner } from "@/components/shared/section";

import { PenandaBab } from "./bab";

/**
 * Bab pertama setelah hero. Bukan deretan kartu: satu pernyataan besar di
 * kiri, satu lembar prinsip dengan catatan tempel di kanan. Lembar prinsip
 * memakai tab map kecil supaya bahasanya nyambung dengan bagian kelas.
 */
export function Manifesto() {
  return (
    <Section jarak="rapat" id="tentang" className="manifesto-section">
      <SectionInner>
        <div className="manifesto">
          <div className="manifesto__kiri">
            <PenandaBab nomor="01" label="Kenapa Klass" />
            <h2 className="manifesto__judul">
              Dari anggota. <br />
              <span className="sorot">Untuk anggota.</span>
            </h2>
            <p className="manifesto__intro">
              Kelas bukan cuma kumpulan file. Ada jadwal yang berubah, tugas yang menumpuk, dan
              orang-orang yang perlu tahu. Klass menyimpan semuanya di satu map—dan yang mengurusnya
              adalah kelas itu sendiri.
            </p>
            <InkLink href="#features">
              Lihat isi mapnya <span aria-hidden="true">↓</span>
            </InkLink>
          </div>

          <div className="manifesto__kanan">
            <div className="manifesto__lembar">
              <span className="manifesto__tab">Prinsip / 03</span>
              <ol className="manifesto__prinsip">
                <li>
                  <span className="manifesto__nomor">01</span>
                  <div>
                    <h3>Terbuka</h3>
                    <p>Kelas kuliah, organisasi, klub, atau komunitas. Semua punya ruang.</p>
                  </div>
                </li>
                <li>
                  <span className="manifesto__nomor">02</span>
                  <div>
                    <h3>Rapi</h3>
                    <p>Struktur disiapkan dari awal, bukan ditempel setelah kelas berjalan.</p>
                  </div>
                </li>
                <li>
                  <span className="manifesto__nomor">03</span>
                  <div>
                    <h3>Milik bersama</h3>
                    <p>Yang mengelola kelas adalah orang-orang yang menjalaninya.</p>
                  </div>
                </li>
              </ol>

              <aside className="manifesto__catatan">
                <Paperclip
                  className="manifesto__klip"
                  size={24}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <p>Nggak perlu jadi ahli IT buat bikin kelas rapi.</p>
                <span>— tim Klass</span>
              </aside>
            </div>
          </div>
        </div>
      </SectionInner>
    </Section>
  );
}
