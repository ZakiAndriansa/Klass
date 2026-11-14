import "server-only";
import { z } from "zod";

/**
 * Variabel lingkungan yang dipakai server.
 * Pemilik: Zaki. Menambah variabel baru berarti menambahkannya di sini DAN di `.env.example`.
 *
 * Kode lain tidak membaca `process.env` langsung, tetapi mengimpor `env` dari berkas ini,
 * supaya salah ketik atau nilai kosong ketahuan saat aplikasi mulai, bukan saat dipakai.
 */
const skemaEnv = z.object({
  DATABASE_URL: z
    .string({ error: "DATABASE_URL belum diisi." })
    .startsWith("mysql://", "DATABASE_URL harus diawali mysql://"),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),

  // Dipakai nanti saat login Google dipasang (Better Auth). Boleh kosong untuk sekarang.
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
});

const hasil = skemaEnv.safeParse(process.env);

if (!hasil.success) {
  const daftar = hasil.error.issues
    .map((isu) => `  ${isu.path.join(".")}: ${isu.message}`)
    .join("\n");
  throw new Error(
    `Variabel lingkungan tidak valid:\n${daftar}\n\nSalin .env.example menjadi .env lalu isi nilainya.`,
  );
}

export const env = hasil.data;
