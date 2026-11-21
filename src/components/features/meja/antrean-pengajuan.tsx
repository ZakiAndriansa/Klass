"use client";

import { useMemo, useState } from "react";

import { Dialog } from "@/components/shared/dialog";
import { Field, FieldError, FieldLabel, FieldTextarea } from "@/components/shared/form";
import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";
import { cn } from "@/lib/utils";

import type { AntreanPengajuan } from "./data-contoh";

/**
 * Antrean pengajuan kelas di Loket superadmin.
 *
 * Berbeda dari tabel lama yang mencampur status: di sini hanya pengajuan yang
 * benar-benar menunggu. Keputusan yang sudah diambil pindah ke arsip, jadi
 * antrean tetap pendek dan bisa dibaca sekali lihat.
 *
 * Aturan keputusan:
 * - "Setujui" satu klik, karena hasilnya bisa diurungkan;
 * - "Tolak" wajib beralasan, karena alasan itu yang dibaca pengaju. Formulir
 *   lama tidak pernah memintanya, padahal model data sudah menyimpan kolomnya.
 *
 * TODO(api): ganti `putuskan` dengan controller pengajuan, lalu segarkan
 * antrean dari server. Undo hanya berlaku di layar sampai endpoint tersedia.
 */
const ALASAN_CEPAT = [
  "Nama terlalu mirip kelas yang sudah ada",
  "Deskripsi kurang jelas",
  "Duplikat pengajuan sebelumnya",
];

function labelUmur(jam: number): string {
  if (jam < 24) return `${jam} jam`;
  return `${Math.floor(jam / 24)} hari`;
}

export function AntreanPengajuan({ awal }: { awal: AntreanPengajuan[] }) {
  const [daftar, setDaftar] = useState(awal);
  const [ditolak, setDitolak] = useState<AntreanPengajuan | null>(null);
  const [alasan, setAlasan] = useState("");
  const [salah, setSalah] = useState(false);
  const [urungkan, setUrungkan] = useState<AntreanPengajuan | null>(null);
  const { daftar: toast, tampilkan, tutup } = useToast();

  const tertua = useMemo(
    () => daftar.reduce((maks, baris) => Math.max(maks, baris.umurJam), 0),
    [daftar],
  );

  function setujui(baris: AntreanPengajuan) {
    setDaftar((lama) => lama.filter((item) => item.id !== baris.id));
    setUrungkan(baris);
    tampilkan(`"${baris.kelas}" disetujui. ${baris.pengaju} menjadi admin kelas.`, "sukses");
  }

  function bukaPenolakan(baris: AntreanPengajuan) {
    setDitolak(baris);
    setAlasan("");
    setSalah(false);
  }

  function kirimPenolakan() {
    if (!ditolak) return;

    if (!alasan.trim()) {
      setSalah(true);
      return;
    }

    setDaftar((lama) => lama.filter((item) => item.id !== ditolak.id));
    tampilkan(`"${ditolak.kelas}" ditolak. Alasan dikirim ke ${ditolak.pengaju}.`, "info");
    setDitolak(null);
    setAlasan("");
  }

  function batalkanUrungkan() {
    if (!urungkan) return;
    setDaftar((lama) => [urungkan, ...lama]);
    setUrungkan(null);
    tampilkan("Persetujuan dibatalkan.", "info");
  }

  return (
    <>
      <header className="loket-kepala">
        <span className="meja-eyebrow">Loket · pengajuan kelas</span>
        <h1 className="meja-judul">Antrean</h1>
        <p className="loket-rekap">
          {daftar.length > 0 ? (
            <>
              <strong>{daftar.length}</strong> menunggu · tertua{" "}
              <strong className={cn(tertua > 48 && "loket-rekap__telat")}>
                {labelUmur(tertua)}
              </strong>
            </>
          ) : (
            "Tidak ada pengajuan menunggu."
          )}
        </p>
      </header>

      {daftar.length > 0 ? (
        <ol className="loket-antrean">
          {daftar.map((baris) => (
            <li key={baris.id} className="loket-kartu">
              <div className="loket-kartu__kepala">
                <div className="loket-kartu__judul-grup">
                  <h2 className="loket-kartu__judul">{baris.kelas}</h2>
                  <p className="loket-kartu__sub">{baris.jenis}</p>
                </div>
                <span className={cn("loket-umur", baris.umurJam > 48 && "loket-umur--telat")}>
                  menunggu {labelUmur(baris.umurJam)}
                </span>
              </div>

              <p className="loket-kartu__deskripsi">{baris.deskripsi}</p>

              <dl className="loket-kartu__fakta">
                <div>
                  <dt>Pengaju</dt>
                  <dd>{baris.pengaju}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd className="loket-kartu__email">{baris.email}</dd>
                </div>
                <div>
                  <dt>Akun</dt>
                  <dd>{baris.akunSejak}</dd>
                </div>
                <div>
                  <dt>Kelas lain</dt>
                  <dd>{baris.jumlahKelas}</dd>
                </div>
              </dl>

              {baris.sinyal.length > 0 ? (
                <ul className="loket-sinyal">
                  {baris.sinyal.map((sinyal) => (
                    <li
                      key={sinyal.teks}
                      className={cn(
                        "loket-sinyal__item",
                        sinyal.nada === "waspada" && "loket-sinyal__item--waspada",
                      )}
                    >
                      {sinyal.teks}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="loket-kartu__aksi">
                <TombolKertas variant="primary" size="sm" onClick={() => setujui(baris)}>
                  Setujui
                </TombolKertas>
                <TombolKertas variant="ghost" size="sm" onClick={() => bukaPenolakan(baris)}>
                  Tolak
                </TombolKertas>
                <span className="loket-kartu__tanggal">diajukan {baris.diajukan}</span>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="loket-bersih">
          <span className="loket-bersih__cap" aria-hidden="true">
            Bersih
          </span>
          <p className="loket-bersih__pesan">Tidak ada pengajuan menunggu.</p>
          <p className="loket-bersih__meta">
            Keputusan yang sudah diambil ada di arsip, dan bisa dicari kapan saja.
          </p>
        </div>
      )}

      {urungkan ? (
        <div className="loket-undo" role="status">
          <span>
            <strong>{urungkan.kelas}</strong> disetujui.
          </span>
          <TombolKertas variant="ghost" size="sm" onClick={batalkanUrungkan}>
            Urungkan
          </TombolKertas>
          <TombolKertas variant="ghost" size="sm" onClick={() => setUrungkan(null)}>
            Tutup
          </TombolKertas>
        </div>
      ) : null}

      <Dialog
        terbuka={ditolak !== null}
        saatTutup={() => setDitolak(null)}
        judul={ditolak ? `Tolak "${ditolak.kelas}"` : "Tolak pengajuan"}
        footer={
          <>
            <TombolKertas variant="secondary" size="sm" onClick={() => setDitolak(null)}>
              Batal
            </TombolKertas>
            <TombolKertas variant="danger" size="sm" onClick={kirimPenolakan}>
              Tolak pengajuan
            </TombolKertas>
          </>
        }
      >
        <p className="loket-dialog__ket">
          Alasan ini yang dibaca pengaju, jadi tuliskan yang bisa ditindaklanjuti. Contoh: nama
          kelas perlu dibedakan dari kelas yang sudah ada.
        </p>

        <Field salah={salah}>
          <FieldLabel htmlFor="alasan-tolak">Alasan penolakan</FieldLabel>
          <FieldTextarea
            id="alasan-tolak"
            rows={3}
            value={alasan}
            onChange={(e) => {
              setAlasan(e.target.value);
              if (salah) setSalah(false);
            }}
            placeholder="Tuliskan alasan yang jelas..."
            aria-invalid={salah || undefined}
            aria-describedby={salah ? "alasan-tolak-err" : undefined}
          />
          {salah ? (
            <FieldError id="alasan-tolak-err">
              Alasan wajib diisi supaya pengaju tahu apa yang harus diperbaiki.
            </FieldError>
          ) : null}
        </Field>

        <div className="loket-dialog__cepat">
          <span className="loket-dialog__cepat-label">Pilihan cepat</span>
          <div className="loket-dialog__cepat-daftar">
            {ALASAN_CEPAT.map((teks) => (
              <button
                key={teks}
                type="button"
                className="loket-dialog__chip"
                onClick={() => {
                  setAlasan(teks);
                  setSalah(false);
                }}
              >
                {teks}
              </button>
            ))}
          </div>
        </div>
      </Dialog>

      <ToastRegion daftar={toast} saatTutup={tutup} />
    </>
  );
}
