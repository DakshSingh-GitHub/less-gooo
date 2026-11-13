"use client";

import { useState } from "react";
import { Trip, PlanSpecifications, updateTripInDb } from "@/lib/appwrite";
import { calculateSingleLegTransitCost } from "@/lib/transitEngine";
import PlanSpecificationsEditor, { DEFAULT_SPECS } from "./trip/PlanSpecificationsEditor";

interface UpcomingTripsViewProps {
  trips: Trip[];
  onSetTripActive: (tripId: string) => void;
  onNewTripClick: () => void;
  onUpdateTrip?: (updated: Trip) => void;
}

export default function UpcomingTripsView({
  trips,
  onSetTripActive,
  onNewTripClick,
  onUpdateTrip,
}: UpcomingTripsViewProps) {
  const upcomingTrips = trips.filter((t) => t.status === "upcoming");

  // Modal State for Editing Specifications on an Upcoming Trip
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [modalSpecs, setModalSpecs] = useState<PlanSpecifications>(DEFAULT_SPECS);
  const [isSavingSpecs, setIsSavingSpecs] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const openEditSpecs = (trip: Trip) => {
    setEditingTrip(trip);
    setModalSpecs({
      ...DEFAULT_SPECS,
      ...(trip.specifications || {}),
    });
    setSaveSuccessMsg(null);
  };

  const closeEditSpecs = () => {
    setEditingTrip(null);
    setSaveSuccessMsg(null);
  };

  const handleSaveModalSpecs = async () => {
    if (!editingTrip) return;
    setIsSavingSpecs(true);
    try {
      const tripId = editingTrip.$id || editingTrip.id;
      if (!tripId) return;

      const approachingCalc = calculateSingleLegTransitCost(
        modalSpecs.approachingTransitMode || "self_car",
        editingTrip.from || "Origin",
        editingTrip.destination,
        "approaching",
        modalSpecs.passengersCount,
        modalSpecs.approachingCarFuelType || "petrol"
      );

      const departureCalc = calculateSingleLegTransitCost(
        modalSpecs.departureTransitMode || "self_car",
        editingTrip.from || "Origin",
        editingTrip.destination,
        "departure",
        modalSpecs.passengersCount,
        modalSpecs.departureCarFuelType || "petrol"
      );

      const updated = await updateTripInDb(tripId, editingTrip.userId, {
        specifications: modalSpecs,
        approachingTransitCost: approachingCalc,
        departureTransitCost: departureCalc,
      });

      const updatedTripObj: Trip = updated || {
        ...editingTrip,
        specifications: modalSpecs,
        approachingTransitCost: approachingCalc,
        departureTransitCost: departureCalc,
        updatedAt: new Date().toISOString(),
      };

      if (onUpdateTrip) {
        onUpdateTrip(updatedTripObj);
      }

      setSaveSuccessMsg("Specifications updated successfully!");
      setTimeout(() => {
        closeEditSpecs();
      }, 900);
    } catch (err: any) {
      alert(err?.message || "Failed to update specifications.");
    } finally {
      setIsSavingSpecs(false);
    }
  };

  if (upcomingTrips.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            No upcoming trips scheduled
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto font-light">
            You don&apos;t have any confirmed trips on your calendar. Plan ahead for your next destination.
          </p>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
        >
          + Plan Upcoming Trip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Confirmed Schedule
          </span>
          <h2 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
            Upcoming Trips ({upcomingTrips.length})
          </h2>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors cursor-pointer"
        >
          + Add Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingTrips.map((trip) => (
          <div
            key={trip.$id || trip.id}
            className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C84B26]/40 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
                  {trip.category}
                </span>
                <span className="text-xs font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">
                  {trip.currency} {trip.budget.toLocaleString()}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
                {trip.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                <svg className="w-3.5 h-3.5 text-[#C84B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {trip.from ? `${trip.from} ➔ ` : ""}{trip.destination}
                </span>
              </div>

              <div className="text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                Dates: {trip.startDate} → {trip.endDate}
              </div>

              {/* Specifications preview badges */}
              {trip.specifications && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
                    Transit: {trip.specifications.approachingTransitMode?.toUpperCase().replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
                    Pace: {trip.specifications.pace}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
                    {trip.specifications.dietaryPreference === "pure_veg" ? "🥗 Pure Veg" : "🍽️ Multi-Cuisine"}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
                    👥 {trip.specifications.passengersCount} Pax
                  </span>
                </div>
              )}

              {trip.notes && (
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] line-clamp-2 pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D]">
                  {trip.notes}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => openEditSpecs(trip)}
                className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26] hover:text-[#C84B26] text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>⚙️</span>
                <span>Edit Specifications</span>
              </button>

              <button
                type="button"
                onClick={() => onSetTripActive(trip.$id || trip.id || "")}
                className="px-3.5 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] hover:bg-[#C84B26] dark:hover:bg-[#C84B26] dark:hover:text-white text-xs font-mono uppercase font-semibold transition-colors cursor-pointer"
              >
                Set as Active Trip
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT SPECIFICATIONS MODAL FOR UPCOMING TRIP */}
      {editingTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
                  Upcoming Trip Customization
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#18181B] dark:text-[#F4F1EA]">
                  Edit Specifications: {editingTrip.title}
                </h3>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
                  Route: {editingTrip.from || "Origin"} ➔ {editingTrip.destination} • Dates: {editingTrip.startDate} → {editingTrip.endDate}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditSpecs}
                className="w-8 h-8 rounded-full border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono text-center">
                ✓ {saveSuccessMsg}
              </div>
            )}

            {/* Specifications Editor */}
            <PlanSpecificationsEditor
              specs={modalSpecs}
              onChangeSpecs={setModalSpecs}
              fromLocation={editingTrip.from}
              destination={editingTrip.destination}
            />

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E3DC] dark:border-[#26272D]">
              <button
                type="button"
                onClick={closeEditSpecs}
                className="px-5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingSpecs}
                onClick={handleSaveModalSpecs}
                className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSavingSpecs ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Specifications</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
