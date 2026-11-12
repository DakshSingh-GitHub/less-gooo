"use client";

import { useEffect, useState } from "react";
import { Trip } from "@/lib/appwrite";
import LiveNavigationMap from "@/components/dashboard/trip/LiveNavigationMap";

interface TripMapsTabProps {
  trip: Trip;
}

export default function TripMapsTab({ trip }: TripMapsTabProps) {
  const [detectedOrigin, setDetectedOrigin] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Resolve origin automatically: prefer explicit trip.from, otherwise auto-detect GPS coordinates
  const explicitFrom =
    trip.from && trip.from.trim() && trip.from.trim().toLowerCase() !== "current location"
      ? trip.from.trim()
      : "";
  const sourceLocation = explicitFrom || detectedOrigin || "";

  useEffect(() => {
    if (explicitFrom || typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedOrigin(`${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`);
      },
      () => {
        // Fallback silently if geolocation is unavailable or denied
      },
      { timeout: 6000, enableHighAccuracy: false }
    );
  }, [explicitFrom]);

  // Google Maps Directions URL (automatically sets origin, destination, and starts navigation)
  const gmapsDirectionsUrl = sourceLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        sourceLocation
      )}&destination=${encodeURIComponent(trip.destination)}&travelmode=driving&dir_action=navigate`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        trip.destination
      )}&travelmode=driving&dir_action=navigate`;

  // Google Maps Embed URL (automatically sets both source (saddr) and destination (daddr) route)
  const gmapsEmbedUrl = sourceLocation
    ? `https://maps.google.com/maps?saddr=${encodeURIComponent(
        sourceLocation
      )}&daddr=${encodeURIComponent(trip.destination)}&dirflg=d&output=embed`
    : `https://maps.google.com/maps?saddr=${encodeURIComponent(
        "My Location"
      )}&daddr=${encodeURIComponent(trip.destination)}&dirflg=d&output=embed`;

  // Start turn-by-turn navigation directly inside the integrated map (no new tab)
  const handleStartInAppNavigation = () => {
    setIsNavigating(true);

    if (!explicitFrom && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectedOrigin(`${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`);
        },
        () => {},
        { timeout: 6000, enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Spatial Navigation & Mapping
          </span>
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            Google Maps & Live Navigation
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
            Automatically routed from your source to destination with in-app turn-by-turn navigation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={gmapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] text-xs font-mono uppercase font-semibold hover:bg-[#C84B26] transition-colors flex items-center gap-1.5"
          >
            <span>Open in GMaps</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* Map Display Frame */}
      <div className="w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-sm relative bg-[#FAF8F5] dark:bg-[#121316]">
        {isNavigating ? (
          <LiveNavigationMap
            origin={sourceLocation || "My Location"}
            destination={trip.destination}
            onExit={() => setIsNavigating(false)}
          />
        ) : (
          <>
            <iframe
              src={gmapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Navigation"
            />

            {/* Floating Route & Start Navigation Overlay on Map */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
              <div className="pointer-events-auto px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#1A1B20]/95 backdrop-blur-md border border-[#E7E3DC] dark:border-[#26272D] shadow-lg flex items-center gap-2 text-xs font-mono max-w-full overflow-hidden">
                <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
                <span className="truncate text-[#18181B] dark:text-[#F4F1EA] font-medium">
                  {sourceLocation || "Current Location"} ➔ {trip.destination}
                </span>
              </div>

              <button
                type="button"
                onClick={handleStartInAppNavigation}
                className="pointer-events-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Start</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Corridor Route Details Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#71717A]">Transit Route:</span>
          <span className="font-semibold text-[#18181B] dark:text-[#F4F1EA]">
            {trip.from || "Starting Origin"} ➔ {trip.destination}
          </span>
        </div>
        <div className="text-[#71717A]">
          Click Start on the map for live turn-by-turn navigation.
        </div>
      </div>
    </div>
  );
}
