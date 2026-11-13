"use client";

import { useState } from "react";
import { Trip, PlanSpecifications, updateTripInDb } from "@/lib/appwrite";
import { calculateSingleLegTransitCost } from "@/lib/transitEngine";
import PlanSpecificationsEditor, { DEFAULT_SPECS } from "./PlanSpecificationsEditor";

interface TripPlanSpecificationsTabProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  onGeneratePlanClick: () => void;
  onSyncTransitExpenses?: (
    approaching: { title: string; amountINR: number },
    departure: { title: string; amountINR: number }
  ) => Promise<void>;
}

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
      if (
        onSyncTransitExpenses &&
        (trip.proposedPlan?.length || trip.approachingTransitCost || trip.estimatedTransitCost)
      ) {
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

      {/* Shared Specifications Editor */}
      <PlanSpecificationsEditor
        specs={specs}
        onChangeSpecs={setSpecs}
        fromLocation={trip.from}
        destination={trip.destination}
      />
    </div>
  );
}
