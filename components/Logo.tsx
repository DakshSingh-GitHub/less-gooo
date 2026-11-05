"use client";

import React, { useId } from "react";

export interface LogoProps {
  /** Size preset or custom pixel number */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  /** Display style: "badge" (tactile obsidian plate) or "mark" (pure minimal glyph) */
  variant?: "badge" | "mark";
  /** Whether to show the editorial "LessGooo" brand wordmark beside the icon */
  showText?: boolean;
  /** Optional secondary subtitle or tag */
  subtitle?: string | boolean;
  /** Custom classes for the wordmark text */
  textClassName?: string;
  /** Custom container classes */
  className?: string;
  /** Optional interactive hover lift / subtle glow animation */
  animated?: boolean;
}

const SIZE_MAP = {
  xs: { icon: 20, font: "text-base", sub: "text-[9px]" },
  sm: { icon: 26, font: "text-lg", sub: "text-[10px]" },
  md: { icon: 34, font: "text-xl sm:text-2xl", sub: "text-[10px]" },
  lg: { icon: 42, font: "text-2xl sm:text-3xl", sub: "text-xs" },
  xl: { icon: 52, font: "text-3xl sm:text-4xl", sub: "text-xs" },
};

export default function Logo({
  size = "md",
  variant = "badge",
  showText = false,
  subtitle,
  textClassName = "",
  className = "",
  animated = false,
}: LogoProps) {
  const uid = useId().replace(/:/g, "_");
  
  const iconDim = typeof size === "number" ? size : SIZE_MAP[size].icon;
  const fontClass = typeof size === "number" ? "text-xl" : SIZE_MAP[size].font;
  const subClass = typeof size === "number" ? "text-[10px]" : SIZE_MAP[size].sub;

  const isBadge = variant === "badge";

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        animated ? "transition-transform duration-200 hover:scale-[1.03]" : ""
      } ${className}`}
      role="img"
      aria-label="LessGooo Logo"
    >
      {/* Wayfinder Icon Mark */}
      <div
        className="relative flex-shrink-0"
        style={{ width: iconDim, height: iconDim }}
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Saffron Ember Gradient (Primary kinetic force) */}
            <linearGradient
              id={`${uid}-ember`}
              x1="10"
              y1="8"
              x2="34"
              y2="36"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FF5A26" />
              <stop offset="55%" stopColor="#E05A32" />
              <stop offset="100%" stopColor="#C84B26" />
            </linearGradient>

            {/* Kashi Ochre Gradient (Wayfinding & heritage guidance) */}
            <linearGradient
              id={`${uid}-ochre`}
              x1="16"
              y1="6"
              x2="38"
              y2="26"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Ambient Ember Halo */}
            <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF5A26" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FF5A26" stopOpacity="0" />
            </radialGradient>

            {/* Subtle Plate Gradient */}
            <linearGradient
              id={`${uid}-plate`}
              x1="0"
              y1="0"
              x2="44"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#1A1C23" />
              <stop offset="100%" stopColor="#0E0F13" />
            </linearGradient>
          </defs>

          {/* Optional Tactile Obsidian Badge Enclosure */}
          {isBadge && (
            <>
              <rect
                width="44"
                height="44"
                rx="11"
                fill={`url(#${uid}-plate)`}
              />
              <rect
                x="0.5"
                y="0.5"
                width="43"
                height="43"
                rx="10.5"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              <circle cx="22" cy="22" r="14" fill={`url(#${uid}-halo)`} />
            </>
          )}

          {/* L Monogram: Grounded Waypoint & Anchor */}
          <path
            d="M 12.5 10 C 12.5 9 13.3 8.2 14.3 8.2 H 15.5 C 16.5 8.2 17.3 9 17.3 10 V 25 C 17.3 25.8 17.9 26.5 18.7 26.5 H 26 C 27 26.5 27.8 27.3 27.8 28.3 C 27.8 29.3 27 30.1 26 30.1 H 18 C 15 30.1 12.5 27.6 12.5 24.6 V 10 Z"
            fill={`url(#${uid}-ember)`}
          />

          {/* G Route Arc: Adaptive Transit Loop */}
          <path
            d="M 35 19 C 35 25.1 30.1 30 24 30 C 23.2 30 22.5 29.3 22.5 28.5 C 22.5 27.7 23.2 27 24 27 C 28.4 27 32 23.4 32 19 C 32 15.9 30.2 13.2 27.7 11.9 C 27 11.5 26.7 10.6 27.1 9.9 C 27.5 9.2 28.4 8.9 29.1 9.3 C 32.6 11.2 35 14.9 35 19 Z"
            fill={`url(#${uid}-ember)`}
          />

          {/* Forward Compass Needle (North-East Vector / 'Gooo!') */}
          <path
            d="M 24.5 7.5 C 24.5 7 24.9 6.5 25.5 6.5 H 33.5 C 34.1 6.5 34.5 7 34.5 7.5 V 15.5 C 34.5 16 34.1 16.5 33.5 16.5 C 33 16.5 32.5 16 32.5 15.5 V 9.7 L 23.9 18.3 C 23.5 18.7 22.9 18.7 22.5 18.3 C 22.1 17.9 22.1 17.3 22.5 16.9 L 31.1 8.5 H 25.5 C 24.9 8.5 24.5 8 24.5 7.5 Z"
            fill={`url(#${uid}-ochre)`}
          />

          {/* Destination Waypoint Beacon */}
          <circle cx="22.5" cy="22.5" r="2.2" fill={`url(#${uid}-ember)`} />
          <circle cx="22.5" cy="22.5" r="1.1" fill="#FAF8F5" />
        </svg>
      </div>

      {/* Editorial Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-serif font-semibold tracking-tight text-[#18181B] dark:text-[#F4F1EA] transition-colors group-hover:text-[#C84B26] dark:group-hover:text-[#E05A32] ${fontClass} ${textClassName}`}
          >
            LessGooo
          </span>
          {subtitle && (
            <span
              className={`font-mono uppercase tracking-widest text-[#71717A] dark:text-[#A1A1AA] mt-0.5 ${subClass}`}
            >
              {typeof subtitle === "string" ? subtitle : "Spatial Wayfinder"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

