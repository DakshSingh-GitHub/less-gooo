"use client";

import React, { useState } from "react";
import { EditorialReveal } from "./EditorialVisuals";

type DriftScenarioKey = "nominal" | "chai-linger" | "bazaar-diversion";
type PassMode = "plus" | "free";

interface TimelineStop {
  id: string;
  order: string;
  place: string;
  sector: string;
  anchorType: "flexible" | "fixed";
  plannedTime: string;
  plannedDuration: string;
  recalibratedTime: string;
  recalibratedDuration: string;
  statusLabel: string;
  note: string;
  deltaMinutes: number;
}

const SCENARIO_META: Record<
  DriftScenarioKey,
  {
    label: string;
    triggerBadge: string;
    driftMinutes: number;
    headline: string;
    summary: string;
    activeStage: number;
    stops: TimelineStop[];
  }
> = {
  nominal: {
    label: "01 · Planned Morning",
    triggerBadge: "0 MIN DRIFT",
    driftMinutes: 0,
    headline: "Your baseline Kashi river-to-sanctuary rhythm.",
    summary:
      "Every journey begins with a breathing schedule: unhurried dawn ragas at Assi, mid-morning silk lanes, afternoon stillness at Sarnath, and a locked 18:30 boat berth for the Sandhya Ganga Aarti.",
    activeStage: 1,
    stops: [
      {
        id: "s1",
        order: "STOP 01",
        place: "Assi Ghat Dawn Raga & Kulhad Chai",
        sector: "25.2894° N · Southern Confluence",
        anchorType: "flexible",
        plannedTime: "05:45 – 07:00",
        plannedDuration: "75 min",
        recalibratedTime: "05:45 – 07:00",
        recalibratedDuration: "75 min",
        statusLabel: "On Cadence",
        note: "Classical morning vocal recital beside the Assi steps.",
        deltaMinutes: 0,
      },
      {
        id: "s2",
        order: "STOP 02",
        place: "Godowlia Silk Weaver & Kachori Lane",
        sector: "25.3095° N · Old City Chowk",
        anchorType: "flexible",
        plannedTime: "08:00 – 09:45",
        plannedDuration: "105 min",
        recalibratedTime: "08:00 – 09:45",
        recalibratedDuration: "105 min",
        statusLabel: "Flexible Window",
        note: "Breakfast at Ram Bhandar followed by handloom zari workshop visit.",
        deltaMinutes: 0,
      },
      {
        id: "s3",
        order: "STOP 03",
        place: "Kashi Vishwanath Dham Corridor",
        sector: "25.3109° N · Lalita Ghat Gate",
        anchorType: "flexible",
        plannedTime: "10:15 – 12:00",
        plannedDuration: "105 min",
        recalibratedTime: "10:15 – 12:00",
        recalibratedDuration: "105 min",
        statusLabel: "Buffer Ready",
        note: "Locker deposit and sanctum darshan via riverside escalator.",
        deltaMinutes: 0,
      },
      {
        id: "s4",
        order: "STOP 04",
        place: "Sarnath Dhamek Stupa & Deer Park",
        sector: "25.3762° N · 10.4 km NE",
        anchorType: "flexible",
        plannedTime: "14:15 – 16:45",
        plannedDuration: "150 min",
        recalibratedTime: "14:15 – 16:45",
        recalibratedDuration: "150 min",
        statusLabel: "Afternoon Arc",
        note: "Quiet garden walk and Ashokan Lion Capital gallery.",
        deltaMinutes: 0,
      },
      {
        id: "s5",
        order: "STOP 05",
        place: "Dashashwamedh Sandhya Ganga Aarti Berth",
        sector: "25.3076° N · Pre-Booked Rowboat",
        anchorType: "fixed",
        plannedTime: "18:15 – 19:30",
        plannedDuration: "75 min",
        recalibratedTime: "18:15 – 19:30",
        recalibratedDuration: "75 min",
        statusLabel: "FIXED ANCHOR LOCKED",
        note: "Ceremonial brass lamps begin strictly at 18:30 IST—non-negotiable.",
        deltaMinutes: 0,
      },
    ],
  },
  "chai-linger": {
    label: "02 · +40m Linger at Assi Ghat",
    triggerBadge: "+40 MIN EXTENDED STAY",
    driftMinutes: 40,
    headline: "You stayed for a second raga and river mist. Nothing downstream broke.",
    summary:
      "An unscripted 40-minute linger at Assi Ghat shifts morning arrival into Godowlia. LessGooo trims 25 minutes from the flexible silk-bazaar browse and 15 minutes from midday rest—leaving Vishwanath Darshan calm and your 18:30 Aarti boat completely untouched.",
    activeStage: 5,
    stops: [
      {
        id: "s1",
        order: "STOP 01",
        place: "Assi Ghat Dawn Raga & Kulhad Chai",
        sector: "25.2894° N · Southern Confluence",
        anchorType: "flexible",
        plannedTime: "05:45 – 07:00",
        plannedDuration: "75 min",
        recalibratedTime: "05:45 – 07:40",
        recalibratedDuration: "115 min (+40m)",
        statusLabel: "Extended Stay",
        note: "Traveller lingered on wooden boat watching morning mist clear.",
        deltaMinutes: 40,
      },
      {
        id: "s2",
        order: "STOP 02",
        place: "Godowlia Silk Weaver & Kachori Lane",
        sector: "25.3095° N · Old City Chowk",
        anchorType: "flexible",
        plannedTime: "08:00 – 09:45",
        plannedDuration: "105 min",
        recalibratedTime: "08:35 – 09:55",
        recalibratedDuration: "80 min (-25m)",
        statusLabel: "Compressed Gently",
        note: "Focused on master weaver studio; skipped secondary market detour.",
        deltaMinutes: 10,
      },
      {
        id: "s3",
        order: "STOP 03",
        place: "Kashi Vishwanath Dham Corridor",
        sector: "25.3109° N · Lalita Ghat Gate",
        anchorType: "flexible",
        plannedTime: "10:15 – 12:00",
        plannedDuration: "105 min",
        recalibratedTime: "10:25 – 12:10",
        recalibratedDuration: "105 min",
        statusLabel: "Shifted +10m",
        note: "Full sanctum duration preserved; midday rest absorbs final 10m.",
        deltaMinutes: 10,
      },
      {
        id: "s4",
        order: "STOP 04",
        place: "Sarnath Dhamek Stupa & Deer Park",
        sector: "25.3762° N · 10.4 km NE",
        anchorType: "flexible",
        plannedTime: "14:15 – 16:45",
        plannedDuration: "150 min",
        recalibratedTime: "14:15 – 16:45",
        recalibratedDuration: "150 min",
        statusLabel: "Restored to Nominal",
        note: "Afternoon schedule fully recovered before northeast cab departure.",
        deltaMinutes: 0,
      },
      {
        id: "s5",
        order: "STOP 05",
        place: "Dashashwamedh Sandhya Ganga Aarti Berth",
        sector: "25.3076° N · Pre-Booked Rowboat",
        anchorType: "fixed",
        plannedTime: "18:15 – 19:30",
        plannedDuration: "75 min",
        recalibratedTime: "18:15 – 19:30",
        recalibratedDuration: "75 min",
        statusLabel: "PROTECTED · ZERO SLIP",
        note: "Boatman Rameshwar meets you at Rajendra Prasad steps on the dot.",
        deltaMinutes: 0,
      },
    ],
  },
  "bazaar-diversion": {
    label: "03 · +65m Temple Queue & Rickshaw Cutoff",
    triggerBadge: "+65 MIN CORRIDOR DRIFT",
    driftMinutes: 65,
    headline: "Midday festival barricades closed Godowlia. The afternoon pivots cleanly.",
    summary:
      "When police barricades halt e-rickshaws outside Maidagin and sanctum queues run 65 minutes long, a static PDF collapses. LessGooo reroutes your Sarnath departure via Rajghat bridge, swaps museum order, and still delivers you to Dashashwamedh 18 minutes before the first conch blows.",
    activeStage: 5,
    stops: [
      {
        id: "s1",
        order: "STOP 01",
        place: "Assi Ghat Dawn Raga & Kulhad Chai",
        sector: "25.2894° N · Southern Confluence",
        anchorType: "flexible",
        plannedTime: "05:45 – 07:00",
        plannedDuration: "75 min",
        recalibratedTime: "05:45 – 07:00",
        recalibratedDuration: "75 min",
        statusLabel: "Completed",
        note: "Completed on baseline morning schedule.",
        deltaMinutes: 0,
      },
      {
        id: "s2",
        order: "STOP 02",
        place: "Godowlia Silk Weaver & Kachori Lane",
        sector: "25.3095° N · Old City Chowk",
        anchorType: "flexible",
        plannedTime: "08:00 – 09:45",
        plannedDuration: "105 min",
        recalibratedTime: "08:00 – 09:45",
        recalibratedDuration: "105 min",
        statusLabel: "Completed",
        note: "Completed prior to midday crowd surge.",
        deltaMinutes: 0,
      },
      {
        id: "s3",
        order: "STOP 03",
        place: "Kashi Vishwanath Dham Corridor",
        sector: "25.3109° N · Lalita Ghat Gate",
        anchorType: "flexible",
        plannedTime: "10:15 – 12:00",
        plannedDuration: "105 min",
        recalibratedTime: "10:15 – 13:20",
        recalibratedDuration: "185 min (+65m)",
        statusLabel: "Queue Drift Detected",
        note: "Auspicious Monday crowd extended Gate 4 security & sanctum queue.",
        deltaMinutes: 65,
      },
      {
        id: "s4",
        order: "STOP 04",
        place: "Sarnath Dhamek Stupa (Focused Garden Loop)",
        sector: "25.3762° N · Express Cab Vector",
        anchorType: "flexible",
        plannedTime: "14:15 – 16:45",
        plannedDuration: "150 min",
        recalibratedTime: "15:00 – 16:55",
        recalibratedDuration: "115 min (-35m)",
        statusLabel: "Re-sequenced",
        note: "Prioritized Dhamek Stupa & Bodhi tree; deferred indoor gallery to Day 2.",
        deltaMinutes: 45,
      },
      {
        id: "s5",
        order: "STOP 05",
        place: "Dashashwamedh Sandhya Ganga Aarti Berth",
        sector: "25.3076° N · River Boat Transfer",
        anchorType: "fixed",
        plannedTime: "18:15 – 19:30",
        plannedDuration: "75 min",
        recalibratedTime: "18:12 – 19:30",
        recalibratedDuration: "78 min",
        statusLabel: "PROTECTED · BOAT BYPASS",
        note: "Bypassed jammed Godowlia road via Namo Ghat water transfer.",
        deltaMinutes: 0,
      },
    ],
  },
};

const FIVE_STAGES = [
  { step: "01", title: "Extended Stay", detail: "Unscripted linger or queue delay" },
  { step: "02", title: "Drift Detected", detail: "Spatial clock measures downstream overlap" },
  { step: "03", title: "Flexible Rebalance", detail: "Compressible stops absorb the variance" },
  { step: "04", title: "Fixed Ritual Locked", detail: "18:30 Aarti & booked tickets stay untouched" },
  { step: "05", title: "Schedule Settled", detail: "Calm updated dispatch without panic" },
];

export default function AdaptiveTimelineSection() {
  const [scenario, setScenario] = useState<DriftScenarioKey>("chai-linger");
  const [passMode, setPassMode] = useState<PassMode>("plus");

  const active = SCENARIO_META[scenario];

  return (
    <section
      id="adaptive-replanning"
      aria-labelledby="adaptive-heading"
      className="relative py-24 lg:py-32 bg-[var(--atlas-bg-deep)] border-b border-[var(--atlas-border)] atlas-graticule"
    >
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Asymmetric Introduction */}
        <EditorialReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--atlas-ember)]">
                <span>Chapter 02</span>
                <span className="text-[var(--atlas-border-brass)]">/</span>
                <span className="text-[var(--atlas-brass)]">
                  Adaptive Journey Chronometer
                </span>
              </div>
              <h2
                id="adaptive-heading"
                className="mt-3 font-display text-[34px] sm:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.02em] text-[var(--atlas-text)]"
              >
                When a morning lingers, your evening sanctuary never slips.
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="text-[15.5px] leading-[1.7] text-[var(--atlas-text-secondary)]">
                Rigid travel spreadsheets shatter the moment a temple queue
                doubles or a conversation over kulhad chai runs forty minutes
                long. Test how the journey chronometer absorbs real street
                variance below.
              </p>
              <div className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--atlas-brass)]">
                ● Interactive Field Simulation · Grounded in Varanasi Transit Cadence
              </div>
            </div>
          </div>
        </EditorialReveal>

        {/* Interactive Disruption Trigger Bar */}
        <EditorialReveal delayMs={90}>
          <div className="mt-10 bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] p-4 sm:p-6 shadow-[var(--atlas-shadow)]">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-[var(--atlas-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--atlas-text-muted)] mr-2">
                  Inject Field Event:
                </span>
                {(
                  Object.keys(SCENARIO_META) as Array<DriftScenarioKey>
                ).map((key) => {
                  const isSelected = scenario === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setScenario(key)}
                      aria-pressed={isSelected}
                      className={`px-3.5 py-2 text-[13px] font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#FF5A26] text-[#F3EEE5] border-[#FF5A26]"
                          : "bg-[var(--atlas-surface-elevated)] text-[var(--atlas-text-secondary)] border-[var(--atlas-border)] hover:border-[var(--atlas-border-brass)] hover:text-[var(--atlas-text)]"
                      }`}
                    >
                      {SCENARIO_META[key].label}
                    </button>
                  );
                })}
              </div>

              {/* Truthful Tier Mode Comparison */}
              <div className="flex items-center gap-2 self-start xl:self-auto">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--atlas-text-muted)]">
                  Engine Mode:
                </span>
                <div className="inline-flex border border-[var(--atlas-border-brass)] p-0.5 bg-[var(--atlas-bg)]">
                  <button
                    type="button"
                    onClick={() => setPassMode("plus")}
                    className={`px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] cursor-pointer transition-colors ${
                      passMode === "plus"
                        ? "bg-[#E5A93C] text-[#0A0D14] font-semibold"
                        : "text-[var(--atlas-text-muted)] hover:text-[var(--atlas-text)]"
                    }`}
                  >
                    LessGooo+ Auto-Rebalance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassMode("free")}
                    className={`px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] cursor-pointer transition-colors ${
                      passMode === "free"
                        ? "bg-[var(--atlas-surface-elevated)] text-[var(--atlas-text)] font-semibold"
                        : "text-[var(--atlas-text-muted)] hover:text-[var(--atlas-text)]"
                    }`}
                  >
                    Free Explorer Alert
                  </button>
                </div>
              </div>
            </div>

            {/* 5-Stage Sequence Ribbon */}
            <div className="py-5 border-b border-[var(--atlas-border)] grid grid-cols-2 sm:grid-cols-5 gap-3">
              {FIVE_STAGES.map((item, idx) => {
                const stageActive =
                  scenario === "nominal"
                    ? idx === 0
                    : passMode === "free"
                    ? idx <= 1
                    : idx < active.activeStage;
                return (
                  <div
                    key={item.step}
                    className={`p-3 border transition-colors ${
                      stageActive
                        ? "border-[#E5A93C]/50 bg-[var(--atlas-surface-elevated)]"
                        : "border-[var(--atlas-border)] opacity-55"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[var(--atlas-ember)]">STAGE {item.step}</span>
                      <span
                        className={
                          stageActive ? "text-[#2DD4BF]" : "text-[var(--atlas-text-muted)]"
                        }
                      >
                        {stageActive ? "● ACTIVE" : "○ STANDBY"}
                      </span>
                    </div>
                    <div className="text-[13px] font-semibold text-[var(--atlas-text)] mt-1">
                      {item.title}
                    </div>
                    <div className="text-[11.5px] text-[var(--atlas-text-muted)] leading-snug mt-0.5">
                      {item.detail}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scenario Narrative Status Banner */}
            <div className="pt-5 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF5A26]">
                  <span>{active.triggerBadge}</span>
                  <span>·</span>
                  <span className="text-[#2DD4BF]">
                    {passMode === "plus"
                      ? "FIXED ANCHORS PROTECTED"
                      : scenario === "nominal"
                      ? "NOMINAL TIMELINE"
                      : "DRIFT WARNING ISSUED — MANUAL ADJUSTMENT REQUIRED"}
                  </span>
                </div>
                <h3 className="font-editorial text-[24px] sm:text-[27px] text-[var(--atlas-text)] mt-1">
                  {active.headline}
                </h3>
                <p className="text-[14px] text-[var(--atlas-text-secondary)] max-w-3xl mt-1 leading-relaxed">
                  {passMode === "plus" || scenario === "nominal"
                    ? active.summary
                    : `Free Explorer detects your +${active.driftMinutes}m schedule drift immediately and highlights the overlap risk with your 18:30 Dashashwamedh Aarti berth so you can manually edit stops—or unlock automatic multi-stop recalibration with LessGooo+.`}
                </p>
              </div>
            </div>

            {/* Chronometer Dispatch Rows */}
            <div className="mt-6 space-y-2.5">
              {active.stops.map((stop) => {
                const isFixed = stop.anchorType === "fixed";
                const hasChanged =
                  scenario !== "nominal" &&
                  stop.plannedTime !== stop.recalibratedTime;

                return (
                  <div
                    key={stop.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border transition-all ${
                      isFixed
                        ? "border-[#E5A93C] bg-[#E5A93C]/[0.06]"
                        : hasChanged && passMode === "plus"
                        ? "border-[#FF5A26]/45 bg-[var(--atlas-surface-elevated)]"
                        : "border-[var(--atlas-border)] bg-[var(--atlas-bg)]/55"
                    }`}
                  >
                    {/* Stop Order & Lock Type */}
                    <div className="lg:col-span-2 flex lg:flex-col justify-between lg:justify-center gap-1">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--atlas-text-muted)]">
                        {stop.order}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                          isFixed
                            ? "text-[var(--atlas-brass)] font-semibold"
                            : "text-[#2DD4BF]"
                        }`}
                      >
                        {isFixed ? "🔒 FIXED RITUAL" : "⇄ FLEXIBLE"}
                      </span>
                    </div>

                    {/* Stop Name & Field Context */}
                    <div className="lg:col-span-5">
                      <div className="text-[15.5px] font-semibold text-[var(--atlas-text)]">
                        {stop.place}
                      </div>
                      <div className="font-mono text-[11px] text-[var(--atlas-text-muted)] mt-0.5">
                        {stop.sector}
                      </div>
                      <p className="text-[13px] text-[var(--atlas-text-secondary)] mt-1.5">
                        {stop.note}
                      </p>
                    </div>

                    {/* Time Comparison */}
                    <div className="lg:col-span-3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[var(--atlas-border)] pt-3 lg:pt-0 lg:pl-4">
                      {hasChanged && passMode === "plus" ? (
                        <>
                          <span className="font-mono text-[11px] line-through text-[var(--atlas-text-muted)]">
                            Planned: {stop.plannedTime}
                          </span>
                          <span className="font-mono text-[13.5px] font-semibold text-[#FF5A26] mt-0.5">
                            Settled: {stop.recalibratedTime}
                          </span>
                          <span className="font-mono text-[10.5px] text-[var(--atlas-text-secondary)] mt-0.5">
                            {stop.recalibratedDuration}
                          </span>
                        </>
                      ) : hasChanged && passMode === "free" ? (
                        <>
                          <span className="font-mono text-[12px] text-[var(--atlas-text)]">
                            Planned: {stop.plannedTime}
                          </span>
                          <span className="font-mono text-[11px] text-[#FF5A26] mt-0.5">
                            ⚠ +{active.driftMinutes}m unadjusted drift
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-[13px] font-medium text-[var(--atlas-text)]">
                            {stop.plannedTime}
                          </span>
                          <span className="font-mono text-[11px] text-[var(--atlas-text-muted)] mt-0.5">
                            Window: {stop.plannedDuration}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Status Stamp */}
                    <div className="lg:col-span-2 flex items-center lg:justify-end">
                      <span
                        className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] border ${
                          isFixed
                            ? "border-[#E5A93C] text-[var(--atlas-brass)] bg-[#E5A93C]/10"
                            : hasChanged
                            ? "border-[#FF5A26]/50 text-[#FF5A26]"
                            : "border-[var(--atlas-border)] text-[var(--atlas-text-muted)]"
                        }`}
                      >
                        {passMode === "free" && hasChanged && !isFixed
                          ? "Awaiting Edit"
                          : stop.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
}
