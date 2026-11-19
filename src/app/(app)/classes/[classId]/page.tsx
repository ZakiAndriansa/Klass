import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ambilKelas } from "@/components/features/kelas/data-contoh";
import { RangkaKelasMemuat } from "@/components/features/kelas/rangka-kelas-memuat";
import { RangkaKelas } from "@/components/features/kelas/rangka-kelas";
import { RingkasanKelas } from "@/components/features/kelas/ringkasan-kelas";

export const metadata: Metadata = {
  title: "Ringkasan kelas",
  description: "Pengumuman, jadwal terdekat, materi terbaru, dan progres tugas kelas.",
};

/**
 * Beranda kelas — `/classes/[classId]`.
 *
 * Pembacaan `params` berada di balik `<Suspense>` karena Cache Components
 * aktif. Rangka hero dan tab tetap tampil lebih dulu, isi kelas menyusul.
 *
 * TODO(api): ganti `ambilKelas` dengan controller kelas dan materi.
 * TODO(izin): tampilkan tombol kelola hanya untuk PJ/admin kelas.
 */
export default function HalamanKelas({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<RangkaKelasMemuat />}>
      <IsiKelas params={params} />
    </Suspense>
  );
}

async function IsiKelas({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const kelas = ambilKelas(classId);

  if (!kelas) notFound();

  return (
    <RangkaKelas kelas={kelas} aktif="ringkasan">
      <RingkasanKelas kelas={kelas} />
    </RangkaKelas>
  );
}
