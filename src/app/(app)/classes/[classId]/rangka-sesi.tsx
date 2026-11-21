import type { KelasDetail } from "@/components/features/kelas/data-contoh";
import type { AksesKelas } from "@/lib/akses-kelas";
import { RangkaKelas, type TabKelas } from "@/components/features/kelas/rangka-kelas";
import { wajibLogin } from "@/server/permissions";

/**
 * `RangkaKelas` versi sadar sesi.
 *
 * Komponen di `src/components` tidak boleh mengimpor kode backend (aturan
 * folder di `eslint.config.mjs`), jadi pembacaan sesi dilakukan di sini —
 * berkas ini berada di `src/app`, tempat controller boleh dipanggil.
 *
 * Dipakai kelima halaman kelas supaya navbar menampilkan identitas yang sama
 * dan halaman tetap dijaga login walau proxy hanya memeriksa cookie.
 */
export async function RangkaKelasSesi({
  kelas,
  aktif,
  children,
}: {
  kelas: KelasDetail;
  aktif: TabKelas;
  children: React.ReactNode;
}) {
  // Yang belum login dipindahkan ke `/login?next=...`.
  const pengguna = await wajibLogin();

  return (
    <RangkaKelas
      kelas={kelas}
      aktif={aktif}
      pengguna={{ name: pengguna.name, image: pengguna.image ?? null }}
      akses={aksesContoh(kelas)}
    >
      {children}
    </RangkaKelas>
  );
}

/**
 * Hak akses sementara dari data contoh.
 *
 * TODO(api): ganti dengan `aksesKelasSaya(classId)` dari
 * `@/server/controllers/class-access` setelah halaman kelas memakai id kelas
 * sungguhan. Sekarang id kelas masih contoh, jadi endpoint aslinya menjawab 404.
 *
 * Pemetaannya mengikuti arti `AksesKelasDto`: "Admin kelas" menjadi role admin;
 * "PJ" menjadi anggota dengan satu subkelas yang dipegang; "Anggota" menjadi
 * anggota tanpa subkelas.
 */
function aksesContoh(kelas: KelasDetail): AksesKelas {
  if (kelas.peran === "Admin kelas") {
    return { role: "admin", pjSubclassIds: [], readOnly: false };
  }

  if (kelas.peran === "PJ") {
    return { role: "member", pjSubclassIds: ["contoh"], readOnly: false };
  }

  return { role: "member", pjSubclassIds: [], readOnly: false };
}
