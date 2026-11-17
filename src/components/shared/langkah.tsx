import { cn } from "@/lib/utils";

/**
 * Daftar langkah bernomor ("Cara kerja"). Tanpa kartu: angka besar, judul, dan
 * keterangan langsung di atas kertas bergaris.
 *
 * Memakai `<ol>` karena urutannya bermakna. Nomornya `aria-hidden` supaya
 * pembaca layar tidak membacanya dua kali.
 */
type LangkahProps = {
  nomor: string;
  judul: string;
  deskripsi: string;
};

export function Langkah({ nomor, judul, deskripsi }: LangkahProps) {
  return (
    <li className="step">
      <span className="step__num" aria-hidden="true">
        {nomor}
      </span>
      <h3 className="step__title">{judul}</h3>
      <p className="step__desc">{deskripsi}</p>
    </li>
  );
}

type DaftarLangkahProps = {
  langkah: LangkahProps[];
  className?: string;
};

export function DaftarLangkah({ langkah, className }: DaftarLangkahProps) {
  return (
    <ol className={cn("steps", className)}>
      {langkah.map((item) => (
        <Langkah key={item.nomor} {...item} />
      ))}
    </ol>
  );
}
