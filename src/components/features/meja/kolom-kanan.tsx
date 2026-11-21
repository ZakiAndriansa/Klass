import Link from "next/link";
import { AlertTriangle, ArrowRight, FileText, FolderOpen, Megaphone } from "lucide-react";

import { Lencana } from "@/components/shared/lencana";
import { cn } from "@/lib/utils";

import type { KabarMeja, KelasMeja, Perhatian, PengajuanMeja } from "./data-contoh";

/**
 * "Perlu perhatian": tugas yang tenggatnya dekat atau sudah lewat.
 *
 * Tampil sebagai sticky note, sama seperti note di buku profil dan kartu
 * catatan di landing. Kalau tidak ada yang perlu diperhatikan, seluruh blok
 * dihilangkan — bukan kotak kosong dengan tulisan "tidak ada tugas".
 */
export function PerluPerhatian({ item }: { item: Perhatian[] }) {
  if (item.length === 0) return null;

  const lewat = item.filter((baris) => baris.lewat).length;

  return (
    <aside className="meja-note" aria-labelledby="meja-perhatian">
      <span className="meja-note__selotip" aria-hidden="true" />

      <h2 className="meja-note__judul" id="meja-perhatian">
        <AlertTriangle size={14} strokeWidth={2.4} aria-hidden="true" />
        Perlu perhatian
      </h2>

      <p className="meja-note__rekap">
        <strong>{item.length}</strong> tenggat dekat
        {lewat > 0 ? (
          <>
            , <strong>{lewat}</strong> sudah lewat
          </>
        ) : null}
      </p>

      <ul className="meja-note__daftar">
        {item.map((baris) => (
          <li key={baris.id}>
            <Link className="meja-note__baris" href={baris.href}>
              <span className={`meja-titik meja-warna--${baris.warna}`} aria-hidden="true" />
              <span className="meja-note__teks">
                <span className="meja-note__nama">{baris.judul}</span>
                <span className="meja-note__meta">
                  {baris.kelas} · {baris.tenggat}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * Tab map kelas yang diikuti.
 *
 * Ini pintasan, bukan katalog. Daftar lengkap dengan pencarian dan filter
 * tetap di `/classes`, jadi di sini cukup kelas teratas + tautan "lihat semua".
 * Bentuknya tab map manila supaya menyambung bahasa visual landing.
 */
export function TabMapKelas({ kelas, total }: { kelas: KelasMeja[]; total: number }) {
  if (kelas.length === 0) return null;

  return (
    <section className="meja-panel" aria-labelledby="meja-kelas">
      <div className="meja-panel__kepala">
        <h2 className="meja-panel__judul" id="meja-kelas">
          <FolderOpen size={16} strokeWidth={2.2} aria-hidden="true" />
          Kelasmu
        </h2>
        {total > kelas.length ? (
          <Link className="meja-panel__tautan" href="/classes">
            Lihat semua
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <ul className="meja-map">
        {kelas.map((item) => (
          <li key={item.id}>
            <Link className={cn("meja-map__tab", `meja-warna--${item.warna}`)} href={item.href}>
              <span className="meja-map__nama">{item.nama}</span>
              <span className="meja-map__peran">{item.peran}</span>
              {item.baru > 0 ? (
                <span className="meja-map__baru">
                  {item.baru}
                  <span className="sr-only"> item baru</span>
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Kabar lintas kelas: materi baru dan perubahan jadwal.
 *
 * Maksimal tiga item. Ini bukan feed sosial; tujuannya hanya memberi tahu
 * apa yang berubah sejak terakhir dibuka, tanpa harus membuka tiap kelas.
 */
export function KabarKelas({ item }: { item: KabarMeja[] }) {
  if (item.length === 0) return null;

  return (
    <section className="meja-panel" aria-labelledby="meja-kabar">
      <div className="meja-panel__kepala">
        <h2 className="meja-panel__judul" id="meja-kabar">
          <Megaphone size={16} strokeWidth={2.2} aria-hidden="true" />
          Kabar kelas
        </h2>
      </div>

      <ul className="meja-kabar">
        {item.map((baris) => (
          <li key={baris.id}>
            <Link className="meja-kabar__baris" href={baris.href}>
              <FileText
                size={13}
                strokeWidth={2.2}
                aria-hidden="true"
                className={`meja-kabar__ikon meja-warna--${baris.warna}`}
              />
              <span className="meja-kabar__teks">
                <span className="meja-kabar__judul">{baris.judul}</span>
                <span className="meja-kabar__meta">
                  {baris.kelas} · {baris.waktu}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Strip status pengajuan kelas.
 *
 * Hanya muncul saat ada pengajuan yang masih menunggu. Riwayat lengkap pindah
 * ke halaman profil, jadi Meja tidak menyimpan arsip yang sudah selesai.
 */
export function StripPengajuan({ item }: { item: PengajuanMeja[] }) {
  const menunggu = item.filter((baris) => baris.status === "Diajukan");
  if (menunggu.length === 0) return null;

  return (
    <aside className="meja-strip" aria-label="Pengajuan kelas">
      <span className="meja-strip__label">Menunggu tinjauan</span>
      <ul className="meja-strip__daftar">
        {menunggu.map((baris) => (
          <li key={baris.id} className="meja-strip__baris">
            <span className="meja-strip__nama">{baris.kelas}</span>
            <Lencana variant="info">Diajukan</Lencana>
          </li>
        ))}
      </ul>
      <Link className="meja-strip__tautan" href="/profile">
        Riwayat di profil
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </aside>
  );
}
