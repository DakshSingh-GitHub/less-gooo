import { NextRequest, NextResponse } from "next/server";

function formatReverseCity(name: string, state?: string, country?: string): string {
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
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  // 1. Try BigDataCloud reverse geocode client API (Free, fast, specifically returns city & state)
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(bdcUrl, { next: { revalidate: 86400 } });
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
        return NextResponse.json({
          city,
          state,
          country,
          displayName: formatReverseCity(city, state, country),
        });
      }
    }
  } catch {
    // Continue to Nominatim
  }

  // 2. Try OpenStreetMap Nominatim reverse
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await fetch(nomUrl, {
      headers: {
        "User-Agent": "LessGoooTravelCompanion/1.0",
        "Accept-Language": "en",
      },
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        addr.suburb;
      const state = addr.state;
      const country = addr.country;

      if (city) {
        return NextResponse.json({
          city,
          state,
          country,
          displayName: formatReverseCity(city, state, country),
        });
      }
    }
  } catch {
    // Ignore
  }

  return NextResponse.json({ error: "Unable to reverse geocode" }, { status: 404 });
}
