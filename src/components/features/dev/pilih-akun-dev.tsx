"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert } from "@/components/shared/alert";
import { GridKartu, KartuKertas } from "@/components/shared/kartu";
import { ToastRegion, useToast } from "@/components/shared/toast";
import { TombolKertas } from "@/components/shared/tombol-kertas";
import { api, ApiError } from "@/lib/api-client";
import type { AkunDevDto, PeranDev } from "@/types/api/dev-auth";
import type { SesiDto } from "@/types/api/session";

/**
 * Daftar akun contoh untuk `/dev/login`: satu kartu per peran, tinggal diklik.
 *
 * Data akun dan sesi datang dari halaman lewat props. Komponen ini memanggil
 * `POST /api/v1/dev/session` untuk masuk dan `DELETE /api/v1/session` untuk keluar.
 */
type PilihAkunDevProps = {
  akun: AkunDevDto[];
  /** Akun yang sedang dipakai, atau `null` bila belum masuk. */
  sesi: SesiDto | null;
};

const varianLencana: Record<PeranDev, "primary" | "info" | "success" | "warning" | "error"> = {
  superadmin: "error",
  class_admin: "warning",
  subclass_pj: "info",
  member: "success",
  user: "primary",
};

function pesanGalat(galat: unknown): string {
  return galat instanceof ApiError ? galat.message : "Server tidak bisa dihubungi.";
}

export function PilihAkunDev({ akun, sesi }: PilihAkunDevProps) {
  const router = useRouter();
  const { daftar: toast, tampilkan, tutup } = useToast();
  /** `id` akun yang sedang diproses, atau `"keluar"` saat keluar. */
  const [sedang, setSedang] = useState<string | null>(null);

  async function masuk(pilihan: AkunDevDto) {
    setSedang(pilihan.id);

    try {
      await api<SesiDto>("/dev/session", {
        method: "POST",
        body: JSON.stringify({ accountId: pilihan.id }),
      });
      router.push(pilihan.redirectTo);
      router.refresh();
    } catch (galat) {
      tampilkan(pesanGalat(galat), "error");
      setSedang(null);
    }
  }

  async function keluar() {
    setSedang("keluar");

    try {
      await api<null>("/session", { method: "DELETE" });
      router.refresh();
      tampilkan("Kamu sudah keluar.", "sukses");
    } catch (galat) {
      tampilkan(pesanGalat(galat), "error");
    } finally {
      setSedang(null);
    }
  }

  return (
    <div className="komponen-tumpuk">
      {sesi ? (
        <Alert
          varian="sukses"
          judul={`Sedang masuk sebagai ${sesi.name}`}
          pesan={`${sesi.email}. Pilih akun lain di bawah untuk berganti peran.`}
        />
      ) : (
        <Alert
          varian="info"
          judul="Belum masuk"
          pesan="Pilih salah satu akun di bawah. Tidak perlu kata sandi."
        />
      )}

      <GridKartu>
        {akun.map((satu) => {
          const dipakai = sesi?.id === satu.id;

          return (
            <KartuKertas
              key={satu.id}
              judul={satu.name}
              deskripsi={satu.description}
              lencana={{ label: satu.roleLabel, varian: varianLencana[satu.role] }}
              kode={satu.email}
              aksi={
                <TombolKertas
                  variant={dipakai ? "secondary" : "primary"}
                  size="md"
                  sedangMemproses={sedang === satu.id}
                  disabled={sedang !== null}
                  onClick={() => masuk(satu)}
                >
                  {dipakai ? "Buka halamannya" : `Masuk sebagai ${satu.roleLabel}`}
                </TombolKertas>
              }
            />
          );
        })}
      </GridKartu>

      {sesi ? (
        <div>
          <TombolKertas
            variant="ghost"
            size="md"
            sedangMemproses={sedang === "keluar"}
            disabled={sedang !== null}
            onClick={keluar}
          >
            Keluar
          </TombolKertas>
        </div>
      ) : null}

      <ToastRegion daftar={toast} saatTutup={tutup} />
    </div>
  );
}
