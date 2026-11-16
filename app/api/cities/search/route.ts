import { NextRequest, NextResponse } from "next/server";

export interface CityResult {
  name: string;
  state?: string;
  country?: string;
  displayName: string;
  lat?: number;
  lon?: number;
}

function formatDisplayName(name: string, state?: string, country?: string): string {
  const isIndia = !country || country.toLowerCase() === "india";
  if (isIndia) {
    return state ? `${name}, ${state}` : `${name}, India`;
  }
  if (state && state !== name) {
    return `${name}, ${state}, ${country}`;
  }
  return country ? `${name}, ${country}` : name;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  // 1. Try Open-Meteo Geocoding API (Fast, free, reliable, no API key)
  try {
    const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      q
    )}&count=15&language=en&format=json`;

    const res = await fetch(openMeteoUrl, {
      headers: { "User-Agent": "LessGoooCitySearch/1.0" },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        // Enforce India-only restriction
        const indianResults = data.results.filter(
          (item: { country?: string; country_code?: string }) =>
            item.country?.toLowerCase() === "india" || item.country_code?.toUpperCase() === "IN"
        );

        if (indianResults.length > 0) {
          const results: CityResult[] = indianResults.map((item: { name: string; admin1?: string; admin2?: string; country?: string; latitude?: number; longitude?: number }) => ({
            name: item.name,
            state: item.admin1 || item.admin2 || undefined,
            country: "India",
            displayName: formatDisplayName(item.name, item.admin1, "India"),
            lat: item.latitude,
            lon: item.longitude,
          }));
          return NextResponse.json({ results });
        }
      }
    }
  } catch {
    // Fall through to Nominatim
  }

  // 2. Fallback to OpenStreetMap Nominatim restricted strictly to India (&countrycodes=in)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q
    )}&format=json&limit=12&addressdetails=1&countrycodes=in`;

    const res = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "LessGoooTravelCompanion/1.0",
        "Accept-Language": "en",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const queryLower = q.toLowerCase();
        const results: CityResult[] = data
          .filter((item: { address?: Record<string, string>; name?: string; display_name?: string }) => {
            const country = item.address?.country?.toLowerCase();
            const countryCode = item.address?.country_code?.toLowerCase();
            const isIndia = !country || country === "india" || countryCode === "in";
            if (!isIndia) return false;

            // Ensure the result actually matches the search query
            const nameMatch =
              (item.name && item.name.toLowerCase().includes(queryLower)) ||
              (item.display_name && item.display_name.toLowerCase().includes(queryLower));
            return Boolean(nameMatch);
          })
          .map((item: { address?: Record<string, string>; name?: string; display_name: string; lat: string; lon: string }) => {
            const addr = item.address || {};
            const name =
              item.name ||
              addr.city ||
              addr.town ||
              addr.village ||
              addr.municipality ||
              item.display_name.split(",")[0];
            const state = addr.state || addr.region || undefined;

            return {
              name,
              state,
              country: "India",
              displayName: formatDisplayName(name, state, "India"),
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon),
            };
          });
        return NextResponse.json({ results });
      }
    }
  } catch {
    // Both failed
  }

  return NextResponse.json({ results: [] });
}
