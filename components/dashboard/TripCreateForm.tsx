"use client";

import { useState } from "react";
import { Trip } from "@/lib/appwrite";

interface TripCreateFormProps {
  userId: string;
  onTripCreated: (trip: Trip) => void;
  onCancel: () => void;
}

const CATEGORIES = ["Solo", "Family", "Business", "Vacation", "Spiritual", "Adventure"];
const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" }
];

export default function TripCreateForm({
  userId,
  onTripCreated,
  onCancel,
}: TripCreateFormProps) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Vacation");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [status, setStatus] = useState<"upcoming" | "active">("upcoming");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !destination.trim() || !startDate || !endDate) {
      setErrorMsg("Please complete all required fields: Title, Destination, and Dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg("Start date cannot be after end date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const payload: Omit<Trip, "$id"> = {
        userId,
        title: title.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        category,
        budget: parseFloat(budget) || 0,
        currency,
        status,
        notes: notes.trim(),
        createdAt: now,
        updatedAt: now,
      };

      const { createTripInDb } = await import("@/lib/appwrite");
      const created = await createTripInDb(payload);
      if (created) {
        onTripCreated(created);
      } else {
        throw new Error("Unable to save trip. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create trip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm space-y-6 max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Trip Planner
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#18181B] dark:text-[#F4F1EA]">
            Plan a New Journey
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-mono text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA]"
        >
          Cancel
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Title & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Trip Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Coastal Heritage Tour"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="e.g. Jaipur, Rajasthan"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>
        </div>

        {/* Row 2: Start & End Date */}
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

        {/* Row 3: Category & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3.5 pr-9 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#71717A] dark:text-[#A1A1AA]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Budget Allocation
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 15000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-11 px-3.5 pr-9 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] appearance-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#71717A] dark:text-[#A1A1AA]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Status Setting with Single Active Rule Notice */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-2">
          <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
            Initial Status
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStatus("upcoming")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                status === "upcoming"
                  ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-semibold"
                  : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]"
              }`}
            >
              Upcoming Trip
            </button>
            <button
              type="button"
              onClick={() => setStatus("active")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                status === "active"
                  ? "bg-[#C84B26] text-white font-semibold shadow-sm"
                  : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A]"
              }`}
            >
              Active Trip (Ongoing)
            </button>
          </div>
          {status === "active" && (
            <p className="text-[11px] text-[#C84B26] dark:text-[#E05A32] font-mono leading-normal">
              Notice: Setting this trip as Active will automatically transition any other ongoing trip to upcoming.
            </p>
          )}
        </div>

        {/* Row 5: Notes & Checklist */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
            Notes / Route Checklist / Details
          </label>
          <textarea
            rows={3}
            placeholder="Add key packing notes, specific monuments to visit, or transit requirements..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Saving to Database..." : "Save Trip to LessGooo"}
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
