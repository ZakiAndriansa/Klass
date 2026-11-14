# Panduan Belajar Tim Klass

Daftar bacaan resmi untuk anggota tim, disusun dari nol. Semua tautan menuju dokumentasi resmi pembuat teknologinya atau lembaga standar web (MDN, W3C, web.dev, OWASP), dan sudah dicek dapat dibuka pada 14 November 2026.

Sebagian besar berbahasa Inggris. Yang tersedia dalam bahasa Indonesia diberi tanda (ID).

## Cara memakai

1. Kerjakan berurutan dari Tahap 0 sampai Tahap 3. Keempat tahap itu wajib untuk semua orang.
2. Setelah itu ambil Tahap 4A bila kamu frontend atau Tahap 4B bila kamu backend, lalu lihat bagian "Bacaan per orang".
3. Jangan hanya membaca. Setiap tautan bertanda "praktik" harus diketik dan dijalankan sendiri.
4. Tidak perlu hafal. Tujuannya tahu konsepnya dan tahu harus membuka halaman mana saat butuh.

## Tahap 0. Memasang alat

| Alat                | Tautan                                                                   | Untuk apa                                                   |
| ------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| VS Code             | https://code.visualstudio.com/docs/getstarted/overview                   | Editor kode                                                 |
| VS Code, antarmuka  | https://code.visualstudio.com/docs/editing/getting-started/userinterface | Mengenal panel dan pintasan                                 |
| Node.js (pilih LTS) | https://nodejs.org/en/download                                           | Menjalankan JavaScript di luar peramban, sudah termasuk npm |
| Git                 | https://git-scm.com/downloads/                                           | Menyimpan riwayat kode                                      |
| Docker Desktop      | https://docs.docker.com/desktop/setup/install/windows-install/           | Menjalankan MySQL tanpa memasangnya langsung di laptop      |

## Tahap 1. Dasar web (semua orang)

Mulai dari sini walaupun merasa sudah pernah belajar HTML.

| Urutan | Topik                                      | Tautan                                                                                                         | Catatan                                 |
| ------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1      | Peta belajar web                           | https://developer.mozilla.org/en-US/docs/Learn_web_development                                                 | Halaman induk, baca sekilas             |
| 2      | Cara kerja web                             | https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works | Klien, server, permintaan, respons      |
| 3      | Mulai dari nol                             | https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started                                 | Praktik                                 |
| 4      | HTML                                       | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content                        | Praktik                                 |
| 5      | CSS dasar                                  | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics                             | Praktik                                 |
| 6      | Tata letak CSS (flexbox, grid, responsif)  | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout                                 | Praktik                                 |
| 7      | JavaScript                                 | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting                                  | Praktik, bagian terpanjang              |
| 8      | JSON                                       | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON                             | Format data antara frontend dan backend |
| 9      | JavaScript asinkron (`async`, `await`)     | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS                             | Dipakai di hampir semua kode Klass      |
| 10     | HTTP                                       | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview                                              | Dasar dari REST API                     |
| 11     | Metode HTTP (GET, POST, PATCH, DELETE)     | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods                                            | Rujukan                                 |
| 12     | Kode status (200, 400, 401, 403, 404, 409) | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status                                             | Rujukan                                 |

Bila penjelasan MDN terasa berat, ada kursus pelengkap dari web.dev:

| Topik       | Tautan                     |
| ----------- | -------------------------- |
| Kursus HTML | https://web.dev/learn/html |
| Kursus CSS  | https://web.dev/learn/css  |

## Tahap 2. Bekerja dalam tim (semua orang)

| Urutan | Topik                             | Tautan                                                                  | Catatan                                       |
| ------ | --------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| 1      | Buku Pro Git, bab 1 sampai 3 (ID) | https://git-scm.com/book/id/v2                                          | Versi Inggris: https://git-scm.com/book/en/v2 |
| 2      | Branch                            | https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell     | Wajib paham sebelum menyentuh repo            |
| 3      | GitHub, latihan pertama           | https://docs.github.com/en/get-started/using-github/hello-world         | Praktik                                       |
| 4      | Alur GitHub                       | https://docs.github.com/en/get-started/using-github/github-flow         | Alur yang dipakai tim                         |
| 5      | Pull request                      | https://docs.github.com/en/pull-requests/reference/pull-requests        | Semua perubahan masuk lewat PR                |
| 6      | Review pull request               | https://docs.github.com/en/pull-requests/reference/pull-request-reviews | Cara meminta dan memberi review               |
| 7      | Konflik merge                     | https://docs.github.com/en/pull-requests/reference/merge-conflicts      | Pasti terjadi, jangan panik                   |
| 8      | Git di dalam VS Code              | https://code.visualstudio.com/docs/sourcecontrol/quickstart             | Alternatif bila belum nyaman dengan terminal  |

Pesan commit tim selalu diawali `Add:`, `Update:`, `Delete:`, atau `Fix:`; penjelasan dan contohnya ada di `README.md`. Aturan Git lengkap ada di `.claude/skills/klass-pr/SKILL.md`.

## Tahap 3. Stack Klass (semua orang)

Urutannya penting: TypeScript dibangun di atas JavaScript, React di atas keduanya, dan Next.js di atas React.

| Urutan | Topik                           | Tautan                                                                    | Catatan                                 |
| ------ | ------------------------------- | ------------------------------------------------------------------------- | --------------------------------------- |
| 1      | Pengenalan Node.js              | https://nodejs.org/learn/getting-started/introduction-to-nodejs           | Baca sekilas                            |
| 2      | npm                             | https://docs.npmjs.com/about-npm/                                         | Apa itu paket dan `package.json`        |
| 3      | TypeScript dari nol             | https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html | Untuk yang baru mengenal JavaScript     |
| 4      | Tipe sehari-hari                | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html        | Bagian yang paling sering dipakai       |
| 5      | Buku pegangan TypeScript        | https://www.typescriptlang.org/docs/handbook/intro.html                   | Rujukan                                 |
| 6      | React, mulai cepat (ID)         | https://id.react.dev/learn                                                | Versi Inggris: https://react.dev/learn  |
| 7      | Tutorial tic-tac-toe            | https://react.dev/learn/tutorial-tic-tac-toe                              | Praktik                                 |
| 8      | Berpikir dalam React            | https://react.dev/learn/thinking-in-react                                 | Cara memecah halaman menjadi komponen   |
| 9      | Kursus React Foundations        | https://nextjs.org/learn/react-foundations                                | Jembatan dari React ke Next.js          |
| 10     | Kursus Next.js (membuat dasbor) | https://nextjs.org/learn/dashboard-app                                    | Praktik, paling penting di tahap ini    |
| 11     | Struktur proyek Next.js         | https://nextjs.org/docs/app/getting-started/project-structure             | Arti setiap folder dan nama berkas      |
| 12     | Layout dan halaman              | https://nextjs.org/docs/app/getting-started/layouts-and-pages             | Dasar App Router                        |
| 13     | Server dan Client Component     | https://nextjs.org/docs/app/getting-started/server-and-client-components  | Konsep yang paling sering membingungkan |

## Tahap 4A. Frontend (Rehan, Darrel, Aqil)

| Urutan | Topik                      | Tautan                                                                                              | Catatan                                   |
| ------ | -------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1      | React, mendeskripsikan UI  | https://react.dev/learn/describing-the-ui                                                           | Komponen, props, daftar                   |
| 2      | React, interaktivitas      | https://react.dev/learn/adding-interactivity                                                        | Event dan state                           |
| 3      | React, mengelola state     | https://react.dev/learn/managing-state                                                              | Untuk form dan komponen yang rumit        |
| 4      | React dengan TypeScript    | https://react.dev/learn/typescript                                                                  | Memberi tipe pada props                   |
| 5      | Tailwind, kelas utilitas   | https://tailwindcss.com/docs/styling-with-utility-classes                                           | Cara berpikir Tailwind                    |
| 6      | Tailwind, desain responsif | https://tailwindcss.com/docs/responsive-design                                                      | Klass dirancang dari layar HP             |
| 7      | Tailwind, variabel tema    | https://tailwindcss.com/docs/theme                                                                  | Dasar tema kelas                          |
| 8      | Variabel CSS               | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties | Tema tiap kelas diterapkan lewat ini      |
| 9      | shadcn/ui, pengenalan      | https://ui.shadcn.com/docs                                                                          | Pustaka komponen yang dipakai             |
| 10     | shadcn/ui, daftar komponen | https://ui.shadcn.com/docs/components                                                               | Cek di sini sebelum membuat komponen baru |
| 11     | shadcn/ui, tema            | https://ui.shadcn.com/docs/theming                                                                  | Token warna seperti `bg-primary`          |
| 12     | shadcn/ui, form            | https://ui.shadcn.com/docs/forms                                                                    | Pola form                                 |
| 13     | Form HTML                  | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms                     | Dasar sebelum memakai pustaka form        |
| 14     | Aksesibilitas              | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility                   | Label, keyboard, kontras                  |
| 15     | Kontras warna (WCAG)       | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html                                   | Syarat F6 pada PRD                        |
| 16     | Dasar desain responsif     | https://web.dev/learn/design                                                                        | Untuk yang merancang halaman              |

Tambahan untuk Aqil (slicing dan menyambungkan data):

| Topik                       | Tautan                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| Navigasi                    | https://nextjs.org/docs/app/getting-started/linking-and-navigating     |
| Mengambil data              | https://nextjs.org/docs/app/getting-started/fetching-data              |
| Mengubah data               | https://nextjs.org/docs/app/getting-started/mutating-data              |
| Penanganan galat            | https://nextjs.org/docs/app/getting-started/error-handling             |
| Memanggil API dari peramban | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch |
| PWA di Next.js              | https://nextjs.org/docs/app/guides/progressive-web-apps                |
| Kursus PWA                  | https://web.dev/learn/pwa                                              |

Aturan tim: `.claude/skills/klass-komponen/SKILL.md`, `klass-halaman/SKILL.md`, dan `klass-review-komponen/SKILL.md`.

## Tahap 4B. Backend (Zaki, Ahmad, Bintang, Fadlan)

Dasar untuk semua anggota backend:

| Urutan | Topik                   | Tautan                                                                                                             | Catatan                                |
| ------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| 1      | Pemrograman sisi server | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps                  | Apa yang dikerjakan backend            |
| 2      | REST                    | https://developer.mozilla.org/en-US/docs/Glossary/REST                                                             | Definisi singkat                       |
| 3      | Panduan desain REST API | https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design                                     | Penamaan URL, metode, status           |
| 4      | Cookie dan sesi         | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies                                                   | Cara login diingat peramban            |
| 5      | Keamanan situs web      | https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Website_security | Ancaman umum                           |
| 6      | Variabel lingkungan     | https://nextjs.org/docs/app/guides/environment-variables                                                           | Tempat rahasia disimpan, bukan di kode |

URL dan controller (Ahmad, Bintang):

| Urutan | Topik                    | Tautan                                                                        | Catatan                         |
| ------ | ------------------------ | ----------------------------------------------------------------------------- | ------------------------------- |
| 1      | Route Handlers           | https://nextjs.org/docs/app/getting-started/route-handlers                    | Cara membuat URL API di Next.js |
| 2      | Rujukan `route.ts`       | https://nextjs.org/docs/app/api-reference/file-conventions/route              | Rujukan                         |
| 3      | Zod, dasar               | https://zod.dev/basics                                                        | Validasi masukan                |
| 4      | Zod, pengenalan          | https://zod.dev/                                                              | Rujukan                         |
| 5      | Autentikasi di Next.js   | https://nextjs.org/docs/app/guides/authentication                             | Beda autentikasi dan otorisasi  |
| 6      | Keamanan data di Next.js | https://nextjs.org/docs/app/guides/data-security                              | Mengapa data dipetakan ke DTO   |
| 7      | Otorisasi (OWASP)        | https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html | Dasar lapisan izin Klass        |
| 8      | Vitest                   | https://vitest.dev/guide/                                                     | Menulis uji controller          |

Database dan model (Fadlan):

| Urutan | Topik                 | Tautan                                                                                                            | Catatan                           |
| ------ | --------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1      | Tutorial MySQL        | https://dev.mysql.com/doc/refman/8.4/en/tutorial.html                                                             | Praktik: membuat tabel dan query  |
| 2      | Tipe data             | https://dev.mysql.com/doc/refman/8.4/en/data-types.html                                                           | Rujukan                           |
| 3      | Kunci asing           | https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html                                            | Relasi antartabel                 |
| 4      | Indeks                | https://dev.mysql.com/doc/refman/8.4/en/mysql-indexes.html                                                        | Kapan query menjadi lambat        |
| 5      | Tipe JSON             | https://dev.mysql.com/doc/refman/8.4/en/json.html                                                                 | Untuk field `style` kelas         |
| 6      | Transaksi             | https://dev.mysql.com/doc/refman/8.4/en/commit.html                                                               | Untuk join, kick, dan persetujuan |
| 7      | Drizzle, gambaran     | https://orm.drizzle.team/docs/overview                                                                            | ORM yang dipakai                  |
| 8      | Drizzle dengan MySQL  | https://orm.drizzle.team/docs/get-started/mysql-new                                                               | Praktik                           |
| 9      | Deklarasi skema       | https://orm.drizzle.team/docs/sql-schema-declaration                                                              | Menulis tabel dalam TypeScript    |
| 10     | Tipe kolom MySQL      | https://orm.drizzle.team/docs/mysql/column-types                                                                  | Rujukan                           |
| 11     | Indeks dan constraint | https://orm.drizzle.team/docs/indexes-constraints                                                                 | Rujukan                           |
| 12     | Relasi                | https://orm.drizzle.team/docs/relations                                                                           | Rujukan                           |
| 13     | Select, insert, join  | https://orm.drizzle.team/docs/select , https://orm.drizzle.team/docs/insert , https://orm.drizzle.team/docs/joins | Isi fungsi model                  |
| 14     | Transaksi di Drizzle  | https://orm.drizzle.team/docs/transactions                                                                        | Rujukan                           |
| 15     | Migrasi               | https://orm.drizzle.team/docs/migrations                                                                          | Alur perubahan skema              |

Ahmad dan Bintang cukup membaca nomor 1, 7, dan 13 dari tabel Fadlan agar paham fungsi model yang mereka panggil.

Struktur, config, dan lingkungan (Zaki):

| Urutan | Topik                       | Tautan                                                                                                                                | Catatan                                  |
| ------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1      | Instalasi Next.js           | https://nextjs.org/docs/app/getting-started/installation                                                                              | `create-next-app` dan pilihannya         |
| 2      | Better Auth, pengenalan     | https://better-auth.com/docs/introduction                                                                                             | Pustaka login                            |
| 3      | Better Auth, instalasi      | https://better-auth.com/docs/installation                                                                                             | Praktik                                  |
| 4      | Better Auth dengan Next.js  | https://better-auth.com/docs/integrations/next                                                                                        | Rujukan                                  |
| 5      | Better Auth, login Google   | https://better-auth.com/docs/authentication/google                                                                                    | Kebutuhan F1                             |
| 6      | Better Auth dengan Drizzle  | https://better-auth.com/docs/adapters/drizzle                                                                                         | Rujukan                                  |
| 7      | Docker, gambaran            | https://docs.docker.com/get-started/docker-overview/                                                                                  | Image, kontainer, volume                 |
| 8      | Docker Compose, mulai cepat | https://docs.docker.com/compose/gettingstarted/                                                                                       | Praktik                                  |
| 9      | Image resmi MySQL           | https://hub.docker.com/_/mysql                                                                                                        | Variabel dan volume kontainer database   |
| 10     | Proxy di Next.js            | https://nextjs.org/docs/app/getting-started/proxy                                                                                     | Pengganti middleware pada versi sekarang |
| 11     | ESLint                      | https://eslint.org/docs/latest/use/getting-started                                                                                    | Pemeriksa kode                           |
| 12     | Prettier                    | https://prettier.io/docs/                                                                                                             | Perapi kode                              |
| 13     | CODEOWNERS                  | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners | Memaksa review lead pada PR              |
| 14     | OWASP Top Ten               | https://owasp.org/projects/top-ten                                                                                                    | Daftar risiko keamanan terbesar          |

Aturan tim: `.claude/skills/klass-setup/SKILL.md`, `klass-api/SKILL.md`, `klass-db/SKILL.md`, dan `klass-izin/SKILL.md`.

## Bacaan per orang

| Anggota | Peran                          | Setelah Tahap 0 sampai 3                      |
| ------- | ------------------------------ | --------------------------------------------- |
| Rehan   | Komponen dan desain halaman    | Tahap 4A nomor 1 sampai 16                    |
| Darrel  | Komponen dan desain halaman    | Tahap 4A nomor 1 sampai 16                    |
| Aqil    | Slicing, lead frontend         | Tahap 4A seluruhnya, termasuk tabel tambahan  |
| Zaki    | Struktur, config, lead backend | Tahap 4B seluruhnya                           |
| Ahmad   | URL dan controller             | Tahap 4B dasar, lalu tabel URL dan controller |
| Bintang | URL dan controller             | Tahap 4B dasar, lalu tabel URL dan controller |
| Fadlan  | Database dan model             | Tahap 4B dasar, lalu tabel database dan model |

## Dibaca nanti, setelah MVP berjalan

| Topik                           | Tautan                                                    | Kapan                                  |
| ------------------------------- | --------------------------------------------------------- | -------------------------------------- |
| Push API                        | https://developer.mozilla.org/en-US/docs/Web/API/Push_API | Saat mengerjakan pengingat tugas (F10) |
| Notifikasi push, gambaran       | https://web.dev/articles/push-notifications-overview      | Saat mengerjakan F10                   |
| Next.js, hosting sendiri        | https://nextjs.org/docs/app/guides/self-hosting           | Saat menyiapkan server                 |
| Caddy                           | https://caddyserver.com/docs/                             | Saat memasang HTTPS di server          |
| Cadangan database (`mysqldump`) | https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html    | Saat menyiapkan backup terjadwal       |
| Keamanan web (MDN)              | https://developer.mozilla.org/en-US/docs/Web/Security     | Sebelum rilis ke pengguna              |
