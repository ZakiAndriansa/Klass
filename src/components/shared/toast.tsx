"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Notifikasi mengambang (toast) bergaya kalimat tersorot.
 *
 * Satu provider di halaman, satu tombol pemicu di mana pun. Toast menumpuk
 * maksimal tiga, hilang sendiri setelah 5 detik, dan bisa ditutup manual.
 *
 * Ukuran region mengikuti isi (`width: fit-content`) dengan batas 18rem, jadi
 * pesan pendek tidak menyisakan ruang kosong.
 */
type ToastItem = {
  id: number;
  pesan: string;
  varian: "sukses" | "info" | "error";
};

type KonteksToast = {
  tampilkan: (pesan: string, varian?: ToastItem["varian"]) => void;
};

const MAKS_TOAST = 3;
const DURASI_MS = 5000;

/** Hook kecil supaya halaman bisa memanggil toast dari mana saja. */
export function useToast() {
  const [daftar, setDaftar] = useState<ToastItem[]>([]);
  const urutan = useRef(0);

  const tampilkan = useCallback((pesan: string, varian: ToastItem["varian"] = "sukses") => {
    urutan.current += 1;
    const id = urutan.current;
    setDaftar((lama) => [...lama, { id, pesan, varian }].slice(-MAKS_TOAST));
  }, []);

  const tutup = useCallback((id: number) => {
    setDaftar((lama) => lama.filter((toast) => toast.id !== id));
  }, []);

  return { daftar, tampilkan, tutup };
}

type ToastRegionProps = {
  daftar: ToastItem[];
  saatTutup: (id: number) => void;
  className?: string;
};

export function ToastRegion({ daftar, saatTutup, className }: ToastRegionProps) {
  return (
    <div
      className={cn("toast-region", className)}
      aria-live="polite"
      aria-atomic="true"
      data-toast-region
    >
      {daftar.map((toast) => (
        <Toast key={toast.id} toast={toast} saatTutup={saatTutup} />
      ))}
    </div>
  );
}

function Toast({ toast, saatTutup }: { toast: ToastItem; saatTutup: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => saatTutup(toast.id), DURASI_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, saatTutup]);

  return (
    <div className="toast">
      <p className="toast__body">
        <span className="toast__msg">{toast.pesan}</span>
      </p>
      <button
        type="button"
        className="toast__dismiss"
        aria-label="Tutup notifikasi"
        onClick={() => saatTutup(toast.id)}
      >
        &times;
      </button>
    </div>
  );
}

export type { ToastItem, KonteksToast };
