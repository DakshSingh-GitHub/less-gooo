"use client";

import { useState } from "react";
import { Trip, ProposedPlanDay, updateTripInDb } from "@/lib/appwrite";

interface TripProposedPlanTabProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  onConfigureSpecsClick: () => void;
  onSyncTransitExpenses?: (
    approaching: { title: string; amountINR: number },
    departure: { title: string; amountINR: number }
  ) => Promise<void>;
  onAddExpenseAuto?: (data: { title: string; amountINR: number; category: "transit" }) => Promise<void>;
}

export default function TripProposedPlanTab({
  trip,
  onUpdateTrip,
  onConfigureSpecsClick,
  onSyncTransitExpenses,
  onAddExpenseAuto,
}: TripProposedPlanTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoLoggedNotice, setAutoLoggedNotice] = useState<string | null>(null);
  const [completedStops, setCompletedStops] = useState<Record<string, boolean>>({});

  const plan: ProposedPlanDay[] = trip.proposedPlan || [];
  const ticketCost = trip.estimatedTicketCost;
  const transitCost = trip.estimatedTransitCost;
  const approachingCost = trip.approachingTransitCost;
  const departureCost = trip.departureTransitCost;

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setAutoLoggedNotice(null);

    try {
      const res = await fetch("/api/trips/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: trip.destination,
          from: trip.from || "",
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: trip.budget,
          currency: trip.currency,
          category: trip.category,
          specifications: trip.specifications || {
            pace: "moderate",
            includeRestaurants: true,
            dietaryPreference: "pure_veg",
            cuisineTypes: ["Heritage Street Food", "Regional Thali"],
            touristPreferences: ["Heritage Temples & Spiritual Ghats"],
            stayType: "Heritage Haveli / Courtyard Homestay",
            includeStayRest: true,
            transitMode: "self_car",
            passengersCount: 2,
            carFuelType: "petrol",
            necessities: { hospital: true, medicalStore: true, atm: true, restrooms: true }
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.proposedPlan) {
        throw new Error(data.error || "Failed to generate plan");
      }

      const generatedPlan: ProposedPlanDay[] = data.proposedPlan;
      const estimatedTicketCost: number = data.estimatedTicketCost || 500;
      const approachingTransitCost = data.approachingTransitCost;
      const departureTransitCost = data.departureTransitCost;
      const estimatedTransitCost = data.estimatedTransitCost;

      const tripId = trip.$id || trip.id;
      if (tripId) {
        await updateTripInDb(tripId, trip.userId, {
          proposedPlan: generatedPlan,
          estimatedTicketCost,
          approachingTransitCost,
          departureTransitCost,
          estimatedTransitCost
        });
      }

      // Automatically sync Approaching & Departure transit costs into the Expense Tracker
      // CRITICAL: Updates in-place and NEVER stacks or piles up upon regeneration
      if (approachingTransitCost && departureTransitCost && onSyncTransitExpenses) {
        const appTitle = `[Approaching] ${
          approachingTransitCost.mode === "self_car"
            ? `Self Car (${approachingTransitCost.fuelLiters || 0}L petrol, tolls) ${approachingTransitCost.from} ➔ ${approachingTransitCost.to}`
            : `${approachingTransitCost.mode.toUpperCase()} Tickets (${approachingTransitCost.passengersCount} pax) ${approachingTransitCost.from} ➔ ${approachingTransitCost.to}`
        }`;

        const depTitle = `[Departure] ${
          departureTransitCost.mode === "self_car"
            ? `Self Car (${departureTransitCost.fuelLiters || 0}L petrol, tolls) ${departureTransitCost.from} ➔ ${departureTransitCost.to}`
            : `${departureTransitCost.mode.toUpperCase()} Tickets (${departureTransitCost.passengersCount} pax) ${departureTransitCost.from} ➔ ${departureTransitCost.to}`
        }`;

        await onSyncTransitExpenses(
          { title: appTitle, amountINR: approachingTransitCost.totalCost },
          { title: depTitle, amountINR: departureTransitCost.totalCost }
        );

        setAutoLoggedNotice(
          `Transit expenses updated in ledger: Approaching (₹${approachingTransitCost.totalCost.toLocaleString()}) and Departure (₹${departureTransitCost.totalCost.toLocaleString()}) updated in-place (non-stacking).`
        );
      } else if (estimatedTransitCost?.roundTripTotal && onAddExpenseAuto) {
        const transitTitle = `Round-trip Transit (${
          estimatedTransitCost.mode === "self_car"
            ? `Self Car: Fuel & FASTag Tolls (${estimatedTransitCost.roundTripDistanceKm} km)`
            : `${estimatedTransitCost.mode.toUpperCase()} Tickets (${estimatedTransitCost.passengersCount} pax)`
        })`;

        await onAddExpenseAuto({
          title: transitTitle,
          amountINR: estimatedTransitCost.roundTripTotal,
          category: "transit"
        });

        setAutoLoggedNotice(
          `Estimated transit cost of ₹${estimatedTransitCost.roundTripTotal.toLocaleString()} was logged into your Expense Tracker.`
        );
      }

      onUpdateTrip({
        ...trip,
        proposedPlan: generatedPlan,
        estimatedTicketCost,
        approachingTransitCost,
        departureTransitCost,
        estimatedTransitCost
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to synthesize proposed itinerary plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleStopVisited = (key: string) => {
    setCompletedStops((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportPlan = () => {
    if (plan.length === 0) return;
    const textLines = [
      `LESSGOOO — PROPOSED JOURNEY PLAN`,
      `Trip: ${trip.title}`,
      `Route: ${trip.from ? `${trip.from} -> ` : ""}${trip.destination}`,
      `Dates: ${trip.startDate} to ${trip.endDate}`,
      `Budget: ${trip.currency} ${trip.budget.toLocaleString()}`,
      `Average Tour Ticket Estimate: ₹${ticketCost || 600} / person`,
      `Inbound/Outbound Transit: ${transitCost?.summaryText || "Configured in specifications"}`,
      `Dietary Standard: ${trip.specifications?.dietaryPreference === "pure_veg" ? "Pure Vegetarian (Satvik)" : "All Cuisines"}`,
      `=========================================`,
      ""
    ];

    plan.forEach((d) => {
      textLines.push(`DAY ${d.dayNumber}: ${d.theme} (${d.date})`);
      textLines.push(`-----------------------------------------`);
      d.stops.forEach((s) => {
        textLines.push(`[${s.time}] ${s.title}`);
        textLines.push(`  Details: ${s.description}`);
        if (s.transitNote) textLines.push(`  Transit: ${s.transitNote}`);
        if (s.estimatedCost) textLines.push(`  Cost: ${s.estimatedCost}`);
        textLines.push("");
      });
      textLines.push("");
    });

    const blob = new Blob([textLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${trip.title.replace(/\s+/g, "_")}_Proposed_Plan.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
              Autonomous Itinerary Solver
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              Live Engine Active
            </span>
          </div>
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            Proposed Itinerary & Transit Economics
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
            Calibrated with attraction ticket price averages, road tolls, petrol prices, and pure-veg stops.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {plan.length > 0 && (
            <button
              onClick={handleExportPlan}
              className="px-3.5 py-2 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase hover:border-[#C84B26] text-[#18181B] dark:text-[#F4F1EA] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Text</span>
            </button>
          )}

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase font-semibold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Synthesizing Plan & Pricing...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>{plan.length > 0 ? "Regenerate Plan" : "Generate Proposed Plan"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auto-Logged Success Notice */}
      {autoLoggedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-mono text-xs flex items-center gap-2">
          <span>✓</span>
          <span>{autoLoggedNotice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs">
          {errorMsg}
        </div>
      )}

      {/* COST FORECAST & TICKET BENCHMARK CARDS */}
      {(ticketCost || transitCost || approachingCost || departureCost) && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Card 1: Average Attraction / Sightseeing Ticket Price */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#71717A] uppercase">
                  🎟️ Tour Ticket Price
                </span>
                <span className="text-xs font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  ~₹{ticketCost ? ticketCost.toLocaleString() : "550"} / person
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-light leading-relaxed">
                Archaeological passes, heritage museum fees, and sacred boat berths.
              </p>
              <div className="pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D] flex items-center justify-between text-[10px] text-[#71717A]">
                <span>Sightseeing budget</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Tariff</span>
              </div>
            </div>

            {/* Card 2: Approaching (Inbound) Transit Card */}
            {approachingCost ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase flex items-center gap-1">
                    <span>🛫</span>
                    <span>Approaching (Inbound)</span>
                  </span>
                  <span className="text-xs font-semibold text-[#C84B26] dark:text-[#E05A32]">
                    ₹{approachingCost.totalCost.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-light leading-relaxed">
                  {approachingCost.summaryText}
                </p>
                <div className="pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D] flex items-center justify-between text-[10px]">
                  <span className="text-[#71717A]">
                    {approachingCost.mode === "self_car"
                      ? `Tolls: ₹${approachingCost.tollCost} | Fuel: ₹${approachingCost.fuelCost}`
                      : `${approachingCost.passengersCount} Passengers`}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>✓</span>
                    <span>In Ledger</span>
                  </span>
                </div>
              </div>
            ) : transitCost ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase">
                    Transit (Inbound)
                  </span>
                  <span className="text-xs font-semibold text-[#C84B26] dark:text-[#E05A32]">
                    ₹{transitCost.roundTripTotal ? Math.round(transitCost.roundTripTotal / 2).toLocaleString() : "0"}
                  </span>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-light leading-relaxed">
                  {transitCost.summaryText}
                </p>
                <div className="pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D] flex items-center justify-between text-[10px]">
                  <span className="text-[#71717A]">Inbound Journey</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Logged</span>
                </div>
              </div>
            ) : null}

            {/* Card 3: Departure (Outbound) Transit Card */}
            {departureCost ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase flex items-center gap-1">
                    <span>🛬</span>
                    <span>Departure (Outbound)</span>
                  </span>
                  <span className="text-xs font-semibold text-[#C84B26] dark:text-[#E05A32]">
                    ₹{departureCost.totalCost.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-light leading-relaxed">
                  {departureCost.summaryText}
                </p>
                <div className="pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D] flex items-center justify-between text-[10px]">
                  <span className="text-[#71717A]">
                    {departureCost.mode === "self_car"
                      ? `Tolls: ₹${departureCost.tollCost} | Fuel: ₹${departureCost.fuelCost}`
                      : `${departureCost.passengersCount} Passengers`}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>✓</span>
                    <span>In Ledger</span>
                  </span>
                </div>
              </div>
            ) : transitCost ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] uppercase">
                    Transit (Outbound)
                  </span>
                  <span className="text-xs font-semibold text-[#C84B26] dark:text-[#E05A32]">
                    ₹{transitCost.roundTripTotal ? Math.round(transitCost.roundTripTotal / 2).toLocaleString() : "0"}
                  </span>
                </div>
                <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-light leading-relaxed">
                  Return journey calculation.
                </p>
                <div className="pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D] flex items-center justify-between text-[10px]">
                  <span className="text-[#71717A]">Outbound Return</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Logged</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Combined Transit Sync Confirmation Banner */}
          {(approachingCost || departureCost) && (
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#16171B] border border-[#E7E3DC] dark:border-[#26272D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">●</span>
                <span className="text-[#18181B] dark:text-[#F4F1EA] font-medium">
                  Total Transit Outlay: ₹{((approachingCost?.totalCost || 0) + (departureCost?.totalCost || 0)).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#71717A]">
                  (Approaching: ₹{(approachingCost?.totalCost || 0).toLocaleString()} + Departure: ₹{(departureCost?.totalCost || 0).toLocaleString()})
                </span>
              </div>
              <div className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] flex items-center gap-1">
                <span>🔄</span>
                <span>Auto-updates in Expense Tracker without stacking</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State if Plan Not Generated Yet */}
      {plan.length === 0 && !isGenerating && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
              Generate Your Proposed Plan
            </h4>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-md mx-auto font-light">
              LessGooo will automatically synthesize your daily stop sequence, fetch average monument ticket costs, estimate your travel tolls & petrol, and automatically record the transit expenditure in your Expense Tracker.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleGeneratePlan}
              className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
            >
              ✨ Generate Proposed Plan
            </button>
            <button
              onClick={onConfigureSpecsClick}
              className="px-4 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
            >
              Adjust Transit / Specs
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isGenerating && (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-4 text-center font-mono text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-[#C84B26] border-t-transparent animate-spin mx-auto" />
          <span className="block text-[#18181B] dark:text-[#F4F1EA] font-semibold">
            Calibrating route timings, FASTag highway tolls & ticket pricing...
          </span>
        </div>
      )}

      {/* Plan Timeline by Day */}
      {plan.length > 0 && !isGenerating && (
        <div className="space-y-8">
          {plan.map((day) => (
            <div
              key={day.dayNumber}
              className="rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div className="p-5 bg-[#FAF8F5] dark:bg-[#121316] border-b border-[#E7E3DC] dark:border-[#26272D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C84B26]/10 text-[#C84B26] font-semibold">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-xs font-mono text-[#71717A]">{day.date}</span>
                  </div>
                  <h4 className="font-serif text-xl text-[#18181B] dark:text-[#F4F1EA]">
                    {day.theme}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase">
                  {day.stops.length} Checkpoints
                </span>
              </div>

              {/* Day Stops List */}
              <div className="p-5 space-y-4">
                {day.stops.map((stop, sIdx) => {
                  const stopKey = `d${day.dayNumber}_s${sIdx}`;
                  const isChecked = completedStops[stopKey];

                  return (
                    <div
                      key={sIdx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isChecked
                          ? "bg-black/[0.02] dark:bg-white/[0.02] border-[#E7E3DC]/40 dark:border-[#26272D]/40 opacity-60"
                          : "bg-white dark:bg-[#1A1B20] border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26]/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-semibold text-[#C84B26] dark:text-[#E05A32] bg-[#FAF8F5] dark:bg-[#121316] px-2 py-0.5 rounded-md border border-[#E7E3DC] dark:border-[#26272D]">
                              {stop.time}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
                              {stop.category}
                            </span>
                            {stop.isPureVeg && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                                🥗 100% Pure Veg
                              </span>
                            )}
                            {stop.category === "medical" && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold">
                                🏥 24/7 Safety Milestone
                              </span>
                            )}
                          </div>

                          <h5 className={`font-serif text-lg text-[#18181B] dark:text-[#F4F1EA] ${isChecked ? "line-through text-[#71717A]" : ""}`}>
                            {stop.title}
                          </h5>

                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed font-light">
                            {stop.description}
                          </p>

                          {/* Transit & Cost Footer */}
                          {(stop.transitNote || stop.estimatedCost) && (
                            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA] border-t border-[#E7E3DC]/40 dark:border-[#26272D]/40">
                              {stop.transitNote && (
                                <span className="flex items-center gap-1">
                                  <span>Transit:</span>
                                  <strong className="text-[#18181B] dark:text-[#F4F1EA]">{stop.transitNote}</strong>
                                </span>
                              )}
                              {stop.estimatedCost && (
                                <span className="flex items-center gap-1">
                                  <span>Budget:</span>
                                  <strong className="text-[#C84B26]">{stop.estimatedCost}</strong>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Visited Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleStopVisited(stopKey)}
                          title={isChecked ? "Mark as unvisited" : "Mark as visited"}
                          className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "border-[#E7E3DC] dark:border-[#26272D] text-transparent hover:text-gray-400"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
