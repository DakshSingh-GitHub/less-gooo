"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import type { UserProfile } from "@/lib/appwrite";
import { BrassCompassRose, EditorialReveal } from "./EditorialVisuals";

interface FinalInvitationFooterProps {
  currentUser: UserProfile | null;
  backendStatus: "checking" | "connected" | "error";
  onOpenAuthModal: (mode: "login" | "signup") => void;
}

export default function FinalInvitationFooter({
  currentUser,
  backendStatus,
  onOpenAuthModal,
}: FinalInvitationFooterProps) {
  return (
    <>
      {/* SECTION H: Final Atmospheric Nocturnal Riverfront Invitation */}
      <section
        aria-labelledby="final-invitation-heading"
        className="relative py-28 lg:py-36 bg-[#0A0D14] text-[#F3EEE5] overflow-hidden"
      >
        {/* Atmospheric Riverfront Plate */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="/hero-illustration.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-35 scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(10,13,20,0.68) 0%, rgba(10,13,20,0.96) 78%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0A0D14] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A0D14] to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1040px] mx-auto px-5 sm:px-8 text-center">
          <EditorialReveal>
            <div className="inline-flex flex-col items-center">
              <BrassCompassRose className="w-16 h-16 text-[#E5A93C] mb-5" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-[#E5A93C]">
                25.3076° N, 83.0105° E · Dusk on the Western Bank
              </span>
            </div>

            <h2
              id="final-invitation-heading"
              className="mt-5 font-display text-[38px] sm:text-[54px] lg:text-[64px] leading-[1.05] tracking-[-0.025em] text-[#F3EEE5]"
            >
              Leave room for the{" "}
              <em className="font-display italic font-normal text-[#FF5A26]">
                unscripted hour
              </em>{" "}
              along the water.
            </h2>

            <p className="mt-6 max-w-2xl mx-auto font-editorial text-[21px] sm:text-[23px] leading-[1.55] text-[#D0C9BC]">
              Step into Varanasi with a living map in your pocket, honest local
              fares on every lane, and every sacred evening anchor quietly
              protected.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={currentUser ? "/dashboard" : "/login"}
                className="h-[54px] px-8 bg-[#FF5A26] hover:bg-[#ec4d1b] text-[#F3EEE5] text-[14.5px] font-medium tracking-[0.02em] inline-flex items-center gap-3 transition-colors shadow-[0_18px_45px_-12px_rgba(255,90,38,0.55)]"
              >
                <span>
                  {currentUser
                    ? "Return to Journey Studio"
                    : "Begin Your Journey Dispatch"}
                </span>
                <span className="font-mono text-[12px]">→</span>
              </Link>

              {!currentUser && (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal("login")}
                  className="h-[54px] px-6 border border-[#E5A93C]/40 hover:border-[#E5A93C] bg-[#171B24]/70 text-[#F3EEE5] text-[14px] tracking-[0.02em] transition-colors cursor-pointer"
                >
                  Sign in to Existing Pass
                </button>
              )}
            </div>
          </EditorialReveal>
        </div>
      </section>

      {/* RESTRAINED EDITORIAL COLOPHON / FOOTER */}
      <footer className="bg-[#07090E] text-[#C5BEB1] border-t border-white/10">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Brand & Monograph Colophon */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Logo variant="badge" size={32} />
                <div>
                  <div className="font-display text-[18px] text-[#F3EEE5] font-semibold">
                    LessGooo
                  </div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#E5A93C]">
                    Spatial Wayfinder & Field Companion
                  </div>
                </div>
              </div>
              <p className="text-[13.5px] leading-relaxed text-[#8C867A] max-w-sm">
                Crafted for real-world Indian journeys—combining spatial
                cartography, adaptive schedules, local transit fare clarity, and
                human care.
              </p>
            </div>

            {/* Atlas Chapters */}
            <div className="md:col-span-4 space-y-2.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5A93C]">
                Monograph Index
              </div>
              <ul className="space-y-2 text-[13.5px]">
                <li>
                  <a
                    href="#destination-atlas"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    01 · Varanasi Living Cartography
                  </a>
                </li>
                <li>
                  <a
                    href="#adaptive-replanning"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    02 · Adaptive Journey Chronometer
                  </a>
                </li>
                <li>
                  <a
                    href="#fare-budget"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    03 · Transit Fare Shield
                  </a>
                </li>
                <li>
                  <a
                    href="#expense-tracker"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    04 · Tactile Expense Journal
                  </a>
                </li>
                <li>
                  <a
                    href="#guide-allotment"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    05 · Verified Local Companions
                  </a>
                </li>
              </ul>
            </div>

            {/* Traveller Desk Routes */}
            <div className="md:col-span-3 space-y-2.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E5A93C]">
                Traveller Desk
              </div>
              <ul className="space-y-2 text-[13.5px]">
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    Journey Studio (/dashboard)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    Traveller Sign-In (/login)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account-info"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    Pass & Credentials (/account-info)
                  </Link>
                </li>
                <li>
                  <a
                    href="#plans-section"
                    className="hover:text-[#F3EEE5] transition-colors"
                  >
                    Explorer & LessGooo+ Passes
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Colophon Line */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#7D776C]">
            <div>
              © {new Date().getFullYear()} LESSGOOO DISPATCH · VARANASI SECTOR
              EDITION
            </div>
            <div className="flex items-center gap-4">
              <span>25.3176° N, 82.9739° E</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendStatus === "connected"
                      ? "bg-[#2DD4BF]"
                      : backendStatus === "error"
                      ? "bg-[#FF5A26]"
                      : "bg-[#E5A93C]"
                  }`}
                />
                <span>
                  {backendStatus === "connected"
                    ? "DISPATCH SYNC LIVE"
                    : backendStatus === "error"
                    ? "OFFLINE ATLAS MODE"
                    : "CHECKING SYNC"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
