import { Navbar } from "@/components/shared/navbar";

import { SisiDasbor, type ItemSisiDasbor } from "./sisi-dasbor";

/**
 * Kerangka dasbor: header tipis, sidebar peran, dan kolom konten.
 *
 * Dipakai dua halaman dengan peran berbeda — `/classes/[classId]` (admin kelas)
 * dan `/admin` (superadmin). Yang berbeda hanya isi sidebar dan kolom konten;
 * kerangkanya sengaja satu supaya navigasi terasa sama di kedua peran.
 *
 * Header hanya berisi logo dan tombol keluar. Navigasi peran sudah ada di
 * sidebar, jadi tidak ada tab di tengah dan tidak ada tombol drawer.
 *
 * Halaman ini Server Component: tidak ada state. Bagian yang butuh interaksi
 * (toggle PWA, tombol tinjau pengajuan) punya Client Component sendiri.
 */
export function KepalaDasbor() {
  return (
    <Navbar
      className="navbar--dash"
      merek="Klass"
      merekHref="/"
      aksi={{ label: "Keluar", href: "/login", keluar: true }}
    />
  );
}

type KerangkaDasborProps = {
  sisi: {
    eyebrow: string;
    judul: React.ReactNode;
    meta: string;
    item: ItemSisiDasbor[];
    catatan?: { label: string; isi: string[] };
    peran: string;
    nama: string;
    keterangan: string;
  };
  children: React.ReactNode;
};

export function KerangkaDasbor({ sisi, children }: KerangkaDasborProps) {
  return (
    <div className="dash-page">
      <KepalaDasbor />

      <div className="dash">
        <SisiDasbor {...sisi} />

        <main className="dash-main">
          <div className="dash-main__inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
