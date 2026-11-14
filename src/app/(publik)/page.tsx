import { connection } from "next/server";
import { Suspense } from "react";

import { KartuStatus, KartuStatusSkeleton } from "@/components/shared/kartu-status";
import { cekKesehatan } from "@/server/controllers/health";

/**
 * CONTOH HALAMAN. Alamatnya "/". Halaman ini sementara dan akan diganti halaman utama sungguhan.
 *
 * Pola yang ditiru untuk halaman lain:
 * 1. Bagian yang tidak butuh data (judul, teks) ditulis langsung, sehingga tampil seketika.
 * 2. Bagian yang butuh data dipisah menjadi komponen `async` dan dibungkus `<Suspense>`
 *    dengan skeleton sebagai tampilan sementara.
 * 3. Halaman memanggil controller, lalu meneruskan hasilnya ke komponen lewat props.
 */
export default function HalamanUtama() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Klass</h1>
        <p className="text-muted-foreground">
          Kerangka proyek sudah berjalan. Dua kartu di bawah menunjukkan alur lengkap dari halaman
          sampai database.
        </p>
      </header>

      <section aria-label="Status sistem" className="flex flex-col gap-3">
        <Suspense
          fallback={
            <>
              <KartuStatusSkeleton />
              <KartuStatusSkeleton />
            </>
          }
        >
          <StatusSistem />
        </Suspense>
      </section>
    </main>
  );
}

async function StatusSistem() {
  // Tunggu sampai ada permintaan dari peramban, supaya database tidak dihubungi saat `npm run build`.
  await connection();

  const kesehatan = await cekKesehatan();
  const databaseTerhubung = kesehatan.database === "terhubung";

  return (
    <>
      <KartuStatus
        judul="Aplikasi"
        status="baik"
        label="Berjalan"
        keterangan="Next.js berhasil dijalankan."
      />
      <KartuStatus
        judul="Database"
        status={databaseTerhubung ? "baik" : "bermasalah"}
        label={databaseTerhubung ? "Terhubung" : "Terputus"}
        keterangan={
          databaseTerhubung
            ? "MySQL bisa dihubungi."
            : "MySQL belum menyala. Jalankan npm run db:up lalu muat ulang halaman ini."
        }
      />
    </>
  );
}
