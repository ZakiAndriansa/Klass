"use client";

import { useState } from "react";

import {
  Checkbox,
  Field,
  FieldError,
  FieldGroup,
  FieldHint,
  FieldInput,
  FieldLabel,
  FieldSelect,
  FieldTextarea,
  FormStack,
  Radio,
} from "@/components/shared/form";
import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";

import { jenisKelompok } from "./data-contoh";

/**
 * Formulir pengajuan kelas baru.
 *
 * Hanya tampil di keadaan onboarding, karena pengajuan kelas adalah langkah
 * sekali pakai: setelah kelas disetujui, formulir ini tidak lagi jadi isi
 * utama Meja.
 *
 * Slug diturunkan dari nama kelas, jadi pengguna tidak perlu memikirkan URL.
 *
 * TODO(api): kirim ke controller pengajuan. Sekarang hanya validasi di layar,
 * memberi toast, lalu mengosongkan formulir.
 */
function jadikanSlug(nama: string) {
  return nama
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function FormPengajuanKelas({ idAwal = "ajuan" }: { idAwal?: string }) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [salah, setSalah] = useState(false);
  const { daftar: toast, tampilkan, tutup } = useToast();

  const slug = jadikanSlug(nama);
  const idNama = `${idAwal}-nama`;

  function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nama.trim() || !slug) {
      setSalah(true);
      return;
    }

    setSalah(false);
    setNama("");
    setDeskripsi("");
    tampilkan(`Pengajuan "${nama.trim()}" terkirim. Menunggu tinjauan superadmin.`, "sukses");
  }

  return (
    <>
      <FormStack className="meja-form" onSubmit={kirim} noValidate>
        <Field salah={salah}>
          <FieldLabel htmlFor={idNama}>Nama kelas</FieldLabel>
          <FieldInput
            id={idNama}
            name="nama"
            type="text"
            value={nama}
            onChange={(e) => {
              setNama(e.target.value);
              if (salah) setSalah(false);
            }}
            placeholder="Contoh: Informatika 2024 A"
            aria-invalid={salah || undefined}
            aria-describedby={salah ? `${idNama}-err` : `${idNama}-hint`}
          />
          {salah ? (
            <FieldError id={`${idNama}-err`}>
              Nama kelas wajib diisi dan harus mengandung huruf atau angka.
            </FieldError>
          ) : (
            <FieldHint id={`${idNama}-hint`}>
              Nama ini akan tampil di halaman jelajah kelas.
            </FieldHint>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idAwal}-slug`}>Alamat kelas</FieldLabel>
          <FieldInput
            id={`${idAwal}-slug`}
            type="text"
            value={slug ? `/classes/${slug}` : ""}
            placeholder="/classes/…"
            readOnly
            aria-describedby={`${idAwal}-slug-hint`}
          />
          <FieldHint id={`${idAwal}-slug-hint`}>
            Dibuat otomatis dari nama kelas. Bisa diubah setelah kelas jadi.
          </FieldHint>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idAwal}-jenis`}>Jenis kelompok</FieldLabel>
          <FieldSelect id={`${idAwal}-jenis`} name="jenis" defaultValue="kuliah">
            {jenisKelompok.map((jenis) => (
              <option key={jenis.value} value={jenis.value}>
                {jenis.label}
              </option>
            ))}
          </FieldSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idAwal}-deskripsi`}>Deskripsi singkat</FieldLabel>
          <FieldTextarea
            id={`${idAwal}-deskripsi`}
            name="deskripsi"
            rows={3}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Tuliskan tujuan kelas dan aturan ringkas..."
          />
        </Field>

        <FieldGroup>
          <legend className="field__label">Opsi keanggotaan</legend>
          <Checkbox
            name="tampil-jelajah"
            label="Tampilkan di halaman Jelajah Kelas"
            defaultChecked
          />
          <Checkbox name="batasi-anggota" label="Batasi maksimal 60 anggota" />
        </FieldGroup>

        <FieldGroup>
          <legend className="field__label">Pengingat deadline</legend>
          <Radio
            name="pengingat"
            value="3d"
            label="3 hari & 1 hari sebelum deadline"
            defaultChecked
          />
          <Radio name="pengingat" value="1d" label="Hanya 1 hari sebelum deadline" />
        </FieldGroup>

        <div className="meja-form__aksi">
          <TombolKertas type="submit" variant="primary" size="md">
            Kirim pengajuan
          </TombolKertas>
          <TombolKertas
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              setNama("");
              setDeskripsi("");
              setSalah(false);
            }}
          >
            Kosongkan
          </TombolKertas>
        </div>
      </FormStack>

      <ToastRegion daftar={toast} saatTutup={tutup} />
    </>
  );
}
