import { cn } from "@/lib/utils";

/**
 * Alert bergaya baris catatan: garis tinta di kiri, titik warna penanda, dan
 * kalimat yang disorot stabilo. Bukan kotak berbingkai.
 */
type AlertProps = {
  varian: "info" | "sukses" | "peringatan" | "error";
  judul: string;
  pesan: string;
  className?: string;
};

const kelasVarian = {
  info: "alert--info",
  sukses: "alert--success",
  peringatan: "alert--warning",
  error: "alert--error",
} as const;

const peran = {
  info: "status",
  sukses: "status",
  peringatan: "alert",
  error: "alert",
} as const;

export function Alert({ varian, judul, pesan, className }: AlertProps) {
  return (
    <div className={cn("alert", kelasVarian[varian], className)} role={peran[varian]}>
      <div className="alert__content">
        <strong className="alert__title">{judul}</strong>
        <p className="alert__msg">
          <span>{pesan}</span>
        </p>
      </div>
    </div>
  );
}
