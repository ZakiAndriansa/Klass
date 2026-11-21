"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Indeks map di tepi kanan: tab-tab folder yang menempel di pinggir layar.
 * Tab aktif atau yang disentuh mouse bergeser keluar, memperlihatkan label.
 *
 * Disembunyikan di bawah 1280px agar tidak menutupi konten. Penanda aktif
 * memakai IntersectionObserver; tanpa JavaScript, semua tab tetap bisa
 * diklik dan halaman tetap terbaca.
 */
export type ItemIndeks = {
  id: string;
  nomor: string;
  label: string;
};

export function IndeksMap({ item }: { item: ItemIndeks[] }) {
  const [aktif, setAktif] = useState(item[0]?.id ?? "");

  useEffect(() => {
    const bagian = item
      .map(({ id }) => document.getElementById(id))
      .filter((elemen): elemen is HTMLElement => elemen !== null);

    if (bagian.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const pengamat = new IntersectionObserver(
      (entries) => {
        const terlihat = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (terlihat) {
          setAktif(terlihat.target.id);
        }
      },
      { rootMargin: "-30% 0px -58% 0px", threshold: [0, 0.2, 0.45, 0.75, 1] },
    );

    bagian.forEach((elemen) => pengamat.observe(elemen));
    return () => pengamat.disconnect();
  }, [item]);

  return (
    <nav className="indeks-map" aria-label="Isi halaman">
      <ol className="indeks-map__daftar">
        {item.map(({ id, nomor, label }) => {
          const sedangAktif = aktif === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn("indeks-map__tautan", sedangAktif && "is-active")}
                aria-current={sedangAktif ? "location" : undefined}
              >
                <span className="indeks-map__nomor">{nomor}</span>
                <span className="indeks-map__label">{label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
