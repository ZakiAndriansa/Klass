import type { Metadata } from "next";
import { Suspense } from "react";

import { Loket } from "@/components/features/meja/loket";
import { Meja } from "@/components/features/meja/meja";
import { ambilMeja, loketContoh } from "@/components/features/meja/data-contoh";
import { Navbar } from "@/components/shared/navbar";
import { requirePageLogin } from "@/server/permissions";

export const metadata: Metadata = {
  title: "Meja",
  description: "Agenda hari ini, tenggat terdekat, dan kabar dari semua kelas yang kamu ikuti.",
};

/**
 * Meja — `/dashboard`.
 *
 * Satu rute, dua tampilan, dipilih dari peran global pengguna:
 *
 *   superadmin   Loket: antrean pengajuan kelas, undangan admin, kondisi situs
 *   pengguna     Meja: agenda lintas kelas, tenggat, tab map kelas, kabar
 *
 * Superadmin TIDAK dialihkan ke rute lain. Peran website dan peran kelas itu
 * dua hal berbeda; superadmin yang juga anggota kelas tetap punya agenda
 * pribadi. Yang berubah hanya isi halaman ini.
 *
 * Meja menjawab satu pertanyaan yang tidak bisa dijawab halaman kelas mana pun:
 * "hari ini aku harus ke mana dan mengerjakan apa, di semua kelas sekaligus".
 * Karena itu tidak ada katalog kelas di sini — katalog tetap di `/classes`,
 * riwayat pengajuan tetap di `/profile`, dan isi tiap kelas tetap di beranda
 * kelasnya.
 *
 * TODO(api): ganti `ambilMeja` dan `loketContoh` dengan controller `me/*`.
 */
export default function HalamanMeja() {
  return (
    <Suspense fallback={<MejaMemuat />}>
      <IsiMeja />
    </Suspense>
  );
}

async function IsiMeja() {
  // Yang belum login dipindahkan ke `/login?next=/dashboard`.
  const pengguna = await requirePageLogin();

  return (
    <>
      <Navbar
        merek="Klass"
        merekHref="/dashboard"
        item={[
          { label: pengguna.isSuperadmin ? "Loket" : "Meja", href: "/dashboard", aktif: true },
          { label: "Kelas", href: "/classes" },
          { label: "Profil", href: "/profile" },
        ]}
        aksi={{ label: "Beranda", href: "/" }}
        pengguna={{ name: pengguna.name, image: pengguna.image ?? null }}
      />

      <main className="meja-halaman">
        <div className="container">
          {pengguna.isSuperadmin ? (
            <Loket
              antrean={loketContoh.antrean}
              undangan={loketContoh.undangan}
              kondisi={loketContoh.kondisi}
            />
          ) : (
            <Meja data={ambilMeja(pengguna.id)} nama={pengguna.name} />
          )}
        </div>
      </main>
    </>
  );
}

/** Kerangka sewarna kertas supaya tidak ada lompatan tata letak saat sesi dibaca. */
function MejaMemuat() {
  return (
    <>
      <Navbar merek="Klass" merekHref="/dashboard" />
      <main className="meja-halaman">
        <div className="container">
          <div className="meja meja--memuat" aria-hidden="true">
            <div className="meja-memuat__bar meja-memuat__bar--eyebrow" />
            <div className="meja-memuat__bar meja-memuat__bar--judul" />
            <div className="meja-memuat__bar" />
          </div>
        </div>
      </main>
    </>
  );
}
