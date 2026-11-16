"use client";

import Image from "next/image";
import { useState } from "react";

export default function CapabilitiesShowcase() {
  // Interactive state for Capability 1: Adaptive timeline before/after
  const [adaptiveView, setAdaptiveView] = useState<"standard" | "adapted">("adapted");
  
  // Interactive state for Capability 3: Transport fare modal mode
  const [selectedTransport, setSelectedTransport] = useState<"auto" | "cab" | "walk">("auto");

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-32">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
          Intelligent Core Capabilities
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
          How LessGooo transforms how you move through the world.
        </h2>
        <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
          Journeys on the ground are living, unpredictable experiences. Rather than locking you into rigid schedules, our engine recalculates, budgets, and supports every step.
        </p>
      </div>

      {/* CAPABILITY 1 & 2: ADAPTIVE ITINERARIES + TRAFFIC ANALYSIS */}
      <div id="adaptive-replanning" className="space-y-24">
        {/* Capability 1: Adaptive Itineraries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Interactive Storytelling */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] shadow-xl p-6 sm:p-8">
              {/* Interactive Mode Switcher */}
              <div className="flex items-center justify-between pb-6 border-b border-[#E7E3DC] dark:border-[#26272D]">
                <div>
                  <span className="text-xs font-mono uppercase text-[#C84B26] dark:text-[#E05A32] tracking-wider block">
                    Live Engine Simulation
                  </span>
                  <div className="text-sm font-serif text-[#18181B] dark:text-[#F4F1EA] font-medium">
                    {adaptiveView === "standard" ? "Rigid Paper Schedule (Fixed)" : "LessGooo Adaptive Flow (Active)"}
                  </div>
                </div>

                <div className="inline-flex p-1 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
                  <button
                    onClick={() => setAdaptiveView("standard")}
                    className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      adaptiveView === "standard"
                        ? "bg-[#18181B] text-white dark:bg-white dark:text-[#18181B] font-medium"
                        : "text-[#71717A] dark:text-[#A1A1AA]"
                    }`}
                  >
                    Static
                  </button>
                  <button
                    onClick={() => setAdaptiveView("adapted")}
                    className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                      adaptiveView === "adapted"
                        ? "bg-[#C84B26] text-white font-medium"
                        : "text-[#71717A] dark:text-[#A1A1AA]"
                    }`}
                  >
                    Adapted ✨
                  </button>
                </div>
              </div>

              {/* Timeline Display */}
              <div className="mt-6 space-y-4">
                {adaptiveView === "standard" ? (
                  <div className="space-y-3 opacity-90">
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-[#71717A]">09:00 AM – 10:30 AM</span>
                        <div className="text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">Old City Heritage Walk</div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Completed</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold">10:45 AM (Spent +75 mins linger)</span>
                        <span className="text-[11px] font-mono text-red-500 font-bold">Delay Detected</span>
                      </div>
                      <div className="text-sm font-medium text-[#18181B] dark:text-[#F4F1EA] mt-1">Artisan Silk Weaving Quarter</div>
                      <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                        ⚠️ Downstream museum reservation at 12:00 PM will be missed due to fixed timing!
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-red-500/5 border border-dashed border-red-400/40 opacity-70">
                      <span className="text-[11px] font-mono text-red-500 line-through">12:00 PM – 01:30 PM • Heritage Museum</span>
                      <div className="text-xs text-red-600 dark:text-red-400 mt-0.5">Missed due to rigid schedule constraints</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-[#71717A]">09:00 AM – 10:30 AM</span>
                        <div className="text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">Old City Heritage Walk</div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Completed</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#C84B26]/10 border border-[#C84B26]/30 animate-in fade-in slide-in-from-top-1 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">Extended Stay Welcomed (+75 mins)</span>
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#C84B26] text-white flex items-center gap-1 shadow-xs animate-pulse">
                          <span>✓</span> Auto-Rebalanced
                        </span>
                      </div>
                      <div className="text-sm font-medium text-[#18181B] dark:text-[#F4F1EA] mt-1">Artisan Silk Weaving Quarter</div>
                      <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] mt-1">
                        ✓ Schedule smoothly shifted downstream. Afternoon riverside lunch adjusted; sunset cruise preserved at optimal golden hour.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-[#C84B26] dark:text-[#E05A32]">04:45 PM – 06:15 PM (Recalculated)</span>
                        <div className="text-sm font-medium text-[#18181B] dark:text-[#F4F1EA]">Ghat Sunset Boat Cruise</div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] dark:bg-[#25272F] text-[#71717A] border border-[#E7E3DC] dark:border-[#26272D]">Synchronized</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              01 / Adaptive Itineraries
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
              Stay longer where you love. The schedule updates on its own.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              When travel feels truly extraordinary, you shouldn’t be checking a timer. If an impromptu conversation with a local craftsman or an extended morning by the river carries on for an extra hour, LessGooo’s dwell detection senses the elapsed time.
            </p>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              The engine automatically shifts downstream activities, recalculates realistic transit buffers, and preserves evening reservations so your day stays unhurried and intact.
            </p>
            <div className="pt-2">
              <a
                href="#trip-search-box"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#C84B26] dark:text-[#E05A32] hover:underline"
              >
                <span>Plan with adaptive flexibility</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Capability 2: Real-Time Traffic Analysis */}
        <div id="traffic-analysis" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              02 / Real-Time Traffic Analysis
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
              Beat local bottlenecks before they eat into your afternoon.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Historic quarters, narrow bazaar lanes, and pilgrimage roads frequently experience spontaneous processions, temple crowd surges, and sudden bottlenecks that standard mapping engines miss.
            </p>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              LessGooo evaluates local congestion dynamics to reorder stops intelligently—suggesting pedestrian walkways when traffic locks up or scheduling vehicle transfers for quieter windows.
            </p>
            <ul className="space-y-2.5 text-xs text-[#52525B] dark:text-[#A1A1AA] pt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84B26]" />
                <span>Micro-routing tailored for historic narrow lanes</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84B26]" />
                <span>Automatic downstream stop re-sequencing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84B26]" />
                <span>Save 40–60 minutes of unnecessary transit daily</span>
              </li>
            </ul>
          </div>

          {/* Right Column: Visual Photographic Storytelling */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-xl aspect-[16/10] bg-[#121316]">
              <Image
                src="/destinations/capability-traffic.jpg"
                alt="Dynamic city transit moving smoothly through illuminated streets"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              {/* Overlay Stat Callout */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FCD34D] block">
                    Congestion Mitigation Engine
                  </span>
                  <span className="text-sm font-medium">Bypassed Godowlia Crossing bottleneck</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 font-semibold block">-35 min transit saved</span>
                  <span className="text-[10px] text-white/70">Reordered to pedestrian lane</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAPABILITY 3 & 4: LOCAL TRANSPORT FARE ESTIMATES + EXPENSE TRACKER */}
      <div className="space-y-24">
        {/* Capability 3: Transport Fare Estimates */}
        <div id="fare-budget" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Fare Tool Simulation */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#C84B26] dark:text-[#E05A32] tracking-wider block">
                    Regional Transit Intelligence
                  </span>
                  <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
                    Fair Fare Reference Band
                  </h4>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified Local Rates
                </span>
              </div>

              {/* Sample Route */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between text-xs">
                <span className="font-mono text-[#71717A]">Route: Cantt Station → Dashashwamedh Ghat</span>
                <span className="font-mono text-[#18181B] dark:text-[#F4F1EA] font-semibold">5.8 km</span>
              </div>

              {/* Transit Modes Tabs */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "auto", name: "Auto-Rickshaw", icon: "🛺", range: "₹90 – ₹120", note: "Fair meter/prepaid range" },
                  { id: "cab", name: "AC Taxi / Cab", icon: "🚕", range: "₹220 – ₹280", note: "App or prepaid booth" },
                  { id: "walk", name: "Heritage Walk", icon: "🚶", range: "Free (0.8 km)", note: "Scenic pedestrian lane" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedTransport(mode.id as "auto" | "cab" | "walk")}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedTransport === mode.id
                        ? "border-[#C84B26] bg-[#C84B26]/5 shadow-xs"
                        : "border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26]/50 bg-white dark:bg-[#1A1B20]"
                    }`}
                  >
                    <div className="text-lg">{mode.icon}</div>
                    <div className="text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] mt-1">{mode.name}</div>
                    <div className="text-xs font-mono font-bold text-[#C84B26] dark:text-[#E05A32] mt-0.5">{mode.range}</div>
                  </button>
                ))}
              </div>

              {/* Advice Note */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-xs text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
                <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA] block mb-0.5">
                  Local Negotiating Insight:
                </span>
                During evening Aarti hours, autos may quote up to ₹300. Step 100 meters away from the primary station exit or agree on ₹110 before boarding.
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              03 / Transport Fare Estimates
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
              Estimated fare ideas for cabs, autos, and local transport.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Arriving at a train terminus or airport in a new city can be overwhelming when aggressive touts quote inflated rates. LessGooo arms you with clear, realistic spending ideas before you hail a ride.
            </p>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Understand per-kilometer metrics, reasonable prepaid rates, and when a picturesque walk or ferry ride actually gets you to your destination faster than four wheels.
            </p>
          </div>
        </div>

        {/* Capability 4: In-Trip Expense Tracking */}
        <div id="expense-tracker" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              04 / Expense Tracking
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
              An effortless expense tracker built directly into the journey.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Don’t let small cash outflows—morning street chai, auto fares, temple offerings, and museum tickets—spiral into budget anxiety at the end of the week.
            </p>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Log expenditures in seconds with single-tap categories. LessGooo calculates your remaining daily budget pace so you always know where you stand without opening an Excel spreadsheet.
            </p>
          </div>

          {/* Right Column: Visual Component Display */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-xl space-y-6">
              {/* Daily Runway Header */}
              <div className="pb-4 border-b border-[#E7E3DC] dark:border-[#26272D] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#71717A] block">Today’s Budget Runway</span>
                    <div className="text-2xl font-serif text-[#18181B] dark:text-[#F4F1EA] font-normal">
                      ₹1,850 <span className="text-xs font-sans font-light text-[#71717A]">/ ₹3,000 spent</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                    ● On Track (₹1,150 left)
                  </span>
                </div>

                {/* Animated Budget Pace Progress Bar */}
                <div className="w-full bg-[#FAF8F5] dark:bg-[#121316] rounded-full h-2 overflow-hidden border border-[#E7E3DC] dark:border-[#26272D]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#E5A93C] to-[#C84B26] transition-all duration-1000 ease-out"
                    style={{ width: "61.6%" }}
                  />
                </div>
              </div>

              {/* Categorized Breakdown */}
              <div className="space-y-2.5">
                {[
                  { category: "Meals & Street Food", amount: "₹650", count: "3 entries", icon: "☕" },
                  { category: "Transport & Autos", amount: "₹420", count: "4 rides", icon: "🛺" },
                  { category: "Heritage Pass / Tickets", amount: "₹500", count: "2 passes", icon: "🎟" },
                  { category: "Local Crafts & Incidental", amount: "₹280", count: "1 item", icon: "🛍" },
                ].map((item) => (
                  <div
                    key={item.category}
                    className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <div className="font-medium text-[#18181B] dark:text-[#F4F1EA]">{item.category}</div>
                        <div className="text-[10px] text-[#71717A]">{item.count}</div>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-[#18181B] dark:text-[#F4F1EA]">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAPABILITY 5 & 6: VERIFIED LOCAL GUIDES + SENIOR ACCOMPANIMENT */}
      <div id="guide-allotment" className="space-y-24">
        {/* Capability 5: Verified Local Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Guide Card */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-xl aspect-[16/10] bg-[#121316]">
              <Image
                src="/destinations/capability-guide.jpg"
                alt="Travellers exploring ancient architecture with an experienced local guide"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              
              {/* Badge Preview */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C84B26] flex items-center justify-center font-mono font-bold text-sm">
                    VK
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      <span>Virendra Kumar</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                        ✓ Verified Guide
                      </span>
                    </div>
                    <div className="text-[11px] text-white/75 font-mono">
                      Heritage Architecture • 12 Yrs Exp • Hindi, English, French
                    </div>
                  </div>
                </div>
                <div className="text-right sm:border-l sm:border-white/20 sm:pl-4">
                  <div className="text-xs font-mono text-[#FCD34D]">★★★★★ 4.98</div>
                  <div className="text-[10px] text-white/70">84 family journeys</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              05 / Verified Local Guides
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
              Vetted storytellers who unlock hidden culture.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Guidebooks tell you where to stand; authentic local storytellers tell you why the stones remember. LessGooo maintains an allotment network of certified, background-verified cultural guides.
            </p>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Filter by language fluency, architectural focus, and culinary expertise. Transparent hourly allotment pricing means zero awkward haggling and no commission-driven souvenir detours.
            </p>
          </div>
        </div>

        {/* Capability 6: Senior Citizen Accompaniment */}
        <div id="senior-accompaniment" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-[#C84B26] dark:text-[#E05A32]">
              06 / Senior Human Accompaniment
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#18181B] dark:text-[#F4F1EA] leading-tight">
              Human accompaniment and zero screen burden for elderly travellers.
            </h3>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              Travelling with elderly parents or grandparents is deeply rewarding, but deciphering smartphone maps, hailing rickshaws in heavy crowds, and navigating steep stone stairs can turn vacations into stressful hurdles.
            </p>
            <p className="text-sm sm:text-base text-[#52525B] dark:text-[#A1A1AA] font-light leading-relaxed">
              LessGooo provides direct allotment of dedicated human companions who take on all physical coordination. Seniors enjoy comfortable pacing, wheelchair-accessible and step-free detours, and genuine dignity.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-base">🪜</span>
                <div className="text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] mt-1">Step-Free Routing</div>
                <div className="text-[10px] text-[#71717A] mt-0.5">Gentle slopes & ramp access</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-base">🤝</span>
                <div className="text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] mt-1">Physical Assistance</div>
                <div className="text-[10px] text-[#71717A] mt-0.5">Hands-on escorting in crowds</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Photographic Storytelling */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-xl aspect-[16/10] bg-[#121316]">
              <Image
                src="/destinations/capability-senior.jpg"
                alt="Elderly travellers enjoying a comfortable walk together with peace of mind"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Callout */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FCD34D] block mb-1">
                  Family Peace of Mind Guarantee
                </span>
                <p className="text-xs text-white/90 font-light">
                  &ldquo;Having our verified companion Suresh guide my 72-year-old mother through the Kashi Vishwanath corridor without rush made our pilgrimage unforgettable.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
