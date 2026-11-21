import type { Metadata } from "next";
import { Suspense } from "react";

import { DasborSuperadmin } from "@/components/features/dasbor/dasbor-superadmin";
import { KerangkaDasbor } from "@/components/features/dasbor/kerangka-dasbor";
import { wajibSuperadmin } from "@/server/permissions";

export const metadata: Metadata = {
  title: "Ruang kendali Klass",
  description: "Tinjau pengajuan kelas, kelola poster halaman utama, dan moderasi tema kelas.",
};

/**
 * Dasbor superadmin — `/admin`.
 *
 * Halaman ini Server Component dan masih memakai data contoh.
 *
 * Hanya superadmin yang boleh membukanya. Pemeriksaannya di `IsiDasborSuperadmin`,
 * SEBELUM isi halaman dibuat: yang belum login dipindahkan ke `/login`, dan yang
 * bukan superadmin mendapat halaman 404 supaya area ini tidak terlihat ada.
 * Halaman lain di bawah `/admin` meniru pola yang sama.
 *
 * TODO(api): ambil antrean pengajuan, jumlah kelas aktif, dan poster aktif
 * dari controller superadmin.
 */
export default function HalamanDasborSuperadmin() {
  return (
    // Membaca sesi butuh cookie, jadi harus di dalam Suspense.
    <Suspense fallback={null}>
      <IsiDasborSuperadmin />
    </Suspense>
  );
}

async function IsiDasborSuperadmin() {
  await wajibSuperadmin();

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
