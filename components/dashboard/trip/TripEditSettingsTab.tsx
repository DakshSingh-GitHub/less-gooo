"use client";

import { useState } from "react";
import { Trip, updateTripInDb } from "@/lib/appwrite";

interface TripEditSettingsTabProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  onCancel: () => void;
}

const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" }
];

export default function TripEditSettingsTab({
  trip,
  onUpdateTrip,
  onCancel,
}: TripEditSettingsTabProps) {
  const [title, setTitle] = useState(trip.title);
  const [from, setFrom] = useState(trip.from || "");
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [budget, setBudget] = useState(trip.budget.toString());
  const [currency, setCurrency] = useState(trip.currency || "INR");
  const [notes, setNotes] = useState(trip.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!title.trim() || !destination.trim() || !startDate || !endDate) {
      setErrorMessage("Please complete all required fields: Title, Destination, and Dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMessage("Start date cannot be after end date.");
      return;
    }

    setIsSaving(true);
    try {
      const tripId = trip.$id || trip.id;
      if (!tripId) throw new Error("Trip identifier missing");

      const updates: Partial<Trip> = {
        title: title.trim(),
        from: from.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        budget: parseFloat(budget) || 0,
        currency,
        notes: notes.trim(),
      };

      const updated = await updateTripInDb(tripId, trip.userId, updates);
      if (updated) {
        onUpdateTrip(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        // Local fallback
        const localUpdated: Trip = { ...trip, ...updates, updatedAt: new Date().toISOString() };
        onUpdateTrip(localUpdated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to save trip settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-6 max-w-3xl animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Trip Configuration
          </span>
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            Edit Active Trip Settings
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
            Modify allocated financial bounds, start/end itinerary schedules, and field notes.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-2">
          <span>✓</span>
          <span>Trip settings updated successfully.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-mono text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
            Trip Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
          />
        </div>

        {/* From & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Starting Location (From)
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. New Delhi, India"
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Destination *
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              End Date *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>
        </div>

        {/* Budget & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Allocated Budget Runway *
            </label>
            <input
              type="number"
              min="0"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field Notes */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
            Trip Field Notes & Directives
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-3 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving Updates..." : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
