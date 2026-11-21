"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TombolKertas } from "@/components/shared/tombol-kertas";
import { api } from "@/lib/api-client";

/**
 * Tombol keluar: mengakhiri sesi di server, lalu pindah ke halaman tujuan.
 *
 * Berbeda dari tautan biasa ke `/login`, tombol ini benar-benar menghapus sesi
 * lewat `DELETE /api/v1/session`, jadi pengguna tidak lagi tercatat login.
 * Berlaku untuk akun contoh maupun login Google, saat pengembangan maupun produksi.
 *
 * Ini satu-satunya jalan keluar di aplikasi. Navbar sengaja tidak memakainya:
 * tombol kanan atas di semua halaman area login adalah tautan ke Meja, supaya
 * aksi yang mengakhiri sesi tidak menempel di setiap halaman. Satu-satunya
 * pemakai komponen ini adalah buku profil (`/profile`).
 */
type TombolKeluarProps = {
  label?: string;
  /** Halaman yang dibuka setelah keluar. */
  tujuan?: string;
};

export function TombolKeluar({ label = "Keluar", tujuan = "/login" }: TombolKeluarProps) {
  const router = useRouter();
  const [sedangKeluar, setSedangKeluar] = useState(false);

  async function keluar() {
    setSedangKeluar(true);

    try {
      await api<null>("/session", { method: "DELETE" });
    } catch {
      // Sesi mungkin memang sudah tidak ada. Pengguna tetap dibawa ke halaman tujuan.
    }

    router.push(tujuan);
    router.refresh();
  }

  return (
    <TombolKertas variant="primary" size="sm" sedangMemproses={sedangKeluar} onClick={keluar}>
      {label}
    </TombolKertas>
  );
}
