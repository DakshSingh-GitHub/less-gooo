"use client";

import React from "react";
import Link from "next/link";
import type { UserProfile } from "@/lib/appwrite";
import { EditorialReveal, KashiBrassSeal } from "./EditorialVisuals";

interface MembershipPassesSectionProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: (mode: "login" | "signup") => void;
}

export default function MembershipPassesSection({
  currentUser,
  onOpenAuthModal,
}: MembershipPassesSectionProps) {
  return (
    <section
      id="plans-section"
      aria-labelledby="passes-heading"
      className="relative py-24 lg:py-32 bg-[var(--atlas-bg-deep)] border-b border-[var(--atlas-border)]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Chapter Header */}
        <EditorialReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[var(--atlas-border)]">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--atlas-ember)]">
                <span>Chapter 06</span>
                <span className="text-[var(--atlas-border-brass)]">/</span>
                <span className="text-[var(--atlas-brass)]">
                  Traveller Credentials & Folio Passes
                </span>
              </div>
              <h2
                id="passes-heading"
                className="mt-3 font-display text-[34px] sm:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.02em] text-[var(--atlas-text)]"
              >
                Two honest travel documents. Zero hidden surcharges.
              </h2>
            </div>

            <p className="max-w-md font-editorial text-[20px] leading-[1.5] text-[var(--atlas-text-secondary)]">
              Every essential orientation, fare bracket, and daily expense sheet
              is open to all travellers. Upgrade to the embossed Brass Pass when
              you want automatic drift rebalancing and human companion dispatch.
            </p>
          </div>
        </EditorialReveal>

        {/* Two Tactile Perforated Travel Credentials */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* PASS I: FREE EXPLORER (5 columns) */}
          <EditorialReveal className="lg:col-span-5 flex">
            <article className="w-full bg-[var(--atlas-ticket)] border border-[var(--atlas-border)] flex flex-col justify-between relative overflow-hidden shadow-[var(--atlas-shadow)]">
              {/* Ticket Punch Notches */}
              <div
                aria-hidden="true"
                className="w-5 h-5 rounded-full bg-[var(--atlas-bg-deep)] border border-[var(--atlas-border)] absolute -left-2.5 top-[148px]"
              />
              <div
                aria-hidden="true"
                className="w-5 h-5 rounded-full bg-[var(--atlas-bg-deep)] border border-[var(--atlas-border)] absolute -right-2.5 top-[148px]"
              />

              <div>
                {/* Credential Stub Top */}
                <div className="p-7 sm:p-8">
                  <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--atlas-text-muted)]">
                    <span>FOLIO PASS // CLASS STD-01</span>
                    <span>OPEN ACCESS</span>
                  </div>
                  <h3 className="font-display text-[30px] text-[var(--atlas-text)] mt-2">
                    Free Explorer
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-[28px] font-semibold text-[var(--atlas-text)]">
                      ₹0
                    </span>
                    <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--atlas-text-muted)]">
                      · Permanent Personal Folio
                    </span>
                  </div>
                </div>

                <div className="ticket-perforation mx-4" />

                {/* Capabilities */}
                <div className="p-7 sm:p-8 space-y-4">
                  <p className="text-[14px] leading-relaxed text-[var(--atlas-text-secondary)]">
                    Built for independent travellers who want grounded spatial
                    itineraries, street-level fare clarity, and a clean pocket
                    ledger.
                  </p>

                  <dl className="space-y-3.5 pt-2">
                    {[
                      {
                        term: "Spatial Day-by-Day Itineraries",
                        detail: "Route-ordered stops across ghats, temples & bazaars",
                      },
                      {
                        term: "4-Mode Transit Fare Shield",
                        detail: "Local e-rickshaw, auto, cab & boat rate brackets",
                      },
                      {
                        term: "Tactile Daily Expense Journal",
                        detail: "Log street vouchers against your planned cap",
                      },
                      {
                        term: "Schedule Drift Warnings",
                        detail: "Alerts when an extended stop risks a downstream clash",
                      },
                    ].map((row) => (
                      <div
                        key={row.term}
                        className="pb-3 border-b border-[var(--atlas-border)] last:border-none"
                      >
                        <dt className="text-[14px] font-semibold text-[var(--atlas-text)] flex items-center justify-between">
                          <span>{row.term}</span>
                          <span className="font-mono text-[10px] text-[#2DD4BF]">
                            INCLUDED
                          </span>
                        </dt>
                        <dd className="text-[12.5px] text-[var(--atlas-text-muted)] mt-0.5">
                          {row.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              {/* Action Stub */}
              <div className="p-7 sm:p-8 pt-0">
                {currentUser ? (
                  <Link
                    href="/dashboard"
                    className="w-full h-12 border border-[var(--atlas-border-brass)] bg-[var(--atlas-surface-elevated)] hover:border-[#FF5A26] text-[var(--atlas-text)] font-medium text-[13.5px] tracking-[0.02em] inline-flex items-center justify-between px-5 transition-colors"
                  >
                    <span>Open Your Explorer Studio</span>
                    <span className="font-mono text-[12px]">→</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal("signup")}
                    className="w-full h-12 border border-[var(--atlas-border-brass)] bg-[var(--atlas-surface-elevated)] hover:border-[#FF5A26] text-[var(--atlas-text)] font-medium text-[13.5px] tracking-[0.02em] inline-flex items-center justify-between px-5 transition-colors cursor-pointer"
                  >
                    <span>Issue Free Explorer Pass</span>
                    <span className="font-mono text-[12px]">→</span>
                  </button>
                )}
              </div>
            </article>
          </EditorialReveal>

          {/* PASS II: LESSGOOO+ BRASS CREDENTIAL (7 columns) */}
          <EditorialReveal delayMs={120} className="lg:col-span-7 flex">
            <article className="w-full bg-[#121621] text-[#F3EEE5] border-2 border-[#E5A93C]/70 flex flex-col justify-between relative overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.75)]">
              {/* Subtle Saffron & Brass Top Accent Foil */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FF5A26] via-[#E5A93C] to-[#4E7BFF]" />

              {/* Ticket Punch Notches */}
              <div
                aria-hidden="true"
                className="w-5 h-5 rounded-full bg-[var(--atlas-bg-deep)] border border-[#E5A93C]/70 absolute -left-2.5 top-[162px]"
              />
              <div
                aria-hidden="true"
                className="w-5 h-5 rounded-full bg-[var(--atlas-bg-deep)] border border-[#E5A93C]/70 absolute -right-2.5 top-[162px]"
              />

              <div>
                {/* Credential Header */}
                <div className="p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#E5A93C]">
                      <span className="w-2 h-2 bg-[#FF5A26]" />
                      <span>CREDENTIAL // CLASS BRASS-PLUS</span>
                    </div>
                    <h3 className="font-display text-[34px] sm:text-[38px] text-[#F3EEE5] mt-1.5">
                      LessGooo<span className="text-[#E5A93C]">+</span>
                    </h3>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
                      <span className="font-mono text-[30px] font-semibold text-[#E5A93C]">
                        ₹299
                      </span>
                      <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#9E978B]">
                        / 14-Day Expedition Pass · or ₹1,499 Annual
                      </span>
                    </div>
                  </div>

                  <KashiBrassSeal
                    label="ADAPTIVE ENGINE • PRIORITY ESCORT •"
                    code="PLUS-01"
                    className="w-20 h-20 shrink-0 hidden sm:block"
                  />
                </div>

                <div className="ticket-perforation mx-5" />

                {/* Credential Privileges */}
                <div className="p-7 sm:p-9">
                  <p className="font-editorial text-[20px] leading-[1.5] text-[#D8D1C5]">
                    For families, elders, and unhurried travellers who want the
                    itinerary to heal itself automatically when real Indian
                    streets improvise.
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        code: "01 // AUTO-REBALANCE",
                        title: "Live Multi-Stop Replanning",
                        desc: "Compresses flexible bazaar or rest windows automatically while locking fixed Aarti boats & train departures.",
                      },
                      {
                        code: "02 // HUMAN DESK",
                        title: "Verified Local Scholar Allotment",
                        desc: "Priority matching with Ministry-licensed Kashi historians, weavers, and regional-language escorts.",
                      },
                      {
                        code: "03 // SENIOR CARE",
                        title: "Senior Companion Calm Mode",
                        desc: "Step-free ramp routing, large high-contrast prompts, and live family gate-check sharing.",
                      },
                      {
                        code: "04 // FIELD CONTINUITY",
                        title: "Multi-Day Disruption Recovery",
                        desc: "Defers skipped galleries or craft stops cleanly into tomorrow’s open morning window.",
                      },
                    ].map((priv) => (
                      <div
                        key={priv.code}
                        className="p-4 bg-[#191F2E] border border-[#E5A93C]/25"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E5A93C]">
                          {priv.code}
                        </div>
                        <div className="text-[15px] font-semibold text-[#F3EEE5] mt-1">
                          {priv.title}
                        </div>
                        <p className="text-[12.5px] leading-relaxed text-[#B6B0A4] mt-1">
                          {priv.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Stub */}
              <div className="p-7 sm:p-9 pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link
                  href={currentUser ? "/account-info" : "/login"}
                  className="flex-1 h-12 bg-[#FF5A26] hover:bg-[#ec4d1b] text-[#F3EEE5] font-medium text-[14px] tracking-[0.02em] inline-flex items-center justify-between px-6 transition-colors"
                >
                  <span>
                    {currentUser?.tier === "pro"
                      ? "LessGooo+ Active — View Pass"
                      : currentUser
                      ? "Upgrade Credential in Account"
                      : "Claim LessGooo+ Expedition Pass"}
                  </span>
                  <span className="font-mono text-[12px]">→</span>
                </Link>
                <div className="font-mono text-[10.5px] text-[#9E978B] sm:text-right">
                  <div>NO AUTO-RENEW TRAP</div>
                  <div className="text-[#2DD4BF]">INSTANT STUDIO ACCESS</div>
                </div>
              </div>
            </article>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
