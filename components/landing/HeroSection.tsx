"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { UserProfile } from "@/lib/appwrite";
import { BrassCompassRose } from "./EditorialVisuals";

interface HeroSectionProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode: "login" | "signup") => void;
}

export default function HeroSection({
  currentUser,
  onOpenAuthModal,
}: HeroSectionProps) {
  return (
    <section
      aria-label="LessGooo Varanasi Editorial Cover"
      className="relative min-h-[100svh] w-full bg-[#0A0D14] text-[#F3EEE5] overflow-hidden flex flex-col justify-between pt-[84px]"
    >
      {/* Full-Bleed Twilight Riverfront Plate */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/hero-illustration.jpg"
          alt="Twilight along the Varanasi riverfront ghats with glowing brass lamps and wooden boats on the Ganga"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_center] sm:object-center scale-[1.01] opacity-85"
        />

        {/* Editorial Nocturnal Vignettes — preserving luminous ghat art on the right while anchoring crisp serif legibility on the left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(102deg, rgba(10,13,20,0.95) 0%, rgba(10,13,20,0.84) 38%, rgba(10,13,20,0.44) 68%, rgba(10,13,20,0.68) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,13,20,0.68) 0%, rgba(10,13,20,0.08) 32%, rgba(10,13,20,0.28) 72%, rgba(10,13,20,0.97) 100%)",
          }}
        />

        {/* Delicate Cartographic River-Vector & Coordinate Graticule Overlay */}
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full opacity-75"
        >
          {/* Subtle meridian / parallel lines */}
          <line x1="0" y1="210" x2="1440" y2="210" stroke="#F3EEE5" strokeOpacity="0.06" />
          <line x1="0" y1="680" x2="1440" y2="680" stroke="#F3EEE5" strokeOpacity="0.07" />
          <line x1="940" y1="0" x2="940" y2="900" stroke="#F3EEE5" strokeOpacity="0.05" />
          <line x1="1210" y1="0" x2="1210" y2="900" stroke="#F3EEE5" strokeOpacity="0.05" />

          {/* Sweeping River Ganga Vector Path across the right quadrant */}
          <path
            d="M840 830 C 905 700, 995 595, 1085 470 C 1155 372, 1235 280, 1345 168"
            stroke="#4E7BFF"
            strokeOpacity="0.42"
            strokeWidth="2.2"
          />
          <path
            d="M840 830 C 905 700, 995 595, 1085 470 C 1155 372, 1235 280, 1345 168"
            stroke="#E5A93C"
            strokeWidth="1.5"
            className="animate-route-flow"
          />

          {/* Waypoint 1: Assi Dawn Anchor */}
          <g transform="translate(918, 692)">
            <circle r="11" fill="#FF5A26" fillOpacity="0.22" className="animate-beacon-ring" />
            <circle r="4" fill="#FF5A26" stroke="#F3EEE5" strokeWidth="1" />
            <text
              x="14"
              y="-4"
              fill="#F3EEE5"
              fillOpacity="0.82"
              fontSize="10"
              fontFamily="var(--font-plex-mono), monospace"
              letterSpacing="1.4"
            >
              ASSI CONFLUENCE
            </text>
            <text
              x="14"
              y="10"
              fill="#E5A93C"
              fontSize="9.5"
              fontFamily="var(--font-plex-mono), monospace"
            >
              25.2894° N · 05:30 IST
            </text>
          </g>

          {/* Waypoint 2: Dashashwamedh Sandhya Aarti */}
          <g transform="translate(1085, 470)">
            <circle r="13" fill="#E5A93C" fillOpacity="0.26" className="animate-beacon-ring" />
            <circle r="4.5" fill="#E5A93C" stroke="#0A0D14" strokeWidth="1.2" />
            <rect
              x="14"
              y="-18"
              width="192"
              height="34"
              fill="#0A0D14"
              fillOpacity="0.72"
              stroke="#E5A93C"
              strokeOpacity="0.45"
            />
            <text
              x="22"
              y="-4"
              fill="#F3EEE5"
              fontSize="10"
              fontFamily="var(--font-plex-mono), monospace"
              letterSpacing="1.2"
            >
              DASHASHWAMEDH AARTI
            </text>
            <text
              x="22"
              y="10"
              fill="#2DD4BF"
              fontSize="9.5"
              fontFamily="var(--font-plex-mono), monospace"
            >
              ANCHOR LOCKED · 18:30 IST
            </text>
          </g>

          {/* Waypoint 3: Kashi Vishwanath */}
          <g transform="translate(1232, 286)">
            <circle r="4" fill="#4E7BFF" stroke="#F3EEE5" strokeWidth="1" />
            <text
              x="-168"
              y="-2"
              fill="#C5BEB1"
              fontSize="9.5"
              fontFamily="var(--font-plex-mono), monospace"
              letterSpacing="1.2"
            >
              VISHWANATH CORRIDOR
            </text>
            <text
              x="-168"
              y="11"
              fill="#4E7BFF"
              fontSize="9"
              fontFamily="var(--font-plex-mono), monospace"
            >
              25.3109° N, 83.0107° E
            </text>
          </g>
        </svg>
      </div>

      {/* Top Folio Masthead Strip */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-white/[0.12]">
          <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#E5A93C]">
            <span className="inline-block w-2 h-2 bg-[#FF5A26]" />
            <span>Monograph No. 01 — Kashi / Varanasi Edition</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 font-mono text-[10.5px] tracking-[0.16em] text-[#C5BEB1]">
            <span>25.3176° N, 82.9739° E</span>
            <span className="text-white/25">|</span>
            <span>ELEV. 80.7M ASL</span>
            <span className="text-white/25">|</span>
            <span className="text-[#2DD4BF]">WEST BANK CRESCENT</span>
          </div>
        </div>
      </div>

      {/* Asymmetric Magazine Cover Body */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 my-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 xl:col-span-7">
            <p className="font-editorial italic text-[21px] sm:text-[24px] text-[#E5A93C] tracking-[0.01em] mb-4">
              An adaptive field atlas for India&apos;s oldest living riverfront
            </p>

            <h1 className="font-display text-[42px] sm:text-[60px] lg:text-[74px] xl:text-[82px] font-medium leading-[1.02] tracking-[-0.028em] text-[#F3EEE5]">
              The journey is yours.
              <span className="block mt-1.5 text-[#F3EEE5]/95">
                The{" "}
                <em className="font-display italic font-normal text-[#FF5A26]">
                  unexpected
                </em>{" "}
                is ours to navigate.
              </span>
            </h1>

            <p className="mt-7 max-w-[590px] text-[16px] sm:text-[17.5px] leading-[1.7] text-[#D4CEC2] font-normal">
              Real streets rarely obey static spreadsheets. LessGooo composes
              living itineraries across Varanasi—rebalancing your day when a
              chai stop lingers, decoding rickshaw and boat fares before you
              step aboard, and pairing your family with verified local scholars.
            </p>

            {/* Editorial Primary & Secondary Actions */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={currentUser ? "/dashboard" : "/login"}
                className="group relative h-[54px] px-7 bg-[#FF5A26] hover:bg-[#ec4d1b] text-[#F3EEE5] inline-flex items-center gap-4 transition-all shadow-[0_18px_40px_-12px_rgba(255,90,38,0.55)]"
              >
                <span className="text-[14.5px] font-medium tracking-[0.02em]">
                  {currentUser
                    ? "Enter Your Journey Studio"
                    : "Compose Your Varanasi Dispatch"}
                </span>
                <span className="w-px h-5 bg-white/25" />
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] group-hover:translate-x-0.5 transition-transform">
                  {currentUser ? "Studio →" : "Begin →"}
                </span>
              </Link>

              <a
                href="#destination-atlas"
                className="h-[54px] px-6 border border-[#E5A93C]/45 bg-[#0A0D14]/55 hover:bg-[#171B24]/85 hover:border-[#E5A93C] text-[#F3EEE5] inline-flex items-center gap-3 text-[14px] tracking-[0.02em] transition-colors backdrop-blur-xs"
              >
                <span>Explore the Kashi Atlas</span>
                <span className="font-mono text-[#E5A93C] text-[12px]">↓</span>
              </a>

              {!currentUser && (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal("signup")}
                  className="px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#C5BEB1] hover:text-[#E5A93C] underline underline-offset-4 decoration-white/25 hover:decoration-[#E5A93C] transition-colors cursor-pointer"
                >
                  Quick Pass Sign-Up
                </button>
              )}
            </div>
          </div>

          {/* Right Marginalia Compass & Field Dispatch Note */}
          <div className="lg:col-span-4 xl:col-span-5 flex lg:justify-end">
            <div className="w-full max-w-[330px] bg-[#0A0D14]/78 backdrop-blur-md border border-[#E5A93C]/30 p-5 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5A93C]">
                    Field Dispatch // 18:30 IST
                  </div>
                  <div className="font-editorial text-[20px] leading-snug text-[#F3EEE5] mt-1">
                    Sandhya Ganga Aarti Berth Protected
                  </div>
                </div>
                <BrassCompassRose className="w-14 h-14 text-[#E5A93C] shrink-0" />
              </div>
              <div className="ticket-perforation my-3.5" />
              <p className="text-[12.5px] leading-relaxed text-[#C5BEB1]">
                When old-city bazaar traffic slows your afternoon crossing at
                Godowlia, flexible stops compress automatically so fixed evening
                rituals remain untouched.
              </p>
              <div className="mt-3.5 flex items-center justify-between font-mono text-[10.5px] text-[#8C867A]">
                <span>84 GHATS INDEXED</span>
                <span className="text-[#2DD4BF]">● LIVE ATLAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cover Colophon Strip */}
      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-6">
        <div className="pt-4 border-t border-white/[0.12] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {[
            {
              code: "PLATE I",
              label: "Living Spatial Cartography",
              detail: "Assi Confluence → Sarnath Deer Park",
            },
            {
              code: "PLATE II",
              label: "Drift-Aware Day Timelines",
              detail: "Fixed anchors & dynamic pacing",
            },
            {
              code: "PLATE III",
              label: "Street Fare Dispatches",
              detail: "E-rickshaw, boat, auto & cab brackets",
            },
            {
              code: "PLATE IV",
              label: "Verified Human Escorts",
              detail: "Local scholars & Senior Companion care",
            },
          ].map((item) => (
            <div key={item.code} className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5A93C]">
                {item.code}
              </span>
              <span className="text-[13.5px] font-medium text-[#F3EEE5] mt-0.5">
                {item.label}
              </span>
              <span className="text-[12px] text-[#9E978B] mt-0.5">
                {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
