"use client";

import { Trip } from "@/lib/appwrite";

interface ActiveTripCardProps {
  trip: Trip | null;
  onNewTripClick: () => void;
  onCompleteTrip?: (tripId: string) => void;
  onLogExpenseClick?: () => void;
}

export default function ActiveTripCard({
  trip,
  onNewTripClick,
  onCompleteTrip,
  onLogExpenseClick,
}: ActiveTripCardProps) {
  // STRICT INTEGRITY GUARDRAIL:
  // Under NO circumstances render dummy, placeholder, or fake data when no active trip exists.
  if (!trip || trip.status !== "active") {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center mx-auto text-[#71717A]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            No active trip at the moment.
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] max-w-sm mx-auto font-light">
            Plan a new journey to track live itineraries, dwell replanning, and real-time expense budgets.
          </p>
        </div>
        <button
          onClick={onNewTripClick}
          className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-colors cursor-pointer"
        >
          + Plan New Trip
        </button>
      </div>
    );
  }

  // Active Trip Content
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-6">
      {/* Header bar with Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              Currently Active Trip
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
              {trip.category}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA] font-normal">
            {trip.title}
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
            <span>Destination:</span>
            <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">{trip.destination}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onLogExpenseClick && (
            <button
              onClick={onLogExpenseClick}
              className="px-4 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase hover:border-[#C84B26] text-[#18181B] dark:text-[#F4F1EA] transition-colors cursor-pointer"
            >
              + Log Expense
            </button>
          )}
          {onCompleteTrip && (
            <button
              onClick={() => onCompleteTrip(trip.$id || trip.id || "")}
              className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors cursor-pointer"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* Grid of Key Properties */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
          <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase text-[10px] block">Duration</span>
          <div className="text-sm font-semibold text-[#18181B] dark:text-[#F4F1EA]">
            {trip.startDate} → {trip.endDate}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
          <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase text-[10px] block">Allocated Budget</span>
          <div className="text-sm font-semibold text-[#C84B26] dark:text-[#E05A32]">
            {trip.currency} {trip.budget.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
          <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase text-[10px] block">Trip Status</span>
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
            {trip.status}
          </div>
        </div>
      </div>

      {/* Notes / Checklist Details */}
      {trip.notes && (
        <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block">
            Trip Notes & Route Details
          </span>
          <p className="text-xs text-[#18181B] dark:text-[#F4F1EA] whitespace-pre-line leading-relaxed font-light">
            {trip.notes}
          </p>
        </div>
      )}
    </div>
  );
}
