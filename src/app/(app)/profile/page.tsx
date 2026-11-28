import type { Metadata } from "next";
import { Suspense } from "react";

import { BukuProfil } from "@/components/features/profil/buku-profil";
import {
  catatanProfilContoh,
  jadwalProfilContoh,
  kelasProfilContoh,
} from "@/components/features/profil/data-contoh";
import { Navbar } from "@/components/shared/navbar";
import { getProfile } from "@/server/controllers/profile";
import { getMySession } from "@/server/controllers/session";
import { forPage } from "@/server/permissions";

export const metadata: Metadata = {
  title: "Profil",
  description: "Identitas, peran kelas, dan jejak aktivitas kelasmu di Klass.",
};

/**
 * Profil — `/profile`.
 *
 * Halaman inilah yang membaca sesi dan profil, lalu meneruskan identitas ke
 * `Navbar` dan `BukuProfil` sebagai props. Komponen tidak menyentuh backend
 * sama sekali — itu aturan folder di `eslint.config.mjs`.
 *
 * Identitas berasal dari `GET /api/v1/profile` lewat controller, bukan dari
 * sesi: profil adalah sumber kebenaran untuk nama dan avatar, dan hanya endpoint
 * itu yang bisa mengubahnya. `getMySession()` tetap dipakai navbar karena ia
 * yang menentukan apakah tombol masuk perlu ditampilkan.
 *
 * Daftar kelas, peran per kelas, dan catatan aktivitas masih data contoh
 * karena backend belum punya endpoint daftar kelas.
 *
 * TODO(api): ganti `kelasProfilContoh` dan `catatanProfilContoh` dengan hasil
 * `GET /api/v1/classes` dan endpoint riwayat kelas.
 * TODO(api): NIM belum ada di kolom `users`; isi `nim` setelah kolomnya dibuat.
 */
export default function HalamanProfil() {
  return (
    <div className="ds-kolom">
      <Suspense fallback={<NavbarFallback />}>
        <NavbarProfil />
      </Suspense>

      <main className="profil-halaman-luar">
        <div className="container">
          {/* Membaca sesi butuh cookie, jadi isi profil dimuat saat ada permintaan. */}
          <Suspense fallback={<ProfilMemuat />}>
            <IsiProfil />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

async function NavbarProfil() {
  const pengguna = await getMySession();

  return (
    <Navbar
      merek="Klass"
      merekHref="/dashboard"
      profilAktif
      aksi={{ label: "Meja", href: "/dashboard" }}
      pengguna={pengguna ? { name: pengguna.name, image: pengguna.image } : null}
    />
  );
}

/** Navbar tanpa identitas, dipakai selama sesi belum terbaca. */
function NavbarFallback() {
  return <Navbar merek="Klass" merekHref="/dashboard" profilAktif />;
}

async function IsiProfil() {
  // `forPage` memindahkan ke `/login` bila sesinya sudah tidak berlaku, dan
  // meneruskan galat lain ke `error.tsx`. Yang belum login tidak sampai ke sini.
  const profil = await forPage(() => getProfile());

  return (
    <BukuProfil
      nama={profil.name}
      email={profil.email}
      image={profil.image}
      nim={null}
      deskripsi="Anggota Klass. Kelas yang kamu ikuti, peranmu di dalamnya, dan catatan terbaru ada di buku ini."
      isSuperadmin={profil.isSuperadmin}
      kelas={kelasProfilContoh}
      catatan={catatanProfilContoh}
      jadwal={jadwalProfilContoh}
    />
  );
}

/** Kerangka sewarna buku, supaya tidak ada lompatan tata letak saat sesi dibaca. */
function ProfilMemuat() {
  return (
    <div className="profil-buku" aria-hidden="true">
      <div className="profil-buku__panggung">
        <div className="profil-buku__badan profil-buku__badan--memuat" />
      </div>
    </div>
  );
}
