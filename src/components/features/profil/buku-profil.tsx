"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, ClipboardCheck, Clock, FileText, MapPin, Users } from "lucide-react";

import { AvatarPengguna } from "@/components/shared/avatar-pengguna";
import { Lencana } from "@/components/shared/lencana";
import { TombolKeluar } from "@/components/shared/tombol-keluar";
import { cn } from "@/lib/utils";

import type { CatatanProfil, JadwalProfil, KelasProfil } from "./data-contoh";

/* Nilai ini harus seirama dengan durasi transisi di profil.css. */
const DURASI_BALIK = 760;

/** Dua bentangan buku. */
type Bentangan = "identitas" | "catatan";

const ikonCatatan = {
  materi: FileText,
  jadwal: CalendarDays,
  tugas: ClipboardCheck,
  anggota: Users,
} as const;

const nadaPeran: Record<KelasProfil["peran"], "primary" | "info" | "default"> = {
  "Admin kelas": "primary",
  PJ: "info",
  Anggota: "default",
};

type BukuProfilProps = {
  nama: string;
  email: string;
  image: string | null;
  /** NIM belum ada di database; ditampilkan sebagai catatan sementara. */
  nim?: string | null;
  deskripsi: string;
  isSuperadmin: boolean;
  kelas: KelasProfil[];
  catatan: CatatanProfil[];
  jadwal: JadwalProfil[];
};

/**
 * Profil berbentuk buku terbuka, memakai bahasa visual yang sama dengan
 * halaman masuk: meja kertas, lembar berporos, dan punggung buku.
 *
 * Buku punya EMPAT halaman dalam dua bentangan, seperti buku sungguhan:
 *
 *   bentangan "identitas"   halaman 1 (kiri, data diri)  halaman 2 (kanan, peran)
 *   bentangan "catatan"     halaman 3 (kiri, update)     halaman 4 (kanan, shortcut)
 *
 * Secara fisik hanya ada satu lembar:
 *
 *   halaman 1  halaman dasar kiri
 *   halaman 2  sisi depan lembar  (menutup halaman kanan saat tertutup)
 *   halaman 3  sisi belakang lembar (mendarat di kiri saat dibalik)
 *   halaman 4  halaman dasar kanan (terlihat setelah lembar dibalik)
 *
 * Jadi membalik lembar sekaligus mengganti kedua halaman, persis buku asli.
 *
 * Navigasi memakai dua sticky note yang menempel di sisi luar buku, bukan
 * tombol. Posisinya tetap: Identitas di tepi kiri, Catatan di tepi kanan.
 * Yang berubah saat lembar dibalik hanya note mana yang aktif (kuning);
 * note satunya tetap menunggu di sisinya.
 *
 * Di layar sempit lembar tidak diputar secara fisik (rotasi 3D di kolom sempit
 * membuat teks tidak terbaca); halaman bentangan aktif ditumpuk, dan kedua
 * sticky note pindah ke bawah buku.
 */
export function BukuProfil({
  nama,
  email,
  image,
  nim,
  deskripsi,
  isSuperadmin,
  kelas,
  catatan,
  jadwal,
}: BukuProfilProps) {
  const [bentangan, setBentangan] = useState<Bentangan>("identitas");
  const [berbalik, setBerbalik] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const ganti = useCallback(
    (tujuan: Bentangan) => {
      if (berbalik || tujuan === bentangan) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setBentangan(tujuan);
        return;
      }

      setBerbalik(true);
      setBentangan(tujuan);
      timer.current = window.setTimeout(() => setBerbalik(false), DURASI_BALIK);
    },
    [berbalik, bentangan],
  );

  const diIdentitas = bentangan === "identitas";
  const catatanTerdekat = jadwal.find((item) => item.terdekat) ?? jadwal[0];

  return (
    <div className="profil-buku">
      <div className="profil-buku__panggung">
        <article className={cn("profil-buku__badan", diIdentitas ? "is-identitas" : "is-catatan")}>
          {/* Halaman 1 — dasar kiri: data diri. */}
          <section
            className="profil-halaman profil-halaman--kiri"
            aria-labelledby="profil-data-diri"
            inert={!diIdentitas}
            aria-hidden={!diIdentitas}
          >
            <header className="profil-halaman__kepala">
              <span className="profil-eyebrow">Halaman 1 · Data diri</span>
              <h1 className="profil-halaman__judul" id="profil-data-diri">
                Tentang kamu
              </h1>
            </header>

            <div className="profil-identitas">
              <AvatarPengguna nama={nama} image={image} ukuran={76} className="profil-avatar" />

              <div className="profil-identitas__teks">
                <p className="profil-nama">{nama}</p>
                <p className="profil-email">{email}</p>
                {isSuperadmin ? (
                  <div className="profil-lencana">
                    <Lencana variant="primary">Superadmin</Lencana>
                  </div>
                ) : null}
              </div>
            </div>

            <p className="profil-deskripsi">{deskripsi}</p>

            <dl className="profil-data">
              <div>
                <dt>NIM</dt>
                <dd>{nim ?? <span className="profil-data__kosong">Belum diisi</span>}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd className="profil-data__email">{email}</dd>
              </div>
            </dl>

            <div className="profil-keluar">
              <p className="profil-keluar__catatan">
                Keluar hanya bisa dari halaman ini. Di halaman lain, tombol kanan atas membawamu
                kembali ke Meja.
              </p>
              <TombolKeluar label="Keluar dari akun" />
            </div>
          </section>

          {/* Halaman 4 — dasar kanan: shortcut kelas. */}
          <section
            className="profil-halaman profil-halaman--kanan"
            aria-labelledby="profil-shortcut"
            inert={diIdentitas}
            aria-hidden={diIdentitas}
          >
            <header className="profil-halaman__kepala">
              <span className="profil-eyebrow">Halaman 4 · Pintasan</span>
              <h2 className="profil-halaman__judul" id="profil-shortcut">
                Langsung ke kelas
              </h2>
            </header>

            <ul className="profil-shortcut__daftar">
              {kelas.map((item) => (
                <li key={item.id}>
                  <a
                    className={cn(
                      "profil-shortcut__tautan",
                      `profil-shortcut__tautan--${item.warna}`,
                    )}
                    href={`/classes/${item.id}`}
                  >
                    <span className="profil-shortcut__baris">
                      <span className="profil-shortcut__nama">{item.nama}</span>
                      <Lencana variant={nadaPeran[item.peran]}>{item.peran}</Lencana>
                    </span>
                    <span className="profil-shortcut__meta">
                      {item.anggota} anggota · {item.aktivitas}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="profil-shortcut__kaki">
              Kelas baru muncul di sini setelah kamu bergabung lewat kode undangan.
            </p>
          </section>

          {/* Lembar: halaman 2 di depan, halaman 3 di belakang. */}
          <div className="profil-lembar">
            {/* Halaman 2 — sisi depan: peran kelas. */}
            <section
              className="profil-muka profil-muka--depan"
              aria-labelledby="profil-peran"
              inert={!diIdentitas}
              aria-hidden={!diIdentitas}
            >
              <header className="profil-halaman__kepala">
                <span className="profil-eyebrow">Halaman 2 · Peran</span>
                <h2 className="profil-halaman__judul" id="profil-peran">
                  Peran kelasmu
                </h2>
              </header>

              <ul className="profil-peran__daftar">
                {kelas.map((item) => (
                  <li key={item.id} className="profil-peran__baris">
                    <span className="profil-peran__teks">
                      <span className="profil-peran__nama">{item.nama}</span>
                      {item.pjSubkelas?.length ? (
                        <span className="profil-peran__sub">PJ · {item.pjSubkelas.join(", ")}</span>
                      ) : (
                        <span className="profil-peran__sub">{item.anggota} anggota</span>
                      )}
                    </span>
                    <Lencana variant={nadaPeran[item.peran]}>{item.peran}</Lencana>
                  </li>
                ))}
              </ul>

              <p className="profil-peran__catatan">
                Peran berlaku per kelas. Kamu bisa admin di satu kelas dan anggota di kelas lain.
              </p>
            </section>

            {/* Halaman 3 — sisi belakang: update + jadwal. */}
            <section
              className="profil-muka profil-muka--belakang"
              aria-labelledby="profil-catatan"
              inert={diIdentitas}
              aria-hidden={diIdentitas}
            >
              <header className="profil-halaman__kepala">
                <span className="profil-eyebrow">Halaman 3 · Catatan</span>
                <h2 className="profil-halaman__judul" id="profil-catatan">
                  Kabar terbaru
                </h2>
              </header>

              <ol className="profil-catatan__daftar">
                {catatan.map((item) => {
                  const Ikon = ikonCatatan[item.jenis];
                  return (
                    <li key={item.judul} className="profil-catatan__baris">
                      <span className="profil-catatan__ikon" aria-hidden="true">
                        <Ikon size={13} strokeWidth={2.2} />
                      </span>
                      <div>
                        <p className="profil-catatan__judul">{item.judul}</p>
                        <p className="profil-catatan__isi">{item.isi}</p>
                        <span className="profil-catatan__waktu">{item.waktu}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="profil-jadwal">
                <h3 className="profil-subjudul">Jadwal terdekat</h3>
                <ul className="profil-jadwal__daftar">
                  {jadwal.map((item) => (
                    <li
                      key={`${item.hari}-${item.jam}-${item.kelas}`}
                      className={cn(
                        "profil-jadwal__baris",
                        item.terdekat && "profil-jadwal__baris--terdekat",
                      )}
                    >
                      <span className="profil-jadwal__waktu">
                        <Clock size={11} strokeWidth={2.4} aria-hidden="true" />
                        {item.hari} · {item.jam}
                      </span>
                      <span className="profil-jadwal__kelas">{item.kelas}</span>
                      <span className="profil-jadwal__ruang">
                        <MapPin size={10} strokeWidth={2.4} aria-hidden="true" />
                        {item.ruang}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {catatanTerdekat ? (
                <p className="profil-catatan__kaki">
                  Berikutnya: {catatanTerdekat.kelas}, {catatanTerdekat.hari.toLowerCase()} pukul{" "}
                  {catatanTerdekat.jam}.
                </p>
              ) : null}
            </section>
          </div>

          <span className="profil-buku__punggung" aria-hidden="true" />
        </article>

        {/* Navigasi: sticky note di sisi buku. Sisi tetap — Identitas di kiri,
            Catatan di kanan. Saat lembar dibalik hanya status aktifnya yang
            berpindah, jadi tidak ada note yang melompat sisi. */}
        <nav
          className={cn("profil-postit", diIdentitas ? "is-identitas" : "is-catatan")}
          aria-label="Halaman profil"
        >
          <span className="profil-postit__bekas profil-postit__bekas--kanan" aria-hidden="true" />
          <span className="profil-postit__bekas profil-postit__bekas--kiri" aria-hidden="true" />

          <button
            type="button"
            className={cn("profil-postit__catatan is-kiri", diIdentitas && "is-aktif")}
            aria-current={diIdentitas ? "page" : undefined}
            onClick={() => ganti("identitas")}
          >
            <span className="profil-postit__nomor">01</span>
            <span className="profil-postit__label">Identitas</span>
          </button>
          <button
            type="button"
            className={cn("profil-postit__catatan is-kanan", !diIdentitas && "is-aktif")}
            aria-current={!diIdentitas ? "page" : undefined}
            onClick={() => ganti("catatan")}
          >
            <span className="profil-postit__nomor">02</span>
            <span className="profil-postit__label">Catatan</span>
          </button>
        </nav>
      </div>

      <p className="profil-buku__penanda" aria-hidden="true">
        {diIdentitas ? "Halaman 1–2 dari 4" : "Halaman 3–4 dari 4"}
      </p>
    </div>
  );
}
