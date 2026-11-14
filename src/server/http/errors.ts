/**
 * Galat yang dikenali API. Pemilik: Zaki.
 *
 * Controller dan model cukup melempar salah satu kelas di bawah, misalnya
 * `throw new NotFoundError("Kelas tidak ditemukan.")`. Pembungkus `handle()` yang
 * mengubahnya menjadi respons JSON dengan status yang benar.
 *
 * `message` berbahasa Indonesia karena ditampilkan ke pengguna.
 * `code` berbahasa Inggris huruf besar karena dipakai frontend untuk bercabang.
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: unknown = null,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** 400: data yang dikirim tidak valid. */
export class ValidationError extends AppError {
  constructor(message = "Data yang dikirim tidak valid.", details: unknown = null) {
    super(400, "VALIDATION_ERROR", message, details);
  }
}

/** 401: belum login. */
export class UnauthorizedError extends AppError {
  constructor(message = "Kamu harus login lebih dulu.") {
    super(401, "UNAUTHORIZED", message);
  }
}

/** 403: sudah login tetapi tidak berhak. */
export class ForbiddenError extends AppError {
  constructor(message = "Kamu tidak punya izin untuk aksi ini.") {
    super(403, "FORBIDDEN", message);
  }
}

/** 404: data tidak ada, atau tidak boleh diketahui keberadaannya. */
export class NotFoundError extends AppError {
  constructor(message = "Data tidak ditemukan.") {
    super(404, "NOT_FOUND", message);
  }
}

/** 409: permintaan bertabrakan dengan keadaan data, misalnya sudah menjadi anggota. */
export class ConflictError extends AppError {
  constructor(message = "Permintaan bertabrakan dengan data yang ada.") {
    super(409, "CONFLICT", message);
  }
}
