import type { HariKelas, SesiJadwal, StatusTugas, TugasProgress } from "./data-contoh";

export const URUTAN_HARI: HariKelas[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const labelStatus: Record<StatusTugas, string> = {
  todo: "Belum mulai",
  doing: "Sedang dikerjakan",
  done: "Selesai",
};

/**
 * Sesi terdekat dari `hariIni`, dihitung dalam satu minggu berulang.
 *
 * Jadwal kelas adalah jadwal mingguan tetap, jadi hari yang sudah lewat
 * dianggap minggu depan. Sesi di hari yang sama tetap ditampilkan lebih dulu.
 */
export function sesiBerikutnya(jadwal: SesiJadwal[], hariIni: HariKelas, batas = 2): SesiJadwal[] {
  const indeksHariIni = URUTAN_HARI.indexOf(hariIni);

  return [...jadwal]
    .sort((a, b) => {
      const jarakA = (URUTAN_HARI.indexOf(a.hari) - indeksHariIni + 7) % 7;
      const jarakB = (URUTAN_HARI.indexOf(b.hari) - indeksHariIni + 7) % 7;
      if (jarakA !== jarakB) return jarakA - jarakB;
      return a.mulai.localeCompare(b.mulai);
    })
    .slice(0, batas);
}

/** Persentase tugas selesai dari daftar tugas dan peta status pribadi. */
export function hitungProgres(tugas: TugasProgress[], status: Record<string, StatusTugas>): number {
  if (tugas.length === 0) return 0;
  const selesai = tugas.filter((item) => (status[item.id] ?? item.status) === "done").length;
  return Math.round((selesai / tugas.length) * 100);
}

export function inisial(nama: string): string {
  return nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((bagian) => bagian[0]?.toUpperCase() ?? "")
    .join("");
}
