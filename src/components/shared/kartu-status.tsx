import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * CONTOH KOMPONEN. Tiru bentuk berkas ini untuk komponen lain.
 *
 * Aturan komponen:
 * 1. Data datang lewat props. Komponen tidak mengambil data dan tidak mengimpor dari `@/server`.
 * 2. Warna memakai token (`text-muted-foreground`, `bg-primary`), bukan warna mentah
 *    seperti `text-gray-500`, supaya tema tiap kelas bisa mengubahnya.
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
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex items-center justify-between gap-3">
        <CardTitle>{judul}</CardTitle>
        <Badge variant={status === "baik" ? "default" : "destructive"}>{label}</Badge>
      </CardHeader>
      <CardContent className="text-muted-foreground">{keterangan}</CardContent>
    </Card>
  );
}

/** Tampilan sementara selagi data dimuat. Ukurannya dibuat mirip kartu aslinya. */
export function KartuStatusSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)} aria-hidden>
      <CardHeader className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
