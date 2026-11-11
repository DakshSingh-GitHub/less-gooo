"use client";

import React, { useState } from "react";
import { EditorialReveal } from "./EditorialVisuals";

interface FieldLedgerEntry {
  id: string;
  time: string;
  title: string;
  category: "transit" | "food" | "temple" | "guide" | "shopping";
  categoryLabel: string;
  plannedInr: number;
  actualInr: number;
  note: string;
}

const BASE_LEDGER: FieldLedgerEntry[] = [
  {
    id: "e1",
    time: "06:10 IST",
    title: "Assi → Dashashwamedh Shared Wooden Boat",
    category: "transit",
    categoryLabel: "Transit & River",
    plannedInr: 200,
    actualInr: 200,
    note: "2 seats × ₹100 verified dawn ghat tariff",
  },
  {
    id: "e2",
    time: "08:25 IST",
    title: "Ram Bhandar Kachori Sabzi & Jalebi",
    category: "food",
    categoryLabel: "Culinary",
    plannedInr: 250,
    actualInr: 190,
    note: "Thatheri Bazaar morning breakfast + 2 kulhad chai",
  },
  {
    id: "e3",
    time: "10:40 IST",
    title: "Vishwanath Dham Sugam Darshan & Flower Basket",
    category: "temple",
    categoryLabel: "Sanctum & Offerings",
    plannedInr: 650,
    actualInr: 620,
    note: "Official temple trust counter receipt #KVT-884",
  },
  {
    id: "e4",
    time: "14:05 IST",
    title: "Maidagin → Sarnath Direct Auto (Round-Trip)",
    category: "transit",
    categoryLabel: "Transit & River",
    plannedInr: 550,
    actualInr: 520,
    note: "Fare Shield rate agreed upfront; zero detour stops",
  },
  {
    id: "e5",
    time: "17:50 IST",
    title: "Half-Day Kashi Heritage Scholar Escort",
    category: "guide",
    categoryLabel: "Companion",
    plannedInr: 1400,
    actualInr: 1400,
    note: "Verified Ministry-licensed historian (4 hrs)",
  },
];

const QUICK_SAMPLE_RECEIPTS: FieldLedgerEntry[] = [
  {
    id: "q-lassi",
    time: "12:30 IST",
    title: "Blue Lassi Shop Saffron Pistachio Kulhad",
    category: "food",
    categoryLabel: "Culinary",
    plannedInr: 160,
    actualInr: 180,
    note: "Kachori Gali unscripted midday cool-down",
  },
  {
    id: "q-silk",
    time: "16:55 IST",
    title: "Madanpura Weaver Co-op Handloom Stole",
    category: "shopping",
    categoryLabel: "Craft & Loom",
    plannedInr: 900,
    actualInr: 850,
    note: "Direct loom purchase stamped by cooperative",
  },
];

const DAILY_PLANNED_CAP = 4200;

export default function ExpenseJournalSection() {
  const [filter, setFilter] = useState<"all" | "transit" | "food" | "heritage">(
    "all"
  );
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const toggleSampleReceipt = (id: string) => {
    setAddedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeEntries = [
    ...BASE_LEDGER,
    ...QUICK_SAMPLE_RECEIPTS.filter((item) => addedIds.includes(item.id)),
  ];

  const filteredEntries = activeEntries.filter((entry) => {
    if (filter === "all") return true;
    if (filter === "transit") return entry.category === "transit";
    if (filter === "food") return entry.category === "food";
    return (
      entry.category === "temple" ||
      entry.category === "guide" ||
      entry.category === "shopping"
    );
  });

  const totalActual = activeEntries.reduce((sum, e) => sum + e.actualInr, 0);
  const totalPlannedOfLogged = activeEntries.reduce(
    (sum, e) => sum + e.plannedInr,
    0
  );
  const remainingRunway = DAILY_PLANNED_CAP - totalActual;
  const utilizationPct = Math.min(
    100,
    Math.round((totalActual / DAILY_PLANNED_CAP) * 100)
  );
  const varianceInr = totalActual - totalPlannedOfLogged;

  return (
    <section
      id="expense-tracker"
      aria-labelledby="journal-heading"
      className="relative py-24 lg:py-32 bg-[var(--atlas-bg-deep)] border-b border-[var(--atlas-border)]"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT COLUMN (5 cols): Editorial Story & Daily Runway Instrument */}
          <EditorialReveal className="lg:col-span-5 space-y-7">
            <div>
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--atlas-ember)]">
                <span>Chapter 04</span>
                <span className="text-[var(--atlas-border-brass)]">/</span>
                <span className="text-[var(--atlas-brass)]">
                  Tactile Field Journal
                </span>
              </div>
              <h2
                id="journal-heading"
                className="mt-3 font-display text-[34px] sm:text-[44px] leading-[1.08] tracking-[-0.02em] text-[var(--atlas-text)]"
              >
                A quiet pocket ledger—not an accounting chore.
              </h2>
              <p className="mt-4 text-[15.5px] leading-[1.7] text-[var(--atlas-text-secondary)]">
                In cash-first lanes of chai stalls, boatmen, and weaver
                courtyards, tiny notes vanish fast. Log street spend in two taps
                and measure real outlay against your day&apos;s planned transit
                and cultural envelope.
              </p>
            </div>

            {/* Daily Runway Card (Tactile Ledger Summary) */}
            <div className="bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] p-6 shadow-[var(--atlas-shadow)]">
              <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--atlas-text-muted)]">
                <span>DAY 01 ENVELOPE · 2 TRAVELLERS</span>
                <span
                  className={
                    remainingRunway >= 600
                      ? "text-[#2DD4BF]"
                      : "text-[#E5A93C]"
                  }
                >
                  {remainingRunway >= 600 ? "● CALM RUNWAY" : "● NEAR CEILING"}
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <span className="font-mono text-[32px] sm:text-[36px] font-semibold text-[var(--atlas-text)] tracking-tight">
                    ₹{totalActual.toLocaleString("en-IN")}
                  </span>
                  <span className="font-mono text-[13px] text-[var(--atlas-text-muted)] ml-2">
                    / ₹{DAILY_PLANNED_CAP.toLocaleString("en-IN")} planned
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--atlas-text-muted)]">
                    Remaining
                  </div>
                  <div className="font-mono text-[16px] font-semibold text-[#2DD4BF]">
                    ₹{Math.max(0, remainingRunway).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Graduated Ruler Gauge */}
              <div className="mt-4">
                <div className="h-2.5 w-full bg-[var(--atlas-bg)] border border-[var(--atlas-border)] overflow-hidden">
                  <div
                    style={{ width: `${utilizationPct}%` }}
                    className={`h-full transition-all duration-500 ${
                      utilizationPct > 88 ? "bg-[#E5A93C]" : "bg-[#2DD4BF]"
                    }`}
                  />
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-[var(--atlas-text-muted)]">
                  <span>0%</span>
                  <span>{utilizationPct}% OF DAY ENVELOPE USED</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="ticket-perforation my-5" />

              {/* Interactive Stamp-an-Expense Simulator */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--atlas-brass)]">
                  Test Live Ledger · Stamp an Unscripted Spend:
                </div>
                <div className="mt-2.5 flex flex-col gap-2">
                  {QUICK_SAMPLE_RECEIPTS.map((sample) => {
                    const isStamped = addedIds.includes(sample.id);
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => toggleSampleReceipt(sample.id)}
                        aria-pressed={isStamped}
                        className={`px-3.5 py-2.5 border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isStamped
                            ? "border-[#2DD4BF] bg-[#2DD4BF]/10 text-[var(--atlas-text)]"
                            : "border-[var(--atlas-border)] bg-[var(--atlas-surface-elevated)] text-[var(--atlas-text-secondary)] hover:border-[var(--atlas-border-brass)]"
                        }`}
                      >
                        <span className="text-[13px] font-medium">
                          {isStamped ? "✓ Stamped: " : "+ Stamp: "}
                          {sample.title}
                        </span>
                        <span className="font-mono text-[12px] text-[var(--atlas-brass)] shrink-0">
                          ₹{sample.actualInr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </EditorialReveal>

          {/* RIGHT COLUMN (7 cols): Tactile Ruled Field Ledger Page */}
          <EditorialReveal delayMs={120} className="lg:col-span-7">
            <div className="bg-[var(--atlas-ticket)] border border-[var(--atlas-border-brass)] shadow-[var(--atlas-shadow)]">
              {/* Ledger Top Folio Header */}
              <div className="px-6 py-5 border-b border-[var(--atlas-border)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--atlas-brass)]">
                    FOLIO SHEET #01 // VARANASI STREET LOG
                  </div>
                  <h3 className="font-editorial text-[24px] text-[var(--atlas-text)] mt-0.5">
                    Planned Estimate vs. Actual Curbside Outlay
                  </h3>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { key: "all", label: "All" },
                    { key: "transit", label: "Transit" },
                    { key: "food", label: "Food" },
                    { key: "heritage", label: "Sanctum & Craft" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() =>
                        setFilter(
                          tab.key as "all" | "transit" | "food" | "heritage"
                        )
                      }
                      className={`px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] border cursor-pointer transition-colors ${
                        filter === tab.key
                          ? "bg-[#FF5A26] text-[#F3EEE5] border-[#FF5A26]"
                          : "border-[var(--atlas-border)] text-[var(--atlas-text-muted)] hover:text-[var(--atlas-text)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column Headings */}
              <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-2.5 bg-[var(--atlas-surface-elevated)] border-b border-[var(--atlas-border)] font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-text-muted)]">
                <div className="col-span-2">Hour</div>
                <div className="col-span-6">Field Entry & Voucher Note</div>
                <div className="col-span-2 text-right">Planned</div>
                <div className="col-span-2 text-right">Actual</div>
              </div>

              {/* Ruled Ledger Rows */}
              <div className="divide-y divide-[var(--atlas-border)]">
                {filteredEntries.map((entry) => {
                  const saved = entry.plannedInr - entry.actualInr;
                  return (
                    <div
                      key={entry.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 px-6 py-4 items-center hover:bg-[var(--atlas-surface-elevated)]/60 transition-colors"
                    >
                      <div className="sm:col-span-2 font-mono text-[11px] text-[var(--atlas-text-muted)]">
                        {entry.time}
                      </div>
                      <div className="sm:col-span-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14.5px] font-medium text-[var(--atlas-text)]">
                            {entry.title}
                          </span>
                          <span className="px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider border border-[var(--atlas-border-brass)] text-[var(--atlas-brass)]">
                            {entry.categoryLabel}
                          </span>
                        </div>
                        <p className="text-[12.5px] text-[var(--atlas-text-muted)] mt-0.5">
                          {entry.note}
                        </p>
                      </div>
                      <div className="sm:col-span-2 sm:text-right font-mono text-[12.5px] text-[var(--atlas-text-muted)]">
                        <span className="sm:hidden mr-1">Est:</span>₹
                        {entry.plannedInr}
                      </div>
                      <div className="sm:col-span-2 sm:text-right">
                        <span className="font-mono text-[14px] font-semibold text-[var(--atlas-text)]">
                          ₹{entry.actualInr}
                        </span>
                        {saved !== 0 && (
                          <div
                            className={`font-mono text-[10px] ${
                              saved > 0 ? "text-[#2DD4BF]" : "text-[#E5A93C]"
                            }`}
                          >
                            {saved > 0 ? `−₹${saved} saved` : `+₹${Math.abs(saved)}`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ledger Reconciliation Footnote */}
              <div className="ticket-perforation" />
              <div className="px-6 py-4 bg-[var(--atlas-surface-elevated)] flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] text-[var(--atlas-text-secondary)]">
                  NET VARIANCE VS. FARE SHIELD ESTIMATES:
                </span>
                <span
                  className={`font-mono text-[13px] font-semibold ${
                    varianceInr <= 0 ? "text-[#2DD4BF]" : "text-[#E5A93C]"
                  }`}
                >
                  {varianceInr <= 0
                    ? `₹${Math.abs(varianceInr)} UNDER ESTIMATED PAR (${activeEntries.length} VOUCHERS)`
                    : `₹${varianceInr} ABOVE ESTIMATED PAR (${activeEntries.length} VOUCHERS)`}
                </span>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
