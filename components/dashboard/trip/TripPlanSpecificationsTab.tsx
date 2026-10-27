"use client";

import { useState } from "react";
import { Trip, PlanSpecifications, TransitMode, updateTripInDb } from "@/lib/appwrite";
import { calculateSingleLegTransitCost } from "@/lib/transitEngine";

interface TripPlanSpecificationsTabProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  onGeneratePlanClick: () => void;
  onSyncTransitExpenses?: (
    approaching: { title: string; amountINR: number },
    departure: { title: string; amountINR: number }
  ) => Promise<void>;
}

const DEFAULT_SPECS: PlanSpecifications = {
  pace: "moderate",
  includeRestaurants: true,
  dietaryPreference: "pure_veg",
  cuisineTypes: ["Heritage Street Food", "Regional Thali"],
  touristPreferences: [
    "Heritage Temples & Spiritual Ghats",
    "Waterway / Boat Rides & Cruises",
    "Evening Ceremonies (Aarti / Sunset Points)"
  ],
  stayType: "Heritage Haveli / Courtyard Homestay",
  includeStayRest: true,
  approachingTransitMode: "self_car",
  departureTransitMode: "self_car",
  passengersCount: 2,
  approachingCarFuelType: "petrol",
  departureCarFuelType: "petrol",
  necessities: {
    hospital: true,
    medicalStore: true,
    atm: true,
    restrooms: true
  }
};

const ALL_TOURIST_PLACES = [
  "Heritage Temples & Spiritual Ghats",
  "Historical Monuments & Forts",
  "Waterway / Boat Rides & Cruises",
  "Cultural Crafts & Artisan Markets",
  "Evening Ceremonies (Aarti / Sunset Points)",
  "Archaeological Museums & Stupas"
];

const ALL_CUISINES = [
  "Heritage Street Food",
  "Regional Thali & Bhojnalaya",
  "Rooftop Riverfront Dining",
  "Traditional Sweets & Lassi Stalls"
];

const STAY_OPTIONS = [
  "Heritage Haveli / Courtyard Homestay",
  "Boutique Riverfront Hotel",
  "4-5 Star Luxury Resort",
  "Budget Pilgrim Guest House / Ashram"
];

const TRANSIT_MODES: { id: TransitMode; label: string; icon: string; sub: string }[] = [
  { id: "flight", label: "Flight", icon: "✈️", sub: "Commercial Air" },
  { id: "train", label: "Train", icon: "🚆", sub: "Vande Bharat / 3AC" },
  { id: "cab", label: "Outstation Cab", icon: "🚕", sub: "Intercity Taxi" },
  { id: "self_car", label: "Self Car", icon: "🚗", sub: "Personal Vehicle" },
];

export default function TripPlanSpecificationsTab({
  trip,
  onUpdateTrip,
  onGeneratePlanClick,
  onSyncTransitExpenses,
}: TripPlanSpecificationsTabProps) {
  const [specs, setSpecs] = useState<PlanSpecifications>({
    ...DEFAULT_SPECS,
    ...(trip.specifications || {}),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live calculations for both legs separately
  const approachingCalc = calculateSingleLegTransitCost(
    specs.approachingTransitMode || "self_car",
    trip.from || "Origin",
    trip.destination,
    "approaching",
    specs.passengersCount,
    specs.approachingCarFuelType || "petrol"
  );

  const departureCalc = calculateSingleLegTransitCost(
    specs.departureTransitMode || "self_car",
    trip.from || "Origin",
    trip.destination,
    "departure",
    specs.passengersCount,
    specs.departureCarFuelType || "petrol"
  );

  const combinedTransitTotal = approachingCalc.totalCost + departureCalc.totalCost;

  const toggleTouristPlace = (place: string) => {
    setSpecs((prev) => {
      const exists = prev.touristPreferences.includes(place);
      return {
        ...prev,
        touristPreferences: exists
          ? prev.touristPreferences.filter((p) => p !== place)
          : [...prev.touristPreferences, place]
      };
    });
  };

  const toggleCuisine = (cuisine: string) => {
    setSpecs((prev) => {
      const exists = prev.cuisineTypes.includes(cuisine);
      return {
        ...prev,
        cuisineTypes: exists
          ? prev.cuisineTypes.filter((c) => c !== cuisine)
          : [...prev.cuisineTypes, cuisine]
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const tripId = trip.$id || trip.id;
      if (!tripId) return;

      const updated = await updateTripInDb(tripId, trip.userId, {
        specifications: specs,
        approachingTransitCost: approachingCalc,
        departureTransitCost: departureCalc,
      });

      // If transit expenses sync handler is provided and trip has an existing plan / transit, sync immediately
      if (onSyncTransitExpenses && (trip.proposedPlan?.length || trip.approachingTransitCost || trip.estimatedTransitCost)) {
        const appTitle = `[Approaching] ${
          approachingCalc.mode === "self_car"
            ? `Self Car (${approachingCalc.fuelLiters || 0}L petrol, tolls) ${approachingCalc.from} ➔ ${approachingCalc.to}`
            : `${approachingCalc.mode.toUpperCase()} Tickets (${approachingCalc.passengersCount} pax) ${approachingCalc.from} ➔ ${approachingCalc.to}`
        }`;

        const depTitle = `[Departure] ${
          departureCalc.mode === "self_car"
            ? `Self Car (${departureCalc.fuelLiters || 0}L petrol, tolls) ${departureCalc.from} ➔ ${departureCalc.to}`
            : `${departureCalc.mode.toUpperCase()} Tickets (${departureCalc.passengersCount} pax) ${departureCalc.from} ➔ ${departureCalc.to}`
        }`;

        await onSyncTransitExpenses(
          { title: appTitle, amountINR: approachingCalc.totalCost },
          { title: depTitle, amountINR: departureCalc.totalCost }
        );
      }

      if (updated) {
        onUpdateTrip(updated);
      } else {
        onUpdateTrip({
          ...trip,
          specifications: specs,
          approachingTransitCost: approachingCalc,
          departureTransitCost: departureCalc,
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Customization Engine
          </span>
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            Plan Specifications & Dual-Leg Transit Directives
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
            Set approaching & departure transportation independently (flight, train, cab, or self car with tolls & fuel).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase hover:border-[#C84B26] text-[#18181B] dark:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            {isSaving ? "Saving..." : saveSuccess ? "Saved ✓" : "Save Specs"}
          </button>
          <button
            onClick={async () => {
              await handleSave();
              onGeneratePlanClick();
            }}
            className="px-4 py-2 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Generate Plan</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: INBOUND (APPROACHING) TRANSIT */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E3DC]/60 dark:border-[#26272D]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C84B26]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] font-semibold">
                Approaching Journey (Inbound Leg)
              </span>
            </div>
            <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
              How are you traveling to {trip.destination}?
            </h4>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light">
              Route: {trip.from || "Starting Origin"} ➔ {trip.destination} (~{approachingCalc.distanceKm} km)
            </p>
          </div>

          {/* Passenger Count */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#71717A]">Travelers:</span>
            <select
              value={specs.passengersCount}
              onChange={(e) => setSpecs({ ...specs, passengersCount: parseInt(e.target.value) || 1 })}
              className="h-9 px-3 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "Person" : "Persons"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Mode Radio Cards for Approaching */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          {TRANSIT_MODES.map((modeOption) => {
            const isSelected = specs.approachingTransitMode === modeOption.id;
            return (
              <button
                key={modeOption.id}
                type="button"
                onClick={() => setSpecs({ ...specs, approachingTransitMode: modeOption.id })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#C84B26] text-white border-[#C84B26] shadow-sm"
                    : "border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#71717A] hover:border-[#C84B26]/40"
                }`}
              >
                <div className="text-lg mb-1">{modeOption.icon}</div>
                <div className={`font-bold text-xs ${isSelected ? "text-white" : "text-[#18181B] dark:text-[#F4F1EA]"}`}>
                  {modeOption.label}
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">{modeOption.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Approaching Self Car Breakdown */}
        {specs.approachingTransitMode === "self_car" && (
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">
                Inbound Self-Drive Forecast ({approachingCalc.distanceKm} km one-way)
              </span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="text-[#71717A] uppercase">Fuel:</span>
                {(["petrol", "diesel", "ev"] as const).map((ft) => (
                  <button
                    key={ft}
                    type="button"
                    onClick={() => setSpecs({ ...specs, approachingCarFuelType: ft })}
                    className={`px-2 py-0.5 rounded-lg uppercase border transition-all cursor-pointer ${
                      (specs.approachingCarFuelType || "petrol") === ft
                        ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-bold"
                        : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]"
                    }`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] text-[#71717A] uppercase block">Inbound Fuel</span>
                <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  ₹{approachingCalc.fuelCost?.toLocaleString()}
                </span>
                <span className="text-[9px] text-[#71717A] block">~{approachingCalc.fuelLiters} Liters</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] text-[#71717A] uppercase block">Inbound FASTag Tolls</span>
                <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  ₹{approachingCalc.tollCost?.toLocaleString()}
                </span>
                <span className="text-[9px] text-[#71717A] block">Highway plazas</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] text-[#71717A] uppercase block">Inbound Subtotal</span>
                <span className="font-semibold text-[#C84B26] dark:text-[#E05A32]">
                  ₹{approachingCalc.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Approaching Other Modes Summary */}
        {specs.approachingTransitMode !== "self_car" && (
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between font-mono text-xs">
            <span className="text-[#18181B] dark:text-[#F4F1EA]">
              {approachingCalc.summaryText}
            </span>
            <span className="font-semibold text-[#C84B26]">
              Subtotal: ₹{approachingCalc.totalCost.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* SECTION 2: OUTBOUND (DEPARTURE) TRANSIT */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E3DC]/60 dark:border-[#26272D]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Departure Journey (Outbound Return Leg)
              </span>
            </div>
            <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
              How are you returning from {trip.destination}?
            </h4>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light">
              Route: {trip.destination} ➔ {trip.from || "Starting Origin"} (~{departureCalc.distanceKm} km)
            </p>
          </div>
        </div>

        {/* 4 Mode Radio Cards for Departure */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          {TRANSIT_MODES.map((modeOption) => {
            const isSelected = specs.departureTransitMode === modeOption.id;
            return (
              <button
                key={modeOption.id}
                type="button"
                onClick={() => setSpecs({ ...specs, departureTransitMode: modeOption.id })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#C84B26] text-white border-[#C84B26] shadow-sm"
                    : "border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#71717A] hover:border-[#C84B26]/40"
                }`}
              >
                <div className="text-lg mb-1">{modeOption.icon}</div>
                <div className={`font-bold text-xs ${isSelected ? "text-white" : "text-[#18181B] dark:text-[#F4F1EA]"}`}>
                  {modeOption.label}
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">{modeOption.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Departure Self Car Breakdown */}
        {specs.departureTransitMode === "self_car" && (
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">
                Outbound Self-Drive Forecast ({departureCalc.distanceKm} km return)
              </span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="text-[#71717A] uppercase">Fuel:</span>
                {(["petrol", "diesel", "ev"] as const).map((ft) => (
                  <button
                    key={ft}
                    type="button"
                    onClick={() => setSpecs({ ...specs, departureCarFuelType: ft })}
                    className={`px-2 py-0.5 rounded-lg uppercase border transition-all cursor-pointer ${
                      (specs.departureCarFuelType || "petrol") === ft
                        ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-bold"
                        : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]"
                    }`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] text-[#71717A] uppercase block">Outbound Fuel</span>
                <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  ₹{departureCalc.fuelCost?.toLocaleString()}
                </span>
                <span className="text-[9px] text-[#71717A] block">~{departureCalc.fuelLiters} Liters</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] text-[#71717A] uppercase block">Outbound FASTag Tolls</span>
                <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                  ₹{departureCalc.tollCost?.toLocaleString()}
                </span>
                <span className="text-[9px] text-[#71717A] block">Highway plazas</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                <span className="text-[10px] text-[#71717A] uppercase block">Outbound Subtotal</span>
                <span className="font-semibold text-[#C84B26] dark:text-[#E05A32]">
                  ₹{departureCalc.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Departure Other Modes Summary */}
        {specs.departureTransitMode !== "self_car" && (
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between font-mono text-xs">
            <span className="text-[#18181B] dark:text-[#F4F1EA]">
              {departureCalc.summaryText}
            </span>
            <span className="font-semibold text-[#C84B26]">
              Subtotal: ₹{departureCalc.totalCost.toLocaleString()}
            </span>
          </div>
        )}

        {/* Combined Dual-Leg Total Banner with Non-Stacking Assurance */}
        <div className="pt-3 border-t border-[#E7E3DC] dark:border-[#26272D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#71717A] uppercase block">Total Dual-Leg Transit Budget</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] block">
              ✓ Inbound & Outbound costs are logged separately and update in-place without piling up.
            </span>
          </div>
          <div className="text-right">
            <span className="text-base font-bold text-[#C84B26] dark:text-[#E05A32]">
              Total: ₹{combinedTransitTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: DAILY STOPAGES & PACE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] block">
              Section 3
            </span>
            <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
              Daily Stopages & Route Intensity
            </h4>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
              Select how many checkpoints and waypoints should be scheduled per day.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {(["relaxed", "moderate", "intensive"] as const).map((paceOption) => (
              <button
                key={paceOption}
                type="button"
                onClick={() => setSpecs({ ...specs, pace: paceOption })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  specs.pace === paceOption
                    ? "bg-[#C84B26] text-white font-semibold border-[#C84B26] shadow-sm"
                    : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] hover:border-[#C84B26]/40"
                }`}
              >
                <span className="capitalize block text-xs font-bold">{paceOption}</span>
                <span className="text-[10px] opacity-80 block mt-1">
                  {paceOption === "relaxed" ? "2-3 Stops" : paceOption === "moderate" ? "4-5 Stops" : "6+ Stops"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Restaurant & Pure Veg Selector */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] block">
                Section 4
              </span>
              <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
                Restaurants & Culinary Selection
              </h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
              <input
                type="checkbox"
                checked={specs.includeRestaurants}
                onChange={(e) => setSpecs({ ...specs, includeRestaurants: e.target.checked })}
                className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
              />
              <span className="text-[#18181B] dark:text-[#F4F1EA]">Include Food</span>
            </label>
          </div>

          {/* Pure Veg Selector */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block">
              Dietary Preference Standard *
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSpecs({ ...specs, dietaryPreference: "pure_veg" })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  specs.dietaryPreference === "pure_veg"
                    ? "bg-emerald-600 text-white font-semibold border-emerald-600 shadow-sm"
                    : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]"
                }`}
              >
                🥗 100% Pure Veg (Satvik)
              </button>
              <button
                type="button"
                onClick={() => setSpecs({ ...specs, dietaryPreference: "all" })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  specs.dietaryPreference === "all"
                    ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-semibold border-black"
                    : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]"
                }`}
              >
                🍽️ Multi-Cuisine / All
              </button>
            </div>
          </div>

          {/* Cuisine Checkboxes */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono uppercase text-[#71717A] block">Cuisine Styles:</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {ALL_CUISINES.map((cuisine) => (
                <label key={cuisine} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
                  <input
                    type="checkbox"
                    checked={specs.cuisineTypes.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                    className="w-3.5 h-3.5 accent-[#C84B26] rounded cursor-pointer"
                  />
                  <span className="text-[11px] truncate">{cuisine}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Tourist Places Checkboxes */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] block">
              Section 5
            </span>
            <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
              Tourist Places & Sightseeing
            </h4>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
              Check the cultural and recreational categories you wish to include.
            </p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {ALL_TOURIST_PLACES.map((place) => (
              <label
                key={place}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] cursor-pointer hover:border-[#C84B26]/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={specs.touristPreferences.includes(place)}
                  onChange={() => toggleTouristPlace(place)}
                  className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
                />
                <span className="text-xs text-[#18181B] dark:text-[#F4F1EA]">{place}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 6: Hotel & Essential Necessities */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-5">
          {/* Hotel Option */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] block">
                Hotel & Stay
              </span>
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                <input
                  type="checkbox"
                  checked={specs.includeStayRest}
                  onChange={(e) => setSpecs({ ...specs, includeStayRest: e.target.checked })}
                  className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
                />
                <span className="text-[#18181B] dark:text-[#F4F1EA]">Afternoon Rest Slot</span>
              </label>
            </div>
            <select
              value={specs.stayType}
              onChange={(e) => setSpecs({ ...specs, stayType: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-xs font-mono focus:outline-none focus:border-[#C84B26] cursor-pointer"
            >
              {STAY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Emergency & Safety Necessities */}
          <div className="space-y-3 pt-3 border-t border-[#E7E3DC] dark:border-[#26272D]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C84B26] dark:text-[#E05A32] block">
                Emergency & Safety Necessities
              </span>
              <h4 className="font-serif text-base text-[#18181B] dark:text-[#F4F1EA]">
                Essential Waypoints & Services
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] cursor-pointer">
                <input
                  type="checkbox"
                  checked={specs.necessities.hospital}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      necessities: { ...specs.necessities, hospital: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <div>
                  <span className="font-medium text-red-600 dark:text-red-400 block text-[11px]">🏥 Hospital & Trauma</span>
                  <span className="text-[9px] text-[#71717A]">Map nearest 24/7 emergency</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] cursor-pointer">
                <input
                  type="checkbox"
                  checked={specs.necessities.medicalStore}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      necessities: { ...specs.necessities, medicalStore: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
                />
                <div>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA] block text-[11px]">💊 24x7 Pharmacy</span>
                  <span className="text-[9px] text-[#71717A]">Emergency medical stores</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] cursor-pointer">
                <input
                  type="checkbox"
                  checked={specs.necessities.atm}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      necessities: { ...specs.necessities, atm: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
                />
                <div>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA] block text-[11px]">🏧 Bank ATM</span>
                  <span className="text-[9px] text-[#71717A]">Cash / forex points</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] cursor-pointer">
                <input
                  type="checkbox"
                  checked={specs.necessities.restrooms}
                  onChange={(e) =>
                    setSpecs({
                      ...specs,
                      necessities: { ...specs.necessities, restrooms: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
                />
                <div>
                  <span className="font-medium text-[#18181B] dark:text-[#F4F1EA] block text-[11px]">🚻 Clean Restrooms</span>
                  <span className="text-[9px] text-[#71717A]">Pilgrim sanitized facilities</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
