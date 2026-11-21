import type { ApiFailure, ApiSuccess } from "@/types/api/common";

import { alamatLogin } from "./tujuan";

/**
 * Pemanggil REST API dari Client Component. Pemilik: Zaki, dipakai tim frontend.
 *
 * Pemakaian:
 *   const { data } = await api<HealthDto>("/health");
 *   await api("/classes", { method: "POST", body: JSON.stringify(isi) });
 *
 * Bila server menjawab gagal, fungsi ini melempar `ApiError`. Bercabanglah
 * berdasarkan `galat.code`, dan tampilkan `galat.message` ke pengguna.
 *
 * Bila jawabannya 401 (belum login atau sesi habis), pengguna langsung dipindahkan
 * ke `/login` dan dikembalikan ke halaman semula setelah masuk. Komponen tidak
 * perlu menangani 401 sendiri. Untuk mematikannya: `api(path, { alihkanSaat401: false })`.
 *
 * Di Server Component jangan memakai ini; panggil controller langsung.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: unknown = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type OpsiApi = RequestInit & {
  /** `false` supaya jawaban 401 tidak memindahkan pengguna ke `/login`. Bawaannya `true`. */
  alihkanSaat401?: boolean;
};

export async function api<T>(
  path: string,
  { alihkanSaat401 = true, ...init }: OpsiApi = {},
): Promise<ApiSuccess<T>> {
  const respons = await fetch(`/api/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  const isi = (await respons.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (isi && "error" in isi) {
    if (respons.status === 401 && alihkanSaat401 && typeof window !== "undefined") {
      window.location.assign(alamatLogin(window.location.pathname + window.location.search));
    }

    throw new ApiError(respons.status, isi.error.code, isi.error.message, isi.error.details);
  }

  if (!respons.ok || !isi) {
    throw new ApiError(respons.status, "INTERNAL_ERROR", "Server tidak bisa dihubungi.");
  }

  return isi;
}
