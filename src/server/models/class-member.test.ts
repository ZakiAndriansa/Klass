import "server-only";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ConflictError } from "@/server/http/errors";

import { classMemberModel } from "./class-member";
import {
  readResult,
  countResult,
  writeResult,
  query,
  resetMysqlMock,
  queueResults,
  executedSql,
  sampleTime,
} from "./testing/mysql";

vi.mock("mysql2/promise", async () => (await import("./testing/mysql")).driver);
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

const kelas = [
  "kelas",
  "Kelas A",
  "pengaju",
  "active",
  1,
  null,
  null,
  null,
  sampleTime,
  sampleTime,
];
const member = ["kelas", "pengguna", "member", sampleTime];
const admin = ["kelas", "pengguna", "admin", sampleTime];

describe("classMemberModel", () => {
  beforeEach(resetMysqlMock);

  it("mengembalikan null untuk kelas privat dengan kode yang salah", async () => {
    const privat = [...kelas];
    privat[4] = 0;
    privat[5] = "kode-benar";
    queueResults(writeResult, readResult(privat), writeResult);

    await expect(classMemberModel.join("kelas", "pengguna", "salah")).resolves.toBeNull();
    expect(executedSql()).toEqual(["begin", expect.stringContaining("for update"), "commit"]);
  });

  it("menambahkan anggota setelah mengunci kelas dan memeriksa ban", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(),
      readResult(),
      writeResult,
      readResult(member),
      writeResult,
    );

    await expect(classMemberModel.join("kelas", "pengguna")).resolves.toMatchObject({
      role: "member",
    });
    expect(executedSql()).toContainEqual(expect.stringContaining("insert into `class_members`"));
  });

  it("menolak keanggotaan duplikat", async () => {
    queueResults(writeResult, readResult(kelas), readResult(), readResult(member), writeResult);

    await expect(classMemberModel.join("kelas", "pengguna")).rejects.toThrow(ConflictError);
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("menolak pengguna yang diblokir sebelum mencoba menulis anggota", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(["kelas", "pengguna", null, sampleTime]),
      writeResult,
    );

    await expect(classMemberModel.join("kelas", "pengguna")).rejects.toThrow("diblokir");
    expect(executedSql()).not.toContainEqual(expect.stringContaining("insert into"));
  });

  it("menolak anggota baru ketika kelas penuh", async () => {
    const terbatas = [...kelas];
    terbatas[6] = 2;
    queueResults(
      writeResult,
      readResult(terbatas),
      readResult(),
      readResult(),
      countResult(2),
      writeResult,
    );

    await expect(classMemberModel.join("kelas", "pengguna")).rejects.toThrow("sudah penuh");
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it.each(["keluarkan", "ubah peran"])("melindungi admin terakhir saat %s", async (aksi) => {
    queueResults(writeResult, readResult(kelas), readResult(admin), countResult(1), writeResult);
    const operasi =
      aksi === "keluarkan"
        ? classMemberModel.removeMember("kelas", "pengguna")
        : classMemberModel.updateRole("kelas", "pengguna", "member");

    await expect(operasi).rejects.toThrow("minimal satu admin");
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("membatalkan kick dan penghapusan PJ jika penulisan ban gagal", async () => {
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(member),
      writeResult,
      writeResult,
      new Error("insert ban gagal"),
      writeResult,
    );

    await expect(
      classMemberModel.removeMember("kelas", "pengguna", { ban: {} }),
    ).rejects.toHaveProperty("cause.message", "insert ban gagal");
    expect(executedSql().slice(-4)).toEqual([
      expect.stringContaining("delete from `subclass_pj`"),
      expect.stringContaining("delete from `class_members`"),
      expect.stringContaining("insert into `class_bans`"),
      "rollback",
    ]);
  });

  it("menolak undangan admin ulang jika status masih pending", async () => {
    const email = "uji@example.test";
    const undanganPending = ["undangan", "kelas", email, "pending", "pengundang-lama", sampleTime];
    queueResults(writeResult, readResult(kelas), readResult(undanganPending), writeResult);

    await expect(
      classMemberModel.createAdminInvite({
        classId: "kelas",
        email,
        invitedBy: "pengundang-baru",
      }),
    ).rejects.toThrow(ConflictError);
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it.each(["revoked", "accepted"])(
    "mengaktifkan kembali undangan %s menjadi pending dan mengganti pengundang",
    async (status) => {
      const email = "uji@example.test";
      const undanganLama = ["undangan", "kelas", email, status, "pengundang-lama", sampleTime];
      queueResults(
        writeResult,
        readResult(kelas),
        readResult(undanganLama),
        writeResult,
        writeResult,
      );

      await expect(
        classMemberModel.createAdminInvite({
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
      expect(executedSql()[3]).toContain("update `class_admin_invites`");
      expect(executedSql().at(-1)).toBe("commit");
    },
  );

  it("menolak penerimaan undangan jika akan menambah keanggotaan melebihi kuota", async () => {
    const email = "uji@example.test";
    const terbatas = [...kelas];
    terbatas[6] = 1;
    queueResults(
      writeResult,
      readResult(terbatas),
      readResult(["undangan", "kelas", email, "pending", null, sampleTime]),
      readResult(),
      readResult(),
      countResult(1),
      writeResult,
    );

    await expect(
      classMemberModel.acceptAdminInvite("kelas", "undangan", email, "pengguna"),
    ).rejects.toThrow("sudah penuh");
    expect(executedSql().at(-1)).toBe("rollback");
  });

  it("tidak memberi peran admin jika ID pengguna tidak cocok dengan akun pemilik email", async () => {
    const email = "uji@example.test";
    queueResults(writeResult, readResult(kelas), readResult(), writeResult);

    await expect(
      classMemberModel.acceptAdminInvite("kelas", "undangan", email, "akun-lain"),
    ).resolves.toBeNull();
    expect(executedSql()[2]).toContain("inner join `users`");
    expect(executedSql()[2]).toContain("`users`.`email` = `class_admin_invites`.`email`");
    expect(query.mock.calls[2][1]).toEqual(["akun-lain", "undangan", "kelas", email, "pending"]);
    expect(executedSql().at(-1)).toBe("commit");
    expect(query).toHaveBeenCalledTimes(4);
  });

  it("menerima undangan pending dan menaikkan anggota menjadi admin dalam satu transaksi", async () => {
    const email = "uji@example.test";
    queueResults(
      writeResult,
      readResult(kelas),
      readResult(["undangan", "kelas", email, "pending", null, sampleTime]),
      readResult(),
      writeResult,
      writeResult,
      writeResult,
    );

    await expect(
      classMemberModel.acceptAdminInvite("kelas", "undangan", email, "pengguna"),
    ).resolves.toMatchObject({ status: "accepted" });
    expect(executedSql().slice(-3)).toEqual([
      expect.stringContaining("on duplicate key update"),
      expect.stringContaining("update `class_admin_invites`"),
      "commit",
    ]);
  });

  it("menampilkan semua status undangan admin dalam satu kelas", async () => {
    const undanganPending = ["undangan-1", "kelas", "a@example.com", "pending", null, sampleTime];
    const undanganAccepted = ["undangan-2", "kelas", "b@example.com", "accepted", null, sampleTime];
    const undanganRevoked = ["undangan-3", "kelas", "c@example.com", "revoked", null, sampleTime];

    queueResults(countResult(3), readResult(undanganPending, undanganAccepted, undanganRevoked));

    const hasil = await classMemberModel.listInvitesByClass("kelas", { page: 1, limit: 10 });

    expect(hasil.total).toBe(3);
    expect(hasil.rows).toHaveLength(3);
    expect(hasil.rows.map((undangan) => undangan.status)).toEqual([
      "pending",
      "accepted",
      "revoked",
    ]);

    expect(query.mock.calls[1][1]).toEqual(["kelas", 10]);
  });

  it("mengembalikan daftar kosong jika kelas tidak punya undangan", async () => {
    queueResults(countResult(0));

    const hasil = await classMemberModel.listInvitesByClass("kelas", { page: 1, limit: 10 });

    expect(hasil).toEqual({
      rows: [],
      total: 0,
    });

    // Tidak perlu menjalankan SELECT ketika jumlah undangan nol.
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("menggunakan ID kelas yang benar saat mencari undangan", async () => {
    queueResults(
      countResult(1),
      readResult(["undangan-1", "kelas-a", "a@example.com", "pending", null, sampleTime]),
    );

    await classMemberModel.listInvitesByClass("kelas-a", { page: 1, limit: 5 });

    // Query perhitungan dan pengambilan data harus memakai kelas yang sama.
    expect(query.mock.calls[0][1]).toEqual(["kelas-a"]);
    expect(query.mock.calls[1][1]).toEqual(["kelas-a", 5]);
  });

  it("menolak nomor halaman yang tidak valid", async () => {
    await expect(
      classMemberModel.listInvitesByClass("kelas", { page: 0, limit: 10 }),
    ).rejects.toThrow("Halaman harus berupa bilangan bulat positif.");
  });

  it("menolak limit lebih dari 100", async () => {
    await expect(
      classMemberModel.listInvitesByClass("kelas", { page: 1, limit: 101 }),
    ).rejects.toThrow("Jumlah baris per halaman harus antara 1 dan 100.");
  });
  it("mengambil undangan pada halaman kedua", async () => {
    queueResults(
      countResult(6),
      readResult(["undangan-3", "kelas", "c@example.com", "revoked", null, sampleTime]),
    );

    const hasil = await classMemberModel.listInvitesByClass("kelas", { page: 2, limit: 2 });

    expect(hasil.total).toBe(6);
    expect(hasil.rows).toHaveLength(1);
    expect(query.mock.calls[1][1]).toEqual(["kelas", 2, 2]);
  });
});
