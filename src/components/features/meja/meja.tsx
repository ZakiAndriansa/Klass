import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { TautanTombolKertas } from "@/components/shared/tombol-kertas";

import { AgendaHariIni, PitaMinggu } from "./agenda";
import type { MejaData } from "./data-contoh";
import { FormMasukKelas } from "./form-masuk-kelas";
import { FormPengajuanKelas } from "./form-pengajuan-kelas";
import { KabarKelas, PerluPerhatian, StripPengajuan, TabMapKelas } from "./kolom-kanan";

/**
 * Meja: ruang hari ini milik satu pengguna.
 *
 * Isinya hanya pekerjaan yang tidak bisa dijawab halaman lain: agenda lintas
 * kelas. Katalog kelas tetap di `/classes`, riwayat pengajuan tetap di
 * `/profile`, dan isi tiap kelas tetap di beranda kelasnya.
 *
 * Dua keadaan yang sengaja dibedakan:
 *
 *   belum punya kelas   halaman ini menjadi onboarding: masuk lewat kode
 *                       undangan atau ajukan kelas baru
 *   sudah punya kelas   halaman ini menjadi agenda, dan formulir pindah ke
 *                       balik tombol supaya tidak memakan layar pertama
 */
export function Meja({ data, nama }: { data: MejaData; nama: string }) {
  const punyaKelas = data.kelas.length > 0;

  if (!punyaKelas) {
    return <Onboarding nama={nama} />;
  }

  const jumlahSesi = data.agenda.filter((item) => item.jenis === "sesi").length;
  const jumlahTugas = data.agenda.filter((item) => item.jenis === "tugas").length;

  return (
    <div className="meja">
      <header className="meja-kepala">
        <span className="meja-eyebrow">
          <CalendarDays size={12} strokeWidth={2.4} aria-hidden="true" />
          Meja · {data.tanggal}
        </span>
        <h1 className="meja-judul">Hari ini</h1>
        <p className="meja-rekap">
          {jumlahSesi > 0 ? `${jumlahSesi} sesi` : "Tidak ada sesi"}
          {" · "}
          {jumlahTugas > 0 ? `${jumlahTugas} tenggat` : "tidak ada tenggat"}
          {" · "}
          {data.kabar.length > 0 ? `${data.kabar.length} kabar baru` : "tidak ada kabar baru"}
        </p>

        <div className="meja-kepala__aksi">
          <TautanTombolKertas href="/dashboard#gabung-kelas" variant="primary" size="sm">
            <Plus size={14} strokeWidth={2.4} aria-hidden="true" />
            Gabung kelas
          </TautanTombolKertas>
          <TautanTombolKertas href="/classes" variant="secondary" size="sm">
            Semua kelas
          </TautanTombolKertas>
        </div>
      </header>

      <StripPengajuan item={data.pengajuan} />

      <div className="meja-kolom">
        <div className="meja-kolom__utama">
          <AgendaHariIni agenda={data.agenda} />
          <PitaMinggu minggu={data.minggu} />

          <section className="meja-gabung" id="gabung-kelas" aria-labelledby="meja-gabung-judul">
            <div className="meja-gabung__teks">
              <h2 className="meja-gabung__judul" id="meja-gabung-judul">
                Punya kode undangan?
              </h2>
              <p className="meja-gabung__ket">
                Masuk ke kelas lain tanpa menunggu persetujuan. Minta kodenya ke admin kelas.
              </p>
            </div>
            <FormMasukKelas />
          </section>
        </div>

        <div className="meja-kolom__sisi">
          <PerluPerhatian item={data.perhatian} />
          <TabMapKelas kelas={data.kelas.slice(0, 4)} total={data.kelas.length} />
          <KabarKelas item={data.kabar} />
        </div>
      </div>
    </div>
  );
}

/**
 * Keadaan "belum punya kelas".
 *
 * Inilah tampilan utama pengguna baru, jadi ia mendapat perhatian penuh:
 * satu aksi utama (masuk dengan kode), satu aksi sekunder (ajukan kelas), dan
 * penjelasan singkat isi kelas. Setelah punya kelas, formulir pengajuan tidak
 * lagi memakan layar pertama — ia pindah ke balik tautan di bagian bawah.
 */
function Onboarding({ nama }: { nama: string }) {
  return (
    <div className="meja">
      <header className="meja-kepala">
        <span className="meja-eyebrow">
          <CalendarDays size={12} strokeWidth={2.4} aria-hidden="true" />
          Meja · belum ada kelas
        </span>
        <h1 className="meja-judul">Mulai dari satu kelas.</h1>
        <p className="meja-rekap meja-rekap--panjang">
          {nama}, meja ini masih kosong. Masuk ke kelas yang sudah ada lewat kode undangan, atau
          ajukan ruang baru untuk komunitasmu sendiri.
        </p>
      </header>

      <div className="meja-kolom meja-kolom--onboarding">
        <section className="meja-langkah meja-langkah--utama" aria-labelledby="onboarding-gabung">
          <span className="meja-langkah__nomor">01</span>
          <h2 className="meja-langkah__judul" id="onboarding-gabung">
            Masuk dengan kode undangan
          </h2>
          <p className="meja-langkah__ket">
            Cara tercepat. Kamu langsung menjadi anggota, tanpa menunggu persetujuan siapa pun.
          </p>
          <FormMasukKelas />
        </section>

        <section className="meja-langkah" aria-labelledby="onboarding-ajukan">
          <span className="meja-langkah__nomor">02</span>
          <h2 className="meja-langkah__judul" id="onboarding-ajukan">
            Ajukan kelas baru
          </h2>
          <p className="meja-langkah__ket">
            Diajukan sekali, ditinjau superadmin. Kalau disetujui, kamu menjadi admin kelas itu.
          </p>
          <FormPengajuanKelas />
        </section>
      </div>

      <section className="meja-isi-kelas" aria-labelledby="onboarding-isi">
        <h2 className="meja-isi-kelas__judul" id="onboarding-isi">
          Setelah masuk, apa yang ada di dalam kelas?
        </h2>
        <ul className="meja-isi-kelas__daftar">
          <li>
            <strong>Materi</strong>
            Slide, PDF, tautan, dan catatan tersusun per mata kuliah.
          </li>
          <li>
            <strong>Jadwal</strong>
            Sesi mingguan dengan jam, ruang, dan PJ yang bisa dihubungi.
          </li>
          <li>
            <strong>Tugas</strong>
            Tenggat dengan pengingat, dan papan progres pribadimu.
          </li>
        </ul>
        <p className="meja-isi-kelas__kaki">
          Belum yakin harus mulai dari mana? <Link href="/classes">Lihat kelas yang tersedia</Link>.
        </p>
      </section>
    </div>
  );
}
