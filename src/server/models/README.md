# src/server/models

**Pemilik:** Fadlan · **Reviewer wajib:** Zaki

Model adalah kumpulan fungsi yang membaca dan mengubah database. **Hanya folder ini yang boleh menulis query.**

Satu berkas per modul, mengekspor satu objek:

```ts
export const materiModel = {
  async buat(data) { ... },
  async cariPerId(id) { ... },
  async daftarPerSubkelas(subclassId, { page, limit }) { ... },
};
```

## Aturan

1. Model menerima nilai yang sudah divalidasi dan mengembalikan data. Model tidak tahu soal HTTP, login, atau role.
2. Model tidak memeriksa izin; itu tugas controller.
3. Perubahan yang harus utuh (misalnya join kelas, kick anggota) ditulis sebagai satu fungsi dengan `db.transaction`.
4. Bila Ahmad atau Bintang butuh fungsi baru, sepakati dulu nama, masukan, dan keluarannya.

Contoh untuk ditiru: `health.ts`.

Skill: `klass-db`.
