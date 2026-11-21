import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ambilKelas } from "@/components/features/kelas/data-contoh";
import { PapanProgress } from "@/components/features/kelas/papan-progress";
import { RangkaKelasMemuat } from "@/components/features/kelas/rangka-kelas-memuat";
import { RangkaKelasSesi } from "../rangka-sesi";

export const metadata: Metadata = {
  title: "Papan progress",
  description: "Papan tugas kelas dan ringkasan progres seluruh anggota untuk PJ.",
};

/**
 * Papan progress — `/classes/[classId]/progress`.
 *
 * Data awal disiapkan di Server Component, lalu papan berjalan sebagai Client
 * Component. Hanya potongan yang dibutuhkan papan yang dikirim lewat props:
 * tugas, status pribadi, anggota, dan mata kuliah.
 *
 * TODO(api): ganti data contoh dengan tugas dan progres dari API. Lihat
 * `docs/papan-progress.md` untuk bentuk data dan endpoint yang direncanakan.
 */
export default function HalamanProgress({ params }: { params: Promise<{ classId: string }> }) {
  return (
    <Suspense fallback={<RangkaKelasMemuat />}>
      <IsiProgress params={params} />
    </Suspense>
  );
}

async function IsiProgress({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const kelas = ambilKelas(classId);

  if (!kelas) notFound();

  const statusAwal = Object.fromEntries(kelas.tugas.map((tugas) => [tugas.id, tugas.status]));
  const namaSaya = kelas.anggota.find((anggota) => anggota.id === kelas.idSaya)?.nama ?? "Anggota";

  return (
    <RangkaKelasSesi kelas={kelas} aktif="progress">
      <header className="kelas-halaman__kepala">
        <p className="kelas-eyebrow">Progress</p>
        <h2 className="kelas-halaman__judul">Papan progress</h2>
        <p className="kelas-halaman__deskripsi">
          Tugas dari PJ, progres pribadi, dan gambaran siapa yang sudah selesai. Setiap anggota
          memindahkan kartunya sendiri; PJ memegang daftar tugas.
        </p>
      </header>

      <PapanProgress
        tugasAwal={kelas.tugas}
        statusAwal={statusAwal}
        anggotaProgres={kelas.progresAnggota}
        anggota={kelas.anggota}
        mataKuliah={kelas.mataKuliah}
        peran={kelas.peran}
        idSaya={kelas.idSaya}
        namaSaya={namaSaya}
      />
    </RangkaKelasSesi>
  );
}
