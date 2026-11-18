import { cn } from "@/lib/utils";

/**
 * Pagination bergaya tab kertas. Halaman aktif tidak bisa diklik dan diberi
 * `aria-current="page"`.
 */
type HalamanPagination = number | "jeda";

type PaginationProps = {
  /** Nomor halaman, atau "jeda" untuk elipsis. */
  halaman: HalamanPagination[];
  aktif: number;
  /** Bangun href untuk sebuah halaman. */
  hrefHalaman?: (halaman: number) => string;
  hrefSebelumnya?: string;
  hrefBerikutnya?: string;
  label?: string;
  className?: string;
};

export function Pagination({
  halaman,
  aktif,
  hrefHalaman = (nomor) => `#halaman-${nomor}`,
  hrefSebelumnya,
  hrefBerikutnya,
  label = "Navigasi halaman",
  className,
}: PaginationProps) {
  return (
    <nav className={cn("pagination", className)} aria-label={label}>
      {hrefSebelumnya ? (
        <a href={hrefSebelumnya} className="pagination__btn" aria-label="Halaman sebelumnya">
          &larr;
        </a>
      ) : null}

      {halaman.map((nomor, indeks) => {
        if (nomor === "jeda") {
          return (
            <span key={`jeda-${indeks}`} className="pagination__ellipsis" aria-hidden="true">
              ...
            </span>
          );
        }

        const sedangAktif = nomor === aktif;

        if (sedangAktif) {
          return (
            <span
              key={nomor}
              className="pagination__btn is-active"
              aria-current="page"
              aria-label={`Halaman ${nomor}`}
            >
              {nomor}
            </span>
          );
        }

        return (
          <a key={nomor} href={hrefHalaman(nomor)} className="pagination__btn">
            {nomor}
          </a>
        );
      })}

      {hrefBerikutnya ? (
        <a href={hrefBerikutnya} className="pagination__btn" aria-label="Halaman berikutnya">
          &rarr;
        </a>
      ) : null}
    </nav>
  );
}
