import { Lencana } from "@/components/shared/lencana";
import { cn } from "@/lib/utils";

/**
 * Sidebar dasbor: identitas ruang, daftar navigasi, dan kartu peran.
 *
 * Di layar >= 1024px sidebar menempel di kiri dan mengikuti gulir halaman.
 * Di layar lebih kecil ia menjadi blok di atas konten dan navigasinya
 * bergulir mendatar, supaya tidak memakan tinggi layar ponsel.
 *
 * Ini Server Component murni; tidak ada state. Item yang belum punya rute
 * cukup ditandai `nonaktif` agar tidak menjadi tautan yang menipu.
 */
export type ItemSisiDasbor = {
  label: string;
  href: string;
  /** Tandai halaman yang sedang dibuka. */
  aktif?: boolean;
  /** Fitur yang belum dibangun: dirender sebagai teks, bukan tautan. */
  nonaktif?: boolean;
};

type SisiDasborProps = {
  eyebrow: string;
  judul: React.ReactNode;
  meta: string;
  item: ItemSisiDasbor[];
  /** Blok "tahap berikutnya": fitur yang sudah direncanakan. */
  catatan?: { label: string; isi: string[] };
  /** Teks lencana peran, misalnya "Admin Kelas". */
  peran: string;
  nama: string;
  keterangan: string;
  className?: string;
};

export function SisiDasbor({
  eyebrow,
  judul,
  meta,
  item,
  catatan,
  peran,
  nama,
  keterangan,
  className,
}: SisiDasborProps) {
  return (
    <aside className={cn("dash-side", className)} aria-label={`Navigasi ${peran}`}>
      <div>
        <span className="dash-side__eyebrow">{eyebrow}</span>
        <h2 className="dash-side__title">{judul}</h2>
        <p className="dash-side__meta">{meta}</p>
      </div>

      <nav aria-label="Menu dasbor">
        <ul className="dash-nav">
          {item.map((tautan) =>
            tautan.nonaktif ? (
              <li key={tautan.label}>
                <span className="dash-nav__link" aria-disabled="true">
                  {tautan.label}
                  <span className="sr-only"> (belum tersedia)</span>
                </span>
              </li>
            ) : (
              <li key={tautan.label}>
                <a
                  href={tautan.href}
                  className={cn("dash-nav__link", tautan.aktif && "is-active")}
                  aria-current={tautan.aktif ? "page" : undefined}
                >
                  {tautan.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </nav>

      {catatan ? (
        <div className="dash-side__soon">
          <span className="dash-side__soon-label">{catatan.label}</span>
          {catatan.isi.map((baris) => (
            <p key={baris} className="dash-side__soon-item">
              {baris}
            </p>
          ))}
        </div>
      ) : null}

      <div className="dash-side__foot">
        <Lencana variant="primary">{peran}</Lencana>
        <p className="dash-side__name">{nama}</p>
        <p className="dash-side__note">{keterangan}</p>
      </div>
    </aside>
  );
}
