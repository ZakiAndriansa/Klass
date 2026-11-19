import { cn } from "@/lib/utils";

/**
 * Rangka muat dasbor.
 *
 * Dipakai sebagai `fallback` `<Suspense>` saat halaman masih menunggu `params`
 * atau data dari server. Bentuknya meniru header, tiga kartu ringkasan, dan
 * blok konten supaya tidak ada lompatan tata letak ketika isi asli muncul.
 */
export function DasborMemuat({ className }: { className?: string }) {
  return (
    <div className={cn("dash-loading", className)} aria-hidden="true">
      <div className="dash-loading__bar dash-loading__bar--eyebrow" />
      <div className="dash-loading__bar dash-loading__bar--title" />
      <div className="dash-loading__bar dash-loading__bar--lede" />
      <div className="dash-loading__cards">
        <div className="dash-loading__card" />
        <div className="dash-loading__card" />
        <div className="dash-loading__card" />
      </div>
    </div>
  );
}
