import { describe, expect, it } from "vitest";

import { alamatLogin, tujuanAman } from "./tujuan";

describe("tujuanAman", () => {
  it.each(["/dashboard", "/classes/123?tab=materials", "/classes/request"])(
    "menerima %s",
    (jalur) => {
      expect(tujuanAman(jalur)).toBe(jalur);
    },
  );

  it.each([
    ["alamat situs lain", "https://situs-jahat.test"],
    ["alamat tanpa protokol", "//situs-jahat.test/x"],
    ["garis miring terbalik", "/\\situs-jahat.test"],
    ["bukan jalur", "dashboard"],
    ["skema javascript", "javascript:alert(1)"],
    ["kosong", ""],
    ["null", null],
    ["halaman login sendiri", "/login?next=/dashboard"],
  ])("menolak %s dan memakai tujuan bawaan", (_nama, nilai) => {
    expect(tujuanAman(nilai)).toBe("/dashboard");
  });
});

describe("alamatLogin", () => {
  it("mengingat halaman asal", () => {
    expect(alamatLogin("/classes/123?tab=materials")).toBe(
      "/login?next=%2Fclasses%2F123%3Ftab%3Dmaterials",
    );
  });

  it("tanpa halaman asal yang sah, cukup /login", () => {
    expect(alamatLogin()).toBe("/login");
    expect(alamatLogin("https://situs-jahat.test")).toBe("/login");
  });
});
