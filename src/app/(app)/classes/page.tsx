import type { Metadata } from "next";
import { BookOpen, ListChecks, Users } from "lucide-react";

import { Navbar } from "@/components/shared/navbar";

import { daftarKelas } from "@/components/features/kelas/data-contoh";
import { DaftarKelas } from "@/components/features/kelas/daftar-kelas";

export const metadata: Metadata = {
  title: "Kelas saya",
  description: "Daftar kelas yang diikuti, lengkap dengan jadwal, materi, dan progres tugas.",
};

/**
 * Daftar kelas — `/classes`.
 *
 * Halaman ini belum butuh `params`, jadi seluruh isinya bisa dirender sebagai
 * Server Component. Penyaringan daftar dilakukan di Client Component kecil
 * yang menerima data contoh lewat props.
 *
 * TODO(api): ambil kelas yang diikuti pengguna dari `GET /api/v1/classes`.
 */
export default function HalamanDaftarKelas() {
  const totalMateri = daftarKelas.reduce((total, kelas) => total + kelas.jumlahMateri, 0);
  const totalTugas = daftarKelas.reduce((total, kelas) => total + kelas.jumlahTugas, 0);

  return (
    <div className="kelas-page kelas-aksen--kuning">
      <Navbar
        className="navbar--dash"
        merek="Klass"
        merekHref="/dashboard"
        aksi={{ label: "Keluar", href: "/login", keluar: true }}
      />

      <main className="kelas-daftar-halaman">
        <div className="container">
          <header className="kelas-daftar-hero">
            <div className="kelas-daftar-hero__utama">
              <p className="kelas-eyebrow">Ruang belajar</p>
              <h1 className="kelas-daftar-hero__judul">Kelas saya</h1>
              <p className="kelas-daftar-hero__deskripsi">
                Semua kelas yang kamu ikuti ada di satu tempat. Buka kelas untuk melihat jadwal,
                materi, dan progres tugas.
              </p>
              <p className="kelas-daftar-hero__catatan">
                Belum menemukan kelasmu? Minta kode undangan ke PJ atau admin kelas.
              </p>
            </div>

            <dl className="kelas-daftar-stat">
              <div>
                <dt>
                  <Users size={15} aria-hidden="true" />
                  Kelas diikuti
                </dt>
                <dd>{daftarKelas.length}</dd>
              </div>
              <div>
                <dt>
                  <BookOpen size={15} aria-hidden="true" />
                  Materi tersedia
                </dt>
                <dd>{totalMateri}</dd>
              </div>
              <div>
                <dt>
                  <ListChecks size={15} aria-hidden="true" />
                  Tugas tercatat
                </dt>
                <dd>{totalTugas}</dd>
              </div>
            </dl>
          </header>

          <DaftarKelas kelas={daftarKelas} />
        </div>
      </main>
    </div>
  );
}
