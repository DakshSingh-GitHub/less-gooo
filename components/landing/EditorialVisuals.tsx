"use client";

import React, { useEffect, useRef, useState } from "react";

export type LandmarkVisualId =
  | "assi"
  | "dashashwamedh"
  | "vishwanath"
  | "manikarnika"
  | "godowlia"
  | "sarnath";

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function EditorialReveal({
  children,
  className = "",
  delayMs = 0,
}: EditorialRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // CSS @media (prefers-reduced-motion: reduce) already reveals .editorial-reveal immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting ||
            entry.boundingClientRect.top <= window.innerHeight
          ) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`editorial-reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function BrassCompassRose({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="0.8"
      />
      <circle
        cx="60"
        cy="60"
        r="46"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        strokeDasharray="2 3"
      />
      <circle
        cx="60"
        cy="60"
        r="24"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      {/* 8-point degree ticks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="60"
          y1="6"
          x2="60"
          y2={deg % 90 === 0 ? "14" : "11"}
          stroke="currentColor"
          strokeOpacity={deg % 90 === 0 ? "0.7" : "0.35"}
          strokeWidth={deg % 90 === 0 ? "1.1" : "0.75"}
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
      {/* North pointer (Saffron Ember highlight) */}
      <polygon points="60,15 65,55 60,49 55,55" fill="#FF5A26" />
      {/* South pointer */}
      <polygon
        points="60,105 64,65 60,71 56,65"
        fill="currentColor"
        fillOpacity="0.45"
      />
      {/* East / West pointers */}
      <polygon
        points="105,60 65,64 71,60 65,56"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <polygon
        points="15,60 55,64 49,60 55,56"
        fill="currentColor"
        fillOpacity="0.45"
      />
      <circle cx="60" cy="60" r="3.5" fill="#E5A93C" />
      <text
        x="60"
        y="4.8"
        textAnchor="middle"
        fill="#FF5A26"
        fontSize="7"
        fontFamily="var(--font-plex-mono), monospace"
        fontWeight="600"
      >
        N
      </text>
    </svg>
  );
}

export function KashiBrassSeal({
  label = "KASHI FIELD DISPATCH • VERIFIED",
  code = "VNS-25.3N",
  className = "w-24 h-24",
}: {
  label?: string;
  code?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <path
          id={`seal-ring-${code}`}
          d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="#E5A93C"
        strokeOpacity="0.55"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <circle
        cx="60"
        cy="60"
        r="49"
        stroke="#E5A93C"
        strokeOpacity="0.35"
        strokeWidth="0.75"
      />
      <circle
        cx="60"
        cy="60"
        r="31"
        stroke="#E5A93C"
        strokeOpacity="0.45"
        strokeWidth="0.9"
      />
      <text
        fill="#E5A93C"
        fontSize="6.6"
        letterSpacing="2.1"
        fontFamily="var(--font-plex-mono), monospace"
      >
        <textPath href={`#seal-ring-${code}`} startOffset="4%">
          {label}
        </textPath>
      </text>
      <path
        d="M52 63 L60 47 L68 63 Z"
        stroke="#FF5A26"
        strokeWidth="1.2"
        fill="rgba(255,90,38,0.14)"
      />
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fill="#E5A93C"
        fontSize="7"
        fontFamily="var(--font-plex-mono), monospace"
        letterSpacing="1"
      >
        {code}
      </text>
    </svg>
  );
}

export function LandmarkVignettePlate({
  id,
  className = "w-full h-44",
}: {
  id: LandmarkVisualId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 420 190"
      fill="none"
      role="img"
      aria-label={`Architectural illustration of ${id}`}
      className={className}
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0D14" />
          <stop offset="62%" stopColor="#161D2E" />
          <stop offset="100%" stopColor="#232B3D" />
        </linearGradient>
        <linearGradient id={`river-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#101A33" />
          <stop offset="50%" stopColor="#1E3568" />
          <stop offset="100%" stopColor="#11192B" />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="45%" r="48%">
          <stop offset="0%" stopColor="#FF5A26" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#E5A93C" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0A0D14" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Nocturnal atmospheric backdrop */}
      <rect width="420" height="190" fill={`url(#sky-${id})`} />
      <rect width="420" height="190" fill={`url(#glow-${id})`} />

      {/* Subtle lat/lon surveyor lines */}
      <line x1="0" y1="42" x2="420" y2="42" stroke="#F3EEE5" strokeOpacity="0.06" />
      <line x1="0" y1="96" x2="420" y2="96" stroke="#F3EEE5" strokeOpacity="0.06" />
      <line x1="105" y1="0" x2="105" y2="190" stroke="#F3EEE5" strokeOpacity="0.05" />
      <line x1="315" y1="0" x2="315" y2="190" stroke="#F3EEE5" strokeOpacity="0.05" />

      {id === "assi" && (
        <>
          {/* Dawn solar disc over southern confluence */}
          <circle cx="290" cy="68" r="28" fill="#FF5A26" fillOpacity="0.28" />
          <circle cx="290" cy="68" r="16" fill="#E5A93C" fillOpacity="0.82" />
          {/* Ghat steps descending from left */}
          <path
            d="M0 98 H115 V110 H148 V122 H182 V134 H216 V146 H0 Z"
            fill="#1D2230"
            stroke="#E5A93C"
            strokeOpacity="0.45"
          />
          {/* Chhatri pavilion on Assi platform */}
          <rect x="52" y="68" width="38" height="30" stroke="#E5A93C" strokeOpacity="0.65" />
          <path d="M46 68 Q71 42 96 68 Z" fill="#262C3D" stroke="#E5A93C" strokeWidth="1.2" />
          <line x1="71" y1="46" x2="71" y2="36" stroke="#FF5A26" strokeWidth="1.5" />
          {/* River confluence */}
          <rect x="0" y="144" width="420" height="46" fill={`url(#river-${id})`} />
          <path
            d="M210 156 Q290 148 395 160"
            stroke="#4E7BFF"
            strokeOpacity="0.7"
            strokeWidth="1.3"
          />
          <path
            d="M245 168 Q300 163 365 170"
            stroke="#E5A93C"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
          {/* Wooden dawn boat */}
          <path d="M258 152 L318 152 L306 160 L270 160 Z" fill="#0A0D14" stroke="#E5A93C" strokeWidth="1" />
        </>
      )}

      {id === "dashashwamedh" && (
        <>
          {/* Temple silhouettes */}
          <path
            d="M54 128 V84 L74 52 L94 84 V128 M112 128 V72 L138 34 L164 72 V128 M260 128 V78 L284 46 L308 78 V128"
            fill="#191F2C"
            stroke="#E5A93C"
            strokeOpacity="0.5"
            strokeWidth="1.1"
          />
          {/* Ceremonial brass Aarti tiered lamp centerpiece */}
          <line x1="210" y1="48" x2="210" y2="128" stroke="#E5A93C" strokeWidth="2" />
          {[64, 82, 100].map((y, idx) => {
            const span = 16 + idx * 11;
            return (
              <g key={y}>
                <line
                  x1={210 - span}
                  y1={y}
                  x2={210 + span}
                  y2={y}
                  stroke="#E5A93C"
                  strokeWidth="1.6"
                />
                <circle cx={210 - span} cy={y - 4} r="3" fill="#FF5A26" />
                <circle cx={210} cy={y - 5} r="3.2" fill="#FF5A26" />
                <circle cx={210 + span} cy={y - 4} r="3" fill="#FF5A26" />
              </g>
            );
          })}
          {/* Grand ghat steps & Ganga */}
          <rect x="0" y="128" width="420" height="16" fill="#202636" stroke="#E5A93C" strokeOpacity="0.35" />
          <rect x="0" y="144" width="420" height="46" fill={`url(#river-${id})`} />
          {/* Floating diyas on River Indigo */}
          {[142, 188, 214, 248, 292].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={160 + (i % 2) * 10} rx="7" ry="2.2" fill="#E5A93C" />
              <circle cx={x} cy={157 + (i % 2) * 10} r="2.3" fill="#FF5A26" />
            </g>
          ))}
        </>
      )}

      {id === "vishwanath" && (
        <>
          {/* Vishwanath Dham colonnade */}
          <rect x="38" y="96" width="344" height="48" fill="#181D29" stroke="#E5A93C" strokeOpacity="0.4" />
          {[62, 98, 134, 286, 322, 358].map((x) => (
            <line key={x} x1={x} y1="96" x2={x} y2="144" stroke="#E5A93C" strokeOpacity="0.42" strokeWidth="1.4" />
          ))}
          {/* Golden Shikhara Twin Spires */}
          <path
            d="M162 144 V86 Q186 30 210 24 Q234 30 258 86 V144 Z"
            fill="#2A2318"
            stroke="#E5A93C"
            strokeWidth="1.5"
          />
          <path
            d="M178 144 V94 Q194 52 210 44 Q226 52 242 94 V144"
            stroke="#E5A93C"
            strokeOpacity="0.65"
            strokeWidth="1"
          />
          {/* Trishul & Saffron pennant */}
          <line x1="210" y1="10" x2="210" y2="26" stroke="#E5A93C" strokeWidth="1.5" />
          <path d="M210 12 L232 17 L210 22 Z" fill="#FF5A26" />
          <rect x="0" y="144" width="420" height="46" fill={`url(#river-${id})`} />
          <path d="M90 162 H330" stroke="#4E7BFF" strokeOpacity="0.55" strokeDasharray="4 4" />
        </>
      )}

      {id === "manikarnika" && (
        <>
          {/* Terraced sandstone riverfront */}
          <path
            d="M30 144 V88 H96 V68 H168 V92 H260 V76 H342 V144 Z"
            fill="#181D28"
            stroke="#E5A93C"
            strokeOpacity="0.42"
          />
          {/* Eternal sacred ember sanctuary */}
          <circle cx="208" cy="112" r="22" fill="#FF5A26" fillOpacity="0.22" />
          <path
            d="M208 92 C216 104 218 114 208 122 C198 114 200 104 208 92 Z"
            fill="#FF5A26"
          />
          <path
            d="M208 100 C212 107 213 113 208 118 C203 113 204 107 208 100 Z"
            fill="#E5A93C"
          />
          <rect x="0" y="144" width="420" height="46" fill={`url(#river-${id})`} />
          <path d="M40 164 Q210 150 380 166" stroke="#4E7BFF" strokeOpacity="0.65" strokeWidth="1.2" />
        </>
      )}

      {id === "godowlia" && (
        <>
          {/* Historic Godowlia Chowk tri-arch gateway */}
          <rect x="58" y="54" width="304" height="96" fill="#181C27" stroke="#E5A93C" strokeOpacity="0.5" />
          <path d="M92 150 V104 A28 28 0 0 1 148 104 V150" fill="#0A0D14" stroke="#E5A93C" strokeOpacity="0.65" />
          <path d="M170 150 V92 A40 40 0 0 1 250 92 V150" fill="#0A0D14" stroke="#FF5A26" strokeOpacity="0.85" strokeWidth="1.3" />
          <path d="M272 150 V104 A28 28 0 0 1 328 104 V150" fill="#0A0D14" stroke="#E5A93C" strokeOpacity="0.65" />
          {/* Hanging temple bell in central arch */}
          <line x1="210" y1="54" x2="210" y2="82" stroke="#E5A93C" strokeWidth="1.3" />
          <path d="M202 92 Q210 78 218 92 Z" fill="#E5A93C" />
          {/* Cobblestone bazaar lane */}
          <rect x="0" y="150" width="420" height="40" fill="#121620" />
          <path d="M150 150 L95 190 M270 150 L325 190" stroke="#E5A93C" strokeOpacity="0.3" />
        </>
      )}

      {id === "sarnath" && (
        <>
          {/* Tranquil Dhamek Stupa cylindrical drum & dome */}
          <circle cx="210" cy="84" r="58" stroke="#2DD4BF" strokeOpacity="0.22" strokeDasharray="3 3" />
          <path
            d="M148 146 V92 A62 52 0 0 1 272 92 V146 Z"
            fill="#1D222E"
            stroke="#E5A93C"
            strokeWidth="1.4"
          />
          {/* Mauryan carved geometric frieze */}
          <rect
            x="148"
            y="108"
            width="124"
            height="14"
            fill="#28231B"
            stroke="#E5A93C"
            strokeOpacity="0.7"
          />
          <path
            d="M154 115 L162 110 L170 115 L178 110 L186 115 L194 110 L202 115 L210 110 L218 115 L226 110 L234 115 L242 110 L250 115 L258 110 L266 115"
            stroke="#FF5A26"
            strokeWidth="1"
          />
          {/* Harmika crown */}
          <rect x="196" y="34" width="28" height="8" stroke="#E5A93C" fill="#171B24" />
          <line x1="210" y1="18" x2="210" y2="34" stroke="#E5A93C" strokeWidth="1.4" />
          {/* Deer park horizon */}
          <rect x="0" y="146" width="420" height="44" fill="#101820" />
          <path d="M35 162 Q210 154 385 162" stroke="#2DD4BF" strokeOpacity="0.5" strokeWidth="1.1" />
        </>
      )}
    </svg>
  );
}

export function CompanionPortraitPlate({
  variant,
  className = "w-full h-56",
}: {
  variant: "raghav" | "annapurna" | "senior-escort";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      role="img"
      aria-label="Editorial engraved portrait plate"
      className={className}
    >
      <defs>
        <linearGradient id={`plate-bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#131722" />
          <stop offset="55%" stopColor="#1C2231" />
          <stop offset="100%" stopColor="#0E121B" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill={`url(#plate-bg-${variant})`} />
      {/* Archival engraving contour rings */}
      {[34, 52, 72, 94].map((r) => (
        <circle
          key={r}
          cx="160"
          cy="106"
          r={r}
          stroke="#E5A93C"
          strokeOpacity="0.12"
          strokeWidth="0.8"
        />
      ))}

      {variant === "raghav" && (
        <>
          {/* Ghat steps & lantern in background */}
          <path d="M24 196 H112 V176 H296" stroke="#4E7BFF" strokeOpacity="0.3" />
          {/* Editorial bust silhouette with handwoven shawl */}
          <path
            d="M92 240 C96 184 122 162 160 162 C198 162 224 184 228 240 Z"
            fill="#232938"
            stroke="#E5A93C"
            strokeWidth="1.2"
          />
          {/* Saffron angavastram drape */}
          <path
            d="M126 168 Q160 202 194 168 L206 240 H182 L160 198 L138 240 H114 Z"
            fill="rgba(255,90,38,0.24)"
            stroke="#FF5A26"
            strokeOpacity="0.7"
          />
          <circle
            cx="160"
            cy="108"
            r="34"
            fill="#1A202D"
            stroke="#E5A93C"
            strokeWidth="1.3"
          />
          {/* Brass spectacles detail */}
          <circle cx="149" cy="108" r="7" stroke="#E5A93C" strokeWidth="1.1" />
          <circle cx="171" cy="108" r="7" stroke="#E5A93C" strokeWidth="1.1" />
          <line x1="156" y1="108" x2="164" y2="108" stroke="#E5A93C" strokeWidth="1.1" />
        </>
      )}

      {variant === "annapurna" && (
        <>
          {/* Sarnath stupa silhouette behind */}
          <path d="M225 180 A32 28 0 0 1 285 180" stroke="#2DD4BF" strokeOpacity="0.32" />
          <path
            d="M94 240 C98 186 124 164 160 164 C196 164 222 186 226 240 Z"
            fill="#202636"
            stroke="#E5A93C"
            strokeWidth="1.2"
          />
          {/* Banarasi zari border pallu */}
          <path
            d="M118 240 L178 166 L204 176 L154 240 Z"
            fill="rgba(229,169,60,0.2)"
            stroke="#E5A93C"
            strokeWidth="1.1"
          />
          <circle
            cx="160"
            cy="108"
            r="33"
            fill="#1A202D"
            stroke="#E5A93C"
            strokeWidth="1.3"
          />
          {/* Traditional bindi */}
          <circle cx="160" cy="99" r="2.6" fill="#FF5A26" />
        </>
      )}

      {variant === "senior-escort" && (
        <>
          {/* Calm riverfront terrace & step-free ramp */}
          <path d="M26 205 L294 175" stroke="#2DD4BF" strokeOpacity="0.55" strokeWidth="1.5" />
          <path d="M26 215 L294 185" stroke="#E5A93C" strokeOpacity="0.35" strokeWidth="1" />
          {/* Two companion figures walking unhurriedly */}
          <circle cx="132" cy="106" r="24" fill="#1A202D" stroke="#E5A93C" strokeWidth="1.2" />
          <path
            d="M92 240 C96 194 110 172 132 172 C154 172 168 194 172 240 Z"
            fill="#232938"
            stroke="#E5A93C"
            strokeWidth="1.1"
          />
          <circle cx="194" cy="112" r="22" fill="#1A202D" stroke="#2DD4BF" strokeWidth="1.2" />
          <path
            d="M160 240 C164 198 176 178 194 178 C212 178 224 198 228 240 Z"
            fill="#1D2733"
            stroke="#2DD4BF"
            strokeWidth="1.1"
          />
        </>
      )}

      {/* Corner archival crop marks */}
      <path d="M12 24 V12 H24 M308 24 V12 H296 M12 216 V228 H24 M308 216 V228 H296" stroke="#E5A93C" strokeOpacity="0.45" strokeWidth="1" />
    </svg>
  );
}
