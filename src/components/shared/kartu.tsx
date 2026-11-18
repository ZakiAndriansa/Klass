import { cn } from "@/lib/utils";
import { Lencana } from "@/components/shared/lencana";

/**
 * Kartu map manila (signature design system Klass).
 *
 * Tiga varian dari galeri:
 * - `folder`: map dengan tab tanggal di kiri-atas dan jendela pratinjau 16:9.
 * - `catatan`: sticky note biru muda dengan dua potong selotip.
 * - `kertas`: kartu kertas tebal untuk satu tugas, lengkap dengan aksi.
 *
 * Warna map: `manila` (default), `lilac`, `green`, atau `featured` (dot kuning).
 */

/** Gambar pratinjau palsu: dua balok abu-abu di dalam jendela cekung. */
function PratinjauKosong() {
  return (
    <div className="card__media">
      <svg
        className="card__placeholder-svg"
        viewBox="0 0 513 289"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <rect className="card__placeholder-bar" x="38" y="38" width="192" height="22" rx="5" />
        <rect className="card__placeholder-block" x="38" y="80" width="436" height="154" rx="6" />
      </svg>
    </div>
  );
}

type KartuFolderProps = {
  judul: string;
  deskripsi: string;
  /** Teks kecil di tab, biasanya tanggal. */
  meta: string;
  warna?: "manila" | "lilac" | "green" | "featured";
  className?: string;
};

export function KartuFolder({
  judul,
  deskripsi,
  meta,
  warna = "manila",
  className,
}: KartuFolderProps) {
  return (
    <article
      className={cn(
        "card",
        "card--folder",
        warna === "lilac" && "card--lilac",
        warna === "green" && "card--green",
        warna === "featured" && "card--featured",
        className,
      )}
    >
      <div className="card__folder-tab">
        <span className="card__folder-tab-inner">
          <span className="card__folder-dot" aria-hidden="true" />
          <span className="card__folder-meta">{meta}</span>
        </span>
      </div>
      <div className="card__folder-body">
        <PratinjauKosong />
        <div className="card__content">
          <h3 className="card__title">{judul}</h3>
          <p className="card__desc">{deskripsi}</p>
        </div>
      </div>
    </article>
  );
}

type KartuCatatanProps = {
  penulis: string;
  /** Inisial untuk avatar bulat, misalnya "NP". */
  inisial: string;
  peran: string;
  isi: string;
  /** Lencana kecil di bawah catatan, misalnya "1 Pengumuman". */
  lencana?: string;
  className?: string;
};

export function KartuCatatan({
  penulis,
  inisial,
  peran,
  isi,
  lencana,
  className,
}: KartuCatatanProps) {
  return (
    <article className={cn("card", "card--note", className)}>
      <div className="card__tape card__tape--left" aria-hidden="true" />
      <div className="card__tape card__tape--right" aria-hidden="true" />
      <div className="card__note-header">
        <span className="card__avatar" aria-hidden="true">
          {inisial}
        </span>
        <div>
          <h3 className="card__note-author">{penulis}</h3>
          <span className="card__note-role">{peran}</span>
        </div>
      </div>
      <p className="card__desc">{isi}</p>
      {lencana ? (
        <div className="card__note-footer">
          <Lencana variant="primary">{lencana}</Lencana>
        </div>
      ) : null}
    </article>
  );
}

type KartuKertasProps = {
  judul: string;
  deskripsi: string;
  /** Lencana status di kiri-atas. */
  lencana?: { label: string; varian: "primary" | "info" | "success" | "warning" | "error" };
  /** Kode monospace di kanan-atas, misalnya "TUGAS #04". */
  kode?: string;
  /** Tombol di bawah kartu. */
  aksi?: React.ReactNode;
  className?: string;
};

export function KartuKertas({
  judul,
  deskripsi,
  lencana,
  kode,
  aksi,
  className,
}: KartuKertasProps) {
  return (
    <article className={cn("card", "card--paper", className)}>
      {lencana || kode ? (
        <div className="card__paper-top">
          {lencana ? <Lencana variant={lencana.varian}>{lencana.label}</Lencana> : <span />}
          {kode ? <span className="card__paper-code">{kode}</span> : null}
        </div>
      ) : null}
      <h3 className="card__title">{judul}</h3>
      <p className="card__desc">{deskripsi}</p>
      {aksi ? <div className="card__actions">{aksi}</div> : null}
    </article>
  );
}

/** Grid dua kolom untuk kartu map. */
export function GridKartu({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("card-grid", className)} {...props}>
      {children}
    </div>
  );
}
