"use client";

import { useState } from "react";

import { Dialog } from "@/components/shared/dialog";
import { Field, FieldInput, FieldLabel } from "@/components/shared/form";
import { ToastRegion, useToast, type ToastItem } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";
import { Tooltip } from "@/components/shared/tooltip";

/**
 * Bagian "Modal, Alert/Toast & Tooltip" di galeri `/components`. Dipisah jadi
 * Client Component karena dialog dan toast butuh state; halaman galeri tetap
 * Server Component.
 *
 * Tooltip tidak butuh JavaScript, tapi ikut di sini supaya pemicunya berdiri
 * berdampingan dengan tombol lain.
 */
export function DemoInteraktif() {
  const [dialogTerbuka, setDialogTerbuka] = useState(false);
  const { daftar, tampilkan, tutup } = useToast();

  return (
    <div className="komponen-tumpuk">
      <div className="btn-group">
        <TombolKertas variant="primary" onClick={() => setDialogTerbuka(true)}>
          Buka Dialog Pengajuan
        </TombolKertas>

        <TombolKertas
          variant="secondary"
          onClick={() => tampilkan("Pengaturan tampilan kelas berhasil disimpan!")}
        >
          Tampilkan Toast
        </TombolKertas>

        <Tooltip teks="Kode undangan berlaku 7 hari">
          <TombolKertas variant="ghost">Arahkan / Fokus (Tooltip)</TombolKertas>
        </Tooltip>
      </div>

      <Dialog
        terbuka={dialogTerbuka}
        saatTutup={() => setDialogTerbuka(false)}
        judul="Buat Subkelas Baru"
        footer={
          <>
            <TombolKertas variant="ghost" onClick={() => setDialogTerbuka(false)}>
              Batal
            </TombolKertas>
            <TombolKertas variant="primary" onClick={() => setDialogTerbuka(false)}>
              Simpan Subkelas
            </TombolKertas>
          </>
        }
      >
        <p>
          Subkelas digunakan untuk memisahkan materi, jadwal, dan tugas tiap mata kuliah atau
          divisi.
        </p>
        <Field>
          <FieldLabel htmlFor="modal-sub-nama">Nama Subkelas</FieldLabel>
          <FieldInput id="modal-sub-nama" type="text" placeholder="Contoh: Pemrograman Web" />
        </Field>
      </Dialog>

      <ToastRegion daftar={daftar} saatTutup={tutup} />
    </div>
  );
}

export type { ToastItem };
