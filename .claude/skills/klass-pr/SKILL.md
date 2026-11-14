---
name: klass-pr
description: Alur Git tim Klass, yaitu nama branch, standar pesan commit (diawali Add, Update, Delete, atau Fix), isi PR, siapa reviewer wajibnya, dan aturan penggabungan. Pakai setiap kali diminta "commit", "push", "buat branch", "buat PR", "merge", atau saat menyiapkan pekerjaan untuk ditinjau. Berlaku untuk semua anggota tim.
---

# Alur Git dan PR Klass

## Aturan mutlak

1. Jangan menyebut Claude atau alat AI apa pun di pesan commit, judul PR, deskripsi PR, atau komentar. Tidak ada baris `Co-Authored-By` dan tidak ada catatan "dibuat dengan".
2. Tidak ada push langsung ke `main`. Semua perubahan lewat PR.
3. Jangan `git push --force` ke branch milik orang lain atau ke `main`.
4. Jangan meng-commit `.env`, kunci, kata sandi, atau data pengguna asli.
5. Commit dan push hanya dilakukan bila diminta pemilik pekerjaan.

## Branch

Format `<jenis>/<nama>-<ringkas>`, huruf kecil dengan tanda hubung:

```
feat/rehan-kartu-tugas
feat/ahmad-api-join-kelas
fix/bintang-pengingat-ganda
chore/zaki-config-eslint
db/fadlan-tabel-subkelas
```

Selalu bercabang dari `main` terbaru. Satu branch untuk satu pekerjaan kecil; PR di atas kira-kira 400 baris sebaiknya dipecah.

## Commit

Setiap pesan commit **selalu diawali** salah satu dari empat kata ini, lalu titik dua, lalu ringkasan singkat berbahasa Indonesia:

| Awalan | Dipakai saat | Contoh |
| --- | --- | --- |
| `Add` | Menambah sesuatu yang baru: berkas, fitur, komponen, tabel, endpoint | `Add: kartu tugas dengan status tenggat` |
| `Update` | Mengubah yang sudah ada tanpa memperbaiki bug: tampilan, isi, config, dokumen, perapian kode | `Update: warna tombol utama memakai token primary` |
| `Delete` | Menghapus berkas, fitur, atau kode yang tidak dipakai | `Delete: gambar bawaan Next.js di folder public` |
| `Fix` | Memperbaiki sesuatu yang salah atau rusak | `Fix: kick terhadap admin terakhir tidak ditolak` |

Aturan penulisan:

1. Bentuknya `Awalan: ringkasan`. Awalan diawali huruf besar dan ditulis persis seperti di tabel, tidak ada awalan lain (`feat`, `chore`, `Tambah`, `Edit`, dan sejenisnya tidak dipakai).
2. Ringkasan menjelaskan apa yang berubah, paling panjang kira-kira 70 karakter, tanpa titik di akhir.
3. Satu commit satu jenis perubahan. Bila sebuah pekerjaan menambah sekaligus menghapus, pecah menjadi dua commit; bila tidak bisa dipecah, pakai awalan dari perubahan utamanya.
4. Bila ragu antara `Update` dan `Fix`: sebelumnya salah atau rusak berarti `Fix`, sebelumnya benar tetapi diubah berarti `Update`.
5. Judul PR memakai bentuk yang sama.

Commit pertama repo (`chore: setup awal proyek Klass`) dibuat sebelum standar ini berlaku dan dibiarkan apa adanya.

## Reviewer wajib

| Perubahan menyentuh | Harus disetujui |
| --- | --- |
| `src/components/**` | Aqil |
| `src/app/**` selain `api` | Aqil |
| Semua backend: `src/app/api/**`, `src/server/**`, `drizzle/**`, `worker/` | Zaki |
| Config, `docker/`, `compose.yaml`, `.github/`, `.claude/` | Zaki |

Aqil adalah lead frontend dan Zaki lead backend. Tidak ada PR backend yang digabung tanpa persetujuan Zaki, dan tidak ada PR frontend yang digabung tanpa persetujuan Aqil. Anggota lain boleh ikut meninjau, misalnya Fadlan untuk perubahan skema, tetapi tinjauan itu tidak menggantikan persetujuan lead.

PR yang menyentuh frontend dan backend sekaligus butuh persetujuan keduanya. Penulis tidak menggabungkan PR-nya sendiri sebelum persetujuan itu ada.

## Isi PR

Judul mengikuti standar pesan commit di atas. Deskripsi berisi:

```
## Apa yang berubah
## Kebutuhan PRD terkait        (misalnya F8, F10)
## Cara mencoba
## Tangkapan layar              (wajib untuk frontend)
## Catatan untuk reviewer       (perubahan skema, perubahan bentuk respons API, hal yang belum selesai)
```

## Sebelum meminta review

1. `git fetch` lalu rebase atau merge `main` terbaru dan selesaikan konflik di branch sendiri.
2. `npm run lint`, `npm run typecheck`, `npm run test` lolos. Bila ada yang gagal, tulis apa adanya di PR, jangan disembunyikan.
3. Baca ulang diff sendiri dan buang berkas yang tidak sengaja ikut berubah.

## Penggabungan

Pakai squash merge agar riwayat `main` satu commit per PR, lalu hapus branch-nya.
