"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

import { IlustrasiBuku } from "@/components/features/auth/ilustrasi-buku";
import { LambangKlass } from "@/components/shared/lambang-klass";
import { TombolKertas } from "@/components/shared/tombol-kertas";

type ModeAuth = "masuk" | "daftar";
type Flip = { ke: ModeAuth } | null;

const teks: Record<ModeAuth, { eyebrow: string; judul: string }> = {
  masuk: {
    eyebrow: "selamat datang kembali",
    judul: "Masuk ke kelasmu.",
  },
  daftar: {
    eyebrow: "mulai dari sini",
    judul: "Buat akun Klass.",
  },
};

const rute: Record<ModeAuth, string> = {
  masuk: "/login",
  daftar: "/register",
};

const judulDokumen: Record<ModeAuth, string> = {
  masuk: "Masuk | Klass",
  daftar: "Buat akun | Klass",
};

/* Nilai ini harus seirama dengan --ds-auth-flip-duration dan
   --ds-auth-settle-duration di tokens.css. */
const DURASI_FLIP = 900;
const DURASI_REDUP = 200;

/** Lambang Google resmi, dipakai di dalam cip putih tombol. */
function IkonGoogle() {
  return (
    <svg className="auth__google-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="var(--ds-color-google-blue)"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="var(--ds-color-google-green)"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path
        fill="var(--ds-color-google-yellow)"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="var(--ds-color-google-red)"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
    </svg>
  );
}

function idJudulDesktop(mode: ModeAuth) {
  return `auth-judul-desktop-${mode}`;
}

function idJudulMobile(mode: ModeAuth) {
  return `auth-judul-mobile-${mode}`;
}

/** Fokus ke judul halaman yang baru terlihat, bukan ke salinan tersembunyi. */
function fokusKeJudul(mode: ModeAuth) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const kandidat = document.querySelectorAll<HTMLElement>(`[data-auth-judul="${mode}"]`);
      for (const judul of kandidat) {
        if (judul.closest("[inert]")) continue;
        if (judul.getClientRects().length === 0) continue;
        judul.focus({ preventScroll: true });
        return;
      }
    });
  });
}

type KontenAuthProps = {
  mode: ModeAuth;
  interaktif: boolean;
  idJudul: string;
  onTautan?: (event: MouseEvent<HTMLAnchorElement>, ke: ModeAuth) => void;
};

/** Merek, sapaan, tombol Google, dan tautan ganti halaman. */
function KontenAuth({ mode, interaktif, idJudul, onTautan }: KontenAuthProps) {
  const { eyebrow, judul } = teks[mode];
  const modeLain: ModeAuth = mode === "masuk" ? "daftar" : "masuk";
  const labelLain = modeLain === "masuk" ? "Masuk" : "Daftar";

  return (
    <>
      {interaktif ? (
        <Link className="auth__brand" href="/" aria-label="Klass, kembali ke beranda">
          <LambangKlass className="auth__logo" />
          <span>Klass</span>
        </Link>
      ) : (
        <span className="auth__brand">
          <LambangKlass className="auth__logo" />
          <span>Klass</span>
        </span>
      )}

      <div className="auth__content">
        <p className="auth__eyebrow">{eyebrow}</p>
        <h1 className="auth__title" id={idJudul} data-auth-judul={mode} tabIndex={-1}>
          {judul}
        </h1>

        <TombolKertas type="button" variant="primary" size="lg" className="auth__google">
          <span className="auth__google-chip" aria-hidden="true">
            <IkonGoogle />
          </span>
          <span lang="en">Continue with Google</span>
        </TombolKertas>

        <p className="auth__switch">
          {mode === "masuk" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          {interaktif ? (
            <Link
              className="auth__switch-link"
              href={rute[modeLain]}
              onClick={(event) => onTautan?.(event, modeLain)}
            >
              {labelLain}
            </Link>
          ) : (
            <span className="auth__switch-link">{labelLain}</span>
          )}
        </p>
      </div>
    </>
  );
}

type LipatanProps = {
  /** Mode halaman tempat lipatan berada. */
  mode: ModeAuth;
  /** Sisi fisik sudut yang terlipat pada lembar saat ini. */
  sisi: "kanan" | "kiri";
  aktif: boolean;
  onKlik?: () => void;
};

/**
 * Sudut kertas terlipat. Tombolnya transparan; flap segitiga yang terlihat
 * memakai clip-path, jadi sudut halaman benar-benar hilang dari lembar.
 */
function Lipatan({ mode, sisi, aktif, onKlik }: LipatanProps) {
  const ke: ModeAuth = mode === "masuk" ? "daftar" : "masuk";

  return (
    <button
      type="button"
      className={["auth__fold", `auth__fold--${sisi}`, aktif ? "" : "is-pasif"].join(" ").trim()}
      aria-label={ke === "daftar" ? "Go to register" : "Go to login"}
      onClick={onKlik}
      tabIndex={aktif ? 0 : -1}
    >
      <span className="auth__fold-flap" aria-hidden="true" />
    </button>
  );
}

type PapanAuthProps = {
  /** `masuk` untuk /login, `daftar` untuk /register. */
  mode: ModeAuth;
};

/**
 * Layar masuk dan daftar berbentuk buku terbuka.
 *
 * Buku terdiri dari dua halaman dasar bergambar dan satu lembar yang berporos
 * di punggung buku. Sisi depan lembar adalah formulir masuk; sisi belakangnya
 * formulir daftar. Saat dibalik, seluruh bentangan ikut bercermin: formulir
 * pindah ke halaman kiri dan ilustrasi menempati halaman kanan.
 *
 * Tombol Google belum diberi penanganan karena Better Auth dan kredensial
 * Google belum dikonfigurasi (lihat src/server/auth/README.md, kebutuhan F1).
 */
export function PapanAuth({ mode: modeAwal }: PapanAuthProps) {
  const [mode, setMode] = useState(modeAwal);
  const [flip, setFlip] = useState<Flip>(null);
  const [redup, setRedup] = useState(false);
  const timers = useRef<number[]>([]);

  function bersihkanTimer() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

  /* Rute /login dan /register juga dipakai tombol kembali/forward. Animasi
     diputar dari mode saat ini ke mode tujuan, dengan arah yang sama seperti
     klik biasa. */
  useEffect(() => {
    function saatPopstate() {
      const jalur = window.location.pathname;
      if (jalur !== rute.masuk && jalur !== rute.daftar) return;

      const modeBaru: ModeAuth = jalur === rute.daftar ? "daftar" : "masuk";
      if (modeBaru === mode && !flip) return;

      bersihkanTimer();
      setRedup(false);
      document.title = judulDokumen[modeBaru];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setMode(modeBaru);
        setFlip(null);
        setRedup(true);
        fokusKeJudul(modeBaru);
        timers.current.push(window.setTimeout(() => setRedup(false), DURASI_REDUP));
        return;
      }

      /* Popstate di tengah animasi tidak ditumpuk: langsung selesaikan ke
         mode terbaru tanpa memulai putaran kedua. */
      if (flip) {
        setMode(modeBaru);
        setFlip(null);
        fokusKeJudul(modeBaru);
        return;
      }

      setFlip({ ke: modeBaru });
      timers.current.push(
        window.setTimeout(() => {
          setMode(modeBaru);
          setFlip(null);
          fokusKeJudul(modeBaru);
        }, DURASI_FLIP),
      );
    }

    window.addEventListener("popstate", saatPopstate);
    return () => window.removeEventListener("popstate", saatPopstate);
  }, [mode, flip]);

  function selesaikanFlip(ke: ModeAuth) {
    setMode(ke);
    setFlip(null);
    window.history.pushState(window.history.state, "", rute[ke]);
    document.title = judulDokumen[ke];
    fokusKeJudul(ke);
  }

  function gantiMode(ke: ModeAuth) {
    if (ke === mode || flip || redup) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode(ke);
      setRedup(true);
      timers.current.push(
        window.setTimeout(() => {
          window.history.pushState(window.history.state, "", rute[ke]);
          document.title = judulDokumen[ke];
          setRedup(false);
          fokusKeJudul(ke);
        }, DURASI_REDUP),
      );
      return;
    }

    setFlip({ ke });
    timers.current.push(window.setTimeout(() => selesaikanFlip(ke), DURASI_FLIP));
  }

  function gantiLewatTautan(event: MouseEvent<HTMLAnchorElement>, ke: ModeAuth) {
    // Biarkan klik dengan modifier (tab baru, unduh) memakai navigasi biasa.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    gantiMode(ke);
  }

  const sedangBerbalik = flip !== null;
  const kelasBuku = [
    "auth__book",
    `is-${mode}`,
    sedangBerbalik ? "is-flipping" : "",
    flip ? `ke-${flip.ke}` : "",
  ]
    .join(" ")
    .trim();
  const kelasStack = ["auth__stack", `is-${mode}`, flip ? `ke-${flip.ke}` : ""].join(" ").trim();

  const aktifDepan = mode === "masuk" && !sedangBerbalik;
  const aktifBelakang = mode === "daftar" && !sedangBerbalik;
  const idAktifDesktop = idJudulDesktop(mode);
  const idAktifMobile = idJudulMobile(mode);

  return (
    <main className="auth">
      <div className="auth__stage">
        {/* >= 900px: bentangan dua halaman dengan lembar berporos di punggung. */}
        <div className={["auth__desktop", redup ? "is-redup" : ""].join(" ").trim()}>
          <div className={kelasStack}>
            <article
              className={kelasBuku}
              aria-labelledby={idAktifDesktop}
              aria-busy={sedangBerbalik}
            >
              <div className="auth__base auth__base--kiri" aria-hidden="true">
                <div className="auth__art">
                  <IlustrasiBuku idPrefix="auth-kiri" />
                </div>
                <span className="auth__art-wash" />
                <span className="auth__gutter auth__gutter--art auth__gutter--kanan" />
              </div>

              <div className="auth__base auth__base--kanan" aria-hidden="true">
                <div className="auth__art auth__art--cermin">
                  <IlustrasiBuku idPrefix="auth-kanan" />
                </div>
                <span className="auth__art-wash" />
                <span className="auth__gutter auth__gutter--art auth__gutter--kiri" />
              </div>

              <span className="auth__under-shadow" aria-hidden="true" />

              <div className={["auth__leaf", sedangBerbalik ? "is-flipping" : ""].join(" ").trim()}>
                <div
                  className="auth__face auth__face--depan"
                  inert={!aktifDepan}
                  aria-hidden={!aktifDepan}
                >
                  <div className="auth__paper auth__paper--form auth__paper--masuk">
                    <span className="auth__gutter auth__gutter--paper auth__gutter--kiri" />
                    <div className="auth__form-body">
                      <KontenAuth
                        mode="masuk"
                        interaktif={aktifDepan}
                        idJudul={idJudulDesktop("masuk")}
                        onTautan={gantiLewatTautan}
                      />
                    </div>
                    <span className="auth__leaf-shade auth__leaf-shade--kiri" aria-hidden="true" />
                    <Lipatan
                      mode="masuk"
                      sisi="kanan"
                      aktif={aktifDepan}
                      onKlik={() => gantiMode("daftar")}
                    />
                  </div>
                </div>

                <div
                  className="auth__face auth__face--belakang"
                  inert={!aktifBelakang}
                  aria-hidden={!aktifBelakang}
                >
                  <div className="auth__paper auth__paper--form auth__paper--daftar">
                    <span className="auth__gutter auth__gutter--paper auth__gutter--kanan" />
                    <div className="auth__form-body">
                      <KontenAuth
                        mode="daftar"
                        interaktif={aktifBelakang}
                        idJudul={idJudulDesktop("daftar")}
                        onTautan={gantiLewatTautan}
                      />
                    </div>
                    <span className="auth__leaf-shade auth__leaf-shade--kanan" aria-hidden="true" />
                    <Lipatan
                      mode="daftar"
                      sisi="kiri"
                      aktif={aktifBelakang}
                      onKlik={() => gantiMode("masuk")}
                    />
                  </div>
                </div>
              </div>

              <div className="auth__spine" aria-hidden="true">
                <span className="auth__spine-band" />
                <span className="auth__spine-stitches" />
                <span className="auth__spine-crease" />
                <span className="auth__spine-deepen" />
                <span className="auth__spine-dip auth__spine-dip--atas" />
                <span className="auth__spine-dip auth__spine-dip--bawah" />
              </div>
            </article>
          </div>
          <div className="auth__contact-shadow" aria-hidden="true" />
        </div>

        {/* < 900px: satu halaman; ilustrasi menjadi pita di atas formulir. */}
        <div className={["auth__mobile", redup ? "is-redup" : ""].join(" ").trim()}>
          <div className="auth__mobile-stack">
            <article className="auth__mobile-book" aria-labelledby={idAktifMobile}>
              {flip ? (
                <div className="auth__mobile-under" aria-hidden="true" inert>
                  <div className="auth__mobile-face">
                    <div className="auth__mobile-paper">
                      <div className="auth__mobile-banner">
                        <IlustrasiBuku idPrefix="auth-mobile-under" />
                        <span className="auth__banner-wash" />
                      </div>
                      <div className="auth__mobile-body">
                        <KontenAuth
                          mode={flip.ke}
                          interaktif={false}
                          idJudul={idJudulMobile(flip.ke)}
                        />
                      </div>
                      <Lipatan mode={flip.ke} sisi="kanan" aktif={false} />
                    </div>
                  </div>
                </div>
              ) : null}

              <div
                className={[
                  "auth__mobile-leaf",
                  sedangBerbalik ? "is-flipping" : "",
                  flip ? `ke-${flip.ke}` : "",
                ]
                  .join(" ")
                  .trim()}
                inert={sedangBerbalik}
              >
                <div className="auth__mobile-face auth__mobile-face--depan">
                  <div className="auth__mobile-paper">
                    <div className="auth__mobile-banner">
                      <IlustrasiBuku idPrefix={`auth-mobile-${mode}`} />
                      <span className="auth__banner-wash" />
                    </div>
                    <div className="auth__mobile-body">
                      <KontenAuth
                        mode={mode}
                        interaktif={!sedangBerbalik}
                        idJudul={idJudulMobile(mode)}
                        onTautan={gantiLewatTautan}
                      />
                    </div>
                    <span className="auth__leaf-shade auth__leaf-shade--kiri" aria-hidden="true" />
                    <Lipatan
                      mode={mode}
                      sisi="kanan"
                      aktif={!sedangBerbalik}
                      onKlik={() => gantiMode(mode === "masuk" ? "daftar" : "masuk")}
                    />
                  </div>
                </div>

                <div className="auth__mobile-face auth__mobile-face--belakang" aria-hidden="true">
                  <div className="auth__mobile-paper auth__mobile-paper--belakang">
                    <span className="auth__back-mark">Klass</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div className="auth__contact-shadow" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
