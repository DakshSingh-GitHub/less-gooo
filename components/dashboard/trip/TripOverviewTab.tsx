"use client";

import { useState } from "react";
import { Trip } from "@/lib/appwrite";

interface TripOverviewTabProps {
  trip: Trip;
  onSelectTab: (tab: "overview" | "edit-settings" | "maps" | "specifications" | "proposed-plan") => void;
  onLogExpenseClick?: () => void;
  onCompleteTrip?: (tripId: string, overrideEndDate?: string) => void;
}

export default function TripOverviewTab({
  trip,
  onSelectTab,
  onLogExpenseClick,
  onCompleteTrip,
}: TripOverviewTabProps) {
  const specs = trip.specifications;
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [overrideDate, setOverrideDate] = useState(true);
  const [completionDate, setCompletionDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmCompletion = () => {
    if (!onCompleteTrip) return;
    setIsSubmitting(true);
    const finalEndDate = overrideDate ? completionDate : trip.endDate;
    onCompleteTrip(trip.$id || trip.id || "", finalEndDate);
    setShowCompleteModal(false);
    setIsSubmitting(false);
  };

  const isEarly = new Date(today) < new Date(trip.endDate);
  const isDifferentDate = today !== trip.endDate;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Route */}
      <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              Ongoing Active Journey
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]">
              {trip.category}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA]">
            {trip.title}
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
            <span>Transit Corridor:</span>
            <span className="text-[#18181B] dark:text-[#F4F1EA] font-semibold">
              {trip.from ? `${trip.from} ➔ ` : ""}
              {trip.destination}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onLogExpenseClick && (
            <button
              onClick={onLogExpenseClick}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase hover:border-[#C84B26] text-[#18181B] dark:text-[#F4F1EA] transition-colors cursor-pointer"
            >
              + Log Expense
            </button>
          )}
          {onCompleteTrip && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="px-4 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors cursor-pointer"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* 3-Column Key Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
          <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase text-[10px] block">Duration</span>
          <div className="text-sm font-semibold text-[#18181B] dark:text-[#F4F1EA]">
            {trip.startDate} → {trip.endDate}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
          <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase text-[10px] block">Allocated Budget</span>
          <div className="text-sm font-semibold text-[#C84B26] dark:text-[#E05A32]">
            {trip.currency} {trip.budget.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-1">
          <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase text-[10px] block">Live Status</span>
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
            Active / In Transit
          </div>
        </div>
      </div>

      {/* Plan Specifications Highlights Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7E3DC]/60 dark:border-[#26272D]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">
            Active Plan Preferences & Safety Shields
          </span>
          <button
            onClick={() => onSelectTab("specifications")}
            className="text-xs font-mono text-[#C84B26] hover:underline cursor-pointer"
          >
            Configure Specifications →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
            <span className="text-[10px] text-[#71717A] uppercase block">Pace</span>
            <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA] capitalize">
              {specs?.pace || "Moderate"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
            <span className="text-[10px] text-[#71717A] uppercase block">Dietary Standard</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {specs?.dietaryPreference === "pure_veg" ? "Pure Vegetarian (Satvik)" : "Multi-Cuisine"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
            <span className="text-[10px] text-[#71717A] uppercase block">Emergency Care</span>
            <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
              {specs?.necessities?.hospital !== false ? "24x7 Hospital Mapped" : "Standard"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D]">
            <span className="text-[10px] text-[#71717A] uppercase block">Proposed Plan</span>
            <span className="font-semibold text-[#C84B26]">
              {trip.proposedPlan && trip.proposedPlan.length > 0
                ? `${trip.proposedPlan.length} Days Ready`
                : "Not Generated Yet"}
            </span>
          </div>
        </div>
      </div>

      {/* Notes / Route Checklist Details */}
      {trip.notes && (
        <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block">
            Trip Field Notes & Directives
          </span>
          <p className="text-xs text-[#18181B] dark:text-[#F4F1EA] whitespace-pre-line leading-relaxed font-light">
            {trip.notes}
          </p>
        </div>
      )}

      {/* Complete Trip Confirmation Dialogue Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
                Journey Conclusion Dialogue
              </span>
              <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
                Mark &ldquo;{trip.title}&rdquo; as Completed?
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light">
                This action will conclude your live trip session and transfer the journey chronicle to your Completed Trips archive.
              </p>
            </div>

            {/* Date Constraint Override Panel */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E3DC]/60 dark:border-[#26272D]">
                <span className="text-[#71717A] uppercase text-[10px]">Scheduled Dates</span>
                <span className="text-[#18181B] dark:text-[#F4F1EA] font-semibold">
                  {trip.startDate} → {trip.endDate}
                </span>
              </div>

              {isDifferentDate && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <span>⚡</span>
                    <span>Date Constraint Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-sans">
                    {isEarly
                      ? `The scheduled end date was ${trip.endDate}, but you are concluding this trip early today (${today}).`
                      : `The scheduled end date was ${trip.endDate}, concluding on current date (${today}).`}
                  </p>
                </div>
              )}

              {/* Date Override Controls */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideDate}
                    onChange={(e) => setOverrideDate(e.target.checked)}
                    className="w-4 h-4 accent-[#C84B26] rounded cursor-pointer"
                  />
                  <span className="text-xs text-[#18181B] dark:text-[#F4F1EA]">
                    Override schedule constraint and finalize as of:
                  </span>
                </label>

                {overrideDate && (
                  <div className="pt-1 pl-6">
                    <input
                      type="date"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-[#E7E3DC] dark:border-[#26272D] bg-white dark:bg-[#1A1B20] text-xs font-mono text-[#18181B] dark:text-[#F4F1EA] focus:outline-none focus:border-[#C84B26]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmCompletion}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer text-center"
              >
                {isSubmitting ? "Finalizing Trip..." : "Confirm & Mark Completed"}
              </button>
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="px-5 py-3 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
