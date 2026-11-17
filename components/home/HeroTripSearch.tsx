"use client";

import { useState } from "react";
import CityAutocompleteInput from "@/components/ui/CityAutocompleteInput";

interface HeroTripSearchProps {
  onInitiatePlan: (searchData: {
    destination: string;
    startDate: string;
    endDate: string;
    travelers: string;
    preference: string;
  }) => void;
  initialDestination?: string;
}

const POPULAR_DESTINATIONS = [
  "Varanasi, Uttar Pradesh",
  "Lucknow, Uttar Pradesh",
  "Agra, Uttar Pradesh",
  "Ayodhya, Uttar Pradesh",
  "Jaipur, Rajasthan",
  "Rishikesh, Uttarakhand",
  "Munnar, Kerala",
  "Goa",
];

const PREFERENCES = [
  { id: "spiritual", label: "Spiritual & Heritage", icon: "✦" },
  { id: "scenic", label: "Scenic & Nature", icon: "⛰" },
  { id: "cultural", label: "Culture & Cuisine", icon: "♨" },
  { id: "relaxed", label: "Relaxed Pace / Senior", icon: "❧" },
  { id: "adventure", label: "Active Exploration", icon: "⚑" },
];

export default function HeroTripSearch({
  onInitiatePlan,
  initialDestination = "",
}: HeroTripSearchProps) {
  const [destination, setDestination] = useState(initialDestination);
  const [prevInitial, setPrevInitial] = useState(initialDestination);

  // Sync state when initialDestination changes externally (e.g. from showcase selection)
  if (initialDestination !== prevInitial) {
    setPrevInitial(initialDestination);
    setDestination(initialDestination);
  }
  
  // Set default dates: 1 week from now for 4 days
  const today = new Date();
  const defaultStart = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const defaultEnd = new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [travelers, setTravelers] = useState("2 Travellers (Couple)");
  const [preference, setPreference] = useState("Spiritual & Heritage");
  const [showTravelersMenu, setShowTravelersMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInitiatePlan({
      destination: destination || "Varanasi, Uttar Pradesh",
      startDate,
      endDate,
      travelers,
      preference,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Container with warm tactile styling & hover elevation */}
      <div className="bg-white/95 dark:bg-[#1A1B20]/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-[#E7E3DC] dark:border-[#26272D] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main 4-segment search bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Segment 1: Destination (5 cols) */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mb-1">
                Where to?
              </label>
              <div className="relative">
                <CityAutocompleteInput
                  value={destination}
                  onChange={setDestination}
                  placeholder="e.g. Varanasi, Lucknow, Jaipur, Munnar"
                  className="w-full"
                  inputClassName="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-sm text-[#18181B] dark:text-[#F4F1EA] placeholder-[#A1A1AA] focus:border-[#C84B26] focus:ring-1 focus:ring-[#C84B26] outline-none transition-colors"
                />
                <svg
                  className="w-4 h-4 text-[#C84B26] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Segment 2: Dates (3 cols) */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mb-1">
                Travel Dates
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#FAF8F5] dark:bg-[#121316] p-1 rounded-2xl border border-[#E7E3DC] dark:border-[#26272D]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#18181B] dark:text-[#F4F1EA] px-2 py-1.5 focus:outline-none"
                  aria-label="Start date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#18181B] dark:text-[#F4F1EA] px-2 py-1.5 focus:outline-none"
                  aria-label="End date"
                />
              </div>
            </div>

            {/* Segment 3: Travellers (2 cols) */}
            <div className="md:col-span-2 relative">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mb-1">
                Travellers
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowTravelersMenu(!showTravelersMenu);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-left text-xs font-medium text-[#18181B] dark:text-[#F4F1EA] flex items-center justify-between hover:border-[#C84B26] transition-colors truncate"
              >
                <span className="truncate">{travelers.split(" ")[0]} {travelers.split(" ")[1]}</span>
                <svg className="w-3 h-3 flex-shrink-0 text-[#71717A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showTravelersMenu && (
                <div className="absolute top-full left-0 w-52 mt-1.5 bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-2xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  {[
                    "1 Traveller (Solo)",
                    "2 Travellers (Couple)",
                    "3–4 Travellers (Group)",
                    "Family with Seniors",
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setTravelers(option);
                        setShowTravelersMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                        travelers === option
                          ? "bg-[#C84B26]/10 text-[#C84B26] font-medium scale-[1.01]"
                          : "hover:bg-[#FAF8F5] dark:hover:bg-[#25272F] text-[#18181B] dark:text-[#F4F1EA]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Segment 4: CTA Button (3 cols) */}
            <div className="md:col-span-3 pt-2 md:pt-4">
              <button
                type="submit"
                className="w-full py-3 px-5 rounded-2xl bg-[#C84B26] hover:bg-[#B33F1D] dark:bg-[#E05A32] dark:hover:bg-[#C84B26] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Generate Plan</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Bar: Trip Preferences & Quick Chips */}
          <div className="pt-3 border-t border-[#E7E3DC]/60 dark:border-[#26272D]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Quick Preference Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider mr-1">
                Style:
              </span>
              {PREFERENCES.map((pref) => {
                const isSelected = preference === pref.label;
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setPreference(pref.label)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-[#C84B26] text-white font-medium shadow-xs"
                        : "bg-[#FAF8F5] dark:bg-[#121316] text-[#52525B] dark:text-[#A1A1AA] border border-[#E7E3DC] dark:border-[#26272D] hover:border-[#C84B26]"
                    }`}
                  >
                    <span>{pref.icon}</span>
                    <span>{pref.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Destination Chips */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#71717A] dark:text-[#A1A1AA]">
              <span className="font-mono text-[10px] uppercase">Popular:</span>
              {POPULAR_DESTINATIONS.slice(0, 3).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setDestination(city)}
                  className="hover:text-[#C84B26] underline underline-offset-2 decoration-[#E7E3DC] hover:decoration-[#C84B26] transition-colors cursor-pointer"
                >
                  {city.split(",")[0]}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
