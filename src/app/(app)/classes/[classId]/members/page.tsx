import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ambilKelas } from "@/components/features/kelas/data-contoh";
import { DaftarAnggota } from "@/components/features/kelas/daftar-anggota";
import { RangkaKelasMemuat } from "@/components/features/kelas/rangka-kelas-memuat";
import { RangkaKelasSesi } from "../rangka-sesi";

export const metadata: Metadata = {
  title: "Anggota kelas",
  description: "Daftar anggota kelas, peran, dan mata kuliah yang dipegang PJ.",
};

/**
 * Anggota kelas — `/classes/[classId]/members`.
 *
 * TODO(api): ambil anggota dari `GET /api/v1/classes/{classId}/members`.
 * Jumlah di hero masih data contoh, sedangkan daftar di bawah memakai array
 * anggota yang sama agar angkanya konsisten.
 */
export default function HalamanAnggota({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<RangkaKelasMemuat />}>
      <IsiAnggota params={params} />
    </Suspense>
  );
}

async function IsiAnggota({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const kelas = ambilKelas(classId);

  if (!kelas) notFound();

  return (
    <RangkaKelasSesi kelas={kelas} aktif="anggota">
      <header className="kelas-halaman__kepala">
        <p className="kelas-eyebrow">Anggota</p>
        <h2 className="kelas-halaman__judul">Orang-orang di kelas</h2>
        <p className="kelas-halaman__deskripsi">
          PJ menjaga materi dan tugas tiap mata kuliah. Bagikan kode undangan kelas untuk mengajak
          teman bergabung.
        </p>
      </header>

      <DaftarAnggota anggota={kelas.anggota} kodeUndangan={kelas.kodeUndangan} />
    </RangkaKelasSesi>
  );
}
