import { KepalaDasbor } from "./kerangka-dasbor";
import { DasborMemuat } from "./dasbor-memuat";

/**
 * Kerangka dasbor yang tampil selagi `params` dan data kelas dimuat.
 *
 * Header-nya sengaja memakai `KepalaDasbor` yang sama dengan dasbor asli,
 * jadi tidak ada lompatan tata letak saat isi aslinya muncul. Sidebar dan
 * konten diganti rangka abu-abu.
 */
export function KerangkaDasborMemuat() {
  return (
    <div className="dash-page">
      <KepalaDasbor />

      <div className="dash">
        <aside className="dash-side" aria-hidden="true">
          <div>
            <div className="dash-loading__bar dash-loading__bar--eyebrow" />
            <div className="dash-loading__bar dash-loading__bar--title" />
            <div className="dash-loading__bar" />
          </div>
        </aside>

        <main className="dash-main">
          <div className="dash-main__inner">
            <DasborMemuat />
          </div>
        </main>
      </div>
    </div>
  );
}
