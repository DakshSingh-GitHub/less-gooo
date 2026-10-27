"use client";

import { useState } from "react";
import { Trip } from "@/lib/appwrite";
import TripMapsTab from "@/components/dashboard/trip/TripMapsTab";

interface CompletedTripsViewProps {
  trips: Trip[];
  onSetTripActive: (tripId: string) => void;
  onNewTripClick: () => void;
}

export default function CompletedTripsView({
  trips,
  onSetTripActive,
  onNewTripClick,
}: CompletedTripsViewProps) {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"overview" | "itinerary" | "map">("overview");

  const completedTrips = trips.filter((t) => t.status === "completed");
  const selectedTrip = completedTrips.find((t) => (t.$id || t.id) === selectedTripId) || null;

  // 1. EMPTY STATE (No completed trips)
  if (completedTrips.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            No completed trips yet
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto font-light">
            When you mark an active trip as completed, your journey chronicles, recorded memories, and expense audits will be archived here.
          </p>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
        >
          + Plan a New Trip
        </button>
      </div>
    );
  }

  // 2. DETAILED TRIP VIEW (When a completed trip is selected)
  if (selectedTrip) {
    const specs = selectedTrip.specifications;
    const plan = selectedTrip.proposedPlan || [];

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Top Navigation Row: Back Button on the Top Left Corner */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
          <button
            onClick={() => setSelectedTripId(null)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] text-xs font-mono uppercase tracking-wider text-[#18181B] dark:text-[#F4F1EA] hover:border-[#C84B26] hover:text-[#C84B26] transition-colors cursor-pointer shadow-sm group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Completed Trips</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              Archived Journey
            </span>
            <button
              onClick={() => onSetTripActive(selectedTrip.$id || selectedTrip.id || "")}
              className="px-3.5 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors cursor-pointer"
            >
              Re-activate Trip
            </button>
          </div>
        </div>

        {/* Header Hero Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
                {selectedTrip.category}
              </span>
              <span className="text-xs font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">
                Budget: {selectedTrip.currency} {selectedTrip.budget.toLocaleString()}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA]">
              {selectedTrip.title}
            </h2>

            <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
              <span>Corridor:</span>
              <span className="text-[#18181B] dark:text-[#F4F1EA] font-semibold">
                {selectedTrip.from ? `${selectedTrip.from} ➔ ` : ""}
                {selectedTrip.destination}
              </span>
            </div>
          </div>

          {/* 3-Column Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
              <span className="text-[#71717A] uppercase text-[10px] block">Completed Dates</span>
              <div className="text-sm font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                {selectedTrip.startDate} → {selectedTrip.endDate}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
              <span className="text-[#71717A] uppercase text-[10px] block">Total Allocated</span>
              <div className="text-sm font-semibold text-[#C84B26] dark:text-[#E05A32]">
                {selectedTrip.currency} {selectedTrip.budget.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
              <span className="text-[#71717A] uppercase text-[10px] block">Status</span>
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                Completed & Preserved
              </div>
            </div>
          </div>

          {/* Sub-Section Tabs for Completed Trip */}
          <div className="p-1.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveDetailTab("overview")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeDetailTab === "overview"
                  ? "bg-[#C84B26] text-white font-semibold shadow-sm"
                  : "text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              Overview & Specifications
            </button>
            <button
              onClick={() => setActiveDetailTab("itinerary")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDetailTab === "itinerary"
                  ? "bg-[#C84B26] text-white font-semibold shadow-sm"
                  : "text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              <span>Proposed Itinerary</span>
              {plan.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white">
                  {plan.length}d
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveDetailTab("map")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeDetailTab === "map"
                  ? "bg-[#C84B26] text-white font-semibold shadow-sm"
                  : "text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              Route Map
            </button>
          </div>

          {/* TAB 1: OVERVIEW & SPECS */}
          {activeDetailTab === "overview" && (
            <div className="space-y-6">
              {/* Field Notes */}
              {selectedTrip.notes && (
                <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block">
                    Archived Field Notes & Directives
                  </span>
                  <p className="text-xs text-[#18181B] dark:text-[#F4F1EA] whitespace-pre-line leading-relaxed font-light">
                    {selectedTrip.notes}
                  </p>
                </div>
              )}

              {/* Specifications Snapshot */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block">
                  Trip Specifications & Safety Settings
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                    <span className="text-[10px] text-[#71717A] uppercase block">Pace</span>
                    <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA] capitalize">
                      {specs?.pace || "Moderate"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                    <span className="text-[10px] text-[#71717A] uppercase block">Dietary Standard</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {specs?.dietaryPreference === "pure_veg" ? "Pure Veg (Satvik)" : "Multi-Cuisine"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                    <span className="text-[10px] text-[#71717A] uppercase block">Emergency Care</span>
                    <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                      {specs?.necessities?.hospital !== false ? "Hospital Mapped" : "Standard"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D]">
                    <span className="text-[10px] text-[#71717A] uppercase block">Accommodation</span>
                    <span className="font-semibold text-[#C84B26] truncate block">
                      {specs?.stayType || "Heritage Haveli"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPOSED ITINERARY */}
          {activeDetailTab === "itinerary" && (
            <div className="space-y-4">
              {plan.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono text-[#71717A]">
                  No AI itinerary was saved for this journey.
                </div>
              ) : (
                plan.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="rounded-2xl border border-[#E7E3DC] dark:border-[#26272D] overflow-hidden"
                  >
                    <div className="p-4 bg-[#FAF8F5] dark:bg-[#121316] border-b border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C84B26]/10 text-[#C84B26] font-semibold">
                          Day {day.dayNumber}
                        </span>
                        <h4 className="font-serif text-lg text-[#18181B] dark:text-[#F4F1EA]">
                          {day.theme}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-[#71717A]">{day.date}</span>
                    </div>

                    <div className="p-4 space-y-3 bg-white dark:bg-[#1A1B20]">
                      {day.stops.map((stop, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-xl border border-[#E7E3DC]/60 dark:border-[#26272D] space-y-1 text-xs"
                        >
                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span className="font-semibold text-[#C84B26]">{stop.time}</span>
                            <span className="uppercase text-[#71717A]">{stop.category}</span>
                            {stop.isPureVeg && (
                              <span className="text-emerald-600 font-semibold">🥗 Pure Veg</span>
                            )}
                          </div>
                          <h5 className="font-medium text-[#18181B] dark:text-[#F4F1EA]">
                            {stop.title}
                          </h5>
                          <p className="text-[#71717A] dark:text-[#A1A1AA] font-light">
                            {stop.description}
                          </p>
                          {(stop.transitNote || stop.estimatedCost) && (
                            <div className="flex items-center gap-4 text-[10px] font-mono text-[#71717A] pt-1">
                              {stop.transitNote && <span>Transit: {stop.transitNote}</span>}
                              {stop.estimatedCost && <span className="text-[#C84B26]">Cost: {stop.estimatedCost}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ROUTE MAP */}
          {activeDetailTab === "map" && (
            <div>
              <TripMapsTab trip={selectedTrip} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. COMPLETED TRIPS LIST VIEW (Default)
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Archived Journeys
          </span>
          <h2 className="font-serif text-3xl text-[#18181B] dark:text-[#F4F1EA]">
            Completed Trips ({completedTrips.length})
          </h2>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
            Click on any completed trip to view its full itinerary, route map, and recorded specifications.
          </p>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors cursor-pointer"
        >
          + Plan Another Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {completedTrips.map((trip) => {
          const tripId = trip.$id || trip.id || "";

          return (
            <div
              key={tripId}
              onClick={() => setSelectedTripId(tripId)}
              className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C84B26] transition-all cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                      Completed
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
                      {trip.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#C84B26] dark:text-[#E05A32] font-semibold">
                    {trip.currency} {trip.budget.toLocaleString()}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA] group-hover:text-[#C84B26] transition-colors">
                  {trip.title}
                </h3>

                <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                  <svg className="w-3.5 h-3.5 text-[#C84B26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>
                    {trip.from ? `${trip.from} ➔ ` : ""}
                    <strong className="text-[#18181B] dark:text-[#F4F1EA]">{trip.destination}</strong>
                  </span>
                </div>

                <div className="text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                  Dates: {trip.startDate} → {trip.endDate}
                </div>

                {trip.notes && (
                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] line-clamp-2 pt-2 border-t border-[#E7E3DC]/60 dark:border-[#26272D]">
                    {trip.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between">
                <span className="text-xs font-mono text-[#C84B26] group-hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <span>→</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetTripActive(tripId);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26] hover:text-[#C84B26] text-xs font-mono uppercase transition-colors cursor-pointer"
                >
                  Re-activate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
