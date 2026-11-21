"use client";

import { useState } from "react";

import { Field, FieldError, FieldHint, FieldInput, FieldLabel } from "@/components/shared/form";
import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Formulir masuk kelas dengan kode undangan.
 *
 * Dipakai di dua tempat: keadaan onboarding (sebagai aksi utama) dan Meja yang
 * sudah berisi kelas (untuk menambah kelas lain tanpa berpindah halaman).
 *
 * TODO(api): kirim kode ke controller keanggotaan, lalu arahkan ke kelas yang
 * didapat dari server. Validasi di sini hanya untuk mencoba alur.
 */
const KODE_CONTOH = "KLS-TIA-2026";

export function FormMasukKelas({ idAwal = "kode-undangan" }: { idAwal?: string }) {
  const [kode, setKode] = useState("");
  const [salah, setSalah] = useState(false);
  const { daftar: toast, tampilkan, tutup } = useToast();

  const idKode = `${idAwal}-kode`;

  function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const rapi = kode.trim().toUpperCase();

    if (rapi !== KODE_CONTOH) {
      setSalah(true);
      return;
    }

    setSalah(false);
    setKode("");
    tampilkan("Kode diterima. Kamu bergabung sebagai anggota.", "sukses");
  }

  return (
    <>
      <form className="meja-form" onSubmit={kirim} noValidate>
        <Field salah={salah}>
          <FieldLabel htmlFor={idKode}>Kode undangan</FieldLabel>
          <div className="meja-form__baris">
            <FieldInput
              id={idKode}
              name="kode"
              type="text"
              value={kode}
              onChange={(e) => {
                setKode(e.target.value);
                if (salah) setSalah(false);
              }}
              placeholder="Contoh: KLS-TIA-2026"
              autoComplete="off"
              aria-invalid={salah || undefined}
              aria-describedby={salah ? `${idKode}-err` : `${idKode}-hint`}
            />
            <TombolKertas type="submit" variant="primary" size="md">
              Masuk
            </TombolKertas>
          </div>
          {salah ? (
            <FieldError id={`${idKode}-err`}>
              Kode tidak dikenali. Periksa lagi atau minta kode baru ke admin kelas.
            </FieldError>
          ) : (
            <FieldHint id={`${idKode}-hint`}>
              Minta kode ke admin kelas. Setelah masuk, kelas muncul di Meja dan daftar kelasmu.
            </FieldHint>
          )}
        </Field>
      </form>

      <ToastRegion daftar={toast} saatTutup={tutup} />
    </>
  );
}
