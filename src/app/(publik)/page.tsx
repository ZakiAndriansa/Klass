import type { Metadata } from "next";

import { Accordion } from "@/components/shared/accordion";
import { AjakanBergabung } from "@/components/shared/ajakan-bergabung";
import { Feed } from "@/components/shared/feed";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/shared/hero";
import { GridKartu, KartuFolder } from "@/components/shared/kartu";
import { GridFitur, KartuFitur } from "@/components/shared/kartu-fitur";
import { DaftarLangkah } from "@/components/shared/langkah";
import { Navbar } from "@/components/shared/navbar";
import { Poster } from "@/components/shared/poster";
import { Section, SectionHead, SectionInner } from "@/components/shared/section";
import { InkLink, SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: { absolute: "Klass — Komunitas kelas yang rapi" },
  description:
    "Materi, jadwal, dan tugas kelas dalam satu tempat. Dikelola bersama oleh anggota, bukan tercecer di chat.",
};

const navigasi = [
  { label: "Jelajah", href: "#explore" },
  { label: "Fitur", href: "#features" },
  { label: "Cara kerja", href: "#how-it-works" },
  { label: "Tanya jawab", href: "#faq" },
];

const lencanaHero = [
  { label: "PJ Matkul", varian: "info" as const },
  { label: "Besok Deadline", varian: "warning" as const },
  { label: "Terlewat", varian: "error" as const },
  { label: "Admin Kelas", varian: "primary" as const },
  { label: "Terkumpul", varian: "success" as const },
];

const fitur = [
  {
    nomor: "01 / Materi",
    judul: "Satu map, semua materi.",
    deskripsi:
      "File dan tautan tersusun per mata kuliah. Cari yang kamu butuhkan, bukan chat minggu lalu.",
    warna: "folder" as const,
  },
  {
    nomor: "02 / Jadwal",
    judul: "Tahu harus ke mana.",
    deskripsi: "Jadwal mingguan yang jelas, lengkap dengan waktu, ruang, dan penanggung jawab.",
    warna: "blue" as const,
  },
  {
    nomor: "03 / Pengingat",
    judul: "Deadline ikut diingatkan.",
    deskripsi:
      "Pengingat langsung ke perangkat lewat notifikasi PWA. Tetap siap, tanpa saling tag.",
    warna: "yellow" as const,
  },
];

const langkah = [
  {
    nomor: "01",
    judul: "Gabung Kelas Terbuka",
    deskripsi: "Gabung kelas terbuka, pakai kode undangan, atau ajukan ruang baru.",
  },
  {
    nomor: "02",
    judul: "Susun bareng pengurus",
    deskripsi: "Admin membuat mata kuliah dan menunjuk PJ dari anggota kelas.",
  },
  {
    nomor: "03",
    judul: "Pengingat PWA otomatis",
    deskripsi:
      "Notifikasi Web Push dikirimkan langsung ke layar HP anggota 3 hari dan 1 hari sebelum batas pengumpulan tugas.",
  },
];

/**
 * Enam kelas unggulan untuk "Jelajah pilihan" (Figma 60:724). Dua baris
 * pertama manila, dua berikutnya lilac, dua terakhir hijau.
 */
const kelasPilihan = [
  {
    meta: "19 Mar 2026",
    judul: "Algoritma & Struktur Data",
    deskripsi: "Kumpulan slide kuliah, catatan graf, dan jadwal praktikum mingguan kelas IF-24A.",
    warna: "manila" as const,
  },
  {
    meta: "19 Mar 2026",
    judul: "Basis Data Lanjut",
    deskripsi: "PJ: Nadia Putri. Tugas normalisasi dikumpulkan paling lambat Jumat pukul 23.59.",
    warna: "manila" as const,
  },
  {
    meta: "20 Mar 2026",
    judul: "Pemrograman Web",
    deskripsi: "Modul praktikum, repo contoh, dan rekaman sesi kelas sepanjang semester.",
    warna: "lilac" as const,
  },
  {
    meta: "20 Mar 2026",
    judul: "Jaringan Komputer",
    deskripsi: "Catatan subnetting, modul praktikum, dan jadwal responsi tiap Jumat sore.",
    warna: "lilac" as const,
  },
  {
    meta: "21 Mar 2026",
    judul: "Sistem Operasi",
    deskripsi: "Silabus, materi penjadwalan proses, dan kumpulan soal latihan UTS.",
    warna: "green" as const,
  },
  {
    meta: "21 Mar 2026",
    judul: "Interaksi Manusia & Komputer",
    deskripsi: "Slide perancangan antarmuka, tautan Figma kelas, dan rubrik tugas besar.",
    warna: "green" as const,
  },
];

const siaran = [
  {
    varian: "peringatan" as const,
    judul: "Pengingat Tugas IF-24A",
    pesan:
      "Tugas Normalisasi Basis Data harus dikumpulkan kurang dari 24 jam lagi di portal tugas.",
  },
  {
    varian: "info" as const,
    judul: "Broadcast Aliansi Fasilkom · Admin IF-24A",
    pesan:
      "Kuliah Tamu Arsitektur AI-Native diadakan Sabtu 22 Nov di Auditorium Utama. Terbuka untuk seluruh angkatan.",
  },
  {
    varian: "sukses" as const,
    judul: "Materi Terbit · PJ Nadia Putri",
    pesan:
      "Slide Pertemuan 5 Basis Data: B-Tree Indexing dan Query Optimization sudah dapat diunduh di tab materi.",
  },
];

const faq = [
  {
    tanya: "Klass hanya untuk kelas kuliah?",
    jawab:
      "Tidak. Kelas kuliah, organisasi, klub, dan komunitas bisa punya ruang sendiri, dikelola langsung oleh anggotanya.",
  },
  {
    tanya: "Siapa yang mengelola kelas?",
    jawab:
      "Admin kelas mengatur pengaturan kelas, tampilan, anggota, dan kolaborasi. PJ fokus mengelola materi, jadwal mingguan, dan tugas pada subkelas tertentu.",
  },
];

const tautanFooter = [
  { label: "Jelajah", href: "#explore" },
  { label: "Fitur", href: "#features" },
  { label: "Cara kerja", href: "#how-it-works" },
  { label: "Tanya jawab", href: "#faq" },
];

/**
 * Halaman utama (F11) — `/`.
 *
 * Menyusun komponen design system Klass mengikuti urutan section Figma
 * 60:640: hero, prinsip komunitas, fitur utama, cara kerja, jelajah pilihan,
 * siaran komunitas, papan informasi, FAQ, lalu ajakan bergabung. Jarak antar
 * section memakai ritme rapat (48px) karena Figma menumpuknya hampir tanpa
 * jeda.
 *
 * Halaman ini statis (Server Component). Galeri seluruh komponen dan varian
 * ada di `/components`; demo dialog dan toast ada di sana.
 */
export default function HalamanUtama() {
  return (
    <>
      <Navbar merek="Klass" item={navigasi} aksi={{ label: "Masuk", href: "/login" }} />

      <main id="top" className="ds-kolom">
        <Hero
          judul="Klass — platform komunitas kelas dan kelompok mandiri"
          lencana={lencanaHero}
          aksi={[
            { label: "Temukan kelasmu ↗", href: "#explore" },
            { label: "Ajukan kelas baru", href: "/login" },
          ]}
        />

        <Section jarak="rapat">
          <SectionInner>
            <SectionHeading
              varian="pisah"
              judul="Dari anggota. Untuk anggota."
              subjudul={
                <>
                  Kelas kuliah, organisasi, atau komunitas.
                  <br />
                  Kamu yang pegang kendalinya.
                </>
              }
            />
          </SectionInner>
        </Section>

        <Section jarak="rapat" id="features">
          <SectionInner>
            <SectionHead judul="Lebih sedikit tercecer. Lebih banyak teratur." />
            <GridFitur>
              {fitur.map((item) => (
                <KartuFitur key={item.nomor} {...item} />
              ))}
            </GridFitur>
          </SectionInner>
        </Section>

        <Section jarak="rapat" id="how-it-works">
          <SectionInner>
            <SectionHeading varian="tulisan" judul="Bagaimana cara kerjanya?" />
            <DaftarLangkah langkah={langkah} />
          </SectionInner>
        </Section>

        <Section jarak="rapat" id="explore">
          <SectionInner>
            <div className="landing-jelajah__head">
              <InkLink href="#explore">
                <span>Jelajahi semua kelas</span>
                <span aria-hidden="true">↗</span>
              </InkLink>
            </div>

            <GridKartu>
              {kelasPilihan.map((kelas) => (
                <KartuFolder key={kelas.judul} {...kelas} />
              ))}
            </GridKartu>

            <SectionHead className="landing-jelajah__title" judul="Ada ruang untuk kelasmu." />
          </SectionInner>
        </Section>

        <Section jarak="rapat" id="broadcast">
          <SectionInner>
            <Feed
              eyebrow="jaringan antar-kelas"
              judul="Siaran Komunitas Terkini"
              intro="Informasi lintas kelas disiarkan satu arah oleh admin kelas tanpa perlu membuat grup chat baru berulang kali."
              siaran={siaran}
            />
          </SectionInner>
        </Section>

        <Section jarak="rapat">
          <SectionInner>
            <Poster
              label="Papan Informasi / 01"
              judul={
                <>
                  Ide bagus tumbuh
                  <br />
                  kalau dibagi.
                </>
              }
              meta={
                <>
                  Sesi kenalan Klass
                  <br />
                  Sabtu, 21 November 2026 · 15.00 WIB
                </>
              }
              aksi={{ label: "Lihat agenda ↗", href: "#broadcast" }}
            />
          </SectionInner>
        </Section>

        <Section jarak="rapat" id="faq">
          <SectionInner>
            <SectionHeading
              varian="polos"
              judul="Masih penasaran?"
              subjudul="Sedikit jawaban sebelum mulai."
            />
            <Accordion item={faq} />
          </SectionInner>
        </Section>

        <div id="request">
          <AjakanBergabung
            judul="Kelas rapi dimulai dari kamu."
            salinan="Bawa teman-temanmu. Sisanya, kita rapikan bareng."
            // Formulir pengajuan sekarang ada di dasbor pengguna (`/dashboard`),
            // karena pengajuan butuh akun: status dan riwayatnya terikat ke
            // pengguna. Halaman ini mengarahkan ke login lebih dulu.
            aksi={{ label: "Ajukan kelas baru ↗", href: "/login" }}
          />
        </div>
      </main>

      <Footer
        tagline="Satu tempat rapi untuk materi, jadwal, dan tugas kelas yang dikelola bersama."
        tautan={tautanFooter}
        hakCipta="© 2026 Klass · Komunitas Kelas"
        lencana="Paper & Folder Edition"
      />
    </>
  );
}
