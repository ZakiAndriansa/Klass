import { cn } from "@/lib/utils";

/**
 * Penanda bab landing: tab kecil bernomor plus garis tipis, seperti pembatas
 * di dalam map. Dipakai sendiri oleh section yang punya komposisi khusus
 * (manifesto, undangan), atau lewat `KepalaBab` untuk judul standar.
 */
type NadaBab = "gelap" | "terang";

type PenandaBabProps = {
  nomor: string;
  label: string;
  nada?: NadaBab;
  className?: string;
};

export function PenandaBab({ nomor, label, nada = "gelap", className }: PenandaBabProps) {
  return (
    <div className={cn("bab__penanda", nada === "terang" && "bab__penanda--terang", className)}>
      <span className="bab__nomor">{nomor}</span>
      <span className="bab__label">{label}</span>
    </div>
  );
}

type KepalaBabProps = {
  nomor: string;
  label: string;
  judul: React.ReactNode;
  intro?: React.ReactNode;
  aksi?: React.ReactNode;
  nada?: NadaBab;
  className?: string;
};

/**
 * Kepala bab dua kolom: judul besar di kiri, keterangan di kanan. Di layar
 * sempit keduanya ditumpuk. Garis putus-putus di bawah penanda menyatukan
 * tab nomor dengan judul.
 */
export function KepalaBab({
  nomor,
  label,
  judul,
  intro,
  aksi,
  nada = "gelap",
  className,
}: KepalaBabProps) {
  return (
    <header className={cn("bab", nada === "terang" && "bab--terang", className)}>
      <PenandaBab nomor={nomor} label={label} nada={nada} />
      <div className="bab__isi">
        <h2 className="bab__judul">{judul}</h2>
        {intro || aksi ? (
          <div className="bab__keterangan">
            {intro ? <p className="bab__intro">{intro}</p> : null}
            {aksi ? <div className="bab__aksi">{aksi}</div> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
