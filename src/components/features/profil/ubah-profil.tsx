"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AvatarPengguna } from "@/components/shared/avatar-pengguna";
import { Dialog } from "@/components/shared/dialog";
import { Field, FieldError, FieldHint, FieldInput, FieldLabel } from "@/components/shared/form";
import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";
import { api, ApiError } from "@/lib/api-client";
import type { ProfileDto } from "@/types/api/profile";

/**
 * Dialog ubah nama dan avatar profil.
 *
 * Halaman profil adalah Server Component, jadi ia mengirim identitas sebagai
 * props dan membaca ulang dari server setelah perubahan. `router.refresh()`
 * yang memicu pembacaan itu; tanpa ini pengguna melihat nama lama sampai
 * halaman dimuat ulang.
 *
 * Aturan panjang nama dan bentuk URL avatar diperiksa server lewat zod
 * (`updateProfileSchema`). Pemeriksaan di sini hanya untuk pengalaman mengetik:
 * tombol simpan dimatikan saat isinya jelas tidak sah, dan pesan dari server
 * tetap ditampilkan apa adanya bila ternyata ditolak.
 */
type ProfilAwal = {
  nama: string;
  email: string;
  image: string | null;
};

/** `details` zod berbentuk `{ name: ["pesan"] }`; ambil pesan pertama. */
function pesanField(details: unknown, field: string): string | null {
  if (!details || typeof details !== "object") return null;

  const nilai = (details as Record<string, unknown>)[field];
  if (!Array.isArray(nilai) || nilai.length === 0) return null;

  return typeof nilai[0] === "string" ? nilai[0] : null;
}

/**
 * Pesan bawaan zod untuk URL ditulis dalam bahasa Inggris ("Invalid URL"),
 * sedangkan seluruh teks yang dibaca pengguna harus bahasa Indonesia. Pesan
 * dari server tetap dipakai apa adanya bila sudah berbahasa Indonesia.
 */
function pesanAvatar(pesan: string | null): string | null {
  if (!pesan) return null;

  return /invalid url/i.test(pesan)
    ? "URL avatar harus alamat http atau https yang lengkap."
    : pesan;
}

export function UbahProfil({ nama, email, image }: ProfilAwal) {
  const [terbuka, setTerbuka] = useState(false);
  const { daftar, tampilkan, tutup } = useToast();

  return (
    <>
      <TombolKertas
        variant="secondary"
        size="sm"
        className="profil-ubah__tombol"
        onClick={() => setTerbuka(true)}
      >
        <Pencil size={13} strokeWidth={2.4} aria-hidden="true" />
        Ubah profil
      </TombolKertas>

      <Dialog terbuka={terbuka} saatTutup={() => setTerbuka(false)} judul="Ubah profil">
        {/* Form hanya dipasang saat dialog dibuka. Dengan begitu isinya selalu
            mulai dari nilai tersimpan, tanpa perlu menyetel ulang state lewat
            effect setiap kali dialog dibuka. */}
        {terbuka ? (
          <FormUbahProfil
            awal={{ nama, email, image }}
            saatSelesai={(pesan) => {
              setTerbuka(false);
              tampilkan(pesan, "sukses");
            }}
            saatBatal={() => setTerbuka(false)}
          />
        ) : null}
      </Dialog>

      <ToastRegion daftar={daftar} saatTutup={tutup} />
    </>
  );
}

function FormUbahProfil({
  awal,
  saatSelesai,
  saatBatal,
}: {
  awal: ProfilAwal;
  saatSelesai: (pesan: string) => void;
  saatBatal: () => void;
}) {
  const router = useRouter();
  const [nama, setNama] = useState(awal.nama);
  const [image, setImage] = useState(awal.image ?? "");
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [salahNama, setSalahNama] = useState<string | null>(null);
  const [salahImage, setSalahImage] = useState<string | null>(null);

  const namaRapi = nama.trim();
  const imageRapi = image.trim();
  const bolehSimpan = namaRapi.length >= 3 && namaRapi.length <= 50;

  async function simpan() {
    setMenyimpan(true);
    setGalat(null);
    setSalahNama(null);
    setSalahImage(null);

    try {
      const { data } = await api<ProfileDto>("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: namaRapi,
          // String kosong berarti "hapus avatar", karena kolomnya nullable.
          image: imageRapi === "" ? null : imageRapi,
        }),
      });

      router.refresh();
      saatSelesai(`Profil diperbarui menjadi "${data.name}".`);
    } catch (kesalahan) {
      if (kesalahan instanceof ApiError) {
        const pesanNama = pesanField(kesalahan.details, "name");
        const pesanImage = pesanAvatar(pesanField(kesalahan.details, "image"));

        if (pesanNama) setSalahNama(pesanNama);
        if (pesanImage) setSalahImage(pesanImage);
        if (!pesanNama && !pesanImage) setGalat(kesalahan.message);
      } else {
        setGalat("Tidak bisa menghubungi server. Coba lagi.");
      }
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <div className="profil-ubah">
      <div className="profil-ubah__pratinjau">
        <AvatarPengguna
          nama={namaRapi || awal.nama}
          image={imageRapi === "" ? null : imageRapi}
          ukuran={56}
        />
        <div className="profil-ubah__keterangan">
          <p className="profil-ubah__nama">{namaRapi || awal.nama}</p>
          <p className="profil-ubah__email">{awal.email}</p>
        </div>
      </div>

      <Field salah={Boolean(salahNama)}>
        <FieldLabel htmlFor="profil-nama">Nama</FieldLabel>
        <FieldInput
          id="profil-nama"
          value={nama}
          maxLength={50}
          autoComplete="name"
          onChange={(e) => setNama(e.target.value)}
        />
        {salahNama ? (
          <FieldError>{salahNama}</FieldError>
        ) : (
          <FieldHint>3–50 karakter. Nama ini tampil di navbar dan daftar anggota.</FieldHint>
        )}
      </Field>

      <Field salah={Boolean(salahImage)}>
        <FieldLabel htmlFor="profil-image">URL avatar</FieldLabel>
        <FieldInput
          id="profil-image"
          type="url"
          inputMode="url"
          placeholder="https://…"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {salahImage ? (
          <FieldError>{salahImage}</FieldError>
        ) : (
          <FieldHint>
            Kosongkan untuk memakai inisial nama. Foto dari Google terisi otomatis.
          </FieldHint>
        )}
      </Field>

      {galat ? <FieldError>{galat}</FieldError> : null}

      <p className="profil-ubah__catatan">
        Email dan NIM tidak bisa diubah di sini. Email mengikuti akun yang dipakai masuk.
      </p>

      <div className="modal__footer profil-ubah__aksi">
        <TombolKertas variant="secondary" size="sm" onClick={saatBatal}>
          Batal
        </TombolKertas>
        <TombolKertas
          variant="primary"
          size="sm"
          sedangMemproses={menyimpan}
          disabled={!bolehSimpan}
          onClick={simpan}
        >
          Simpan
        </TombolKertas>
      </div>
    </div>
  );
}
