import type { Metadata } from "next";

import { PapanAuth } from "@/components/features/auth/papan-auth";

export const metadata: Metadata = {
  title: "Buat akun",
  description: "Buat akun Klass dengan Google, lalu mulai rapikan kelas dan komunitasmu.",
};

export default function HalamanDaftar() {
  return <PapanAuth mode="daftar" />;
}
