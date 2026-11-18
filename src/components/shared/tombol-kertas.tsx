import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Tombol kertas (tactile push-button) dari design system Klass.
 *
 * Berbeda dari `@/components/ui/button` (shadcn). Komponen ini memakai kelas
 * `.ds .btn` dari CSS design system, jadi dipakai di halaman bergaya kertas.
 *
 * Ini satu-satunya sumber tampilan tombol di halaman Klass: semua CTA, termasuk
 * di hero, poster, ajakan, dan navbar, memakai komponen ini agar perubahan
 * gaya `.btn` langsung berlaku di mana-mana. Jangan menulis ulang gayanya.
 *
 * Varian mengikuti gambar galeri: primary (kuning), secondary (kertas),
 * ghost (garis putus-putus), danger (merah). Ukuran sm/md/lg/pill.
 */
const tombolKertasVariants = cva("btn", {
  variants: {
    variant: {
      primary: "btn--primary",
      secondary: "btn--secondary",
      ghost: "btn--ghost",
      danger: "btn--danger",
    },
    size: {
      sm: "btn--sm",
      md: "btn--md",
      lg: "btn--lg",
      pill: "btn--pill",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type TombolKertasProps = React.ComponentProps<"button"> &
  VariantProps<typeof tombolKertasVariants> & {
    /** Tampilkan spinner dan kunci tombol selama proses berjalan. */
    sedangMemproses?: boolean;
  };

export function TombolKertas({
  variant,
  size,
  className,
  children,
  sedangMemproses = false,
  disabled,
  type = "button",
  ...props
}: TombolKertasProps) {
  return (
    <button
      type={type}
      className={cn(
        tombolKertasVariants({ variant, size }),
        sedangMemproses && "is-loading",
        className,
      )}
      disabled={disabled || sedangMemproses}
      aria-busy={sedangMemproses || undefined}
      {...props}
    >
      {sedangMemproses ? <span className="btn__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

type TautanTombolKertasProps = React.ComponentProps<"a"> &
  VariantProps<typeof tombolKertasVariants>;

/** Versi tautan dari tombol kertas, untuk navigasi berbentuk tombol. */
export function TautanTombolKertas({
  variant,
  size,
  className,
  children,
  ...props
}: TautanTombolKertasProps) {
  return (
    <a className={cn(tombolKertasVariants({ variant, size }), className)} {...props}>
      {children}
    </a>
  );
}
