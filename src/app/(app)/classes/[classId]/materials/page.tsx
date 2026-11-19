import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ambilKelas } from "@/components/features/kelas/data-contoh";
import { DaftarMateri } from "@/components/features/kelas/daftar-materi";
import { RangkaKelasMemuat } from "@/components/features/kelas/rangka-kelas-memuat";
import { RangkaKelas } from "@/components/features/kelas/rangka-kelas";

export const metadata: Metadata = {
  title: "Materi kelas",
  description: "Kumpulan materi kelas, bisa dicari dan disaring berdasarkan mata kuliah.",
};

/**
 * Kumpulan materi — `/classes/[classId]/materials`.
 *
 * TODO(api): ambil materi dari `GET /api/v1/classes/{classId}/materials`
 * (atau endpoint subkelas bila model PRD dipakai).
 */
export default function HalamanMateri({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<RangkaKelasMemuat />}>
      <IsiMateri params={params} />
    </Suspense>
  );
}

async function IsiMateri({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const kelas = ambilKelas(classId);

  if (!kelas) notFound();

  return (
    <RangkaKelas kelas={kelas} aktif="materi">
      <header className="kelas-halaman__kepala">
        <p className="kelas-eyebrow">Materi</p>
        <h2 className="kelas-halaman__judul">Kumpulan materi</h2>
        <p className="kelas-halaman__deskripsi">
          {kelas.materi.length} materi dari {kelas.mataKuliah.length} mata kuliah. Cari berdasarkan
          judul, atau saring berdasarkan mata kuliah dan jenis berkas.
        </p>
      </header>

      <DaftarMateri kelasId={kelas.id} materi={kelas.materi} />
    </RangkaKelas>
  );
}
