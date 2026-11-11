"use client";

import React, { useState } from "react";
import {
  BrassCompassRose,
  EditorialReveal,
  LandmarkVignettePlate,
  type LandmarkVisualId,
} from "./EditorialVisuals";

interface VaranasiLandmark {
  id: LandmarkVisualId;
  code: string;
  name: string;
  hindiName: string;
  coords: string;
  bestWindow: string;
  elevationOrBank: string;
  mapX: number;
  mapY: number;
  routeFromPrev: string;
  transitLeg: string;
  crowdCadence: string;
  accessibilityNote: string;
  editorialNote: string;
  sensoryDetail: string;
  arcFilter: "dawn" | "sacred";
}

const LANDMARKS: VaranasiLandmark[] = [
  {
    id: "assi",
    code: "WP-01",
    name: "Assi Ghat",
    hindiName: "अस्सी घाट",
    coords: "25.2894° N, 83.0064° E",
    bestWindow: "05:15 – 07:00 IST",
    elevationOrBank: "Southern Confluence · Broad Steps",
    mapX: 256,
    mapY: 446,
    routeFromPrev: "M 256 446 C 276 410, 294 368, 304 322",
    transitLeg: "18 min rowboat north along 42 ghats (₹100 shared / ₹450 private)",
    crowdCadence: "Serene dawn · Unhurried",
    accessibilityNote: "Vehicle drop right beside upper plaza; gentle paved upper terrace.",
    editorialNote:
      "Where the Assi stream meets the Ganga. Classical vocalists tune tanpuras before sunrise at Subah-e-Banaras while terracotta kulhads of cardamom tea steam along the steps.",
    sensoryDetail: "Morning raga · Woodsmoke · Wet Chunar sandstone",
    arcFilter: "dawn",
  },
  {
    id: "dashashwamedh",
    code: "WP-02",
    name: "Dashashwamedh Ghat",
    hindiName: "दशाश्वमेध घाट",
    coords: "25.3076° N, 83.0105° E",
    bestWindow: "17:45 – 19:30 IST",
    elevationOrBank: "Central Ceremonial Amphitheatre",
    mapX: 304,
    mapY: 322,
    routeFromPrev: "M 256 446 C 276 410, 294 368, 304 322",
    transitLeg: "6 min walk inland to Godowlia or 4 min corridor walk north",
    crowdCadence: "High evening convergence · Fixed 18:30 anchor",
    accessibilityNote: "Best viewed from pre-berthed wooden boat to avoid steep stair crush.",
    editorialNote:
      "The mythic heart of the riverfront. At dusk, synchronized priests raise heavy multi-tiered Kashi brass lamps as conch shells reverberate across the dark indigo water.",
    sensoryDetail: "Conch resonance · Camphor flame · Brass bells",
    arcFilter: "dawn",
  },
  {
    id: "godowlia",
    code: "WP-03",
    name: "Godowlia Market",
    hindiName: "गोदौलिया चौक",
    coords: "25.3095° N, 83.0062° E",
    bestWindow: "09:30 – 12:00 IST",
    elevationOrBank: "Old-City Inland Artery · No-Car Zone",
    mapX: 204,
    mapY: 288,
    routeFromPrev: "M 304 322 Q 252 314 204 288",
    transitLeg: "7 min pedestrian stroll east to Vishwanath Gate 4",
    crowdCadence: "Vibrant bazaar rhythm · Rickshaw cutoff gate",
    accessibilityNote: "Flat paved chowk; e-rickshaws halt at perimeter barricades during peak hours.",
    editorialNote:
      "A labyrinth of silk brocade looms, beaten copper vessels, betel-leaf ateliers, and winter malaiyyo foam whisked with saffron dew.",
    sensoryDetail: "Zari looms · Roasted cumin · Brass hammer-tap",
    arcFilter: "dawn",
  },
  {
    id: "vishwanath",
    code: "WP-04",
    name: "Kashi Vishwanath",
    hindiName: "काशी विश्वनाथ धाम",
    coords: "25.3109° N, 83.0107° E",
    bestWindow: "07:30 – 09:30 IST",
    elevationOrBank: "Golden Spire Sanctum · Lalita Ghat Link",
    mapX: 312,
    mapY: 248,
    routeFromPrev: "M 204 288 Q 258 262 312 248",
    transitLeg: "5 min riverside corridor walk to Manikarnika terrace",
    crowdCadence: "Timed darshan queues · Locker deposit required",
    accessibilityNote: "Escalators, ramps & golf-cart assistance available via Riverfront Gate.",
    editorialNote:
      "Crowned in 800 kilograms of gilded copper, the Jyotirlinga sanctum now opens directly onto the river through a sweeping carved red-sandstone monumental courtyard.",
    sensoryDetail: "Bilva leaves · Sandalwood paste · Temple drums",
    arcFilter: "sacred",
  },
  {
    id: "manikarnika",
    code: "WP-05",
    name: "Manikarnika Ghat",
    hindiName: "मणिकर्णिका घाट",
    coords: "25.3108° N, 83.0141° E",
    bestWindow: "08:30 – 10:30 IST",
    elevationOrBank: "Eastern Bend · Sacred Kund",
    mapX: 344,
    mapY: 196,
    routeFromPrev: "M 312 248 Q 332 224 344 196",
    transitLeg: "32 min auto/cab northeast from Maidagin exit to Sarnath (10.4 km)",
    crowdCadence: "Solemn · Photography respectfully prohibited",
    accessibilityNote: "Observe respectfully from upper colonnade or passing river boat.",
    editorialNote:
      "Varanasi without illusion: an ancient stepped sanctuary where life and liberation coexist openly beside the Vishnu Charan Paduka marble slab.",
    sensoryDetail: "Sacred stillness · Marigold garlands · River current",
    arcFilter: "sacred",
  },
  {
    id: "sarnath",
    code: "WP-06",
    name: "Sarnath",
    hindiName: "सारनाथ स्तूप क्षेत्र",
    coords: "25.3762° N, 83.0227° E",
    bestWindow: "14:30 – 17:00 IST",
    elevationOrBank: "Northeast Sanctuary · 10.4 km Inland",
    mapX: 468,
    mapY: 88,
    routeFromPrev: "M 344 196 C 378 152, 422 118, 468 88",
    transitLeg: "35 min return cab to Dashashwamedh perimeter before dusk Aarti",
    crowdCadence: "Spacious lawns · Quiet contemplative pace",
    accessibilityNote: "Level garden pathways, shaded benches & wheelchair-friendly museum galleries.",
    editorialNote:
      "Ten kilometres northeast of the dense river lanes, the 43-metre Mauryan brick Dhamek Stupa rises from quiet deer-park lawns where the Dharma wheel was first set in motion.",
    sensoryDetail: "Bodhi leaves · Carved stone · Quiet wind",
    arcFilter: "sacred",
  },
];

export default function VaranasiAtlasSection() {
  const [selectedId, setSelectedId] = useState<LandmarkVisualId>("dashashwamedh");
  const [corridorFilter, setCorridorFilter] = useState<"all" | "dawn" | "sacred">("all");

  const activeLandmark =
    LANDMARKS.find((item) => item.id === selectedId) ?? LANDMARKS[1];

  const visibleLandmarks =
    corridorFilter === "all"
      ? LANDMARKS
      : LANDMARKS.filter((l) => l.arcFilter === corridorFilter);

  return (
    <section
      id="destination-atlas"
      aria-labelledby="atlas-heading"
      className="relative py-24 lg:py-32 bg-[var(--atlas-bg)] border-b border-[var(--atlas-border)] overflow-hidden"
    >
      {/* Anchor target for First-Time Travellers menu item */}
      <div id="travelers-first-time" className="absolute -top-20" aria-hidden="true" />

      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Chapter Folio Header */}
        <EditorialReveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-[var(--atlas-border)]">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--atlas-ember)]">
                <span>Chapter 01</span>
                <span className="text-[var(--atlas-border-brass)]">/</span>
                <span className="text-[var(--atlas-brass)]">
                  Spatial Cartography · Varanasi Sector
                </span>
              </div>
              <h2
                id="atlas-heading"
                className="mt-3 font-display text-[34px] sm:text-[46px] lg:text-[52px] leading-[1.08] tracking-[-0.02em] text-[var(--atlas-text)]"
              >
                Read the crescent of the Ganga before you walk its lanes.
              </h2>
            </div>

            <div className="max-w-md">
              <p className="font-editorial text-[20px] sm:text-[21px] leading-[1.5] text-[var(--atlas-text-secondary)]">
                Varanasi unfolds along a seven-kilometre western riverbank arc,
                anchored inland by silk bazaars and Sarnath&apos;s quiet monastic
                lawns. Select any waypoint to inspect its real transit geometry.
              </p>

              {/* Corridor Lens Filter */}
              <div
                role="tablist"
                aria-label="Filter Varanasi route arc"
                className="mt-5 inline-flex flex-wrap border border-[var(--atlas-border-brass)] bg-[var(--atlas-surface)] p-1 gap-1"
              >
                {[
                  { key: "all", label: "Full 6-Stop Arc" },
                  { key: "dawn", label: "Dawn Ghat & Bazaar" },
                  { key: "sacred", label: "Sanctum & Sarnath" },
                ].map((tab) => {
                  const active = corridorFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => {
                        const nextFilter = tab.key as "all" | "dawn" | "sacred";
                        setCorridorFilter(nextFilter);
                        if (
                          nextFilter !== "all" &&
                          activeLandmark.arcFilter !== nextFilter
                        ) {
                          const firstMatch = LANDMARKS.find(
                            (l) => l.arcFilter === nextFilter
                          );
                          if (firstMatch) setSelectedId(firstMatch.id);
                        }
                      }}
                      className={`px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                        active
                          ? "bg-[#FF5A26] text-[#F3EEE5]"
                          : "text-[var(--atlas-text-secondary)] hover:text-[var(--atlas-text)]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </EditorialReveal>

        {/* Interactive Cartographic Spread */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT / CENTER: Interactive Hydrographic & Street Atlas Canvas */}
          <EditorialReveal className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 bg-[#0D121D] border border-[#E5A93C]/30 shadow-[var(--atlas-shadow)] overflow-hidden min-h-[470px] sm:min-h-[540px] flex flex-col justify-between">
              {/* Top Survey Legend Bar */}
              <div className="relative z-10 px-5 py-3.5 border-b border-white/10 bg-[#0A0D14]/75 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.16em] text-[#E5A93C]">
                  <span className="w-2 h-2 rounded-full bg-[#4E7BFF]" />
                  <span>SURVEY PLATE VNS-04 · RIVER GANGA WEST BANK</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10px] text-[#9E978B]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-[#FF5A26] inline-block" /> Active Leg
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-[#4E7BFF] inline-block" /> River Channel
                  </span>
                </div>
              </div>

              {/* Interactive SVG Cartography */}
              <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4">
                <svg
                  viewBox="0 0 600 500"
                  className="w-full h-auto max-h-[480px] select-none"
                  role="group"
                  aria-label="Interactive geographical map of Varanasi landmarks"
                >
                  <defs>
                    <linearGradient id="ganga-water" x1="0" y1="1" x2="0.4" y2="0">
                      <stop offset="0%" stopColor="#162955" />
                      <stop offset="50%" stopColor="#24458A" />
                      <stop offset="100%" stopColor="#193166" />
                    </linearGradient>
                    <radialGradient id="active-pin-halo" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF5A26" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FF5A26" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Cartographic Graticule */}
                  {[80, 160, 240, 320, 400, 480, 560].map((x) => (
                    <line
                      key={`vx-${x}`}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="500"
                      stroke="#F3EEE5"
                      strokeOpacity="0.045"
                      strokeWidth="1"
                    />
                  ))}
                  {[70, 140, 210, 280, 350, 420].map((y) => (
                    <line
                      key={`hy-${y}`}
                      x1="0"
                      y1={y}
                      x2="600"
                      y2={y}
                      stroke="#F3EEE5"
                      strokeOpacity="0.045"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Old City Topographical Contour Lines (West Bank) */}
                  <path
                    d="M 40 480 C 95 405, 130 330, 145 245 C 160 165, 200 105, 265 40"
                    stroke="#E5A93C"
                    strokeOpacity="0.1"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M 85 485 C 145 415, 185 340, 205 260 C 225 180, 260 120, 325 55"
                    stroke="#E5A93C"
                    strokeOpacity="0.14"
                    strokeWidth="1"
                    fill="none"
                  />

                  {/* Old City Urban Fabric Polygon */}
                  <path
                    d="M 110 460 C 175 420, 225 350, 245 268 C 260 205, 295 168, 340 145 L 220 115 L 115 240 Z"
                    fill="#151B28"
                    stroke="#E5A93C"
                    strokeOpacity="0.14"
                  />

                  {/* Authentic Crescent Bend of River Ganga (flowing South -> North) */}
                  <path
                    d="M 248 500 C 288 430, 322 355, 338 272 C 352 198, 392 148, 468 118 L 545 152 C 462 182, 424 228, 408 298 C 392 374, 356 442, 318 500 Z"
                    fill="url(#ganga-water)"
                    stroke="#4E7BFF"
                    strokeOpacity="0.55"
                    strokeWidth="1.4"
                  />
                  {/* Bathymetric river flow lines */}
                  <path
                    d="M 278 492 C 312 426, 345 352, 362 276 C 378 206, 415 162, 488 134"
                    stroke="#4E7BFF"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                  />
                  {/* Flow Direction Label */}
                  <text
                    x="398"
                    y="355"
                    fill="#4E7BFF"
                    fillOpacity="0.82"
                    fontSize="9.5"
                    fontFamily="var(--font-plex-mono), monospace"
                    letterSpacing="2"
                    transform="rotate(-72 398 355)"
                  >
                    RIVER GANGA · NORTHWARD FLOW →
                  </text>

                  {/* Eastern Sandbank (Kashi Reti) */}
                  <path
                    d="M 432 292 C 452 242, 488 210, 548 196 L 568 345 C 510 360, 462 342, 432 292 Z"
                    fill="#161C27"
                    stroke="#E5A93C"
                    strokeOpacity="0.16"
                    strokeDasharray="3 3"
                  />
                  <text
                    x="466"
                    y="286"
                    fill="#8C867A"
                    fontSize="8.5"
                    fontFamily="var(--font-plex-mono), monospace"
                    letterSpacing="1.4"
                  >
                    EASTERN RETI
                  </text>
                  <text
                    x="466"
                    y="298"
                    fill="#8C867A"
                    fontSize="8"
                    fontFamily="var(--font-plex-mono), monospace"
                  >
                    SANDBANK
                  </text>

                  {/* Sarnath Northeast Survey Inset Frame */}
                  <rect
                    x="390"
                    y="24"
                    width="186"
                    height="108"
                    fill="#101724"
                    fillOpacity="0.92"
                    stroke="#2DD4BF"
                    strokeOpacity="0.4"
                    strokeDasharray="4 3"
                  />
                  <text
                    x="402"
                    y="41"
                    fill="#2DD4BF"
                    fontSize="8.5"
                    fontFamily="var(--font-plex-mono), monospace"
                    letterSpacing="1.4"
                  >
                    NE INSET · 10.4 KM INLAND
                  </text>

                  {/* Base Waypoint Network Connectors */}
                  <path
                    d="M 256 446 C 276 410, 294 368, 304 322 Q 252 314 204 288 Q 258 262 312 248 Q 332 224 344 196 C 378 152, 422 118, 468 88"
                    stroke="#E5A93C"
                    strokeOpacity="0.3"
                    strokeWidth="1.3"
                    strokeDasharray="3 4"
                    fill="none"
                  />

                  {/* Highlighted Active Transit Arc */}
                  <path
                    d={activeLandmark.routeFromPrev}
                    stroke="#FF5A26"
                    strokeWidth="2.4"
                    fill="none"
                    className="animate-route-flow"
                  />

                  {/* Compass Rose in NW Corner */}
                  <g transform="translate(26, 24)" className="text-[#E5A93C]">
                    <circle cx="34" cy="34" r="28" stroke="#E5A93C" strokeOpacity="0.25" />
                    <polygon points="34,10 38,32 34,28 30,32" fill="#FF5A26" />
                    <polygon points="34,58 37,36 34,40 31,36" fill="#E5A93C" fillOpacity="0.45" />
                    <text
                      x="34"
                      y="7"
                      textAnchor="middle"
                      fill="#FF5A26"
                      fontSize="8"
                      fontFamily="var(--font-plex-mono), monospace"
                    >
                      N
                    </text>
                  </g>

                  {/* Interactive Waypoint Nodes */}
                  {LANDMARKS.map((landmark) => {
                    const isSelected = landmark.id === selectedId;
                    const isDimmed =
                      corridorFilter !== "all" &&
                      landmark.arcFilter !== corridorFilter;
                    const labelLeft =
                      landmark.id === "godowlia" || landmark.id === "assi";

                    return (
                      <g
                        key={landmark.id}
                        transform={`translate(${landmark.mapX}, ${landmark.mapY})`}
                        onClick={() => setSelectedId(landmark.id)}
                        onMouseEnter={() => setSelectedId(landmark.id)}
                        onFocus={() => setSelectedId(landmark.id)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        aria-label={`${landmark.name} — ${landmark.coords}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(landmark.id);
                          }
                        }}
                        className={`cursor-pointer focus:outline-none transition-opacity duration-300 ${
                          isDimmed ? "opacity-35" : "opacity-100"
                        }`}
                      >
                        {isSelected && (
                          <>
                            <circle r="24" fill="url(#active-pin-halo)" />
                            <circle
                              r="14"
                              stroke="#FF5A26"
                              strokeWidth="1.2"
                              fill="none"
                              className="animate-beacon-ring"
                            />
                          </>
                        )}
                        <circle
                          r={isSelected ? "6.5" : "5"}
                          fill={
                            isSelected
                              ? "#FF5A26"
                              : landmark.id === "sarnath"
                              ? "#2DD4BF"
                              : "#E5A93C"
                          }
                          stroke="#0A0D14"
                          strokeWidth="1.6"
                        />

                        {/* Pin Callout Tag */}
                        <g
                          transform={
                            labelLeft ? "translate(-142, -14)" : "translate(13, -14)"
                          }
                        >
                          <rect
                            width="130"
                            height="28"
                            fill={isSelected ? "#1B2130" : "#0A0D14"}
                            fillOpacity={isSelected ? "0.96" : "0.8"}
                            stroke={isSelected ? "#FF5A26" : "#E5A93C"}
                            strokeOpacity={isSelected ? "0.9" : "0.35"}
                            strokeWidth={isSelected ? "1.2" : "0.8"}
                          />
                          <text
                            x="8"
                            y="12"
                            fill="#F3EEE5"
                            fontSize="9.5"
                            fontWeight={isSelected ? "600" : "500"}
                            fontFamily="var(--font-dm-sans), sans-serif"
                          >
                            {landmark.name}
                          </text>
                          <text
                            x="8"
                            y="22.5"
                            fill={isSelected ? "#E5A93C" : "#9E978B"}
                            fontSize="7.8"
                            fontFamily="var(--font-plex-mono), monospace"
                          >
                            {landmark.code} · {landmark.bestWindow.split("–")[0].trim()}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Waypoint Strip & Scale Bar */}
              <div className="px-5 py-3.5 border-t border-white/10 bg-[#0A0D14]/85 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {visibleLandmarks.map((l) => {
                    const active = l.id === selectedId;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedId(l.id)}
                        className={`px-2.5 py-1 font-mono text-[10.5px] transition-colors cursor-pointer border ${
                          active
                            ? "border-[#FF5A26] bg-[#FF5A26]/20 text-[#F3EEE5]"
                            : "border-white/10 text-[#9E978B] hover:text-[#F3EEE5] hover:border-[#E5A93C]/40"
                        }`}
                      >
                        {l.code} {l.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>

                {/* Scale Bar */}
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#9E978B]">
                  <span>0</span>
                  <span className="w-14 h-1.5 border-x border-b border-[#E5A93C]/60 inline-block" />
                  <span>1.5 KM</span>
                </div>
              </div>
            </div>
          </EditorialReveal>

          {/* RIGHT: Selected Landmark Architectural Dossier & Field Notes */}
          <EditorialReveal delayMs={120} className="lg:col-span-5 flex flex-col">
            <article
              aria-live="polite"
              className="flex-1 bg-[var(--atlas-surface)] border border-[var(--atlas-border-brass)] p-6 sm:p-7 flex flex-col justify-between shadow-[var(--atlas-shadow)]"
            >
              <div>
                {/* Top Metadata Header */}
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--atlas-border)]">
                  <div>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--atlas-ember)]">
                      {`${activeLandmark.code} // FIELD DOSSIER`}
                    </span>
                    <div className="font-mono text-[11.5px] text-[var(--atlas-text-muted)] mt-0.5">
                      {activeLandmark.coords}
                    </div>
                  </div>
                  <BrassCompassRose className="w-11 h-11 text-[var(--atlas-brass)]" />
                </div>

                {/* Bespoke Architectural Vignette */}
                <div className="mt-5 border border-[var(--atlas-border)] overflow-hidden relative">
                  <LandmarkVignettePlate
                    id={activeLandmark.id}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#F3EEE5]/90 bg-[#0A0D14]/75 px-2.5 py-1 border border-white/10">
                    <span>{activeLandmark.hindiName}</span>
                    <span className="text-[#E5A93C]">{activeLandmark.bestWindow}</span>
                  </div>
                </div>

                {/* Landmark Title & Editorial Narrative */}
                <div className="mt-5">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--atlas-brass)]">
                    {activeLandmark.elevationOrBank}
                  </div>
                  <h3 className="font-display text-[28px] sm:text-[32px] leading-tight text-[var(--atlas-text)] mt-1">
                    {activeLandmark.name}
                  </h3>
                  <p className="mt-3 font-editorial text-[19.5px] leading-[1.55] text-[var(--atlas-text-secondary)]">
                    &ldquo;{activeLandmark.editorialNote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Practical Wayfinding Specifications */}
              <div className="mt-6 pt-5 border-t border-[var(--atlas-border)] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--atlas-surface-elevated)] border border-[var(--atlas-border)]">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--atlas-text-muted)]">
                      Sensory Signature
                    </div>
                    <div className="text-[12.5px] font-medium text-[var(--atlas-text)] mt-1">
                      {activeLandmark.sensoryDetail}
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--atlas-surface-elevated)] border border-[var(--atlas-border)]">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--atlas-text-muted)]">
                      Pacing & Cadence
                    </div>
                    <div className="text-[12.5px] font-medium text-[var(--atlas-text)] mt-1">
                      {activeLandmark.crowdCadence}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--atlas-surface-elevated)] border-l-2 border-[#4E7BFF]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4E7BFF]">
                    Onward Vector & Mobility Note
                  </div>
                  <p className="text-[13px] text-[var(--atlas-text)] mt-1">
                    {activeLandmark.transitLeg}
                  </p>
                  <p className="text-[12px] text-[var(--atlas-text-muted)] mt-1">
                    Access: {activeLandmark.accessibilityNote}
                  </p>
                </div>
              </div>
            </article>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
