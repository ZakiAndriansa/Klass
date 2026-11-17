import { cn } from "@/lib/utils";

import { Alert } from "@/components/shared/alert";

/**
 * Siaran komunitas: kepala bagian dengan eyebrow tulisan tangan, lalu daftar
 * alert satu arah. Gaya tiap baris sepenuhnya milik komponen `Alert`.
 */
type Siaran = {
  varian: "info" | "sukses" | "peringatan" | "error";
  judul: string;
  pesan: string;
};

type FeedProps = {
  eyebrow?: string;
  judul: string;
  intro?: string;
  siaran: Siaran[];
  className?: string;
};

export function Feed({ eyebrow, judul, intro, siaran, className }: FeedProps) {
  return (
    <div className={cn("feed", className)}>
      <header className="feed__header">
        {eyebrow ? <span className="feed__eyebrow">{eyebrow}</span> : null}
        <h2 className="feed__title">{judul}</h2>
        {intro ? <p className="feed__intro">{intro}</p> : null}
      </header>
      <ul className="feed__list">
        {siaran.map((item) => (
          <li key={item.judul}>
            <Alert varian={item.varian} judul={item.judul} pesan={item.pesan} />
          </li>
        ))}
      </ul>
    </div>
  );
}
