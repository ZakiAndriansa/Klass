import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * CONTOH KOMPONEN. Tiru bentuk berkas ini untuk komponen lain.
 *
 * Aturan komponen:
 * 1. Data datang lewat props. Komponen tidak mengambil data dan tidak mengimpor dari `@/server`.
 * 2. Warna memakai token design system (`var(--ds-color-ink-muted)` di CSS Klass),
 *    bukan warna mentah seperti `#888`, supaya tema tiap kelas bisa mengubahnya.
 * 3. `className` dari luar selalu diteruskan lewat `cn()`.
 * 4. Sediakan tampilan saat memuat (skeleton) di berkas yang sama.
 */
type KartuStatusProps = {
  judul: string;
  /** `baik` ditampilkan dengan lencana biasa, `bermasalah` dengan lencana merah. */
  status: "baik" | "bermasalah";
  /** Teks pada lencana, misalnya "Terhubung". */
  label: string;
  keterangan: string;
  className?: string;
};

export function KartuStatus({ judul, status, label, keterangan, className }: KartuStatusProps) {
  return (
    <Card className={cn("kartu-status", className)}>
      <CardHeader className="kartu-status__kepala">
        <CardTitle>{judul}</CardTitle>
        <Badge variant={status === "baik" ? "default" : "destructive"}>{label}</Badge>
      </CardHeader>
      <CardContent className="kartu-status__ket">{keterangan}</CardContent>
    </Card>
  );
}

/** Tampilan sementara selagi data dimuat. Ukurannya dibuat mirip kartu aslinya. */
export function KartuStatusSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("kartu-status", "kartu-status--memuat", className)} aria-hidden>
      <CardHeader className="kartu-status__kepala">
        <Skeleton className="kartu-status__skeleton--judul" />
        <Skeleton className="kartu-status__skeleton--lencana" />
      </CardHeader>
      <CardContent>
        <Skeleton className="kartu-status__skeleton--teks" />
      </CardContent>
    </Card>
  );
}
