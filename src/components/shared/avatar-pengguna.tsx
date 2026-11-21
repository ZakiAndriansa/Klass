import { cn } from "@/lib/utils";

import { inisialNama } from "@/lib/inisial";

/**
 * Avatar pengguna: foto bila ada, inisial nama bila tidak.
 *
 * Foto dari Google bisa saja gagal dimuat (diblokir jaringan kampus, atau
 * URL-nya kedaluwarsa). Karena itu inisial selalu dirender di belakang foto
 * sebagai lapisan cadangan; kalau foto gagal, inisialnya yang terlihat.
 *
 * Murni tampilan, jadi Server Component.
 */
type AvatarPenggunaProps = {
  nama: string;
  image?: string | null;
  /** Ukuran sisi dalam piksel. */
  ukuran?: number;
  className?: string;
};

export function AvatarPengguna({ nama, image, ukuran = 32, className }: AvatarPenggunaProps) {
  return (
    <span
      className={cn("avatar", className)}
      style={{ inlineSize: ukuran, blockSize: ukuran }}
      aria-hidden="true"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar eksternal, ukurannya tetap
        <img className="avatar__foto" src={image} alt="" width={ukuran} height={ukuran} />
      ) : null}
      <span className="avatar__inisial">{inisialNama(nama)}</span>
    </span>
  );
}
