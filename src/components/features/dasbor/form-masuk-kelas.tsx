"use client";

import { useState } from "react";

import { Field, FieldError, FieldHint, FieldInput, FieldLabel } from "@/components/shared/form";
import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";

/**
 * Formulir masuk kelas dengan kode undangan.
 *
 * Pengguna yang belum punya peran tetap bisa bergabung ke kelas yang sudah
 * ada selama punya kodenya. Kode contoh yang diterima: `KLASS-2026`.
 *
 * TODO(api): kirim kode ke controller keanggotaan, lalu arahkan ke kelas yang
 * didapat dari server. Validasi di sini hanya untuk mencoba alur.
 */
const KODE_CONTOH = "KLASS-2026";

export function FormMasukKelas() {
  const [kode, setKode] = useState("");
  const [salah, setSalah] = useState(false);
  const { daftar: toast, tampilkan, tutup } = useToast();

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
      <form className="dash-form" onSubmit={kirim} noValidate>
        <Field salah={salah}>
          <FieldLabel htmlFor="join-code">Kode undangan</FieldLabel>
          <FieldInput
            id="join-code"
            name="kode"
            type="text"
            value={kode}
            onChange={(e) => {
              setKode(e.target.value);
              if (salah) setSalah(false);
            }}
            placeholder="Contoh: KLASS-2026"
            autoComplete="off"
            aria-invalid={salah || undefined}
            aria-describedby={salah ? "join-code-err" : "join-code-hint"}
          />
          {salah ? (
            <FieldError id="join-code-err">
              Kode tidak dikenali. Periksa lagi atau minta kode baru ke admin kelas.
            </FieldError>
          ) : (
            <FieldHint id="join-code-hint">
              Minta kode ke admin kelas. Setelah masuk, kelas muncul di daftar kelasmu.
            </FieldHint>
          )}
        </Field>

        <TombolKertas type="submit" variant="primary" size="md">
          Masuk kelas
        </TombolKertas>
      </form>

      <ToastRegion daftar={toast} saatTutup={tutup} />
    </>
  );
}
