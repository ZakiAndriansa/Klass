import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ambilKelas } from "@/components/features/kelas/data-contoh";
import { JadwalKelas } from "@/components/features/kelas/jadwal-kelas";
import { RangkaKelasMemuat } from "@/components/features/kelas/rangka-kelas-memuat";
import { RangkaKelasSesi } from "../rangka-sesi";

export const metadata: Metadata = {
  title: "Jadwal kelas",
  description: "Jadwal mingguan kelas beserta ruang, PJ, dan mode pertemuan.",
};

/**
 * Jadwal kelas — `/classes/[classId]/schedule`.
 *
 * TODO(api): ambil jadwal dari `GET /api/v1/classes/{classId}/schedule`.
 * Sampai endpoint tersedia, `hariIni` berasal dari data contoh agar penanda
 * "Hari ini" tidak berubah antara server dan klien.
 */
export default function HalamanJadwal({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<RangkaKelasMemuat />}>
      <IsiJadwal params={params} />
    </Suspense>
  );
}

async function IsiJadwal({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const kelas = ambilKelas(classId);

  if (!kelas) notFound();

  return (
    <RangkaKelasSesi kelas={kelas} aktif="jadwal">
      <header className="kelas-halaman__kepala">
        <p className="kelas-eyebrow">Jadwal</p>
        <h2 className="kelas-halaman__judul">Jadwal mingguan</h2>
        <p className="kelas-halaman__deskripsi">
          Sesi tetap kelas ini beserta ruang dan PJ yang mendampingi. Pilih hari untuk mempersempit
          daftar.
        </p>
      </header>

      <JadwalKelas jadwal={kelas.jadwal} hariIni={kelas.hariIni} />
    </RangkaKelasSesi>
  );
}
