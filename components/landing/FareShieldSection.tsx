"use client";

import React, { useState } from "react";
import { EditorialReveal, KashiBrassSeal } from "./EditorialVisuals";

interface TransitModeTicket {
  mode: string;
  subLabel: string;
  ticketCode: string;
  dayFare: string;
  duskFare: string;
  duration: string;
  dropPointNote: string;
  touristTrapQuote: string;
  recommended?: boolean;
}

interface FareCorridor {
  id: string;
  serial: string;
  origin: string;
  destination: string;
  distance: string;
  barricadeRule: string;
  hindiPhrase: string;
  phoneticGuide: string;
  englishMeaning: string;
  tickets: TransitModeTicket[];
}

const FARE_CORRIDORS: FareCorridor[] = [
  {
    id: "cantt-godowlia",
    serial: "VNS-CORR-101",
    origin: "Varanasi Jn (Cantt)",
    destination: "Godowlia Chowk",
    distance: "4.8 KM · 22–28 MIN",
    barricadeRule:
      "Four-wheelers & autos halt at Girjaghar / Ramaपुरा perimeter during evening hours; final 450m is pedestrian.",
    hindiPhrase: "गोदौलिया चौराहा चलेंगे? मीटर या लोकल रेट एक सौ चालीस देंगे।",
    phoneticGuide:
      "“Godowlia chauraha chalenge? Local rate ek sau chaalis rupaye denge.”",
    englishMeaning:
      "“Heading to Godowlia junction? We will pay the standard local ₹140 fare.”",
    tickets: [
      {
        mode: "E-Rickshaw (Toto)",
        subLabel: "Shared Seat / Private Reserve",
        ticketCode: "ERK-01",
        dayFare: "₹25 seat · ₹120–₹150 full",
        duskFare: "₹30 seat · ₹150–₹180 full",
        duration: "24 min",
        dropPointNote: "Slips closest to Girjaghar barricade through narrow lanes.",
        touristTrapQuote: "Unverified stand quote: ₹300–₹400",
        recommended: true,
      },
      {
        mode: "Auto-Rickshaw",
        subLabel: "Private Three-Wheeler",
        ticketCode: "AUT-02",
        dayFare: "₹130 – ₹170",
        duskFare: "₹170 – ₹220",
        duration: "20 min",
        dropPointNote: "Exit Platform 1 prepaid booth or main road outside station gate.",
        touristTrapQuote: "Station tout quote: ₹350+",
      },
      {
        mode: "App-Based Cab",
        subLabel: "AC Hatchback / Sedan",
        ticketCode: "CAB-03",
        dayFare: "₹230 – ₹310",
        duskFare: "₹290 – ₹390",
        duration: "26 min",
        dropPointNote: "Drops 650m prior to Godowlia when police no-vehicle zone is active.",
        touristTrapQuote: "Unmetered taxi stand: ₹550",
      },
      {
        mode: "Local City E-Bus",
        subLabel: "Kashi AC Electric Transit",
        ticketCode: "LOC-04",
        dayFare: "₹20 – ₹25 per rider",
        duskFare: "₹25 per rider",
        duration: "32 min",
        dropPointNote: "Fixed municipal fare along Cantt–Maidagin–Godowlia trunk corridor.",
        touristTrapQuote: "Fixed ticketed counter — zero haggling",
      },
    ],
  },
  {
    id: "assi-dashashwamedh",
    serial: "VNS-CORR-204",
    origin: "Assi Ghat Jetty",
    destination: "Dashashwamedh Ghat",
    distance: "2.9 KM · RIVER OR LANE",
    barricadeRule:
      "Road route detours inland via Sonarpura & Madanpura; river wooden rowboat glides past 42 ghats step-free.",
    hindiPhrase: "दशाश्वमेध घाट तक साझा नाव कितने में? सौ रुपये प्रति सवारी ठीक है।",
    phoneticGuide:
      "“Dashashwamedh tak saajha naav kitne mein? Sau rupaye prati sawari theek hai.”",
    englishMeaning:
      "“How much for the shared boat to Dashashwamedh? ₹100 per passenger works.”",
    tickets: [
      {
        mode: "E-Rickshaw (Toto)",
        subLabel: "Inland via Sonarpura Road",
        ticketCode: "ERK-11",
        dayFare: "₹20 seat · ₹100–₹130 full",
        duskFare: "₹25 seat · ₹130–₹160 full",
        duration: "19 min",
        dropPointNote: "Drops at Girjaghar crossing; 6-min walk down Dashashwamedh road.",
        touristTrapQuote: "Ghat-side private quote: ₹250",
      },
      {
        mode: "Auto-Rickshaw",
        subLabel: "Via Bhelupur Perimeter",
        ticketCode: "AUT-12",
        dayFare: "₹120 – ₹150",
        duskFare: "₹150 – ₹190",
        duration: "17 min",
        dropPointNote: "Faster midday option when river sun is overhead.",
        touristTrapQuote: "Tout quote: ₹300",
      },
      {
        mode: "App-Based Cab",
        subLabel: "Point-to-Perimeter AC",
        ticketCode: "CAB-13",
        dayFare: "₹190 – ₹250",
        duskFare: "₹250 – ₹330",
        duration: "24 min",
        dropPointNote: "Not advised after 16:30 IST due to Aarti pedestrian closures.",
        touristTrapQuote: "Hotel desk car: ₹600",
      },
      {
        mode: "Local River Rowboat",
        subLabel: "Shared / Private Bajra",
        ticketCode: "LOC-14",
        dayFare: "₹80–₹100 seat · ₹450–₹600 boat",
        duskFare: "₹150–₹200 seat · ₹800–₹1100 Aarti",
        duration: "22 min",
        dropPointNote: "Direct step-to-step riverfront glide bypassing all street traffic.",
        touristTrapQuote: "Unverified Aarti boat quote: ₹2,500+",
        recommended: true,
      },
    ],
  },
  {
    id: "godowlia-sarnath",
    serial: "VNS-CORR-309",
    origin: "Maidagin / Godowlia",
    destination: "Sarnath Dhamek Stupa",
    distance: "10.4 KM · 32–38 MIN",
    barricadeRule:
      "Board autos or cabs at Maidagin Town Hall or Chaukaghat bridge edge to save 15 minutes of old-city crawl.",
    hindiPhrase: "सारनाथ स्तूप सीधा चलना है, बिना सिल्क शॉप रुके—ढाई सौ रुपये।",
    phoneticGuide:
      "“Sarnath Stupa seedha chalna hai, bina dukaan ruke — dhaai sau rupaye.”",
    englishMeaning:
      "“Direct to Sarnath Stupa without commission showroom stops — ₹250.”",
    tickets: [
      {
        mode: "E-Rickshaw (Toto)",
        subLabel: "Private Reserve via Pandeypur",
        ticketCode: "ERK-21",
        dayFare: "₹40–₹50 hop · ₹220–₹260 full",
        duskFare: "₹250 – ₹300 full",
        duration: "42 min",
        dropPointNote: "Breezy open ride; slower over flyover stretches.",
        touristTrapQuote: "“₹100 ride” that detours into 3 commission shops",
      },
      {
        mode: "Auto-Rickshaw",
        subLabel: "Direct Point-to-Gate",
        ticketCode: "AUT-22",
        dayFare: "₹220 – ₹280",
        duskFare: "₹260 – ₹330",
        duration: "32 min",
        dropPointNote: "Ideal balance of speed and direct drop outside Archaeological Museum.",
        touristTrapQuote: "Round-trip tout quote: ₹900",
        recommended: true,
      },
      {
        mode: "App-Based Cab",
        subLabel: "AC Sedan · Comfort Leg",
        ticketCode: "CAB-23",
        dayFare: "₹320 – ₹420",
        duskFare: "₹380 – ₹490",
        duration: "30 min",
        dropPointNote: "Recommended for hot April–June afternoons and senior travellers.",
        touristTrapQuote: "Half-day private package: ₹1,600",
      },
      {
        mode: "Local Electric Bus",
        subLabel: "Maidagin → Sarnath Route",
        ticketCode: "LOC-24",
        dayFare: "₹25 – ₹30 per rider",
        duskFare: "₹30 per rider",
        duration: "45 min",
        dropPointNote: "Clean AC municipal coach running every 20–25 minutes.",
        touristTrapQuote: "Official conductor ticket",
      },
    ],
  },
];

export default function FareShieldSection() {
  const [selectedCorridorId, setSelectedCorridorId] =
    useState<string>("cantt-godowlia");
  const [duskWindow, setDuskWindow] = useState<boolean>(false);

  const corridor =
    FARE_CORRIDORS.find((c) => c.id === selectedCorridorId) ??
    FARE_CORRIDORS[0];

  return (
    <section
      id="fare-budget"
      aria-labelledby="fare-shield-heading"
      className="relative py-24 lg:py-32 bg-[var(--atlas-bg)] border-b border-[var(--atlas-border)]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Editorial Masthead */}
        <EditorialReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[var(--atlas-border)]">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--atlas-ember)]">
                <span>Chapter 03</span>
                <span className="text-[var(--atlas-border-brass)]">/</span>
                <span className="text-[var(--atlas-brass)]">
                  Transit Fare Transparency · Street Shield
                </span>
              </div>
              <h2
                id="fare-shield-heading"
                className="mt-3 font-display text-[34px] sm:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.02em] text-[var(--atlas-text)]"
              >
                Know the honest local fare before you step off the curb.
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="font-editorial text-[20px] leading-[1.5] text-[var(--atlas-text-secondary)]">
                Unfamiliarity shouldn&apos;t carry a 300% surcharge. Every route
                leg in LessGooo issues a grounded local fare bracket across four
                modes—complete with barricade rules and polite Hindi phrasing.
              </p>
            </div>
          </div>
        </EditorialReveal>

        {/* Corridor Selector & Time-of-Day Switch */}
        <EditorialReveal delayMs={80}>
          <div className="mt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Select Varanasi transit corridor"
              className="flex flex-wrap gap-2"
            >
              {FARE_CORRIDORS.map((item) => {
                const active = item.id === selectedCorridorId;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => setSelectedCorridorId(item.id)}
                    className={`px-4 py-2.5 text-left border transition-all cursor-pointer ${
                      active
                        ? "bg-[var(--atlas-surface)] border-[#FF5A26] shadow-md"
                        : "bg-[var(--atlas-bg-deep)] border-[var(--atlas-border)] hover:border-[var(--atlas-border-brass)]"
                    }`}
                  >
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--atlas-brass)]">
                      {item.serial}
                    </div>
                    <div className="text-[13.5px] font-semibold text-[var(--atlas-text)] mt-0.5">
                      {item.origin} → {item.destination}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Daylight vs Dusk Aarti Window Toggle */}
            <div className="inline-flex items-center gap-2 self-start lg:self-auto bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] p-1">
              <button
                type="button"
                onClick={() => setDuskWindow(false)}
                className={`px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] cursor-pointer transition-colors ${
                  !duskWindow
                    ? "bg-[#2DD4BF] text-[#0A0D14] font-semibold"
                    : "text-[var(--atlas-text-muted)] hover:text-[var(--atlas-text)]"
                }`}
              >
                Daylight Rate
              </button>
              <button
                type="button"
                onClick={() => setDuskWindow(true)}
                className={`px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] cursor-pointer transition-colors ${
                  duskWindow
                    ? "bg-[#E5A93C] text-[#0A0D14] font-semibold"
                    : "text-[var(--atlas-text-muted)] hover:text-[var(--atlas-text)]"
                }`}
              >
                Dusk Aarti Peak
              </button>
            </div>
          </div>
        </EditorialReveal>

        {/* Master Dispatch Stub + 4 Perforated Mode Tickets */}
        <EditorialReveal delayMs={140}>
          <div className="mt-8 bg-[var(--atlas-ticket)] border border-[var(--atlas-border-brass)] shadow-[var(--atlas-shadow)] relative overflow-hidden">
            {/* Ticket Punch Notches (Left & Right) */}
            <div
              aria-hidden="true"
              className="hidden sm:block w-6 h-6 rounded-full bg-[var(--atlas-bg)] border border-[var(--atlas-border-brass)] absolute -left-3 top-[118px]"
            />
            <div
              aria-hidden="true"
              className="hidden sm:block w-6 h-6 rounded-full bg-[var(--atlas-bg)] border border-[var(--atlas-border-brass)] absolute -right-3 top-[118px]"
            />

            {/* Top Dispatch Header */}
            <div className="p-6 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--atlas-brass)]">
                  <span>DISPATCH {corridor.serial}</span>
                  <span>•</span>
                  <span>{corridor.distance}</span>
                  <span>•</span>
                  <span className="text-[#2DD4BF]">
                    {duskWindow ? "17:30–20:30 PEAK TARIFF" : "06:00–17:30 LOCAL TARIFF"}
                  </span>
                </div>
                <h3 className="font-display text-[26px] sm:text-[32px] text-[var(--atlas-text)] mt-1">
                  {corridor.origin}{" "}
                  <span className="text-[#FF5A26] font-normal px-1">⟶</span>{" "}
                  {corridor.destination}
                </h3>
                <p className="text-[13.5px] text-[var(--atlas-text-secondary)] mt-1.5 max-w-2xl">
                  {corridor.barricadeRule}
                </p>
              </div>

              <KashiBrassSeal
                code={corridor.serial.slice(-3)}
                className="hidden md:block w-20 h-20 shrink-0"
              />
            </div>

            {/* Perforated Tear Line */}
            <div className="ticket-perforation mx-4" />

            {/* Four Perforated Mode Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--atlas-border)]">
              {corridor.tickets.map((ticket) => (
                <div
                  key={ticket.ticketCode}
                  className={`p-6 flex flex-col justify-between relative ${
                    ticket.recommended ? "bg-[#E5A93C]/[0.05]" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--atlas-text-muted)]">
                        STUB // {ticket.ticketCode}
                      </span>
                      {ticket.recommended && (
                        <span className="px-2 py-0.5 bg-[#FF5A26] text-[#F3EEE5] font-mono text-[9.5px] uppercase tracking-[0.14em]">
                          Best Fit
                        </span>
                      )}
                    </div>

                    <h4 className="text-[18px] font-semibold text-[var(--atlas-text)] mt-2">
                      {ticket.mode}
                    </h4>
                    <div className="text-[12.5px] text-[var(--atlas-text-muted)]">
                      {ticket.subLabel}
                    </div>

                    {/* Expected Local Fare Bracket */}
                    <div className="mt-5 pt-4 border-t border-dashed border-[var(--atlas-border-brass)]">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-brass)]">
                        Fair Local Bracket
                      </div>
                      <div className="font-mono text-[20px] font-semibold text-[var(--atlas-text)] mt-1 tracking-tight">
                        {duskWindow ? ticket.duskFare : ticket.dayFare}
                      </div>
                      <div className="font-mono text-[11px] text-[#2DD4BF] mt-1">
                        Est. Transit: {ticket.duration}
                      </div>
                    </div>

                    <p className="mt-4 text-[13px] leading-relaxed text-[var(--atlas-text-secondary)]">
                      {ticket.dropPointNote}
                    </p>
                  </div>

                  {/* Unverified Markup Warning */}
                  <div className="mt-5 pt-3 border-t border-[var(--atlas-border)] font-mono text-[11px] text-[var(--atlas-ember)]">
                    ⚑ {ticket.touristTrapQuote}
                  </div>
                </div>
              ))}
            </div>

            {/* Spoken Curbside Phrase Footer */}
            <div className="ticket-perforation mx-4" />
            <div className="p-6 sm:px-8 bg-[var(--atlas-surface-elevated)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--atlas-brass)]">
                  Curbside Phrasebook // Speak Like a Resident
                </div>
                <div className="font-editorial italic text-[20px] text-[var(--atlas-text)] mt-1">
                  {corridor.phoneticGuide}
                </div>
                <div className="text-[13px] text-[var(--atlas-text-muted)] mt-0.5">
                  {corridor.hindiPhrase} — {corridor.englishMeaning}
                </div>
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#2DD4BF] shrink-0">
                ✓ Included Free on Every Itinerary Leg
              </div>
            </div>
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
}
