import { KartuKertas } from "@/components/shared/kartu";
import { Lencana } from "@/components/shared/lencana";
import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

import {
  kelasDiikutiContoh,
  pengajuanSayaContoh,
  ringkasanPenggunaContoh,
  type StatusKelasDiikuti,
  type StatusPengajuan,
} from "./data-contoh";
import { FormMasukKelas } from "./form-masuk-kelas";
import { FormPengajuanKelas } from "./form-pengajuan-kelas";
import { GridRingkasan } from "./kartu-ringkasan";

/**
 * Dasbor pengguna yang belum punya peran.
 *
 * Ini kondisi "anggota biasa": belum jadi PJ maupun admin kelas, jadi yang
 * bisa dilakukan hanya tiga hal —
 * 1. mengajukan kelas baru,
 * 2. masuk ke kelas yang sudah ada lewat kode undangan,
 * 3. melihat kelas apa saja yang sudah diikuti dan membuka isinya.
 *
 * Alat tingkat website (menyetujui pengajuan, poster, moderasi) tidak ada di
 * sini; itu milik superadmin. Alat pengelolaan kelas juga tidak ada; itu milik
 * admin kelas di `/classes/[classId]`.
 *
 * Halaman ini Server Component. Formulir yang butuh state ada di
 * `form-pengajuan-kelas.tsx` dan `form-masuk-kelas.tsx`.
 */
const lencanaStatus: Record<StatusKelasDiikuti, "success" | "warning" | "error"> = {
  Aktif: "success",
  "Menunggu persetujuan": "warning",
  Ditolak: "error",
};

const lencanaPengajuan: Record<StatusPengajuan, "info" | "success" | "error"> = {
  Diajukan: "info",
  Disetujui: "success",
  Ditolak: "error",
};

export function DasborPengguna() {
  return (
    <>
      <header className="dash-head">
        <span className="dash-eyebrow">Akun / Pengguna</span>
        <h1 className="dash-title">Selamat datang di Klass.</h1>
        <p className="dash-lede">
          Kamu belum terdaftar sebagai PJ atau admin kelas. Mulai dengan masuk ke kelas yang sudah
          ada, atau ajukan ruang baru untuk komunitasmu.
        </p>
        <span className="dash-meta">Data contoh · 15 November 2026</span>
      </header>

      <GridRingkasan item={ringkasanPenggunaContoh} />

      <section className="dash-section" aria-labelledby="my-classes">
        <h2 className="dash-section__title" id="my-classes">
          Kelas yang kamu ikuti
        </h2>
        <p className="dash-section__sub">
          {kelasDiikutiContoh.filter((kelas) => kelas.status === "Aktif").length} kelas bisa dibuka.
          Sisanya menunggu keputusan superadmin.
        </p>

        <div className="dash-section__body">
          <div className="dash-grid-2">
            {kelasDiikutiContoh.map((kelas) => (
              <KartuKertas
                key={kelas.id}
                judul={kelas.nama}
                deskripsi={`${kelas.jenis}. ${kelas.isi}.`}
                lencana={{ label: kelas.status, varian: lencanaStatus[kelas.status] }}
                aksi={
                  kelas.href ? (
                    <TautanTombolKertas href={kelas.href} variant="primary" size="sm">
                      Buka kelas
                    </TautanTombolKertas>
                  ) : (
                    <span className="dash-card__desc">
                      Kelas terbuka setelah pengajuan disetujui.
                    </span>
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="dash-section" aria-labelledby="get-started">
        <h2 className="dash-section__title" id="get-started">
          Mulai dari sini
        </h2>
        <p className="dash-section__sub">
          Sudah punya kode undangan? Masuk langsung. Belum ada kelasnya? Ajukan dulu.
        </p>

        <div className="dash-section__body dash-grid-2 dash-grid-2--start">
          <article className="dash-card" aria-labelledby="join-class">
            <h3 className="dash-card__title" id="join-class">
              Masuk kelas
            </h3>
            <p className="dash-card__desc">
              Pakai kode dari admin kelas. Kamu masuk sebagai anggota, tanpa peran khusus.
            </p>

            <div className="dash-card__body">
              <FormMasukKelas />
            </div>
          </article>

          <article className="dash-card" aria-labelledby="request-class">
            <h3 className="dash-card__title" id="request-class">
              Ajukan kelas baru
            </h3>
            <p className="dash-card__desc">
              Diajukan sekali, ditinjau superadmin. Kalau disetujui, kamu menjadi admin kelas itu.
            </p>

            <div className="dash-card__body">
              <FormPengajuanKelas />
            </div>
          </article>
        </div>
      </section>

      <section className="dash-section" aria-labelledby="my-requests">
        <h2 className="dash-section__title" id="my-requests">
          Pengajuan kelasmu
        </h2>
        <p className="dash-section__sub">
          Riwayat pengajuan dan keputusannya. Kamu akan diberi tahu lewat email saat status berubah.
        </p>

        <div className="dash-section__body">
          <div className="dash-list">
            {pengajuanSayaContoh.map((ajuan) => (
              <article className="dash-list__row" key={ajuan.id}>
                <div className="dash-list__main">
                  <p className="dash-list__title">{ajuan.kelas}</p>
                  <p className="dash-list__meta">
                    {ajuan.jenis} · Diajukan {ajuan.tanggal}
                  </p>
                  {ajuan.catatan ? <p className="dash-list__meta">{ajuan.catatan}</p> : null}
                </div>

                <Lencana variant={lencanaPengajuan[ajuan.status]}>{ajuan.status}</Lencana>
              </article>
            ))}
          </div>
        </div>
      </section>

      <p className="dash-note">
        Ingin jadi PJ di salah satu mata kuliah? Minta admin kelas menunjukmu setelah kamu masuk.
      </p>
    </>
  );
}
