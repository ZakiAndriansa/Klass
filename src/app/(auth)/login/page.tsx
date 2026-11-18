import type { Metadata } from "next";

import { PapanAuth } from "@/components/features/auth/papan-auth";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke Klass dengan akun Google untuk membuka materi, jadwal, dan tugas kelasmu.",
};

export default function HalamanMasuk() {
  return <PapanAuth mode="masuk" />;
}
