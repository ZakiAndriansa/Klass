import { tujuanAman } from "./tujuan";

/**
 * Login Google dari Client Component. Pemilik: Zaki.
 *
 * Pemakaian (di dalam `onClick`):
 *   const pesan = await masukDenganGoogle();
 *   if (pesan) tampilkan(pesan);
 *
 * Bila berhasil, peramban langsung pindah ke halaman Google, jadi baris setelahnya
 * tidak sempat berjalan. Bila gagal, hasilnya pesan berbahasa Indonesia untuk ditampilkan.
 *
 * Tujuan setelah login dibaca dari `?next=` di alamat sekarang (lihat `tujuan.ts`).
 * Untuk keluar, pakai `api("/session", { method: "DELETE" })` atau `TombolKeluar`.
 */
const PESAN_GAGAL =
  process.env.NODE_ENV === "production"
    ? "Login Google belum bisa dipakai. Coba lagi nanti."
    : "Login Google belum aktif di server ini. Saat pengembangan, masuk lewat /dev/login.";

export async function masukDenganGoogle(): Promise<string | null> {
  const tujuan = tujuanAman(new URLSearchParams(window.location.search).get("next"));

  try {
    // Alamat ini milik Better Auth (`src/app/api/auth`), jadi bentuk jawabannya
    // bukan `{ data }` dan tidak dipanggil lewat `api()`.
    const respons = await fetch("/api/auth/sign-in/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "google", callbackURL: tujuan, errorCallbackURL: "/login" }),
    });
    const isi = (await respons.json().catch(() => null)) as { url?: string } | null;

    if (respons.ok && isi?.url) {
      window.location.assign(isi.url);
      return null;
    }
  } catch {
    // Jaringan putus atau server mati: ditangani sama seperti gagal.
  }

  return PESAN_GAGAL;
}
