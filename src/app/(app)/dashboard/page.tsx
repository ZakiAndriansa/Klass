import type { Metadata } from "next";

import { DasborPengguna } from "@/components/features/dasbor/dasbor-pengguna";
import { KerangkaDasbor } from "@/components/features/dasbor/kerangka-dasbor";

export const metadata: Metadata = {
  title: "Dasbor pengguna",
  description: "Ajukan kelas baru, masuk dengan kode undangan, dan buka kelas yang kamu ikuti.",
};

/**
 * Dasbor pengguna — `/dashboard`.
 *
 * Untuk pengguna yang sudah login tetapi belum punya peran PJ maupun admin
 * kelas. Isinya hanya tiga hal: ajukan kelas, masuk kelas, dan lihat kelas
 * yang diikuti. Kerangkanya sama dengan `/classes/[classId]` dan `/admin`.
 *
 * TODO(api): ambil daftar kelas yang diikuti dan riwayat pengajuan milik
 * pengguna yang sedang login.
 * TODO(izin): rute ini nanti dijaga middleware. Setelah peran diketahui,
 * arahkan admin kelas ke `/classes/[classId]` dan superadmin ke `/admin`.
 */
export default function HalamanDasborPengguna() {
  return (
    <KerangkaDasbor
      sisi={{
        eyebrow: "Akun saya",
        judul: "Ruang pengguna",
        meta: "Belum punya peran",
        item: [
          { label: "Ringkasan", href: "/dashboard", aktif: true },
          { label: "Kelas saya", href: "/dashboard#my-classes" },
          { label: "Ajukan kelas", href: "/dashboard#request-class" },
          { label: "Masuk kelas", href: "/dashboard#join-class" },
        ],
        catatan: {
          label: "Butuh peran?",
          isi: ["PJ & admin kelas · Diatur admin kelas"],
        },
        peran: "Anggota",
        nama: "Naufal Aqil",
        keterangan: "Tanpa peran khusus.",
      }}
    >
      <DasborPengguna />
    </KerangkaDasbor>
  );
}
