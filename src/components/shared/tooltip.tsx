"use client";

import { cloneElement, isValidElement, useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Tooltip berupa label stabilo yang muncul saat kursor mendekat atau saat
 * elemen pemicu mendapat fokus keyboard.
 *
 * Struktur: pembungkus `.tooltip-trigger` (posisi relatif) berisi elemen
 * pemicu dan label tooltip-nya. `aria-describedby` ditempel ke elemen pemicu,
 * bukan ke pembungkus, supaya pembaca layar mengumumkannya bersama tombolnya.
 *
 * Tidak butuh JavaScript: muncul dari CSS `:hover` dan `:focus-within`.
 */
type TooltipProps = {
  teks: string;
  /** Satu elemen pemicu yang menerima `className` dan atribut ARIA. */
  children: React.ReactElement<{ className?: string; "aria-describedby"?: string }>;
  className?: string;
};

export function Tooltip({ teks, children, className }: TooltipProps) {
  const id = useId();

  if (!isValidElement(children)) return null;

  return (
    <span className={cn("tooltip-trigger", className)}>
      {cloneElement(children, { "aria-describedby": id })}
      <span className="tooltip" role="tooltip" id={id}>
        {teks}
      </span>
    </span>
  );
}
