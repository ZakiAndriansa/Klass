import type { Metadata } from "next";
import { Suspense } from "react";

import { AlurArsip, type LangkahLanding } from "@/components/features/landing/alur-arsip";
import type { KelasPilihan } from "@/components/features/landing/folder-kelas";
import { IndeksMap, type ItemIndeks } from "@/components/features/landing/indeks-map";
import { IsiMap, type FiturLanding } from "@/components/features/landing/isi-map";
import { Manifesto } from "@/components/features/landing/manifesto";
import { PapanKabar, type SiaranLanding } from "@/components/features/landing/papan-kabar";
import { PetaKelas } from "@/components/features/landing/peta-kelas";
import { SuratAjakan } from "@/components/features/landing/surat-ajakan";
import { TanyaJawab, type FaqLanding } from "@/components/features/landing/tanya-jawab";
import { Footer } from "@/components/shared/footer";
import { Hero } from "@/components/shared/hero";
import { Navbar } from "@/components/shared/navbar";
import { ambilSesiSaya } from "@/server/auth";

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

const indeksHalaman: ItemIndeks[] = [
  { id: "tentang", nomor: "01", label: "Kenapa" },
  { id: "features", nomor: "02", label: "Isi map" },
  { id: "how-it-works", nomor: "03", label: "Alur" },
  { id: "explore", nomor: "04", label: "Kelas" },
  { id: "broadcast", nomor: "05", label: "Kabar" },
  { id: "faq", nomor: "06", label: "Tanya" },
  { id: "gabung", nomor: "07", label: "Gabung" },
];

const fitur: FiturLanding[] = [
  {
    jenis: "materi",
    kode: "01 / Materi",
    judul: "Satu map, semua materi.",
    deskripsi:
      "PDF, video, tautan, dan catatan tersusun per mata kuliah. Tinggal buka, bukan scroll chat minggu lalu.",
  },
  {
    jenis: "jadwal",
    kode: "02 / Jadwal",
    judul: "Tahu harus ke mana.",
    deskripsi:
      "Jadwal mingguan dengan waktu, ruang, dan PJ. Perubahan langsung terlihat oleh semua anggota.",
  },
  {
    jenis: "pengingat",
    kode: "03 / Pengingat",
    judul: "Deadline ikut ingat.",
    deskripsi:
      "Notifikasi PWA datang 3 hari dan 1 hari sebelum tenggat. Nggak perlu saling tag di grup.",
  },
];

const langkah: LangkahLanding[] = [
  {
    nomor: "01",
    label: "Gabung",
    judul: "Buat atau gabung",
    deskripsi: "Bikin kelas baru, masuk lewat kode undangan, atau pilih kelas terbuka.",
  },
  {
    nomor: "02",
    label: "Susun",
    judul: "Susun bareng pengurus",
    deskripsi: "Admin menambah mata kuliah dan menunjuk PJ. PJ mengisi materi, jadwal, dan tugas.",
  },
  {
    nomor: "03",
    label: "Ingat",
    judul: "Biarkan pengingat jalan",
    deskripsi: "Anggota dapat notifikasi PWA 3 hari dan 1 hari sebelum deadline.",
  },
];

/**
 * Enam kelas contoh untuk pita "Jelajahi semua kelas". Isinya sengaja
 * mengikuti data contoh kelas supaya bahasa dan angkanya konsisten.
 */
const kelasPilihan: KelasPilihan[] = [
  {
    nomor: "01",
    kode: "ALG-302",
    anggota: 46,
    judul: "Algoritma & Struktur Data",
    deskripsi: "Slide kuliah, catatan graf, dan jadwal praktikum mingguan.",
    warna: "manila",
    berkas: [
      { jenis: "Materi", judul: "Graf & BFS", meta: "12 slide · PDF", href: "/classes" },
      { jenis: "Tugas", judul: "Praktikum 04", meta: "Besok, 23.59", href: "/classes" },
      {
        jenis: "Jadwal",
        judul: "Praktikum mingguan",
        meta: "Rabu, 10.00 · Lab 3",
        href: "/classes",
      },
    ],
  },
  {
    nomor: "02",
    kode: "BD-301",
    anggota: 42,
    judul: "Basis Data Lanjut",
    deskripsi: "Normalisasi, indeks, dan kuis mingguan. PJ: Nadia Putri.",
    warna: "manila",
    berkas: [
      { jenis: "Materi", judul: "B-Tree Indexing", meta: "18 halaman · PDF", href: "/classes" },
      { jenis: "Tugas", judul: "Normalisasi", meta: "Jumat, 23.59", href: "/classes" },
      {
        jenis: "Jadwal",
        judul: "Kelas mingguan",
        meta: "Jumat, 13.00 · Ruang 2.4",
        href: "/classes",
      },
    ],
  },
  {
    nomor: "03",
    kode: "WEB-204",
    anggota: 38,
    judul: "Pemrograman Web",
    deskripsi: "Modul praktikum, repo contoh, dan rekaman sesi sepanjang semester.",
    warna: "lilac",
    berkas: [
      { jenis: "Materi", judul: "Modul 05", meta: "6 berkas · repo", href: "/classes" },
      { jenis: "Tugas", judul: "Landing page", meta: "Minggu, 23.59", href: "/classes" },
      { jenis: "Jadwal", judul: "Praktikum", meta: "Selasa, 08.00 · Lab 1", href: "/classes" },
    ],
  },
  {
    nomor: "04",
    kode: "JAR-205",
    anggota: 40,
    judul: "Jaringan Komputer",
    deskripsi: "Catatan subnetting, modul responsi, dan jadwal praktikum.",
    warna: "lilac",
    berkas: [
      { jenis: "Materi", judul: "Subnetting", meta: "9 halaman · PDF", href: "/classes" },
      { jenis: "Tugas", judul: "Latihan 03", meta: "Kamis, 20.00", href: "/classes" },
      { jenis: "Jadwal", judul: "Responsi", meta: "Jumat, 15.00 · Lab 2", href: "/classes" },
    ],
  },
  {
    nomor: "05",
    kode: "SO-303",
    anggota: 44,
    judul: "Sistem Operasi",
    deskripsi: "Silabus, materi penjadwalan proses, dan kumpulan latihan UTS.",
    warna: "green",
    berkas: [
      { jenis: "Materi", judul: "Scheduling", meta: "14 slide · PDF", href: "/classes" },
      { jenis: "Tugas", judul: "Shell 02", meta: "Sabtu, 23.59", href: "/classes" },
      { jenis: "Jadwal", judul: "Kelas", meta: "Kamis, 09.00 · Ruang 3.1", href: "/classes" },
    ],
  },
  {
    nomor: "06",
    kode: "IMK-206",
    anggota: 36,
    judul: "Interaksi Manusia & Komputer",
    deskripsi: "Slide perancangan, tautan Figma kelas, dan rubrik tugas besar.",
    warna: "green",
    berkas: [
      { jenis: "Materi", judul: "Wireframe", meta: "21 slide · Figma", href: "/classes" },
      { jenis: "Tugas", judul: "Studi kasus", meta: "Senin, 23.59", href: "/classes" },
      { jenis: "Jadwal", judul: "Kelas", meta: "Senin, 11.00 · Ruang 4.2", href: "/classes" },
    ],
  },
];

const siaran: SiaranLanding[] = [
  {
    varian: "warning",
    label: "Penting",
    judul: "Tugas Normalisasi",
    pesan: "Basis Data Lanjut · kurang dari 24 jam. Kumpulkan di portal tugas.",
    sumber: "Admin BD-301",
  },
  {
    varian: "info",
    label: "Info",
    judul: "Kuliah tamu: AI-Native",
    pesan: "Sabtu, 28 Nov · Auditorium Utama. Terbuka untuk seluruh angkatan.",
    sumber: "Aliansi Fasilkom",
  },
  {
    varian: "success",
    label: "Baru",
    judul: "Slide Pertemuan 5 terbit",
    pesan: "B-Tree Indexing dan Query Optimization sudah bisa diunduh di tab materi.",
    sumber: "PJ Nadia Putri",
  },
];

const faq: FaqLanding[] = [
  {
    tanya: "Klass cuma untuk kelas kuliah?",
    jawab:
      "Nggak. Kelas kuliah, organisasi, klub, dan komunitas bisa punya ruang sendiri, dikelola langsung oleh anggotanya.",
  },
  {
    tanya: "Siapa yang mengelola kelas?",
    jawab:
      "Admin kelas mengatur anggota, tampilan, dan pengaturan. PJ mengurus materi, jadwal, dan tugas di mata kuliahnya.",
  },
  {
    tanya: "Apakah harus punya akun?",
    jawab:
      "Iya. Akun dipakai untuk bergabung, menyimpan progres, dan menerima pengingat. Tanpa akun, halaman kelas hanya bisa dilihat sebagai contoh.",
  },
  {
    tanya: "Pengingatnya dikirim ke mana?",
    jawab:
      "Lewat notifikasi PWA di perangkat yang sudah mengizinkan. Klass mengingatkan 3 hari dan 1 hari sebelum deadline.",
  },
  {
    tanya: "Bisa dipakai tanpa install?",
    jawab:
      "Bisa. Klass berjalan di browser. Kalau mau, tambahkan ke layar utama sebagai PWA supaya lebih cepat dibuka.",
  },
];

const tautanFooter = [
  { label: "Kenapa", href: "#tentang" },
  { label: "Fitur", href: "#features" },
  { label: "Kelas", href: "#explore" },
  { label: "Kabar", href: "#broadcast" },
  { label: "Tanya", href: "#faq" },
];

/**
 * Halaman utama (F11) — `/`.
 *
 * Hero dipertahankan; semua section di bawahnya memakai arah "Buka Mapnya":
 * halaman terasa seperti isi satu map kelas, dengan pembatas bab, pita meja
 * untuk jelajah kelas, papan pengumuman, dan surat undangan di penutup.
 *
 * Halaman ini statis (Server Component). Interaksi hanya ada di dua tempat:
 * indeks map di tepi kanan dan buka/tutup map kelas.
 */
export default function HalamanUtama() {
  return (
    <>
      <Suspense
        fallback={
          <Navbar merek="Klass" item={navigasi} aksi={{ label: "Masuk", href: "/login" }} />
        }
      >
        <NavbarLanding />
      </Suspense>

      <main id="top" className="ds-kolom landing-main">
        <Hero
          judul="Klass — platform komunitas kelas dan kelompok mandiri"
          lencana={lencanaHero}
          aksi={[
            { label: "Temukan kelasmu ↗", href: "#explore" },
            { label: "Ajukan kelas baru", href: "/classes" },
          ]}
        />

        <IndeksMap item={indeksHalaman} />

        <Manifesto />
        <IsiMap fitur={fitur} />
        <AlurArsip langkah={langkah} />
        <PetaKelas kelas={kelasPilihan} />
        <PapanKabar siaran={siaran} />
        <TanyaJawab faq={faq} />
        <SuratAjakan />
      </main>

      <Footer
        className="landing-footer"
        tagline="Satu tempat rapi untuk materi, jadwal, dan tugas kelas yang dikelola bersama."
        tautan={tautanFooter}
        hakCipta="© 2026 Klass · Komunitas Kelas"
        lencana="Paper & Folder Edition"
      />
    </>
  );
}

/**
 * Navbar halaman utama. Dibaca terpisah di dalam `<Suspense>` supaya sisa
 * halaman tetap bisa diprerender walau sesi butuh cookie.
 */
async function NavbarLanding() {
  const pengguna = await ambilSesiSaya();

  return (
    <Navbar
      merek="Klass"
      item={navigasi}
      aksi={pengguna ? { label: "Meja", href: "/dashboard" } : { label: "Masuk", href: "/login" }}
      pengguna={pengguna ? { name: pengguna.name, image: pengguna.image } : null}
    />
  );
}
