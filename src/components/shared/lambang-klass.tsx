import Image from "next/image";

/**
 * Lambang Klass — map manila dengan label bertinta K.
 *
 * Aset `public/logo/klass-mark.svg` diekspor dari Figma node 130:1434
 * ("Klass Logo" di berkas PPW-Bismillah), latar transparan, rasio asli 849:663.
 * Karena rasionya bukan persegi, atur **tinggi** lewat CSS dan biarkan lebar
 * mengikuti (`width: auto`). Jangan paksa lebar dan tinggi sekaligus.
 *
 * Lambang ini dekoratif: nama merek sudah tampil sebagai teks di sebelahnya,
 * jadi `alt` dikosongkan agar pembaca layar tidak menyebut "Klass" dua kali.
 */
export function LambangKlass({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/klass-mark.svg"
      alt=""
      width={849}
      height={663}
      unoptimized
      priority
      className={className}
    />
  );
}
