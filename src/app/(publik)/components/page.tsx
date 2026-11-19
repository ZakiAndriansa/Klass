import type { Metadata } from "next";

import { DemoInteraktif } from "./demo-interaktif";

import { Accordion } from "@/components/shared/accordion";
import { Alert } from "@/components/shared/alert";
import { AjakanBergabung } from "@/components/shared/ajakan-bergabung";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Feed } from "@/components/shared/feed";
import { Footer } from "@/components/shared/footer";
import {
  FormStack,
  Field,
  FieldError,
  FieldGroup,
  FieldHint,
  FieldInput,
  FieldLabel,
  FieldSelect,
  FieldTextarea,
  Checkbox,
  Radio,
  Toggle,
  ToggleRow,
} from "@/components/shared/form";
import { Hero } from "@/components/shared/hero";
import { GridKartu, KartuCatatan, KartuFolder, KartuKertas } from "@/components/shared/kartu";
import { GridFitur, KartuFitur } from "@/components/shared/kartu-fitur";
import { DaftarLangkah } from "@/components/shared/langkah";
import { Lencana } from "@/components/shared/lencana";
import { Navbar } from "@/components/shared/navbar";
import { Pagination } from "@/components/shared/pagination";
import { Poster } from "@/components/shared/poster";
import { Section, SectionHead, SectionInner } from "@/components/shared/section";
import { InkLink, SectionHeading } from "@/components/shared/section-heading";
import { Tabs } from "@/components/shared/tabs";
import { Tooltip } from "@/components/shared/tooltip";
import { TombolKertas } from "@/components/shared/tombol-kertas";

export const metadata: Metadata = {
  title: { absolute: "Komponen — Design System Klass" },
  description:
    "Galeri seluruh komponen dan gaya design system Klass: tombol, kartu, formulir, feed, dialog, toast, dan lainnya.",
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
  {
    tanya: "Bagaimana cara menerima pengingat tugas di HP?",
    jawab:
      "Pasang Klass sebagai PWA ke layar utama ponsel, lalu aktifkan izin notifikasi Web Push pada halaman Pengaturan.",
  },
];

const tautanFooter = [
  { label: "Jelajah", href: "#explore" },
  { label: "Fitur", href: "#features" },
  { label: "Cara kerja", href: "#how-it-works" },
  { label: "Tanya jawab", href: "#faq" },
];

/**
 * Galeri komponen design system Klass, alamat `/components`.
 *
 * Halaman ini adalah ruang uji seluruh komponen dan gayanya: hero, kartu,
 * langkah, feed, poster, formulir, tab, dialog, toast, hingga navigasi.
 * Halaman utama (`/`) memakai komponen yang sama untuk menyusun landing page
 * sungguhan; halaman ini yang menampilkan seluruh variannya.
 */
export default function HalamanKomponen() {
  return (
    <>
      <Navbar
        merek="Klass"
        item={navigasi.map((item) => ({ ...item, href: `/${item.href}` }))}
        aksi={{ label: "Ajukan kelas", href: "#request" }}
      />

      <main id="top" className="ds-kolom">
        <Hero
          judul="Klass — platform komunitas kelas dan kelompok mandiri"
          lencana={lencanaHero}
          aksi={[
            { label: "Temukan kelasmu ↗", href: "#explore" },
            { label: "Ajukan kelas baru", href: "#request" },
          ]}
        />

        <Section>
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

        <Section id="features">
          <SectionInner>
            <SectionHead judul="Lebih sedikit tercecer. Lebih banyak teratur." />
            <GridFitur>
              {fitur.map((item) => (
                <KartuFitur key={item.nomor} {...item} />
              ))}
            </GridFitur>
          </SectionInner>
        </Section>

        <Section id="how-it-works">
          <SectionInner>
            <SectionHeading
              varian="polos"
              eyebrow="Bagaimana cara kerjanya?"
              judul="Tiga langkah, langsung jalan"
            />
            <DaftarLangkah langkah={langkah} />
          </SectionInner>
        </Section>

        <Section id="explore">
          <SectionInner>
            <SectionHeading
              eyebrow="semester ganjil 2026"
              judul="Jelajah kelas pilihan"
              subjudul="Semua materi, jadwal mingguan, dan pengingat tugas dikelola langsung oleh PJ masing-masing."
            />
            <GridKartu>
              <KartuFolder
                meta="19 Mar 2026"
                judul="Algoritma & Struktur Data"
                deskripsi="Kumpulan slide kuliah, catatan graf, dan jadwal praktikum mingguan kelas IF-24A."
              />
              <KartuFolder
                warna="lilac"
                meta="19 Mar 2026"
                judul="Basis Data Lanjut"
                deskripsi="PJ: Nadia Putri. Tugas normalisasi dikumpulkan paling lambat Jumat pukul 23.59."
              />
              <KartuFolder
                warna="green"
                meta="19 Mar 2026"
                judul="Pemrograman Web"
                deskripsi="Modul praktikum, repo contoh, dan rekaman sesi kelas sepanjang semester."
              />
              <KartuCatatan
                inisial="NP"
                penulis="Nadia Putri"
                peran="PJ Basis Data"
                isi="Ruang kuliah minggu ini pindah ke Lab Komputer 3 karena proyektor di ruang 204 sedang diperbaiki."
                lencana="1 Pengumuman"
              />
              <KartuKertas
                lencana={{ label: "Deadline Besok", varian: "warning" }}
                kode="TUGAS #04"
                judul="Makalah Sistem Operasi"
                deskripsi="Bahas perbandingan penjadwalan proses Linux CFS dan Windows Thread Scheduler."
                aksi={
                  <>
                    <TombolKertas variant="primary" size="sm">
                      Buka Detail
                    </TombolKertas>
                    <TombolKertas variant="ghost" size="sm">
                      Tandai Selesai
                    </TombolKertas>
                  </>
                }
              />
            </GridKartu>
            <div className="komponen-jarak-atas">
              <InkLink href="#explore">
                <span>Lihat semua arsip materi</span>
                <span aria-hidden="true">↗</span>
              </InkLink>
            </div>
          </SectionInner>
        </Section>

        <Section>
          <SectionInner>
            <Feed
              eyebrow="jaringan antar-kelas"
              judul="Siaran Komunitas Terkini"
              intro="Informasi lintas kelas disiarkan satu arah oleh admin kelas tanpa perlu membuat grup chat baru berulang kali."
              siaran={siaran}
            />
          </SectionInner>
        </Section>

        <Section>
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
              aksi={{ label: "Lihat agenda ↗", href: "#showcase" }}
            />
          </SectionInner>
        </Section>

        <Section id="showcase">
          <SectionInner>
            <SectionHeading
              eyebrow="komponen"
              judul="Blok bangunan Klass"
              subjudul="Tombol, lencana, dan kontrol yang menyusun halaman ini — semua dari design system yang sama."
            />

            <div className="komponen-tumpuk">
              <div className="btn-group">
                <TombolKertas variant="primary">Gabung Kelas</TombolKertas>
                <TombolKertas variant="secondary">Lihat Jadwal</TombolKertas>
                <TombolKertas variant="ghost">Batal</TombolKertas>
                <TombolKertas variant="danger">Hapus Tugas</TombolKertas>
              </div>

              <div className="btn-group">
                <TombolKertas variant="primary" size="sm">
                  Kecil
                </TombolKertas>
                <TombolKertas variant="primary" size="md">
                  Sedang
                </TombolKertas>
                <TombolKertas variant="primary" size="lg">
                  Besar
                </TombolKertas>
                <TombolKertas variant="primary" size="pill">
                  Pill CTA
                </TombolKertas>
              </div>

              <div className="btn-group">
                <TombolKertas variant="primary">
                  <svg
                    className="btn__icon"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                  </svg>
                  <span>Catatan Baru</span>
                </TombolKertas>
                <TombolKertas variant="secondary" disabled>
                  Nonaktif
                </TombolKertas>
                <TombolKertas variant="primary" sedangMemproses>
                  Menyimpan...
                </TombolKertas>
                <Tooltip teks="Kode undangan berlaku 7 hari">
                  <TombolKertas variant="ghost">Arahkan / Fokus (Tooltip)</TombolKertas>
                </Tooltip>
              </div>

              <div className="badge-row">
                <Lencana>Default</Lencana>
                <Lencana variant="primary">Admin Kelas</Lencana>
                <Lencana variant="info">PJ Matkul</Lencana>
                <Lencana variant="success">Terkumpul</Lencana>
                <Lencana variant="warning">Besok Deadline</Lencana>
                <Lencana variant="error">Terlewat</Lencana>
              </div>
            </div>
          </SectionInner>
        </Section>

        <Section id="form">
          <SectionInner>
            <SectionHeading
              eyebrow="formulir"
              judul="Ajukan kelas baru"
              subjudul="Isi datanya sekali. Pengurus bisa mengubahnya kapan saja setelah kelas jadi."
            />
            <FormStack>
              <Field>
                <FieldLabel htmlFor="demo-nama">Nama Kelas</FieldLabel>
                <FieldInput
                  id="demo-nama"
                  type="text"
                  placeholder="Contoh: Informatika 2024 A"
                  defaultValue="Informatika 2024 A"
                />
                <FieldHint>Nama ini akan tampil di halaman jelajah kelas.</FieldHint>
              </Field>

              <Field salah>
                <FieldLabel htmlFor="demo-slug">Slug URL Kelas</FieldLabel>
                <FieldInput
                  id="demo-slug"
                  type="text"
                  defaultValue="if 24!"
                  aria-invalid="true"
                  aria-describedby="demo-slug-err"
                />
                <FieldError id="demo-slug-err">
                  Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).
                </FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="demo-kode">Kode Undangan (Nonaktif)</FieldLabel>
                <FieldInput id="demo-kode" type="text" defaultValue="KLASS-2026" disabled />
              </Field>

              <Field>
                <FieldLabel htmlFor="demo-jenis">Jenis Kelompok</FieldLabel>
                <FieldSelect id="demo-jenis" defaultValue="kuliah">
                  <option value="kuliah">Kelas Kuliah</option>
                  <option value="org">Organisasi / Himpunan</option>
                  <option value="komunitas">Komunitas Belajar</option>
                </FieldSelect>
              </Field>

              <Field>
                <FieldLabel htmlFor="demo-desc">Deskripsi Singkat</FieldLabel>
                <FieldTextarea
                  id="demo-desc"
                  rows={3}
                  placeholder="Tuliskan tujuan kelas dan aturan ringkas..."
                />
              </Field>

              <FieldGroup>
                <legend className="field__label">Opsi Keanggotaan</legend>
                <Checkbox label="Tampilkan di halaman Jelajah Kelas" defaultChecked />
                <Checkbox label="Batasi maksimal 60 anggota" />
              </FieldGroup>

              <FieldGroup>
                <legend className="field__label">Pengingat Deadline</legend>
                <Radio
                  name="pengingat"
                  value="3d"
                  label="3 hari & 1 hari sebelum deadline"
                  defaultChecked
                />
                <Radio name="pengingat" value="1d" label="Hanya 1 hari sebelum deadline" />
              </FieldGroup>

              <ToggleRow>
                <Toggle id="demo-push" label="Aktifkan notifikasi Web Push (PWA)" defaultChecked />
              </ToggleRow>
            </FormStack>
          </SectionInner>
        </Section>

        <Section id="faq">
          <SectionInner>
            <SectionHeading
              eyebrow="cara pakai"
              judul="Subkelas, jadwal, dan tugas"
              subjudul="Contoh tab yang memisahkan isi tiap subkelas."
            />

            <div className="komponen-tumpuk komponen-tumpuk--lebar">
              <Tabs
                label="Menu subkelas"
                item={[
                  {
                    label: "Materi",
                    isi: "Slide Pertemuan 1–4 tersedia dalam format PDF dan tautan video rekaman kelas.",
                  },
                  {
                    label: "Jadwal",
                    isi: "Setiap Selasa, 08:00–10:30 WIB di Gedung Kuliah Bersama Ruang 302.",
                  },
                  {
                    label: "Tugas",
                    isi: "2 tugas aktif: Analisis Kompleksitas (Jumat) dan Latihan Graph BFS/DFS (Minggu depan).",
                  },
                ]}
              />

              <div>
                <SectionHeading
                  varian="polos"
                  judul="Masih penasaran?"
                  subjudul="Sedikit jawaban sebelum mulai."
                />
                <Accordion item={faq} />
              </div>
            </div>
          </SectionInner>
        </Section>

        <Section id="demo">
          <SectionInner>
            <SectionHeading
              eyebrow="contoh interaksi"
              judul="Dialog, notifikasi, dan pesan"
              subjudul="Komponen overlay yang dipakai untuk aksi penting dan umpan balik."
            />

            <div className="komponen-tumpuk">
              <DemoInteraktif />

              <div className="alert-stack">
                <Alert
                  varian="info"
                  judul="Info Jadwal"
                  pesan="Jadwal kuliah Algoritma minggu depan digeser ke pukul 09.00 WIB."
                />
                <Alert
                  varian="sukses"
                  judul="Berhasil Disimpan"
                  pesan="Materi Pertemuan 5 sudah tersedia untuk seluruh anggota kelas."
                />
                <Alert
                  varian="peringatan"
                  judul="Pengingat Deadline"
                  pesan="Tugas Basis Data harus dikumpulkan kurang dari 24 jam lagi."
                />
                <Alert
                  varian="error"
                  judul="Gagal Mengunggah"
                  pesan="Ukuran berkas melebihi batas maksimal 10 MB. Silakan kompres terlebih dahulu."
                />
              </div>
            </div>
          </SectionInner>
        </Section>

        <Section id="request">
          <AjakanBergabung
            judul="Kelas rapi dimulai dari kamu."
            salinan="Bawa teman-temanmu. Sisanya, kita rapikan bareng."
            aksi={{ label: "Ajukan kelas baru ↗", href: "#form" }}
          />
        </Section>

        <Section rapatAtas>
          <SectionInner>
            <Breadcrumb
              remah={[
                { label: "Beranda", href: "#top" },
                { label: "IF-24A", href: "#explore" },
                { label: "Basis Data" },
              ]}
            />
            <Pagination
              halaman={[1, 2, 3, "jeda", 8]}
              aktif={1}
              // Halaman ini belum punya daftar berhalaman sungguhan, jadi semua
              // nomor menuju bagian jelajah kelas. Halaman fitur nanti mengirim
              // `hrefHalaman` yang sebenarnya.
              hrefHalaman={() => "#explore"}
              hrefSebelumnya="#explore"
              hrefBerikutnya="#explore"
            />
          </SectionInner>
        </Section>
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
