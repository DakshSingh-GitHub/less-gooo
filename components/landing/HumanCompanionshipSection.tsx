"use client";

import React, { useState } from "react";
import {
  CompanionPortraitPlate,
  EditorialReveal,
  KashiBrassSeal,
} from "./EditorialVisuals";

export default function HumanCompanionshipSection() {
  const [seniorCalmPreview, setSeniorCalmPreview] = useState<boolean>(true);

  return (
    <section
      id="guide-allotment"
      aria-labelledby="companionship-heading"
      className="relative py-24 lg:py-32 bg-[var(--atlas-bg)] border-b border-[var(--atlas-border)]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Magazine Feature Opener */}
        <EditorialReveal>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--atlas-ember)]">
              <span>Chapter 05</span>
              <span className="text-[var(--atlas-border-brass)]">/</span>
              <span className="text-[var(--atlas-brass)]">
                Human Companionship & Senior Care
              </span>
            </div>
            <h2
              id="companionship-heading"
              className="mt-3 font-display text-[34px] sm:text-[46px] lg:text-[54px] leading-[1.06] tracking-[-0.02em] text-[var(--atlas-text)]"
            >
              Software reads the clock. Only a neighbour knows which courtyard holds shade at noon.
            </h2>
            <p className="mt-5 font-editorial text-[21px] leading-[1.55] text-[var(--atlas-text-secondary)]">
              When lanes narrow beyond GPS geometry—or when parents travel for a
              lifetime pilgrimage—LessGooo pairs your itinerary with vetted
              resident historians and unhurried human escorts.
            </p>
          </div>
        </EditorialReveal>

        {/* Editorial Two-Feature Spread: Companion Dossiers + Senior Companion Experience */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT (7 cols): Editorial Portraits of Verified Kashi Companions */}
          <EditorialReveal className="lg:col-span-7 flex flex-col gap-6">
            {[
              {
                variant: "raghav" as const,
                credential: "REG. #UP-T-1408 · 19 YEARS ON THE GHATS",
                name: "Pt. Raghavendra Mishra",
                role: "Oral Historian & Riverfront Sanctuary Escort",
                languages: "Hindi · English · Bhojpuri · Sanskrit",
                quote:
                  "Most visitors rush from Gate 4 straight back to traffic. Five minutes north sits an eighteenth-century sandstone stepwell where elders can rest in complete silence.",
                specialties: [
                  "Step-free Lalita Ghat escalator access",
                  "Pre-berthed dusk Aarti wooden boats",
                  "Zero-commission weaver introductions",
                ],
              },
              {
                variant: "annapurna" as const,
                credential: "BHU ARCHAEOLOGY FELLOW · VERIFIED ESCORT",
                name: "Dr. Annapurna Chatterjee",
                role: "Sarnath Buddhist Art & Old-City Culinary Scholar",
                languages: "English · Bengali · Hindi · Tamil",
                quote:
                  "For solo women and older couples, calm pacing changes everything—knowing which ghat stairs have handrails, clean rest stops, and trusted family kitchens.",
                specialties: [
                  "Mauryan & Gupta sculpture interpretation",
                  "Women-led heritage walks",
                  "Unhurried multi-generational pacing",
                ],
              },
            ].map((person) => (
              <article
                key={person.name}
                className="bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] grid grid-cols-1 sm:grid-cols-12 overflow-hidden shadow-[var(--atlas-shadow)]"
              >
                <div className="sm:col-span-5 border-b sm:border-b-0 sm:border-r border-[var(--atlas-border)] relative bg-[#121621]">
                  <CompanionPortraitPlate
                    variant={person.variant}
                    className="w-full h-full min-h-[210px] object-cover"
                  />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2.5 py-1 bg-[#0A0D14]/85 border border-[#E5A93C]/35 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#E5A93C]">
                    ✓ Police & Tourism Board Verified
                  </div>
                </div>

                <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-brass)]">
                      {person.credential}
                    </div>
                    <h3 className="font-display text-[24px] text-[var(--atlas-text)] mt-1">
                      {person.name}
                    </h3>
                    <div className="text-[13px] font-medium text-[var(--atlas-ember)]">
                      {person.role}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--atlas-text-muted)] mt-1">
                      Speaks: {person.languages}
                    </div>

                    <blockquote className="mt-3.5 font-editorial italic text-[18.5px] leading-[1.5] text-[var(--atlas-text-secondary)]">
                      &ldquo;{person.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-[var(--atlas-border)] flex flex-wrap gap-1.5">
                    {person.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-1 font-mono text-[10px] bg-[var(--atlas-surface-elevated)] border border-[var(--atlas-border)] text-[var(--atlas-text-secondary)]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </EditorialReveal>

          {/* RIGHT (5 cols): Senior Companion Experience Card */}
          <EditorialReveal delayMs={130} className="lg:col-span-5 flex flex-col">
            <div className="flex-1 bg-[var(--atlas-surface)] border-2 border-[#E5A93C]/55 p-6 sm:p-8 flex flex-col justify-between shadow-[var(--atlas-shadow)] relative">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-[#2DD4BF]/15 border border-[#2DD4BF]/45 font-mono text-[10px] uppercase tracking-[0.18em] text-[#2DD4BF]">
                      Senior Companion Experience
                    </span>
                    <h3 className="font-display text-[28px] sm:text-[31px] leading-tight text-[var(--atlas-text)] mt-3">
                      Designed for your parents&apos; peace of mind—and yours.
                    </h3>
                  </div>
                  <KashiBrassSeal
                    label="CALM ESCORT • STEP-FREE CARE •"
                    code="SNR-CARE"
                    className="w-16 h-16 shrink-0 hidden sm:block"
                  />
                </div>

                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--atlas-text-secondary)]">
                  Dense map pins and tiny fare tables overwhelm older travellers
                  in crowded temple corridors. Senior Companion Mode replaces
                  visual noise with calm, large-type prompts, ramp-first routes,
                  and a named human escort on standby.
                </p>

                {/* Interactive View Switcher */}
                <div className="mt-5 flex items-center justify-between gap-2 pb-3 border-b border-[var(--atlas-border)]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-text-muted)]">
                    Companion Interface Preview:
                  </span>
                  <div className="inline-flex border border-[var(--atlas-border-brass)] p-0.5 bg-[var(--atlas-bg)]">
                    <button
                      type="button"
                      onClick={() => setSeniorCalmPreview(true)}
                      className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider cursor-pointer ${
                        seniorCalmPreview
                          ? "bg-[#2DD4BF] text-[#0A0D14] font-semibold"
                          : "text-[var(--atlas-text-muted)]"
                      }`}
                    >
                      Senior Calm View
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeniorCalmPreview(false)}
                      className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider cursor-pointer ${
                        !seniorCalmPreview
                          ? "bg-[var(--atlas-surface-elevated)] text-[var(--atlas-text)] font-semibold"
                          : "text-[var(--atlas-text-muted)]"
                      }`}
                    >
                      Standard Telemetry
                    </button>
                  </div>
                </div>

                {/* Tactile Preview Specimen */}
                {seniorCalmPreview ? (
                  <div className="mt-5 p-5 bg-[#0E131D] text-[#F3EEE5] border border-[#2DD4BF]/45 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2DD4BF]">
                        ● NEXT STEP · UNHURRIED PACE
                      </span>
                      <span className="font-mono text-[12px] text-[#E5A93C]">
                        10:15 AM
                      </span>
                    </div>
                    <div className="text-[21px] font-semibold leading-snug">
                      Board Riverfront Golf Cart at Gate 1 (Zero Stairs)
                    </div>
                    <p className="text-[15.5px] leading-relaxed text-[#D8D2C6]">
                      Your verified companion{" "}
                      <strong className="text-[#F3EEE5]">Raghavendra Ji</strong>{" "}
                      is waiting beside the shaded bench in a saffron shawl.
                      Escalator lift to sanctum is confirmed.
                    </p>
                    <div className="pt-2 grid grid-cols-2 gap-2.5">
                      <div className="py-2.5 px-3 bg-[#2DD4BF]/15 border border-[#2DD4BF]/40 text-center text-[13.5px] font-medium text-[#2DD4BF]">
                        ☎ Call Raghavendra Ji
                      </div>
                      <div className="py-2.5 px-3 bg-white/[0.06] border border-white/15 text-center text-[13.5px] font-medium text-[#F3EEE5]">
                        Share Live Gate w/ Family
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 p-5 bg-[var(--atlas-surface-elevated)] border border-[var(--atlas-border)] space-y-2.5 font-mono text-[11.5px] text-[var(--atlas-text-secondary)]">
                    <div className="flex justify-between text-[var(--atlas-brass)]">
                      <span>WP-04 // VISHWANATH CORRIDOR</span>
                      <span>25.3109° N, 83.0107° E</span>
                    </div>
                    <div>
                      TRANSIT: E-RICKSHAW DROP GIRJAGHAR (₹120) + 550M WALK
                    </div>
                    <div>QUEUE ESTIMATE: 45M · LOCKER ZONE B · GATE 4 ENTRY</div>
                    <div className="text-[#2DD4BF]">
                      BUFFER REMAINING BEFORE S5 ANCHOR: +35 MIN
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--atlas-border)] flex items-center justify-between gap-3 font-mono text-[10.5px] text-[var(--atlas-text-muted)]">
                <span>STEP-FREE GHAT INDEX</span>
                <span className="text-[var(--atlas-brass)]">
                  COMPANION DESK · LESSGOOO+ PASS
                </span>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
