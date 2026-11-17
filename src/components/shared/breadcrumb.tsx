import { cn } from "@/lib/utils";

/** Remah roti monospace. Item terakhir ditandai `aria-current="page"`. */
type Remah = { label: string; href?: string };

type BreadcrumbProps = {
  remah: Remah[];
  label?: string;
  className?: string;
};

export function Breadcrumb({ remah, label = "Breadcrumb", className }: BreadcrumbProps) {
  return (
    <nav className={cn("breadcrumb", className)} aria-label={label}>
      <ol className="breadcrumb__list">
        {remah.map((item) => (
          <li key={item.label} className="breadcrumb__item">
            {item.href ? (
              <a href={item.href} className="breadcrumb__link">
                {item.label}
              </a>
            ) : (
              <span className="breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
