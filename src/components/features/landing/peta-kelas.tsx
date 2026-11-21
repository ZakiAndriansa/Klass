import { ArrowUpRight } from "lucide-react";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

import { KepalaBab } from "./bab";
import { FolderKelas, type KelasPilihan } from "./folder-kelas";

/**
 * Pita "Jelajahi semua kelas": satu bidang meja kerja selebar layar dengan
 * tab map di tepi atas. Enam map kelas duduk di atasnya, masing-masing bisa
 * dibuka untuk melihat materi, tugas, dan jadwal.
 */
export function PetaKelas({ kelas }: { kelas: KelasPilihan[] }) {
  return (
    <section className="section section--rapat peta-kelas" id="explore">
      <div className="peta-kelas__tab" aria-hidden="true">
        {kelas.length} map kelas
      </div>

      <div className="section__inner">
        <KepalaBab
          nomor="04"
          label="Kelas"
          judul={
            <>
              Buka mapnya. <span className="sorot">Semua ada di dalam.</span>
            </>
          }
          aksi={
            <TautanTombolKertas href="/login" variant="secondary" size="sm">
              Masuk untuk membuka
              <ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </TautanTombolKertas>
          }
        />

        <div className="peta-kelas__baris">
          <p className="peta-kelas__petunjuk">
            <span aria-hidden="true">↳</span> klik map untuk membuka
          </p>
        </div>

        <ul className="peta-kelas__grid">
          {kelas.map((item) => (
            <FolderKelas key={`${item.kode}-${item.judul}`} kelas={item} />
          ))}
        </ul>

        <div className="peta-kelas__kaki">
          <p>Ada ruang untuk kelasmu.</p>
          <TautanTombolKertas href="/login" variant="primary">
            Ajukan kelas baru
            <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </TautanTombolKertas>
        </div>
      </div>
    </section>
  );
}
