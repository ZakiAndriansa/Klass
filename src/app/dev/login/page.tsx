import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PilihAkunDev } from "@/components/features/dev/pilih-akun-dev";
import { Alert } from "@/components/shared/alert";
import { Section, SectionInner } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { daftarAkunDev, loginDevAktif, sesiDev } from "@/server/controllers/dev-auth";

export const metadata: Metadata = {
  title: "Login pengembangan",
  description: "Masuk sebagai akun contoh untuk mencoba tiap peran saat pengembangan.",
  robots: { index: false, follow: false },
};

/**
 * Login pengembangan, beralamat `/dev/login`.
 *
 * Menampilkan satu akun contoh per peran. Klik salah satu untuk langsung masuk,
 * tanpa Google dan tanpa kata sandi. Di produksi halaman ini menjawab 404.
 */
export default function HalamanLoginDev() {
  if (!loginDevAktif()) {
    notFound();
  }

  return (
    <main className="ds-kolom">
      <Section>
        <SectionInner>
          <SectionHeading
            eyebrow="khusus pengembangan"
            judul="Masuk sebagai akun contoh."
            subjudul="Satu peran, satu akun. Halaman ini tidak ada di produksi."
          />

          {/* Membaca sesi butuh cookie, jadi bagian ini dimuat saat ada permintaan. */}
          <Suspense
            fallback={<Alert varian="info" judul="Memuat" pesan="Menyiapkan daftar akun contoh." />}
          >
            <IsiLoginDev />
          </Suspense>
        </SectionInner>
      </Section>
    </main>
  );
}

async function IsiLoginDev() {
  const [akun, sesi] = await Promise.all([daftarAkunDev(), sesiDev()]);

  return <PilihAkunDev akun={akun} sesi={sesi} />;
}
