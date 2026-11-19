"use client";

import { useState } from "react";

import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";

import type { PengajuanDasbor, StatusPengajuan } from "./data-contoh";

/**
 * Antrean pengajuan kelas (Figma 60:1252).
 *
 * Setiap baris bisa disetujui atau ditolak. Keputusan hanya mengubah status di
 * layar dan memberi toast — belum ada server, jadi tidak ada data yang
 * benar-benar tersimpan.
 *
 * TODO(api): ganti `putuskan` dengan panggilan controller pengajuan, lalu
 * segarkan daftar dari server. Setelah disetujui, baris menampilkan tautan
 * "Lihat kelas" seperti instance tersembunyi di Figma.
 */
const kelasStatus: Record<StatusPengajuan, string> = {
  Diajukan: "dash-status",
  Disetujui: "dash-status dash-status--disetujui",
  Ditolak: "dash-status dash-status--ditolak",
};

export function TabelPengajuan({ awal }: { awal: PengajuanDasbor[] }) {
  const [daftar, setDaftar] = useState(awal);
  const { daftar: toast, tampilkan, tutup } = useToast();

  function putuskan(id: string, status: StatusPengajuan, nama: string) {
    setDaftar((lama) => lama.map((baris) => (baris.id === id ? { ...baris, status } : baris)));
    tampilkan(
      status === "Disetujui"
        ? `"${nama}" disetujui. Pengaju menjadi admin kelas.`
        : `"${nama}" ditolak. Pengaju akan diberi tahu lewat email.`,
      status === "Disetujui" ? "sukses" : "info",
    );
  }

  return (
    <>
      <div className="dash-table">
        <div className="dash-table__head" aria-hidden="true">
          <span>Kelas</span>
          <span>Pengaju / email admin</span>
          <span>Diajukan</span>
          <span>Status</span>
          <span>Tindakan</span>
        </div>

        {daftar.length === 0 ? (
          <p className="dash-table__empty">Tidak ada pengajuan yang menunggu tinjauan.</p>
        ) : (
          daftar.map((baris) => (
            <div className="dash-table__row" key={baris.id}>
              <div className="dash-table__cell">
                <span className="dash-table__label">Kelas</span>
                <p className="dash-table__name">{baris.kelas}</p>
                <p className="dash-table__sub">{baris.jenis}</p>
              </div>

              <div className="dash-table__cell">
                <span className="dash-table__label">Pengaju / email admin</span>
                <p className="dash-table__name">{baris.pengaju}</p>
                <p className="dash-table__sub">{baris.email}</p>
              </div>

              <div className="dash-table__cell">
                <span className="dash-table__label">Diajukan</span>
                <p className="dash-table__date">{baris.tanggal}</p>
              </div>

              <div className="dash-table__cell">
                <span className="dash-table__label">Status</span>
                <span className={kelasStatus[baris.status]}>{baris.status}</span>
              </div>

              <div className="dash-table__cell">
                <span className="dash-table__label">Tindakan</span>
                {baris.status === "Diajukan" ? (
                  <div className="dash-table__actions">
                    <TombolKertas
                      variant="primary"
                      size="sm"
                      onClick={() => putuskan(baris.id, "Disetujui", baris.kelas)}
                    >
                      Setujui
                    </TombolKertas>
                    <TombolKertas
                      variant="ghost"
                      size="sm"
                      onClick={() => putuskan(baris.id, "Ditolak", baris.kelas)}
                    >
                      Tolak
                    </TombolKertas>
                  </div>
                ) : (
                  <div className="dash-table__actions">
                    <TombolKertas variant="secondary" size="sm">
                      Lihat kelas
                    </TombolKertas>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ToastRegion daftar={toast} saatTutup={tutup} />
    </>
  );
}
