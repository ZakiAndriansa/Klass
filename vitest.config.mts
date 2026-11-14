import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const dariAkar = (jalur: string) => fileURLToPath(new URL(jalur, import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": dariAkar("./src"),
      // `server-only` sengaja melempar galat di luar Next.js; saat uji diganti modul kosong.
      "server-only": dariAkar("./node_modules/server-only/empty.js"),
    },
  },
});
