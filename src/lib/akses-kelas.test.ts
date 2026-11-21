import { describe, expect, it } from "vitest";

import { bolehKelolaSubkelas, hakKelas, labelPeran, type AksesKelas } from "./akses-kelas";

const admin: AksesKelas = { role: "admin", pjSubclassIds: [], readOnly: false };
const pj: AksesKelas = { role: "member", pjSubclassIds: ["sub-1"], readOnly: false };
const anggota: AksesKelas = { role: "member", pjSubclassIds: [], readOnly: false };
const belumGabung: AksesKelas = { role: null, pjSubclassIds: [], readOnly: false };
const adminArsip: AksesKelas = { role: "admin", pjSubclassIds: [], readOnly: true };

describe("hakKelas", () => {
  it("admin boleh mengatur kelas", () => {
    expect(hakKelas(admin)).toEqual({
      bolehAturKelas: true,
      sudahAnggota: true,
      perluGabung: false,
      terkunci: false,
    });
  });

  it("anggota dan PJ tidak boleh mengatur kelas", () => {
    expect(hakKelas(anggota).bolehAturKelas).toBe(false);
    expect(hakKelas(pj).bolehAturKelas).toBe(false);
  });

  it("yang belum bergabung mendapat tombol gabung", () => {
    expect(hakKelas(belumGabung).perluGabung).toBe(true);
    expect(hakKelas(belumGabung).sudahAnggota).toBe(false);
  });

  it("kelas terarsip mengunci admin sekalipun", () => {
    expect(hakKelas(adminArsip).bolehAturKelas).toBe(false);
    expect(hakKelas(adminArsip).terkunci).toBe(true);
  });

  it("akses null tidak menampilkan tombol apa pun", () => {
    expect(hakKelas(null)).toEqual({
      bolehAturKelas: false,
      sudahAnggota: false,
      perluGabung: false,
      terkunci: false,
    });
  });
});

describe("bolehKelolaSubkelas", () => {
  it("admin boleh di semua subkelas", () => {
    expect(bolehKelolaSubkelas(admin, "sub-1")).toBe(true);
    expect(bolehKelolaSubkelas(admin, "sub-lain")).toBe(true);
  });

  it("PJ hanya boleh di subkelas yang dipegangnya", () => {
    expect(bolehKelolaSubkelas(pj, "sub-1")).toBe(true);
    expect(bolehKelolaSubkelas(pj, "sub-2")).toBe(false);
  });

  it("anggota biasa tidak boleh mengelola", () => {
    expect(bolehKelolaSubkelas(anggota, "sub-1")).toBe(false);
  });

  it("kelas terarsip mengunci semua orang", () => {
    expect(bolehKelolaSubkelas(adminArsip, "sub-1")).toBe(false);
  });

  it("null tidak boleh apa pun", () => {
    expect(bolehKelolaSubkelas(null, "sub-1")).toBe(false);
  });
});

describe("labelPeran", () => {
  it("memberi label sesuai peran sebenarnya", () => {
    expect(labelPeran(admin)).toBe("Admin kelas");
    expect(labelPeran(pj)).toBe("PJ");
    expect(labelPeran(anggota)).toBe("Anggota");
    expect(labelPeran(belumGabung)).toBe("Belum gabung");
    expect(labelPeran(null)).toBe("Belum gabung");
  });

  it("member tanpa subkelas bukan PJ", () => {
    // Penting: daftar pjSubclassIds kosong tidak boleh menghasilkan label "PJ".
    expect(labelPeran({ role: "member", pjSubclassIds: [], readOnly: false })).toBe("Anggota");
  });
});
