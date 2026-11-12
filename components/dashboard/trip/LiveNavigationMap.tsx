"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface LiveNavigationMapProps {
  origin: string;
  destination: string;
  onExit: () => void;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface NavStep {
  instruction: string;
  name: string;
  distance: number;
  duration: number;
  maneuverType: string;
  maneuverModifier?: string;
  location: LatLng;
}

interface RouteData {
  coordinates: [number, number][];
  totalDistance: number;
  totalDuration: number;
  steps: NavStep[];
  originCoord: LatLng;
  destCoord: LatLng;
}

function parseLatLngString(value: string): LatLng | null {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

async function geocodePlace(query: string): Promise<LatLng | null> {
  const parsed = parseLatLngString(query);
  if (parsed) return parsed;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function calculateBearing(from: LatLng, to: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const y = Math.sin(toRad(to.lng - from.lng)) * Math.cos(toRad(to.lat));
  const x =
    Math.cos(toRad(from.lat)) * Math.sin(toRad(to.lat)) -
    Math.sin(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.cos(toRad(to.lng - from.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)} m`;
  const km = meters / 1000;
  return km >= 100 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs} hr ${remMins} min` : `${hrs} hr`;
}

function formatEta(secondsRemaining: number): string {
  const eta = new Date(Date.now() + secondsRemaining * 1000);
  return eta.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildStepInstruction(type: string, modifier: string | undefined, name: string): string {
  const road = name ? ` onto ${name}` : "";
  if (type === "depart") return name ? `Head toward ${name}` : "Start route";
  if (type === "arrive") return "Arrive at destination";
  if (type === "roundabout" || type === "rotary") return `Enter roundabout${road}`;
  if (modifier === "uturn") return `Make a U-turn${road}`;
  if (modifier === "sharp left") return `Turn sharp left${road}`;
  if (modifier === "left") return `Turn left${road}`;
  if (modifier === "slight left") return `Keep left${road}`;
  if (modifier === "sharp right") return `Turn sharp right${road}`;
  if (modifier === "right") return `Turn right${road}`;
  if (modifier === "slight right") return `Keep right${road}`;
  return name ? `Continue on ${name}` : "Continue straight";
}

function ManeuverIcon({ type, modifier }: { type: string; modifier?: string }) {
  if (type === "arrive") {
    return (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (modifier?.includes("left")) {
    return (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V9a2 2 0 00-2-2H4m0 0l4-4M4 7l4 4" />
      </svg>
    );
  }
  if (modifier?.includes("right")) {
    return (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19V9a2 2 0 012-2h3m0 0l-4-4m4 4l-4 4" />
      </svg>
    );
  }
  if (modifier === "uturn") {
    return (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V9a4 4 0 018 0v8m0 0l-3-3m3 3l3-3" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-5 5m5-5l5 5" />
    </svg>
  );
}

function createCarHeadIconHtml(headingDeg: number): string {
  return `
    <div style="
      position: relative;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${headingDeg}deg);
      transition: transform 0.25s ease-out;
    ">
      <div style="
        position: absolute;
        top: 0;
        width: 34px;
        height: 30px;
        background: linear-gradient(to top, rgba(26,115,232,0.38), rgba(26,115,232,0));
        clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
        pointer-events: none;
      "></div>
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #FFFFFF;
        box-shadow: 0 3px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #E5E7EB;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1A73E8">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
        </svg>
      </div>
    </div>
  `;
}

export default function LiveNavigationMap({
  origin,
  destination,
  onExit,
}: LiveNavigationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const carMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [distanceToTurn, setDistanceToTurn] = useState<number>(0);
  const [remainingDistance, setRemainingDistance] = useState<number>(0);
  const [remainingDuration, setRemainingDuration] = useState<number>(0);
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(true);

  // 1. Geocode origin & destination and fetch real OSRM turn-by-turn route
  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      setLoading(true);
      setError(null);

      try {
        const [orig, dest] = await Promise.all([
          geocodePlace(origin || "My Location"),
          geocodePlace(destination),
        ]);

        if (cancelled) return;
        if (!orig || !dest) {
          setError("Could not resolve source or destination coordinates for turn-by-turn routing.");
          setLoading(false);
          return;
        }

        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${orig.lng},${orig.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(osrmUrl);
        if (!res.ok) throw new Error("Routing service unavailable");
        const json = await res.json();
        const route = json?.routes?.[0];
        if (!route?.geometry?.coordinates?.length) {
          throw new Error("No drivable route found between these locations.");
        }

        const coords: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        const rawSteps = route.legs?.[0]?.steps || [];
        const steps: NavStep[] = rawSteps.map((s: {
          name?: string;
          distance: number;
          duration: number;
          maneuver: { type: string; modifier?: string; location: [number, number] };
        }) => ({
          instruction: buildStepInstruction(s.maneuver.type, s.maneuver.modifier, s.name || ""),
          name: s.name || "",
          distance: s.distance,
          duration: s.duration,
          maneuverType: s.maneuver.type,
          maneuverModifier: s.maneuver.modifier,
          location: {
            lat: s.maneuver.location[1],
            lng: s.maneuver.location[0],
          },
        }));

        const initialHeading =
          coords.length >= 2
            ? calculateBearing(
                { lat: coords[0][0], lng: coords[0][1] },
                { lat: coords[1][0], lng: coords[1][1] }
              )
            : 0;

        if (cancelled) return;
        setRouteData({
          coordinates: coords,
          totalDistance: route.distance,
          totalDuration: route.duration,
          steps,
          originCoord: orig,
          destCoord: dest,
        });
        setCurrentPos(orig);
        setHeading(initialHeading);
        setCurrentStepIdx(steps.length > 1 ? 1 : 0);
        setDistanceToTurn(steps[0]?.distance || 0);
        setRemainingDistance(route.distance);
        setRemainingDuration(route.duration);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to initialize live navigation.");
          setLoading(false);
        }
      }
    }

    loadRoute();
    return () => {
      cancelled = true;
    };
  }, [origin, destination]);

  // 2. Initialize Leaflet map with route polyline, destination pin, and car-head arrow
  useEffect(() => {
    if (!routeData || !containerRef.current) return;
    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || !routeData) return;
      leafletRef.current = L;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const startLatLng: [number, number] = [routeData.originCoord.lat, routeData.originCoord.lng];
      const map = L.map(containerRef.current, {
        center: startLatLng,
        zoom: 16,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      // Google-Maps-style route casing + blue polyline
      L.polyline(routeData.coordinates, {
        color: "#1557B0",
        weight: 10,
        opacity: 0.9,
      }).addTo(map);

      L.polyline(routeData.coordinates, {
        color: "#4285F4",
        weight: 6,
        opacity: 1,
      }).addTo(map);

      // Destination marker
      const destIcon = L.divIcon({
        className: "nav-dest-pin",
        html: `
          <div style="
            width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
            background: #EA4335; border: 2px solid #fff;
            transform: rotate(-45deg);
            box-shadow: 0 3px 8px rgba(0,0,0,0.35);
          "></div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      L.marker([routeData.destCoord.lat, routeData.destCoord.lng], { icon: destIcon }).addTo(map);

      // Car-head arrow marker
      const carIcon = L.divIcon({
        className: "nav-car-head",
        html: createCarHeadIconHtml(heading),
        iconSize: [56, 56],
        iconAnchor: [28, 28],
      });
      const carMarker = L.marker(startLatLng, { icon: carIcon, zIndexOffset: 1000 }).addTo(map);
      carMarkerRef.current = carMarker;

      map.on("dragstart", () => {
        setIsFollowing(false);
      });

      mapRef.current = map;
    }

    initMap();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      carMarkerRef.current = null;
    };
  }, [routeData]);

  // 3. Watch live GPS position & update car-head arrow, bearing, and next turn step
  useEffect(() => {
    if (!routeData || typeof window === "undefined" || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const livePos: LatLng = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentPos(livePos);

        // Find nearest upcoming step
        let bestStepIdx = 0;
        let minStepDist = Infinity;
        routeData.steps.forEach((step, idx) => {
          const d = haversineMeters(livePos, step.location);
          if (d < minStepDist) {
            minStepDist = d;
            bestStepIdx = idx;
          }
        });

        const nextIdx = Math.min(bestStepIdx + 1, routeData.steps.length - 1);
        setCurrentStepIdx(nextIdx);
        setDistanceToTurn(haversineMeters(livePos, routeData.steps[nextIdx].location));

        // Estimate remaining distance & duration from remaining steps
        const remDist = routeData.steps
          .slice(nextIdx)
          .reduce((acc, s) => acc + s.distance, 0);
        const remDur = routeData.steps
          .slice(nextIdx)
          .reduce((acc, s) => acc + s.duration, 0);
        setRemainingDistance(Math.max(remDist, haversineMeters(livePos, routeData.destCoord)));
        setRemainingDuration(remDur);

        // Compute car-head heading from GPS or bearing toward next maneuver
        const nextHeading =
          typeof pos.coords.heading === "number" && !Number.isNaN(pos.coords.heading)
            ? pos.coords.heading
            : calculateBearing(livePos, routeData.steps[nextIdx].location);
        setHeading(nextHeading);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [routeData]);

  // 4. Sync car-head marker position/rotation and follow camera
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const marker = carMarkerRef.current;
    if (!L || !map || !marker || !currentPos) return;

    marker.setLatLng([currentPos.lat, currentPos.lng]);
    marker.setIcon(
      L.divIcon({
        className: "nav-car-head",
        html: createCarHeadIconHtml(heading),
        iconSize: [56, 56],
        iconAnchor: [28, 28],
      })
    );

    if (isFollowing) {
      map.panTo([currentPos.lat, currentPos.lng], { animate: true });
    }
  }, [currentPos, heading, isFollowing]);

  const handleRecenter = () => {
    setIsFollowing(true);
    if (mapRef.current && currentPos) {
      mapRef.current.setView([currentPos.lat, currentPos.lng], 16, { animate: true });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#121316] text-[#F4F1EA] font-mono text-xs gap-3 p-6">
        <div className="w-10 h-10 rounded-full border-2 border-[#1A73E8] border-t-transparent animate-spin" />
        <span>Starting turn-by-turn navigation...</span>
        <span className="text-[11px] text-[#A1A1AA]">
          Resolving route from {origin || "Current Location"} to {destination}
        </span>
      </div>
    );
  }

  if (error || !routeData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#121316] text-[#F4F1EA] font-mono text-xs gap-4 p-6 text-center">
        <span className="text-red-400">{error || "Unable to start live navigation."}</span>
        <button
          type="button"
          onClick={onExit}
          className="px-4 py-2 rounded-xl bg-[#C84B26] text-white uppercase font-semibold cursor-pointer"
        >
          Back to Overview Map
        </button>
      </div>
    );
  }

  const activeStep = routeData.steps[currentStepIdx] || routeData.steps[0];
  const nextStep = routeData.steps[currentStepIdx + 1];

  return (
    <div className="relative w-full h-full">
      {/* Live Map Canvas */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Top Turn-by-Turn Navigation Banner (Maps-App Style) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-[#0F5338] text-white shadow-2xl border border-white/15 px-4 py-3 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <ManeuverIcon
              type={activeStep?.maneuverType || "depart"}
              modifier={activeStep?.maneuverModifier}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold leading-tight font-mono">
              {formatDistance(distanceToTurn)}
            </div>
            <div className="text-sm font-medium truncate text-white/95">
              {activeStep?.instruction || `Head toward ${destination}`}
            </div>
          </div>
        </div>

        {nextStep && (
          <div className="pointer-events-auto rounded-xl bg-[#0B3D29]/95 text-white/90 shadow-lg border border-white/10 px-3 py-1.5 text-[11px] font-mono flex items-center gap-2">
            <span className="text-white/60 uppercase">Then</span>
            <span className="truncate max-w-[260px]">{nextStep.instruction}</span>
          </div>
        )}
      </div>

      {/* Re-center Button (appears when user pans away from car-head arrow) */}
      {!isFollowing && (
        <button
          type="button"
          onClick={handleRecenter}
          className="absolute bottom-24 right-4 z-20 px-3.5 py-2 rounded-full bg-white dark:bg-[#1A1B20] text-[#1A73E8] border border-[#E7E3DC] dark:border-[#26272D] shadow-xl text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
          <span>Re-center</span>
        </button>
      )}

      {/* Bottom Maps-App ETA & Exit HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/95 dark:bg-[#1A1B20]/95 backdrop-blur-md border border-[#E7E3DC] dark:border-[#26272D] shadow-2xl">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#16A34A] dark:text-emerald-400 font-mono">
              {formatDuration(remainingDuration)}
            </span>
            <span className="text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
              ({formatDistance(remainingDistance)})
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA] truncate">
            ETA {formatEta(remainingDuration)} • {destination}
          </div>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="px-4 py-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-md cursor-pointer transition-colors shrink-0"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
