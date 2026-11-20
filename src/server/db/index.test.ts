import { describe, expect, it, vi } from "vitest";

const on = vi.hoisted(() => vi.fn());

vi.mock("mysql2/promise", () => ({ default: { createPool: () => ({ on }) } }));
vi.mock("@/env", () => ({ env: { DATABASE_URL: "mysql://localhost/klass_test" } }));

describe("koneksi database", () => {
  it("memaksa setiap koneksi baru memakai zona waktu UTC", async () => {
    await import("./index");

    expect(on).toHaveBeenCalledWith("connection", expect.any(Function));

    // Jalankan pendengarnya dengan koneksi tiruan, seperti yang dilakukan mysql2.
    const query = vi.fn();
    const saatKoneksiBaru = on.mock.calls[0][1] as (koneksi: { query: typeof query }) => void;
    saatKoneksiBaru({ query });

    expect(query).toHaveBeenCalledWith("SET time_zone = '+00:00'", expect.any(Function));
  });
});
