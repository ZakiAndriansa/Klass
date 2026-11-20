import { describe, expect, it } from "vitest";

import { bacaJson } from "./body";
import { ValidationError } from "./errors";

function permintaan(body?: string) {
  return new Request("http://localhost/api/v1/contoh", { method: "POST", body });
}

describe("bacaJson", () => {
  it("mengembalikan isi body bila JSON-nya valid", async () => {
    await expect(bacaJson(permintaan('{"name":"Basis Data"}'))).resolves.toEqual({
      name: "Basis Data",
    });
  });

  it("melempar ValidationError (400) bila body bukan JSON", async () => {
    await expect(bacaJson(permintaan("{ini bukan json"))).rejects.toBeInstanceOf(ValidationError);
  });

  it("melempar ValidationError (400) bila body kosong", async () => {
    await expect(bacaJson(permintaan())).rejects.toBeInstanceOf(ValidationError);
  });
});
