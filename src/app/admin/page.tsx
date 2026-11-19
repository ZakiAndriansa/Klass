import type { Metadata } from "next";

import { DasborSuperadmin } from "@/components/features/dasbor/dasbor-superadmin";
import { KerangkaDasbor } from "@/components/features/dasbor/kerangka-dasbor";

export const metadata: Metadata = {
  title: "Ruang kendali Klass",
  description: "Tinjau pengajuan kelas, kelola poster halaman utama, dan moderasi tema kelas.",
};

/**
 * Dasbor superadmin — `/admin`.
 *
 * Halaman ini Server Component dan masih memakai data contoh.
 *
 * TODO(api): ambil antrean pengajuan, jumlah kelas aktif, dan poster aktif
 * dari controller superadmin.
 * TODO(izin): pemeriksaan "apakah pengguna ini superadmin" dilakukan di
 * server. Menu yang disembunyikan bukan pengamanan.
 */
export default function HalamanDasborSuperadmin() {
  return (
    <KerangkaDasbor
      sisi={{
        eyebrow: "Admin website",
        judul: "Ruang kendali Klass",
        meta: "Akses superadmin",
        item: [
          { label: "Ringkasan", href: "/admin" },
          { label: "Pengajuan kelas", href: "/admin", aktif: true },
          { label: "Semua kelas", href: "/admin/classes", nonaktif: true },
          { label: "Poster", href: "/admin/posters", nonaktif: true },
          { label: "Moderasi & tema", href: "/admin/moderation", nonaktif: true },
        ],
        peran: "Superadmin",
        nama: "Pengelola website",
        keterangan: "Bukan admin kelas.",
      }}
    >
      <DasborSuperadmin />
    </KerangkaDasbor>
  );
}
