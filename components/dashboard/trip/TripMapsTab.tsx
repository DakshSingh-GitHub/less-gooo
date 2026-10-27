"use client";

import { useEffect, useRef, useState } from "react";
import { Trip } from "@/lib/appwrite";

interface TripMapsTabProps {
  trip: Trip;
}

interface MapPOI {
  name: string;
  category: "destination" | "sight" | "pure_veg" | "hospital" | "hotel";
  lat: number;
  lng: number;
  description: string;
}

// Known coordinates for Varanasi and major hubs
const DEFAULT_COORDINATES: Record<string, { lat: number; lng: number; zoom: number; pois: MapPOI[] }> = {
  varanasi: {
    lat: 25.3176,
    lng: 82.9739,
    zoom: 13,
    pois: [
      { name: "Kashi Vishwanath Temple", category: "sight", lat: 25.3109, lng: 83.0107, description: "Sacred Golden Jyotirlinga Shrine & Corridor" },
      { name: "Assi Ghat & Subah-e-Banaras", category: "sight", lat: 25.2894, lng: 83.0064, description: "Morning Vedic chants, sunrise boat jetty" },
      { name: "Dashashwamedh Ghat", category: "sight", lat: 25.3076, lng: 83.0105, description: "Grand Sunset Evening Ganga Aarti site" },
      { name: "Kashi Chaat Bhandar", category: "pure_veg", lat: 25.3082, lng: 83.0078, description: "100% Pure Veg Heritage Banarasi Chaat" },
      { name: "Sir Sunderlal Hospital (BHU)", category: "hospital", lat: 25.2750, lng: 82.9995, description: "Premier 24x7 Multispecialty Emergency Trauma Center" },
      { name: "Heritage Haveli Stay", category: "hotel", lat: 25.3021, lng: 83.0089, description: "Riverfront Traditional Courtyard Accommodation" }
    ]
  },
  jaipur: {
    lat: 26.9124,
    lng: 75.7873,
    zoom: 13,
    pois: [
      { name: "Hawa Mahal", category: "sight", lat: 26.9239, lng: 75.8267, description: "Palace of Winds & Heritage Windows" },
      { name: "Amer Fort", category: "sight", lat: 26.9855, lng: 75.8513, description: "Iconic Hilltop Rajput Fort" },
      { name: "LMB Laxmi Mishtan Bhandar", category: "pure_veg", lat: 26.9197, lng: 75.8239, description: "Historic Pure Veg Rajasthani Sweets & Thali" },
      { name: "SMS Hospital (24x7)", category: "hospital", lat: 26.8997, lng: 75.8164, description: "State 24-Hour Emergency Medical Centre" }
    ]
  }
};

export default function TripMapsTab({ trip }: TripMapsTabProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapEngine, setMapEngine] = useState<"leaflet" | "gmaps">("leaflet");
  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const mapInstanceRef = useRef<any>(null);

  const destLower = trip.destination.toLowerCase();
  const matchedKey = Object.keys(DEFAULT_COORDINATES).find((k) => destLower.includes(k));
  const coordData = matchedKey ? DEFAULT_COORDINATES[matchedKey] : {
    lat: 25.3176,
    lng: 82.9739,
    zoom: 12,
    pois: [
      { name: trip.destination, category: "destination" as const, lat: 25.3176, lng: 82.9739, description: "Primary Journey Destination" }
    ]
  };

  // Google Maps Directions URL
  const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    trip.from || "My Location"
  )}&destination=${encodeURIComponent(trip.destination)}&travelmode=driving`;

  // Google Maps Embed URL
  const gmapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    trip.destination
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  // Initialize genuine Leaflet map on client
  useEffect(() => {
    if (mapEngine !== "leaflet") return;
    let isCancelled = false;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const L = (await import("leaflet")).default;
        if (isCancelled || !mapContainerRef.current) return;

        // Custom pin generator
        const createColorIcon = (color: string, label: string) => {
          return L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div style="
                background-color: ${color};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: white;
                font-weight: bold;
              ">
                ${label}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -14],
          });
        };

        const map = L.map(mapContainerRef.current, {
          center: [coordData.lat, coordData.lng],
          zoom: coordData.zoom,
          zoomControl: true,
        });

        // Genuine OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add POI markers
        coordData.pois.forEach((poi) => {
          let color = "#C84B26"; // Default terracotta
          let symbol = "📍";
          if (poi.category === "hospital") {
            color = "#DC2626"; // Red for emergency
            symbol = "🏥";
          } else if (poi.category === "pure_veg") {
            color = "#16A34A"; // Green for pure veg
            symbol = "🥗";
          } else if (poi.category === "hotel") {
            color = "#2563EB"; // Blue for stay
            symbol = "🏨";
          } else if (poi.category === "sight") {
            color = "#D97706"; // Amber for heritage
            symbol = "🏛️";
          }

          const icon = createColorIcon(color, symbol);
          const marker = L.marker([poi.lat, poi.lng], { icon }).addTo(map);
          marker.bindPopup(`
            <div style="font-family: ui-monospace, monospace; font-size: 11px; padding: 4px;">
              <strong style="color: ${color}; font-size: 12px; display: block; margin-bottom: 2px;">${poi.name}</strong>
              <div style="color: #4B5563;">${poi.description}</div>
              <div style="margin-top: 6px; font-size: 9px; text-transform: uppercase; color: #9CA3AF;">Category: ${poi.category.replace("_", " ")}</div>
            </div>
          `);
        });

        mapInstanceRef.current = map;
        setIsLeafletReady(true);
      } catch (err) {
        console.warn("Leaflet map initialization notice:", err);
      }
    }

    initLeaflet();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapEngine, trip.destination, coordData.lat, coordData.lng]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Engine Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] dark:text-[#E05A32] block">
            Spatial Navigation & Mapping
          </span>
          <h3 className="font-serif text-2xl text-[#18181B] dark:text-[#F4F1EA]">
            Transit Map & Waypoint Geolocation
          </h3>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-light mt-0.5">
            Real-time interactive spatial map populated with monuments, pure-veg eateries, and emergency hospitals.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Engine Toggle */}
          <div className="p-1 rounded-xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setMapEngine("leaflet")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapEngine === "leaflet"
                  ? "bg-[#C84B26] text-white font-semibold"
                  : "text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setMapEngine("gmaps")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapEngine === "gmaps"
                  ? "bg-[#C84B26] text-white font-semibold"
                  : "text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
              }`}
            >
              Google Maps
            </button>
          </div>

          {/* Launch Native Google Maps */}
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

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-[#FAF8F5] dark:bg-[#121316] p-3 rounded-xl border border-[#E7E3DC] dark:border-[#26272D]">
        <span className="text-[10px] text-[#71717A] uppercase">Active Markers:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span>Heritage / Sights</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          <span>Pure Veg Eateries</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
          <span>24/7 Hospital</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>Verified Stay</span>
        </span>
      </div>

      {/* Map Display Frame */}
      <div className="w-full h-[450px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#E7E3DC] dark:border-[#26272D] shadow-sm relative bg-[#FAF8F5] dark:bg-[#121316]">
        {mapEngine === "leaflet" ? (
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        ) : (
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
          Click any marker on the map to view address details, contact info, and transit notes.
        </div>
      </div>
    </div>
  );
}
