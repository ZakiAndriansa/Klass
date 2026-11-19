import { cn } from "@/lib/utils";

import type { RingkasanDasbor, WarnaKartu } from "./data-contoh";

/**
 * Kartu ringkasan angka di atas dasbor (Figma 60:1025 dan kawan-kawan).
 *
 * Angka ditulis di kotak kertas kecil, judul 22px, lalu satu kalimat
 * penjelas. Tiga warna kartu dipakai bergantian: kuning, oranye, biru.
 */
const kelasWarna: Record<WarnaKartu, string> = {
  kuning: "dash-stat--kuning",
  oranye: "dash-stat--oranye",
  biru: "dash-stat--biru",
};

type KartuRingkasanProps = RingkasanDasbor & { className?: string };

export function KartuRingkasan({ nomor, judul, deskripsi, warna, className }: KartuRingkasanProps) {
  return (
    <article className={cn("dash-stat", kelasWarna[warna], className)}>
      <span className="dash-stat__num">{nomor}</span>
      <h3 className="dash-stat__title">{judul}</h3>
      <p className="dash-stat__desc">{deskripsi}</p>
    </article>
  );
}

/** Grid tiga kolom untuk kartu ringkasan. */
export function GridRingkasan({
  item,
  className,
}: {
  item: RingkasanDasbor[];
  className?: string;
}) {
  return (
    <div className={cn("dash-stats", className)}>
      {item.map((ringkasan) => (
        <KartuRingkasan key={ringkasan.judul} {...ringkasan} />
      ))}
    </div>
  );
}
