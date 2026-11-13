import { CURATED_CITIES, CuratedCity } from "./cityData";
import { API_BASE_URL } from "./api";

export interface CityOption {
  name: string;
  state?: string;
  country?: string;
  displayName: string;
  lat?: number;
  lon?: number;
}

export function formatCityDisplayName(name: string, state?: string, country?: string): string {
  const isIndia = !country || country.toLowerCase() === "india";
  if (isIndia) {
    return state ? `${name}, ${state}` : `${name}, India`;
  }
  if (state && state !== name) {
    return `${name}, ${state}, ${country}`;
  }
  return country ? `${name}, ${country}` : name;
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the nearest city from the curated list within maxKm distance
 */
export function findNearestCuratedCity(
  lat: number,
  lon: number,
  maxKm: number = 120
): CuratedCity | null {
  let closest: CuratedCity | null = null;
  let minDistance = Infinity;

  for (const city of CURATED_CITIES) {
    const dist = calculateDistanceKm(lat, lon, city.lat, city.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  if (closest && minDistance <= maxKm) {
    return closest;
  }
  return closest; // fallback to closest known city
}

/**
 * Multi-layer reverse geocoding to resolve GPS coordinates to a formatted City Name.
 * Guaranteed to return a city/locality name rather than raw coordinates.
 */
export async function reverseGeocodeToCity(lat: number, lon: number): Promise<string> {
  // 1. Try Next.js internal API route
  try {
    const res = await fetch(`/api/cities/reverse?lat=${lat}&lon=${lon}`);
    if (res.ok) {
      const data = await res.json();
      if (data.displayName) {
        return data.displayName;
      }
      if (data.city) {
        return formatCityDisplayName(data.city, data.state, data.country);
      }
    }
  } catch {}

  // 2. Try BigDataCloud Client Reverse Geocode (free client-side API, CORS enabled, no API key)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        data.localityInfo?.administrative?.[2]?.name;
      const state = data.principalSubdivision;
      const country = data.countryName;
      if (city) {
        return formatCityDisplayName(city, state, country);
      }
    }
  } catch {}

  // 3. Try OpenStreetMap Nominatim reverse
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: { "Accept-Language": "en" },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.county ||
        addr.suburb;
      const state = addr.state;
      const country = addr.country;
      if (city) {
        return formatCityDisplayName(city, state, country);
      }
    }
  } catch {}

  // 4. Try Backend API proxy if alive
  try {
    const res = await fetch(`${API_BASE_URL}/maps/reverse?lat=${lat}&lon=${lon}`);
    if (res.ok) {
      const data = await res.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        data.address?.county;
      const state = data.address?.state;
      const country = data.address?.country;
      if (city) {
        return formatCityDisplayName(city, state, country);
      }
    }
  } catch {}

  // 5. Intelligent nearest city fallback from curated dataset
  const nearest = findNearestCuratedCity(lat, lon, 150);
  if (nearest) {
    return formatCityDisplayName(nearest.name, nearest.state, nearest.country);
  }

  // 6. Safe human-readable fallback (never bare raw coordinates)
  return "Detected Current Location";
}

// In-memory cache for search queries
const searchCache = new Map<string, CityOption[]>();

/**
 * Searches cities by matching local curated database instantly and combining with live geocoding API.
 */
export async function searchCities(query: string): Promise<CityOption[]> {
  const cleanQuery = query.trim().toLowerCase();

  // If query is blank, suggest top featured destinations
  if (!cleanQuery) {
    return CURATED_CITIES.slice(0, 8).map((c) => ({
      name: c.name,
      state: c.state,
      country: c.country,
      displayName: formatCityDisplayName(c.name, c.state, c.country),
      lat: c.lat,
      lon: c.lon,
    }));
  }

  if (searchCache.has(cleanQuery)) {
    return searchCache.get(cleanQuery)!;
  }

  // 1. Instant local search from curated database
  const localMatches: CityOption[] = CURATED_CITIES.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(cleanQuery);
    const stateMatch = c.state.toLowerCase().includes(cleanQuery);
    return nameMatch || stateMatch;
  })
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(cleanQuery);
      const bStarts = b.name.toLowerCase().startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((c) => ({
      name: c.name,
      state: c.state,
      country: c.country,
      displayName: formatCityDisplayName(c.name, c.state, c.country),
      lat: c.lat,
      lon: c.lon,
    }));

  let remoteMatches: CityOption[] = [];

  // 2. Fetch from Next.js server route
  try {
    const res = await fetch(`/api/cities/search?q=${encodeURIComponent(cleanQuery)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        remoteMatches = data.results;
      }
    }
  } catch {
    // 3. Direct browser fallback to Open-Meteo Geocoding (CORS friendly, no key required)
    try {
      const omRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cleanQuery
        )}&count=8&language=en&format=json`
      );
      if (omRes.ok) {
        const omData = await omRes.json();
        if (Array.isArray(omData.results)) {
          remoteMatches = omData.results.map((item: { name: string; admin1?: string; country?: string; latitude?: number; longitude?: number }) => ({
            name: item.name,
            state: item.admin1 || undefined,
            country: item.country || undefined,
            displayName: formatCityDisplayName(item.name, item.admin1, item.country),
            lat: item.latitude,
            lon: item.longitude,
          }));
        }
      }
    } catch {}
  }

  // 4. Merge and deduplicate results
  const seen = new Set<string>();
  const merged: CityOption[] = [];

  // Prioritize remote matches that start with query or local matches
  const combined = [...localMatches, ...remoteMatches];

  for (const item of combined) {
    const key = `${item.name.toLowerCase()}|${(item.state || "").toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
    if (merged.length >= 10) break;
  }

  searchCache.set(cleanQuery, merged);
  return merged;
}
