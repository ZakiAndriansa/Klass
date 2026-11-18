import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Lencana sorotan stabilo dari design system Klass.
 *
 * Warnanya bukan blok solid: gradasi spidol semi-transparan dengan tepi
 * memudar (`--ds-marker-*` di tokens.css). Teksnya selalu huruf kapital
 * monospace kecil, jadi tulis label apa adanya, misalnya "Admin Kelas".
 */
const lencanaVariants = cva("badge", {
  variants: {
    variant: {
      default: "",
      primary: "badge--primary",
      info: "badge--info",
      success: "badge--success",
      warning: "badge--warning",
      error: "badge--error",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type LencanaProps = React.ComponentProps<"span"> & VariantProps<typeof lencanaVariants>;

export function Lencana({ variant, className, children, ...props }: LencanaProps) {
  return (
    <span className={cn(lencanaVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
