"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Trip, PlanSpecifications } from "@/lib/appwrite";
import { getAutomatedTripStatus } from "@/lib/tripDateUtils";
import { reverseGeocodeToCity } from "@/lib/cityService";
import { calculateSingleLegTransitCost } from "@/lib/transitEngine";
import CityAutocompleteInput from "@/components/ui/CityAutocompleteInput";
import PlanSpecificationsEditor, { DEFAULT_SPECS } from "@/components/dashboard/trip/PlanSpecificationsEditor";

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
  const [fromLocation, setFromLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Vacation");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [notes, setNotes] = useState("");
  const [specs, setSpecs] = useState<PlanSpecifications>(DEFAULT_SPECS);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const automatedStatus =
    startDate && endDate ? getAutomatedTripStatus(startDate, endDate) : null;

  // Auto-detect current location
  const detectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus("Detecting city from GPS...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const cityString = await reverseGeocodeToCity(latitude, longitude);
          if (cityString) {
            setFromLocation(cityString);
            setLocationStatus("Auto-filled city from GPS");
            setIsDetectingLocation(false);
            return;
          }
        } catch {}
        setLocationStatus("Could not resolve city. Please type city name.");
        setIsDetectingLocation(false);
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationStatus("Permission denied. Set location manually.");
        } else {
          setLocationStatus("Could not detect location. Set manually.");
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

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
      const computedStatus = getAutomatedTripStatus(startDate, endDate);

      const fromPlace = fromLocation.trim() || "Current Location";
      const destPlace = destination.trim();

      const approachingCalc = calculateSingleLegTransitCost(
        specs.approachingTransitMode || "self_car",
        fromPlace,
        destPlace,
        "approaching",
        specs.passengersCount,
        specs.approachingCarFuelType || "petrol"
      );

      const departureCalc = calculateSingleLegTransitCost(
        specs.departureTransitMode || "self_car",
        fromPlace,
        destPlace,
        "departure",
        specs.passengersCount,
        specs.departureCarFuelType || "petrol"
      );

      const payload: Omit<Trip, "$id"> = {
        userId,
        title: title.trim(),
        from: fromPlace,
        destination: destPlace,
        startDate,
        endDate,
        category,
        budget: parseFloat(budget) || 0,
        currency,
        status: computedStatus,
        notes: notes.trim(),
        specifications: specs,
        approachingTransitCost: approachingCalc,
        departureTransitCost: departureCalc,
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
        {/* Row 1: Trip Title */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
            Trip Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Coastal Heritage Tour / Kashi Spiritual Sojourn"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
          />
        </div>

        {/* Row 2: From (Origin) & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
                From (Starting Location) *
              </label>
              <button
                type="button"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="text-[10px] font-mono text-[#C84B26] hover:text-[#B33F1D] flex items-center gap-1 cursor-pointer"
              >
                <svg className={`w-3 h-3 ${isDetectingLocation ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{isDetectingLocation ? "Detecting..." : "Detect Location"}</span>
              </button>
            </div>
            <div className="relative">
              <CityAutocompleteInput
                value={fromLocation}
                onChange={(val) => {
                  setFromLocation(val);
                  setLocationStatus("Manually specified");
                }}
                placeholder="e.g. New Delhi, Delhi"
                required
              />
            </div>
            {locationStatus && (
              <span className="text-[10px] font-mono text-[#71717A] dark:text-[#A1A1AA] mt-1 block">
                {locationStatus}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1">
              Destination *
            </label>
            <CityAutocompleteInput
              value={destination}
              onChange={(val) => setDestination(val)}
              placeholder="e.g. Varanasi, Uttar Pradesh"
              required
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

        {/* Row 4: Automated Status Preview */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
              Automated Trip Status
            </label>
            {automatedStatus && (
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono uppercase font-semibold ${
                  automatedStatus === "active"
                    ? "bg-[#C84B26] text-white"
                    : automatedStatus === "completed"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316]"
                }`}
              >
                {automatedStatus === "active"
                  ? "Active Trip (Ongoing)"
                  : automatedStatus === "completed"
                  ? "Completed Trip"
                  : "Upcoming Trip"}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] font-mono leading-normal">
            {!automatedStatus &&
              "Select start and end dates — your trip will automatically activate when the start date arrives and deactivate after the end date."}
            {automatedStatus === "active" &&
              "Today falls within your selected dates. This trip will automatically be set as Active (and any previous active trip will transition to upcoming)."}
            {automatedStatus === "upcoming" &&
              "Your start date is in the future. This trip will be saved as Upcoming and will automatically activate on its start date."}
            {automatedStatus === "completed" &&
              "The selected end date has already passed, so this trip will be archived as Completed."}
          </p>
        </div>

        {/* Row 5: Plan Specifications & Dual-Leg Transit */}
        <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E3DC]/60 dark:border-[#26272D]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
                Required Specifications
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#18181B] dark:text-[#F4F1EA]">
                Plan Specifications & Transit Preferences
              </h3>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
                Define your transportation modes, daily pace, dining preferences, and safety waypoints right with trip creation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSpecsExpanded((prev) => !prev)}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isSpecsExpanded ? "Hide Details" : "Customize Specs"}</span>
              <span className="text-[10px]">{isSpecsExpanded ? "▲" : "▼"}</span>
            </button>
          </div>

          {/* Quick specs summary badge pills */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
              Inbound: <strong className="text-[#C84B26] dark:text-[#E05A32] uppercase">{specs.approachingTransitMode.replace("_", " ")}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
              Return: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{specs.departureTransitMode.replace("_", " ")}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
              Travelers: <strong className="text-[#18181B] dark:text-[#F4F1EA]">{specs.passengersCount} Pax</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
              Pace: <strong className="text-[#18181B] dark:text-[#F4F1EA] capitalize">{specs.pace}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA]">
              Diet: <strong className="text-[#18181B] dark:text-[#F4F1EA]">{specs.dietaryPreference === "pure_veg" ? "Pure Veg 🥗" : "All Cuisines 🍽️"}</strong>
            </span>
          </div>

          {isSpecsExpanded && (
            <div className="pt-2 animate-fadeIn">
              <PlanSpecificationsEditor
                specs={specs}
                onChangeSpecs={setSpecs}
                fromLocation={fromLocation}
                destination={destination}
              />
            </div>
          )}
        </div>

        {/* Row 6: Notes & Checklist */}
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
