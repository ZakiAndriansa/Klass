import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  ambilKelas,
  ambilMateri,
  materiSekitar,
  materiTerkait,
} from "@/components/features/kelas/data-contoh";
import { IsiMateri } from "@/components/features/kelas/isi-materi";
import { RangkaKelasMemuat } from "@/components/features/kelas/rangka-kelas-memuat";
import { RangkaKelas } from "@/components/features/kelas/rangka-kelas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ classId: string; materialId: string }>;
}): Promise<Metadata> {
  const { classId, materialId } = await params;
  const kelas = ambilKelas(classId);
  const materi = kelas ? ambilMateri(kelas, materialId) : undefined;

  if (!materi) notFound();

  return {
    title: materi.judul,
    description: materi.ringkasan,
  };
}

/**
 * Isi materi — `/classes/[classId]/materials/[materialId]`.
 *
 * Materi yang tidak dikenal langsung 404, bukan menampilkan halaman kosong.
 * Urutan sebelumnya/berikutnya mengikuti urutan daftar materi kelas.
 */
export default function HalamanIsiMateri({
  params,
}: {
  params: Promise<{ classId: string; materialId: string }>;
}) {
  return (
    <Suspense fallback={<RangkaKelasMemuat />}>
      <Isi params={params} />
    </Suspense>
  );
}

async function Isi({ params }: { params: Promise<{ classId: string; materialId: string }> }) {
  const { classId, materialId } = await params;
  const kelas = ambilKelas(classId);

  if (!kelas) notFound();

  const materi = ambilMateri(kelas, materialId);
  if (!materi) notFound();

  const { sebelumnya, berikutnya } = materiSekitar(kelas, materi);
  const terkait = materiTerkait(kelas, materi);
  const tugas = materi.tugasTerkaitId
    ? kelas.tugas.find((item) => item.id === materi.tugasTerkaitId)
    : undefined;

  return (
    <RangkaKelas kelas={kelas} aktif="materi">
      <IsiMateri
        kelas={kelas}
        materi={materi}
        sebelumnya={sebelumnya}
        berikutnya={berikutnya}
        terkait={terkait}
        tugas={tugas}
      />
    </RangkaKelas>
  );
}
