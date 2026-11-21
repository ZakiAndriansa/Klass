"use client";

import { useEffect, useId, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Dialog memakai elemen <dialog> asli, jadi focus trap, Escape, dan
 * pengembalian fokus ke tombol pemicu ditangani peramban.
 *
 * Tambahan dari galeri: klik di area backdrop menutup dialog.
 *
 * Pemakaian: kendalikan lewat props `terbuka` dan `saatTutup`.
 */
type DialogProps = {
  terbuka: boolean;
  saatTutup: () => void;
  judul: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Dialog({ terbuka, saatTutup, judul, children, footer, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Satu halaman bisa punya lebih dari satu dialog (mis. antrean + panel tolak).
  // Tanpa id unik, `aria-labelledby` menunjuk judul dialog yang salah.
  const idJudul = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (terbuka && !dialog.open) {
      dialog.showModal();
    } else if (!terbuka && dialog.open) {
      dialog.close();
    }
  }, [terbuka]);

  return (
    <dialog
      ref={dialogRef}
      className={cn("modal", className)}
      aria-labelledby={idJudul}
      onClose={saatTutup}
      onCancel={(e) => {
        e.preventDefault();
        saatTutup();
      }}
      onClick={(e) => {
        // Klik tepat pada <dialog> berarti di area backdrop, bukan isi sheet.
        if (e.target === dialogRef.current) saatTutup();
      }}
    >
      <div className="modal__sheet">
        <div className="modal__header">
          <h3 className="modal__title" id={idJudul}>
            {judul}
          </h3>
          <button
            type="button"
            className="modal__close"
            aria-label="Tutup dialog"
            onClick={saatTutup}
          >
            &times;
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </dialog>
  );
}
