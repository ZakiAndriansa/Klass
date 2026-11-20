import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/server/http/errors";

import { anggotaKelasModel } from "./anggota-kelas";
import {
  hasilBaca,
  hasilHitung,
  hasilTulis,
  query,
  resetMysqlTiruan,
  siapkan,
  sqlDijalankan,
  waktu,
} from "./uji/mysql";

vi.mock("mysql2/promise", async () => (await import("./uji/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const kelas = ["kelas", "Kelas A", "pengaju", "active", 1, null, null, null, waktu, waktu];
const member = ["kelas", "pengguna", "member", waktu];
const admin = ["kelas", "pengguna", "admin", waktu];

describe("anggotaKelasModel", () => {
  beforeEach(resetMysqlTiruan);

  it("mengembalikan null untuk kelas privat dengan kode yang salah", async () => {
    const privat = [...kelas];
    privat[4] = 0;
    privat[5] = "kode-benar";
    siapkan(hasilTulis, hasilBaca(privat), hasilTulis);

    await expect(anggotaKelasModel.gabung("kelas", "pengguna", "salah")).resolves.toBeNull();
    expect(sqlDijalankan()).toEqual(["begin", expect.stringContaining("for update"), "commit"]);
  });

  it("menambahkan anggota setelah mengunci kelas dan memeriksa ban", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(),
      hasilBaca(),
      hasilTulis,
      hasilBaca(member),
      hasilTulis,
    );

    await expect(anggotaKelasModel.gabung("kelas", "pengguna")).resolves.toMatchObject({
      role: "member",
    });
    expect(sqlDijalankan()).toContainEqual(expect.stringContaining("insert into `class_members`"));
  });

  it("menolak keanggotaan duplikat", async () => {
    siapkan(hasilTulis, hasilBaca(kelas), hasilBaca(), hasilBaca(member), hasilTulis);

    await expect(anggotaKelasModel.gabung("kelas", "pengguna")).rejects.toThrow(ConflictError);
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("menolak pengguna yang diblokir sebelum mencoba menulis anggota", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(["kelas", "pengguna", null, waktu]),
      hasilTulis,
    );

    await expect(anggotaKelasModel.gabung("kelas", "pengguna")).rejects.toThrow("diblokir");
    expect(sqlDijalankan()).not.toContainEqual(expect.stringContaining("insert into"));
  });

  it("menolak anggota baru ketika kelas penuh", async () => {
    const terbatas = [...kelas];
    terbatas[6] = 2;
    siapkan(hasilTulis, hasilBaca(terbatas), hasilBaca(), hasilBaca(), hasilHitung(2), hasilTulis);

    await expect(anggotaKelasModel.gabung("kelas", "pengguna")).rejects.toThrow("sudah penuh");
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it.each(["keluarkan", "ubah peran"])("melindungi admin terakhir saat %s", async (aksi) => {
    siapkan(hasilTulis, hasilBaca(kelas), hasilBaca(admin), hasilHitung(1), hasilTulis);
    const operasi =
      aksi === "keluarkan"
        ? anggotaKelasModel.keluarkanAnggota("kelas", "pengguna")
        : anggotaKelasModel.ubahPeran("kelas", "pengguna", "member");

    await expect(operasi).rejects.toThrow("minimal satu admin");
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("membatalkan kick dan penghapusan PJ jika penulisan ban gagal", async () => {
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(member),
      hasilTulis,
      hasilTulis,
      new Error("insert ban gagal"),
      hasilTulis,
    );

    await expect(
      anggotaKelasModel.keluarkanAnggota("kelas", "pengguna", { ban: {} }),
    ).rejects.toHaveProperty("cause.message", "insert ban gagal");
    expect(sqlDijalankan().slice(-4)).toEqual([
      expect.stringContaining("delete from `subclass_pj`"),
      expect.stringContaining("delete from `class_members`"),
      expect.stringContaining("insert into `class_bans`"),
      "rollback",
    ]);
  });

  it("menolak undangan admin ulang jika status masih pending", async () => {
    const email = "uji@example.test";
    const undanganPending = ["undangan", "kelas", email, "pending", "pengundang-lama", waktu];
    siapkan(hasilTulis, hasilBaca(kelas), hasilBaca(undanganPending), hasilTulis);

    await expect(
      anggotaKelasModel.buatUndanganAdmin({
        classId: "kelas",
        email,
        invitedBy: "pengundang-baru",
      }),
    ).rejects.toThrow(ConflictError);
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it.each(["revoked", "accepted"])(
    "mengaktifkan kembali undangan %s menjadi pending dan mengganti pengundang",
    async (status) => {
      const email = "uji@example.test";
      const undanganLama = ["undangan", "kelas", email, status, "pengundang-lama", waktu];
      siapkan(hasilTulis, hasilBaca(kelas), hasilBaca(undanganLama), hasilTulis, hasilTulis);

      await expect(
        anggotaKelasModel.buatUndanganAdmin({
          classId: "kelas",
          email,
          invitedBy: "pengundang-baru",
        }),
      ).resolves.toMatchObject({
        id: "undangan",
        status: "pending",
        invitedBy: "pengundang-baru",
      });
      expect(query.mock.calls[3][1]).toEqual(["pending", "pengundang-baru", "undangan"]);
      expect(sqlDijalankan()[3]).toContain("update `class_admin_invites`");
      expect(sqlDijalankan().at(-1)).toBe("commit");
    },
  );

  it("menolak penerimaan undangan jika akan menambah keanggotaan melebihi kuota", async () => {
    const email = "uji@example.test";
    const terbatas = [...kelas];
    terbatas[6] = 1;
    siapkan(
      hasilTulis,
      hasilBaca(terbatas),
      hasilBaca(["undangan", "kelas", email, "pending", null, waktu]),
      hasilBaca(),
      hasilBaca(),
      hasilHitung(1),
      hasilTulis,
    );

    await expect(
      anggotaKelasModel.terimaUndanganAdmin("kelas", "undangan", email, "pengguna"),
    ).rejects.toThrow("sudah penuh");
    expect(sqlDijalankan().at(-1)).toBe("rollback");
  });

  it("tidak memberi peran admin jika ID pengguna tidak cocok dengan akun pemilik email", async () => {
    const email = "uji@example.test";
    siapkan(hasilTulis, hasilBaca(kelas), hasilBaca(), hasilTulis);

    await expect(
      anggotaKelasModel.terimaUndanganAdmin("kelas", "undangan", email, "akun-lain"),
    ).resolves.toBeNull();
    expect(sqlDijalankan()[2]).toContain("inner join `users`");
    expect(sqlDijalankan()[2]).toContain("`users`.`email` = `class_admin_invites`.`email`");
    expect(query.mock.calls[2][1]).toEqual(["akun-lain", "undangan", "kelas", email, "pending"]);
    expect(sqlDijalankan().at(-1)).toBe("commit");
    expect(query).toHaveBeenCalledTimes(4);
  });

  it("menerima undangan pending dan menaikkan anggota menjadi admin dalam satu transaksi", async () => {
    const email = "uji@example.test";
    siapkan(
      hasilTulis,
      hasilBaca(kelas),
      hasilBaca(["undangan", "kelas", email, "pending", null, waktu]),
      hasilBaca(),
      hasilTulis,
      hasilTulis,
      hasilTulis,
    );

    await expect(
      anggotaKelasModel.terimaUndanganAdmin("kelas", "undangan", email, "pengguna"),
    ).resolves.toMatchObject({ status: "accepted" });
    expect(sqlDijalankan().slice(-3)).toEqual([
      expect.stringContaining("on duplicate key update"),
      expect.stringContaining("update `class_admin_invites`"),
      "commit",
    ]);
  });

  it("menampilkan semua status undangan admin dalam satu kelas", async () => {
    const undanganPending = ["undangan-1", "kelas", "a@example.com", "pending", null, waktu];
    const undanganAccepted = ["undangan-2", "kelas", "b@example.com", "accepted", null, waktu];
    const undanganRevoked = ["undangan-3", "kelas", "c@example.com", "revoked", null, waktu];

    siapkan(hasilHitung(3), hasilBaca(undanganPending, undanganAccepted, undanganRevoked));

    const hasil = await anggotaKelasModel.daftarUndanganPerKelas("kelas", { page: 1, limit: 10 });

    expect(hasil.total).toBe(3);
    expect(hasil.baris).toHaveLength(3);
    expect(hasil.baris.map((undangan) => undangan.status)).toEqual([
      "pending",
      "accepted",
      "revoked",
    ]);

    expect(query.mock.calls[1][1]).toEqual(["kelas", 10]);
  });

  it("mengembalikan daftar kosong jika kelas tidak punya undangan", async () => {
    siapkan(hasilHitung(0));

    const hasil = await anggotaKelasModel.daftarUndanganPerKelas("kelas", { page: 1, limit: 10 });

    expect(hasil).toEqual({
      baris: [],
      total: 0,
    });

    // Tidak perlu menjalankan SELECT ketika jumlah undangan nol.
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("menggunakan ID kelas yang benar saat mencari undangan", async () => {
    siapkan(
      hasilHitung(1),
      hasilBaca(["undangan-1", "kelas-a", "a@example.com", "pending", null, waktu]),
    );

    await anggotaKelasModel.daftarUndanganPerKelas("kelas-a", { page: 1, limit: 5 });

    // Query perhitungan dan pengambilan data harus memakai kelas yang sama.
    expect(query.mock.calls[0][1]).toEqual(["kelas-a"]);
    expect(query.mock.calls[1][1]).toEqual(["kelas-a", 5]);
  });

  it("menolak nomor halaman yang tidak valid", async () => {
    await expect(
      anggotaKelasModel.daftarUndanganPerKelas("kelas", { page: 0, limit: 10 }),
    ).rejects.toThrow("Halaman harus berupa bilangan bulat positif.");
  });

  it("menolak limit lebih dari 100", async () => {
    await expect(
      anggotaKelasModel.daftarUndanganPerKelas("kelas", { page: 1, limit: 101 }),
    ).rejects.toThrow("Jumlah baris per halaman harus antara 1 dan 100.");
  });
  it("mengambil undangan pada halaman kedua", async () => {
    siapkan(
      hasilHitung(6),
      hasilBaca(["undangan-3", "kelas", "c@example.com", "revoked", null, waktu]),
    );

    const hasil = await anggotaKelasModel.daftarUndanganPerKelas("kelas", { page: 2, limit: 2 });

    expect(hasil.total).toBe(6);
    expect(hasil.baris).toHaveLength(1);
    expect(query.mock.calls[1][1]).toEqual(["kelas", 2, 2]);
  });
});
