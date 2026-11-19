import { TombolKertas } from "@/components/shared/tombol-kertas";

import { pengajuanContoh, posterContoh, ringkasanSuperadminContoh } from "./data-contoh";
import { GridRingkasan } from "./kartu-ringkasan";
import { TabelPengajuan } from "./tabel-pengajuan";

/**
 * Dasbor superadmin — Figma "Klass · 03 Dashboard Admin — Superadmin" (60:776).
 *
 * Superadmin mengurus website, bukan isi kelas: menyetujui pengajuan kelas,
 * mengelola poster halaman utama, dan meninjau tema kelas yang disalahgunakan.
 * Karena itu tidak ada folder subkelas, agenda, atau jadwal di sini.
 *
 * Halaman ini Server Component; baris tabel yang bisa berubah statusnya
 * ditangani `TabelPengajuan` (Client Component).
 */
export function DasborSuperadmin() {
  return (
    <>
      <header className="dash-head">
        <span className="dash-eyebrow">Website / Superadmin</span>
        <h1 className="dash-title">Ruang kendali Klass</h1>
        <p className="dash-lede">Tinjau pengajuan, kelola poster, dan jaga ruang yang aman.</p>
        <span className="dash-meta">Data contoh · 15 November 2026</span>
      </header>

      <GridRingkasan item={ringkasanSuperadminContoh} />

      <section className="dash-section" aria-labelledby="admin-requests">
        <h2 className="dash-section__title" id="admin-requests">
          Pengajuan kelas
        </h2>
        <p className="dash-section__sub">
          Hanya superadmin yang dapat menyetujui dan menunjuk admin kelas.
        </p>

        <div className="dash-section__body">
          <TabelPengajuan awal={pengajuanContoh} />
        </div>
      </section>

      <section className="dash-section" aria-labelledby="admin-manage">
        <h2 className="sr-only" id="admin-manage">
          Poster dan moderasi
        </h2>

        <div className="dash-grid-2">
          <article className="dash-card">
            <h3 className="dash-card__title">Poster halaman utama</h3>

            <div className="dash-poster">
              <p className="dash-poster__title">{posterContoh.judul}</p>
              <p className="dash-poster__meta">{posterContoh.jadwal}</p>
            </div>

            <div className="dash-card__foot">
              <TombolKertas variant="secondary" size="sm">
                Kelola poster
              </TombolKertas>
            </div>
          </article>

          <article className="dash-card">
            <h3 className="dash-card__title">Moderasi &amp; tema</h3>
            <p className="dash-card__desc">
              Tinjau konten kelas dan reset tema yang disalahgunakan. Pesan pribadi tidak termasuk
              akses moderasi.
            </p>

            <div className="dash-card__foot">
              <TombolKertas variant="secondary" size="sm">
                Reset tema
              </TombolKertas>
              <TombolKertas variant="secondary" size="sm">
                Hapus kelas
              </TombolKertas>
            </div>

            <p className="dash-note">Penghapusan data kelas hanya untuk superadmin.</p>
          </article>
        </div>
      </section>

      <p className="dash-note">
        Persetujuan menunjuk pengaju sebagai admin kelas. Undangan email aktif saat login pertama.
      </p>
    </>
  );
}
