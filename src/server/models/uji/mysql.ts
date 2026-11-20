import { vi } from "vitest";

export const query = vi.fn<(perintah: { sql: string }, params: unknown[]) => Promise<unknown>>(
  async ({ sql }) => {
    throw new Error("Query MySQL belum disiapkan untuk tes: " + sql);
  },
);

export const release = vi.fn();
export const getConnection = vi.fn(async () => ({ query, release }));
// `on` dipakai `src/server/db/index.ts` untuk mengatur zona waktu tiap koneksi baru.
export const driver = { default: { createPool: () => ({ query, getConnection, on: vi.fn() }) } };
export const hasilTulis = [{ affectedRows: 1, insertId: 0 }, []];
export const tanpaPerubahan = [{ affectedRows: 0, insertId: 0 }, []];
export const waktu = "2026-11-19 03:00:00";

export function resetMysqlTiruan() {
  query.mockReset();
  release.mockClear();
  getConnection.mockClear();
}

export function hasilBaca(...baris: unknown[][]) {
  return [baris, []];
}

export function hasilHitung(count: number) {
  return [[{ count }], []];
}

export function siapkan(...hasil: unknown[]) {
  for (const langkah of hasil) {
    if (langkah instanceof Error) {
      query.mockRejectedValueOnce(langkah);
    } else {
      query.mockResolvedValueOnce(langkah);
    }
  }
}

export function sqlDijalankan() {
  return query.mock.calls.map(([perintah]) => String(perintah.sql));
}
