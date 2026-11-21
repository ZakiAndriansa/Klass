import { KepalaBab } from "./bab";

/**
 * Alur tiga langkah sebagai tiga lembar map yang ditab: tiap langkah punya
 * tab sendiri, lembar kertas, dan nomor besar. Di desktop ketiganya turun
 * bertingkat seperti berkas yang sedang disusun.
 */
export type LangkahLanding = {
  nomor: string;
  label: string;
  judul: string;
  deskripsi: string;
};

export function AlurArsip({ langkah }: { langkah: LangkahLanding[] }) {
  return (
    <section className="section section--rapat alur-section" id="how-it-works">
      <div className="section__inner">
        <KepalaBab
          nomor="03"
          label="Alur arsip"
          judul={
            <>
              Dari kelas baru <span className="sorot">sampai rapi.</span>
            </>
          }
          intro="Tiga langkah. Nggak ada instalasi, nggak ada rapat panjang. Setelah kelas berdiri, pengingat jalan sendiri."
        />

        <ol className="alur">
          {langkah.map((item) => (
            <li className="alur__langkah" key={item.nomor}>
              <span className="alur__tab">
                <span className="alur__tab-nomor">{item.nomor}</span>
                <span className="alur__tab-label">{item.label}</span>
              </span>
              <div className="alur__lembar">
                <span className="alur__nomor" aria-hidden="true">
                  {item.nomor}
                </span>
                <h3>{item.judul}</h3>
                <p>{item.deskripsi}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="alur__catatan">
          <span className="alur__cap" aria-hidden="true">
            3H / 1H
          </span>
          <p>
            Pengingat dikirim <strong>3 hari</strong> dan <strong>1 hari</strong> sebelum deadline
            lewat notifikasi PWA—tanpa perlu install dari toko aplikasi.
          </p>
        </div>
      </div>
    </section>
  );
}
