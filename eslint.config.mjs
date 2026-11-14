import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ---------------------------------------------------------------------------
  // Penjaga batas folder. Pemilik aturan: Zaki.
  // Alurnya satu arah: halaman / URL -> controller -> model -> database.
  // ---------------------------------------------------------------------------
  {
    // Kode yang ikut terkirim ke peramban tidak boleh menyentuh backend.
    files: ["src/components/**", "src/lib/**", "src/types/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server", "@/server/**", "@/env"],
              message:
                "Folder ini tidak boleh mengimpor kode backend. Komponen menerima data lewat props; pengambilan data dilakukan di halaman.",
            },
          ],
        },
      ],
    },
  },
  {
    // Halaman dan URL memanggil controller, tidak melompat ke model atau database.
    files: ["src/app/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/server/db",
                "@/server/db/**",
                "@/server/models",
                "@/server/models/**",
                "drizzle-orm",
                "drizzle-orm/**",
                "mysql2",
                "mysql2/**",
              ],
              message:
                "Halaman dan URL (route.ts) hanya boleh memanggil controller di @/server/controllers.",
            },
          ],
        },
      ],
    },
  },
  {
    // Controller memanggil model, tidak menulis query sendiri.
    files: ["src/server/controllers/**", "src/server/http/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/server/db",
                "@/server/db/**",
                "drizzle-orm",
                "drizzle-orm/**",
                "mysql2",
                "mysql2/**",
              ],
              message:
                "Hanya src/server/models yang boleh menyentuh database. Panggil fungsi model, atau minta Fadlan membuatkannya.",
            },
          ],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Berkas hasil generate:
    "drizzle/**",
  ]),
]);

export default eslintConfig;
