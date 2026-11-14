import { defineConfig } from "drizzle-kit";

// drizzle-kit berjalan di luar Next.js, jadi `.env` dimuat sendiri di sini.
try {
  process.loadEnvFile(".env");
} catch {
  // `.env` tidak ada; lanjut dengan variabel dari lingkungan (misalnya di server).
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diisi. Salin .env.example menjadi .env lebih dulu.");
}

export default defineConfig({
  dialect: "mysql",
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL },
});
