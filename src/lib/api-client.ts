import type { ApiGagal, ApiSukses } from "@/types/api/umum";

/**
 * Pemanggil REST API dari Client Component. Pemilik: Zaki, dipakai tim frontend.
 *
 * Pemakaian:
 *   const { data } = await api<HealthDto>("/health");
 *   await api("/kelas", { method: "POST", body: JSON.stringify(isi) });
 *
 * Bila server menjawab gagal, fungsi ini melempar `ApiError`. Bercabanglah
 * berdasarkan `galat.code`, dan tampilkan `galat.message` ke pengguna.
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

export async function api<T>(path: string, init: RequestInit = {}): Promise<ApiSukses<T>> {
  const respons = await fetch(`/api/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  const isi = (await respons.json().catch(() => null)) as ApiSukses<T> | ApiGagal | null;

  if (isi && "error" in isi) {
    throw new ApiError(respons.status, isi.error.code, isi.error.message, isi.error.details);
  }

  if (!respons.ok || !isi) {
    throw new ApiError(respons.status, "INTERNAL_ERROR", "Server tidak bisa dihubungi.");
  }

  return isi;
}
