import { cn } from "@/lib/utils";

/**
 * Ilustrasi halaman kiri buku masuk/daftar.
 *
 * Adegan malam yang tenang: bulan hangat, awan kertas, perbukitan berlapis,
 * tumpukan buku, cangkir, dan pesawat kertas. Seluruh warna diambil dari token
 * design system supaya paletnya tetap satu keluarga dengan halaman lain.
 *
 * Murni hiasan: tidak ada teks, tombol, atau bentuk interaktif di dalamnya.
 */
export function IlustrasiBuku({
  className,
  idPrefix = "auth",
}: {
  className?: string;
  /** Awalan id unik saat ilustrasi dipakai lebih dari sekali di satu halaman. */
  idPrefix?: string;
}) {
  const id = (nama: string) => `${idPrefix}-${nama}`;

  return (
    <svg
      className={cn("auth__art-svg", className)}
      viewBox="0 0 560 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={id("langit")} cx="52%" cy="30%" r="82%">
          <stop offset="0" stopColor="var(--ds-color-ink-secondary)" />
          <stop offset="0.56" stopColor="var(--ds-color-ink)" />
          <stop offset="1" stopColor="var(--ds-color-ink)" />
        </radialGradient>

        <radialGradient id={id("cahaya-bulan")}>
          <stop offset="0" stopColor="var(--ds-color-primary)" stopOpacity="0.34" />
          <stop offset="0.5" stopColor="var(--ds-color-primary)" stopOpacity="0.11" />
          <stop offset="1" stopColor="var(--ds-color-primary)" stopOpacity="0" />
        </radialGradient>

        <clipPath id={id("bulan-klip")}>
          <circle cx="396" cy="212" r="78" />
        </clipPath>

        <filter id={id("butir")} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Langit malam: tinta hangat, bukan hitam pekat. */}
      <rect width="560" height="700" fill={`url(#${id("langit")})`} />

      {/* Bintang dan kilau kecil. */}
      <g fill="var(--ds-color-paper-surface)">
        <circle cx="58" cy="84" r="2.2" opacity="0.75" />
        <circle cx="112" cy="146" r="1.6" opacity="0.55" />
        <circle cx="188" cy="72" r="1.8" opacity="0.7" />
        <circle cx="252" cy="128" r="2.4" opacity="0.8" />
        <circle cx="312" cy="66" r="1.5" opacity="0.5" />
        <circle cx="470" cy="92" r="2" opacity="0.7" />
        <circle cx="518" cy="168" r="1.7" opacity="0.55" />
        <circle cx="484" cy="252" r="1.5" opacity="0.45" />
        <circle cx="72" cy="288" r="1.8" opacity="0.5" />
        <circle cx="176" cy="248" r="1.4" opacity="0.4" />
        <circle cx="322" cy="182" r="1.5" opacity="0.45" />
      </g>
      <g fill="var(--ds-color-primary)" opacity="0.9">
        <g transform="translate(128 58)">
          <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z" />
        </g>
        <g transform="translate(466 122) scale(0.82)">
          <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z" />
        </g>
        <g transform="translate(66 228) scale(0.62)" opacity="0.7">
          <path d="M0 -9 L2.4 -2.4 L9 0 L2.4 2.4 L0 9 L-2.4 2.4 L-9 0 L-2.4 -2.4 Z" />
        </g>
      </g>

      {/* Bulan hangat dengan kawah tipis. */}
      <circle cx="396" cy="212" r="196" fill={`url(#${id("cahaya-bulan")})`} />
      <circle
        cx="396"
        cy="212"
        r="86"
        fill="none"
        stroke="var(--ds-color-primary)"
        strokeOpacity="0.16"
        strokeWidth="2"
      />
      <circle cx="396" cy="212" r="78" fill="var(--ds-color-primary)" />
      <g clipPath={`url(#${id("bulan-klip")})`} fill="var(--ds-color-primary-hover)" opacity="0.38">
        <circle cx="368" cy="190" r="14" />
        <circle cx="416" cy="234" r="10" />
        <circle cx="406" cy="170" r="7" />
        <circle cx="352" cy="240" r="6" />
        <circle cx="430" cy="192" r="5" />
        <circle cx="384" cy="256" r="4" />
      </g>
      <path
        d="M340 252 A 78 78 0 0 1 338 172"
        fill="none"
        stroke="var(--ds-color-paper-surface)"
        strokeOpacity="0.22"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Awan kertas. Bayangan biru di bawah membuatnya terasa ditempel. */}
      <g transform="translate(28 160)" opacity="0.95">
        <g transform="translate(5 7)" fill="var(--ds-color-secondary)" opacity="0.35">
          <ellipse cx="42" cy="32" rx="38" ry="16" />
          <ellipse cx="84" cy="24" rx="40" ry="22" />
          <ellipse cx="126" cy="34" rx="30" ry="14" />
          <rect x="12" y="30" width="142" height="22" rx="11" />
        </g>
        <g fill="var(--ds-color-paper-surface)">
          <ellipse cx="42" cy="32" rx="38" ry="16" />
          <ellipse cx="84" cy="24" rx="40" ry="22" />
          <ellipse cx="126" cy="34" rx="30" ry="14" />
          <rect x="12" y="30" width="142" height="22" rx="11" />
        </g>
      </g>

      <g transform="translate(312 300) scale(0.72)" opacity="0.7">
        <g transform="translate(5 7)" fill="var(--ds-color-secondary)" opacity="0.4">
          <ellipse cx="42" cy="32" rx="38" ry="16" />
          <ellipse cx="84" cy="24" rx="40" ry="22" />
          <ellipse cx="126" cy="34" rx="30" ry="14" />
          <rect x="12" y="30" width="142" height="22" rx="11" />
        </g>
        <g fill="var(--ds-color-paper-surface)">
          <ellipse cx="42" cy="32" rx="38" ry="16" />
          <ellipse cx="84" cy="24" rx="40" ry="22" />
          <ellipse cx="126" cy="34" rx="30" ry="14" />
          <rect x="12" y="30" width="142" height="22" rx="11" />
        </g>
      </g>

      <g transform="translate(48 366) scale(0.5)" opacity="0.36">
        <g fill="var(--ds-color-paper-surface)">
          <ellipse cx="42" cy="32" rx="38" ry="16" />
          <ellipse cx="84" cy="24" rx="40" ry="22" />
          <ellipse cx="126" cy="34" rx="30" ry="14" />
          <rect x="12" y="30" width="142" height="22" rx="11" />
        </g>
      </g>

      {/* Pesawat kertas dan jejak putus-putusnya. */}
      <path
        d="M286 410 C 328 400 358 366 404 348"
        fill="none"
        stroke="var(--ds-color-paper-surface)"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 9"
      />
      <g transform="translate(424 330) rotate(-16)">
        <path
          d="M0 26 L78 0 L44 32 L36 58 L26 32 Z"
          fill="var(--ds-color-paper-surface)"
          stroke="var(--ds-color-border-ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M26 32 L44 32 L36 58 Z" fill="var(--ds-color-secondary)" opacity="0.6" />
        <path
          d="M0 26 L26 32 L44 32 L78 0"
          fill="none"
          stroke="var(--ds-color-border-ink)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* Perbukitan berlapis: biru jauh, tan hangat dekat. */}
      <ellipse cx="280" cy="474" rx="330" ry="128" fill="var(--ds-color-primary)" opacity="0.05" />
      <path
        d="M0 424 C 58 400 118 396 182 414 C 250 434 326 422 396 400 C 462 380 520 386 560 398 L560 700 L0 700 Z"
        fill="var(--ds-color-secondary)"
        opacity="0.26"
      />
      <path
        d="M0 470 C 58 446 128 440 198 460 C 266 480 340 470 414 446 C 474 428 524 432 560 444 L560 700 L0 700 Z"
        fill="var(--ds-color-secondary)"
        opacity="0.5"
      />
      <path
        d="M0 520 C 70 492 144 486 218 508 C 298 532 378 520 452 496 C 498 482 534 486 560 498 L560 700 L0 700 Z"
        fill="var(--ds-color-folder-edge)"
      />
      <path
        d="M0 520 C 70 492 144 486 218 508 C 298 532 378 520 452 496 C 498 482 534 486 560 498"
        fill="none"
        stroke="var(--ds-color-paper-surface)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <path
        d="M0 638 C 72 618 146 626 220 646 C 300 668 388 658 468 636 C 508 626 544 628 560 634 L560 700 L0 700 Z"
        fill="var(--ds-color-ink)"
      />

      {/* Tumpukan buku dan cangkir di atas bukit. Digeser sedikit ke atas agar
          tetap utuh saat halaman ditumpuk dan ilustrasi dipotong melebar. */}
      <g transform="translate(0 -28)">
        <ellipse cx="190" cy="614" rx="136" ry="12" fill="var(--ds-color-ink)" opacity="0.18" />
        <g stroke="var(--ds-color-border-ink)" strokeWidth="2.5" strokeLinejoin="round">
          <rect
            x="82"
            y="574"
            width="216"
            height="30"
            rx="3"
            fill="var(--ds-color-paper-surface)"
          />
          <path
            d="M98 584 H286 M98 593 H286"
            fill="none"
            stroke="var(--ds-color-folder-edge)"
            strokeWidth="1.5"
          />
          <rect x="68" y="566" width="244" height="12" rx="6" fill="var(--ds-color-folder-bg)" />
          <rect x="68" y="602" width="244" height="12" rx="6" fill="var(--ds-color-folder-bg)" />
          <rect x="68" y="566" width="26" height="48" rx="6" fill="var(--ds-color-accent-orange)" />

          <rect
            x="96"
            y="536"
            width="200"
            height="28"
            rx="3"
            fill="var(--ds-color-paper-surface)"
          />
          <path
            d="M110 546 H284 M110 555 H284"
            fill="none"
            stroke="var(--ds-color-folder-edge)"
            strokeWidth="1.5"
          />
          <rect x="82" y="528" width="228" height="12" rx="6" fill="var(--ds-color-secondary)" />
          <rect x="82" y="562" width="228" height="12" rx="6" fill="var(--ds-color-secondary)" />
          <rect
            x="82"
            y="528"
            width="24"
            height="46"
            rx="6"
            fill="var(--ds-color-secondary-hover)"
          />

          <rect
            x="110"
            y="500"
            width="176"
            height="26"
            rx="3"
            fill="var(--ds-color-paper-surface)"
          />
          <path
            d="M124 509 H274 M124 517 H274"
            fill="none"
            stroke="var(--ds-color-folder-edge)"
            strokeWidth="1.5"
          />
          <rect x="96" y="492" width="204" height="12" rx="6" fill="var(--ds-color-primary)" />
          <rect x="96" y="524" width="204" height="12" rx="6" fill="var(--ds-color-primary)" />
          <rect x="96" y="492" width="22" height="44" rx="6" fill="var(--ds-color-primary-hover)" />
        </g>

        {/* Pembatas buku menjuntai dari buku paling atas. */}
        <path
          d="M158 524 v30 l9 -8 l9 8 v-30"
          fill="var(--ds-color-accent-orange)"
          stroke="var(--ds-color-border-ink)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Cangkir: satu-satunya benda hangat di depan. */}
        <ellipse cx="249" cy="492" rx="28" ry="5" fill="var(--ds-color-ink)" opacity="0.18" />
        <path
          d="M226 444 h46 v32 q0 16 -16 16 h-14 q-16 0 -16 -16 z"
          fill="var(--ds-color-paper-surface)"
          stroke="var(--ds-color-border-ink)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M272 452 q18 -2 18 13 q0 15 -18 13"
          fill="none"
          stroke="var(--ds-color-border-ink)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse
          cx="249"
          cy="444"
          rx="23"
          ry="7"
          fill="var(--ds-color-accent-orange)"
          stroke="var(--ds-color-border-ink)"
          strokeWidth="2.5"
        />
        <ellipse cx="249" cy="445" rx="15" ry="3.6" fill="var(--ds-color-ink)" opacity="0.45" />
        <path
          d="M242 474 c-4 -5 -11 -1 -7 4 c2 3 7 6 7 6 c0 0 5 -3 7 -6 c4 -5 -3 -9 -7 -4 z"
          fill="var(--ds-color-accent-orange)"
          opacity="0.85"
        />

        <g
          fill="none"
          stroke="var(--ds-color-paper-surface)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
        >
          <path d="M238 432 c-8 -12 8 -18 0 -30 c-6 -10 4 -14 2 -22" />
          <path d="M260 428 c-7 -12 8 -18 1 -30" />
        </g>
      </g>

      {/* Rumput dan bunga kecil di latar depan. */}
      <g
        fill="none"
        stroke="var(--ds-color-folder-edge)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      >
        <path d="M38 692 q4 -20 9 -2" />
        <path d="M52 694 q2 -26 8 -4" />
        <path d="M72 696 q4 -18 9 -2" />
        <path d="M484 690 q4 -22 9 -3" />
        <path d="M500 694 q2 -18 8 -2" />
      </g>
      <g fill="var(--ds-color-primary)" opacity="0.7">
        <circle cx="88" cy="678" r="3" />
        <circle cx="476" cy="676" r="2.6" />
        <circle cx="522" cy="688" r="2.2" />
      </g>

      {/* Butir kertas halus agar ilustrasi tidak terlihat seperti vektor datar. */}
      <rect
        width="560"
        height="700"
        filter={`url(#${id("butir")})`}
        opacity="0.05"
        className="auth__art-grain"
      />
    </svg>
  );
}
