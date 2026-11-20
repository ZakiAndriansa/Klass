import { describe, expect, it, vi } from "vitest";

// Modul dimuat di sini, bukan di dalam tes. Memuat Drizzle dan seluruh skema bisa lama
// saat laptop sedang sibuk, dan waktu muat di dalam tes ikut dihitung batas waktu 5 detik.
import "./index";

type KoneksiTiruan = { query: (sql: string, selesai: (galat: Error | null) => void) => void };

// Pendengar yang didaftarkan `index.ts` disimpan di objek biasa, bukan `vi.fn()`,
// karena Vitest menghapus catatan panggilan `vi.fn()` sebelum setiap tes.
const terdaftar = vi.hoisted(() => ({
  peristiwa: "",
  pendengar: undefined as ((koneksi: KoneksiTiruan) => void) | undefined,
}));

vi.mock("mysql2/promise", () => ({
  default: {
    createPool: () => ({
      on(peristiwa: string, pendengar: (koneksi: KoneksiTiruan) => void) {
        terdaftar.peristiwa = peristiwa;
        terdaftar.pendengar = pendengar;
      },
    }),
  },
}));
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

describe("koneksi database", () => {
  it("memaksa setiap koneksi baru memakai zona waktu UTC", () => {
    expect(terdaftar.peristiwa).toBe("connection");

    // Jalankan pendengarnya dengan koneksi tiruan, seperti yang dilakukan mysql2.
    const query = vi.fn();
    terdaftar.pendengar?.({ query });

    expect(query).toHaveBeenCalledWith("SET time_zone = '+00:00'", expect.any(Function));
  });
});
