import { CURATED_CITIES, CuratedCity } from "./cityData";

export type TransitMode = "flight" | "train" | "cab" | "self_car";

export interface SingleLegTransitCost {
  mode: TransitMode;
  direction: "approaching" | "departure";
  directionLabel: string;
  from: string;
  to: string;
  distanceKm: number;
  corridorType?: string;
  fuelCost?: number;
  fuelLiters?: number;
  tollCost?: number;
  ticketPricePerPerson?: number;
  passengersCount: number;
  totalCost: number;
  summaryText: string;
  isFlightNotViable?: boolean;
}

export interface TransitCostBreakdown {
  mode: TransitMode;
  distanceKm: number;
  roundTripDistanceKm: number;
  fuelCost?: number;
  tollCost?: number;
  ticketPricePerPerson?: number;
  passengersCount: number;
  roundTripTotal: number;
  summaryText: string;
}

// Centroids & capitals for all 28 Indian States and 8 Union Territories
const INDIAN_STATE_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
  karnataka: { lat: 12.9716, lon: 77.5946, name: "Karnataka (Bengaluru)" },
  haryana: { lat: 28.9931, lon: 77.0151, name: "Haryana (Sonipat/NCR)" },
  delhi: { lat: 28.6139, lon: 77.2090, name: "Delhi" },
  "new delhi": { lat: 28.6139, lon: 77.2090, name: "New Delhi" },
  "uttar pradesh": { lat: 26.8467, lon: 80.9462, name: "Uttar Pradesh (Lucknow)" },
  up: { lat: 26.8467, lon: 80.9462, name: "Uttar Pradesh" },
  maharashtra: { lat: 19.0760, lon: 72.8777, name: "Maharashtra (Mumbai)" },
  rajasthan: { lat: 26.9124, lon: 75.7873, name: "Rajasthan (Jaipur)" },
  "tamil nadu": { lat: 13.0827, lon: 80.2707, name: "Tamil Nadu (Chennai)" },
  kerala: { lat: 9.9312, lon: 76.2673, name: "Kerala (Kochi)" },
  "west bengal": { lat: 22.5726, lon: 88.3639, name: "West Bengal (Kolkata)" },
  gujarat: { lat: 23.0225, lon: 72.5714, name: "Gujarat (Ahmedabad)" },
  punjab: { lat: 31.6340, lon: 74.8723, name: "Punjab (Amritsar)" },
  "himachal pradesh": { lat: 31.1048, lon: 77.1734, name: "Himachal Pradesh (Shimla)" },
  uttarakhand: { lat: 30.3165, lon: 78.0322, name: "Uttarakhand (Dehradun)" },
  "jammu & kashmir": { lat: 34.0837, lon: 74.7973, name: "Jammu & Kashmir (Srinagar)" },
  "jammu and kashmir": { lat: 34.0837, lon: 74.7973, name: "Jammu & Kashmir (Srinagar)" },
  kashmir: { lat: 34.0837, lon: 74.7973, name: "Kashmir" },
  ladakh: { lat: 34.1526, lon: 77.5771, name: "Ladakh (Leh)" },
  goa: { lat: 15.4909, lon: 73.8278, name: "Goa (Panaji)" },
  telangana: { lat: 17.3850, lon: 78.4867, name: "Telangana (Hyderabad)" },
  "andhra pradesh": { lat: 16.5062, lon: 80.6480, name: "Andhra Pradesh (Vijayawada)" },
  bihar: { lat: 25.5941, lon: 85.1376, name: "Bihar (Patna)" },
  odisha: { lat: 20.2961, lon: 85.8245, name: "Odisha (Bhubaneswar)" },
  "madhya pradesh": { lat: 23.2599, lon: 77.4126, name: "Madhya Pradesh (Bhopal)" },
  mp: { lat: 23.2599, lon: 77.4126, name: "Madhya Pradesh" },
  assam: { lat: 26.1445, lon: 91.7362, name: "Assam (Guwahati)" },
  sikkim: { lat: 27.3389, lon: 88.6065, name: "Sikkim (Gangtok)" },
  meghalaya: { lat: 25.5788, lon: 91.8933, name: "Meghalaya (Shillong)" },
  chhattisgarh: { lat: 21.2514, lon: 81.6296, name: "Chhattisgarh (Raipur)" },
  jharkhand: { lat: 23.3441, lon: 85.3096, name: "Jharkhand (Ranchi)" },
  chandigarh: { lat: 30.7333, lon: 76.7794, name: "Chandigarh" },
  puducherry: { lat: 11.9416, lon: 79.8083, name: "Puducherry" },
  pondicherry: { lat: 11.9416, lon: 79.8083, name: "Pondicherry" },
};

// Common NCR & satellite towns often used as travel origins/destinations
const NCR_AND_REGIONAL_TOWNS: Record<string, { lat: number; lon: number; state: string }> = {
  sonipat: { lat: 28.9931, lon: 77.0151, state: "Haryana" },
  sonepat: { lat: 28.9931, lon: 77.0151, state: "Haryana" },
  panipat: { lat: 29.3909, lon: 76.9635, state: "Haryana" },
  rohtak: { lat: 28.8955, lon: 76.6066, state: "Haryana" },
  karnal: { lat: 29.6857, lon: 76.9905, state: "Haryana" },
  gurugram: { lat: 28.4595, lon: 77.0266, state: "Haryana" },
  gurgaon: { lat: 28.4595, lon: 77.0266, state: "Haryana" },
  faridabad: { lat: 28.4089, lon: 77.3178, state: "Haryana" },
  noida: { lat: 28.5355, lon: 77.3910, state: "Uttar Pradesh" },
  "greater noida": { lat: 28.4744, lon: 77.5040, state: "Uttar Pradesh" },
  ghaziabad: { lat: 28.6692, lon: 77.4538, state: "Uttar Pradesh" },
  meerut: { lat: 28.9845, lon: 77.7064, state: "Uttar Pradesh" },
  alwar: { lat: 27.5530, lon: 76.6346, state: "Rajasthan" },
  mathura: { lat: 27.4924, lon: 77.6737, state: "Uttar Pradesh" },
  vrindavan: { lat: 27.5806, lon: 77.7006, state: "Uttar Pradesh" },
  agra: { lat: 27.1767, lon: 78.0081, state: "Uttar Pradesh" },
  sarnath: { lat: 25.3716, lon: 83.0252, state: "Uttar Pradesh" },
  chitrakoot: { lat: 25.1764, lon: 80.8653, state: "Uttar Pradesh" },
};

/**
 * Calculates straight-line spherical distance between two coordinates in kilometers using Haversine formula
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
 * Adaptive resolver that parses any city, district, or state query into precise geographic coordinates
 */
export function resolveLocationCoordinates(
  locationStr: string
): { lat: number; lon: number; name: string } | null {
  if (!locationStr || typeof locationStr !== "string") return null;

  const rawClean = locationStr.toLowerCase().trim();
  if (!rawClean || rawClean === "origin" || rawClean === "destination" || rawClean === "current location") {
    return null;
  }

  // Remove common country suffix and extract primary terms
  const sanitized = rawClean.replace(/\bindia\b/g, "").trim();
  const parts = sanitized
    .split(/[,/]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const primaryName = parts[0] || sanitized;
  const secondaryName = parts[1] || "";

  // 1. Direct match in NCR & satellite towns dictionary
  if (NCR_AND_REGIONAL_TOWNS[primaryName]) {
    const t = NCR_AND_REGIONAL_TOWNS[primaryName];
    return { lat: t.lat, lon: t.lon, name: primaryName };
  }

  // 2. Direct match in Curated Cities
  const exactCity = CURATED_CITIES.find(
    (c: CuratedCity) => c.name.toLowerCase() === primaryName
  );
  if (exactCity) {
    return { lat: exactCity.lat, lon: exactCity.lon, name: exactCity.name };
  }

  // 3. Substring match in Curated Cities (handles e.g. "Bengaluru Urban", "Varanasi Cantt")
  const subCity = CURATED_CITIES.find(
    (c: CuratedCity) =>
      primaryName.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(primaryName)
  );
  if (subCity) {
    return { lat: subCity.lat, lon: subCity.lon, name: subCity.name };
  }

  // 4. Match against Indian States & Union Territories (e.g. "Karnataka", "Haryana", "Rajasthan")
  if (INDIAN_STATE_COORDINATES[primaryName]) {
    return INDIAN_STATE_COORDINATES[primaryName];
  }
  if (secondaryName && INDIAN_STATE_COORDINATES[secondaryName]) {
    return INDIAN_STATE_COORDINATES[secondaryName];
  }

  // Check if any state key is contained in sanitized string
  for (const [stateKey, coord] of Object.entries(INDIAN_STATE_COORDINATES)) {
    if (sanitized.includes(stateKey)) {
      return coord;
    }
  }

  return null;
}

/**
 * Adaptive highway/road distance estimation between any two locations in India
 */
export function estimateCorridorDistance(fromStr: string, destStr: string): number {
  const fromCoord = resolveLocationCoordinates(fromStr);
  const destCoord = resolveLocationCoordinates(destStr);

  if (fromCoord && destCoord) {
    const straightLine = calculateDistanceKm(
      fromCoord.lat,
      fromCoord.lon,
      destCoord.lat,
      destCoord.lon
    );

    // Apply realistic highway winding coefficient based on distance tier
    if (straightLine <= 45) {
      // Local / Intra-metro or adjacent towns (e.g. Delhi to Gurgaon, Noida, or Sonipat)
      return Math.max(15, Math.round(straightLine * 1.15));
    }
    if (straightLine <= 120) {
      // Short-haul NCR or regional commute (e.g. Sonipat to Delhi, 43 km aerial -> ~52 km road)
      return Math.round(straightLine * 1.22);
    }
    if (straightLine <= 400) {
      // Regional corridor (e.g. Delhi to Jaipur, Chandigarh, Agra)
      return Math.round(straightLine * 1.25);
    }
    if (straightLine <= 1200) {
      // Trunk intercity corridor (e.g. Delhi to Varanasi, Lucknow, Mumbai)
      return Math.round(straightLine * 1.28);
    }
    // Long-haul cross-country corridor (e.g. North India to Karnataka, Kerala, Tamil Nadu)
    return Math.round(straightLine * 1.30);
  }

  // Fallback if one location is unresolvable: check common keyword hints
  const cleanFrom = fromStr.toLowerCase();
  const cleanDest = destStr.toLowerCase();

  // If one of the endpoints is South India (Karnataka, Kerala, Tamil Nadu) from North
  const isFromNorth = cleanFrom.includes("haryana") || cleanFrom.includes("delhi") || cleanFrom.includes("sonipat") || cleanFrom.includes("punjab") || cleanFrom.includes("up");
  const isDestSouth = cleanDest.includes("karnataka") || cleanDest.includes("bengaluru") || cleanDest.includes("bangalore") || cleanDest.includes("kerala") || cleanDest.includes("chennai") || cleanDest.includes("tamil");

  if (isFromNorth && isDestSouth) {
    return 2180;
  }

  // If both are NCR neighbors
  const isFromNCR = cleanFrom.includes("sonipat") || cleanFrom.includes("delhi") || cleanFrom.includes("noida") || cleanFrom.includes("gurgaon");
  const isDestNCR = cleanDest.includes("delhi") || cleanDest.includes("sonipat") || cleanDest.includes("noida") || cleanDest.includes("gurgaon");

  if (isFromNCR && isDestNCR) {
    return 55;
  }

  // Standard medium-haul fallback
  return 480;
}

/**
 * Calculates adaptive, transparent single-leg transit cost based on actual corridor geography
 */
export function calculateSingleLegTransitCost(
  mode: TransitMode,
  origin: string,
  destination: string,
  direction: "approaching" | "departure",
  passengersCount: number = 1,
  fuelType: "petrol" | "diesel" | "ev" = "petrol"
): SingleLegTransitCost {
  const from = direction === "approaching" ? (origin || "Origin") : destination;
  const to = direction === "approaching" ? destination : (origin || "Origin");
  const distanceKm = estimateCorridorDistance(origin || "Origin", destination);
  const count = Math.max(1, passengersCount);
  const directionLabel = direction === "approaching" ? "Approaching (Inbound)" : "Departure (Outbound)";

  // Categorize corridor type for display
  let corridorType = "Regional Trunk Corridor";
  if (distanceKm <= 75) {
    corridorType = "Short-Haul Local / NCR Corridor";
  } else if (distanceKm <= 350) {
    corridorType = "Intercity Highway Corridor";
  } else if (distanceKm <= 950) {
    corridorType = "Major Trunk Interstate Corridor";
  } else {
    corridorType = "Long-Haul Cross-Country Corridor";
  }

  // 1. SELF CAR (Adaptive by distance, vehicle fuel efficiency, and realistic highway tolls)
  if (mode === "self_car") {
    const mileage = fuelType === "diesel" ? 17 : fuelType === "ev" ? 6 : 14;
    const fuelRate = fuelType === "diesel" ? 89 : fuelType === "ev" ? 12 : 101.5;
    const fuelLiters = Math.max(1, Math.round(distanceKm / mileage));
    const fuelCost = Math.round(fuelLiters * fuelRate);

    // Toll plaza logic in India: Local routes under 40km have 0 tolls; 40-75km has 1 plaza (~₹80-120); long haul ~₹2.1/km
    let tollCost = 0;
    if (distanceKm > 35 && distanceKm <= 75) {
      tollCost = 90; // Single plaza (e.g. Kundli / Singhu border)
    } else if (distanceKm > 75) {
      tollCost = Math.round(distanceKm * 2.1);
    }

    const totalCost = fuelCost + tollCost;

    return {
      mode: "self_car",
      direction,
      directionLabel,
      from,
      to,
      distanceKm,
      corridorType,
      fuelCost,
      fuelLiters,
      tollCost,
      passengersCount: count,
      totalCost,
      summaryText: `${directionLabel} via Self Car (${distanceKm} km): Fuel ₹${fuelCost.toLocaleString()} (~${fuelLiters}L) + Tolls ₹${tollCost.toLocaleString()}`,
    };
  }

  // 2. FLIGHT (Adaptive pricing; flags non-viability for short ground distances)
  if (mode === "flight") {
    if (distanceKm <= 160) {
      // Commercial scheduled passenger flights do not operate for short distances (e.g. Sonipat to Delhi)
      return {
        mode: "flight",
        direction,
        directionLabel,
        from,
        to,
        distanceKm,
        corridorType,
        ticketPricePerPerson: 0,
        passengersCount: count,
        totalCost: 0,
        isFlightNotViable: true,
        summaryText: `${directionLabel}: Direct flights unavailable for short distance (${distanceKm} km). Cab or train transit recommended.`,
      };
    }

    // Realistic flight price model across Indian domestic routes
    let baseAirfareOneWay = 3800;
    if (distanceKm <= 450) {
      baseAirfareOneWay = Math.round(2800 + distanceKm * 2.5); // Regional flight e.g. ₹3,400 - ₹3,900
    } else if (distanceKm <= 1200) {
      baseAirfareOneWay = Math.round(3400 + distanceKm * 2.2); // Mid-range e.g. ₹4,500 - ₹6,000
    } else {
      baseAirfareOneWay = Math.round(3800 + Math.min(distanceKm, 2600) * 1.95); // Long haul e.g. ₹6,800 - ₹8,500
    }

    const totalCost = baseAirfareOneWay * count;

    return {
      mode: "flight",
      direction,
      directionLabel,
      from,
      to,
      distanceKm,
      corridorType,
      ticketPricePerPerson: baseAirfareOneWay,
      passengersCount: count,
      totalCost,
      summaryText: `${directionLabel} via Flight (${count} pax): ₹${baseAirfareOneWay.toLocaleString()}/person (Total: ₹${totalCost.toLocaleString()})`,
    };
  }

  // 3. TRAIN (Adaptive: local express/EMU for short distance, Vande Bharat for mid, Rajdhani/3AC for long)
  if (mode === "train") {
    let trainOneWay = 0;
    if (distanceKm <= 75) {
      // Local passenger / EMU / Express unreserved/chair car (e.g. Sonipat to Delhi, ~50km = ₹75)
      trainOneWay = Math.max(50, Math.round(distanceKm * 1.5));
    } else if (distanceKm <= 350) {
      // Intercity / Vande Bharat CC (e.g. Delhi to Chandigarh / Jaipur = ~₹600 - ₹850)
      trainOneWay = Math.round(180 + distanceKm * 1.6);
    } else if (distanceKm <= 950) {
      // Trunk corridor 3AC / Vande Bharat (e.g. Delhi to Varanasi, 820km = ~₹1,550)
      trainOneWay = Math.round(450 + distanceKm * 1.35);
    } else {
      // Cross-country Superfast / Rajdhani 3AC (e.g. Sonipat to Karnataka, 2,280km = ~₹3,100)
      trainOneWay = Math.round(950 + distanceKm * 0.95);
    }

    const totalCost = trainOneWay * count;

    return {
      mode: "train",
      direction,
      directionLabel,
      from,
      to,
      distanceKm,
      corridorType,
      ticketPricePerPerson: trainOneWay,
      passengersCount: count,
      totalCost,
      summaryText: `${directionLabel} via Train (${count} pax): ₹${trainOneWay.toLocaleString()}/person (Total: ₹${totalCost.toLocaleString()})`,
    };
  }

  // 4. OUTSTATION CAB / INTERCITY TAXI
  let totalCabCost = 0;
  if (distanceKm <= 60) {
    // Local city/NCR cab (flat base + rate + toll) e.g. Sonipat to Delhi = ~₹850 - ₹1,100
    totalCabCost = Math.max(750, Math.round(distanceKm * 16 + (distanceKm > 35 ? 90 : 0)));
  } else {
    // Outstation taxi with standard per-km rate, driver batta, and highway tolls
    const cabRatePerKm = 13.5;
    const driverBatta = 450;
    const tollEstimate = Math.round(distanceKm * 2.1);
    totalCabCost = Math.round(distanceKm * cabRatePerKm + driverBatta + tollEstimate);
  }

  return {
    mode: "cab",
    direction,
    directionLabel,
    from,
    to,
    distanceKm,
    corridorType,
    tollCost: distanceKm > 35 ? (distanceKm <= 60 ? 90 : Math.round(distanceKm * 2.1)) : 0,
    passengersCount: count,
    totalCost: totalCabCost,
    summaryText: `${directionLabel} via Cab (${distanceKm} km): Total ₹${totalCabCost.toLocaleString()} (Includes fuel, driver allowance & tolls)`,
  };
}

export function calculateTransitCost(
  mode: TransitMode,
  from: string,
  destination: string,
  passengersCount: number = 1,
  fuelType: "petrol" | "diesel" | "ev" = "petrol"
): TransitCostBreakdown {
  const leg = calculateSingleLegTransitCost(mode, from, destination, "approaching", passengersCount, fuelType);
  const roundTripDistanceKm = leg.distanceKm * 2;
  const roundTripTotal = leg.totalCost * 2;

  return {
    mode,
    distanceKm: leg.distanceKm,
    roundTripDistanceKm,
    fuelCost: leg.fuelCost ? leg.fuelCost * 2 : undefined,
    tollCost: leg.tollCost ? leg.tollCost * 2 : undefined,
    ticketPricePerPerson: leg.ticketPricePerPerson ? leg.ticketPricePerPerson * 2 : undefined,
    passengersCount: leg.passengersCount,
    roundTripTotal,
    summaryText: `Round-Trip ${mode.toUpperCase()} Transit (${roundTripDistanceKm} km): Total ₹${roundTripTotal.toLocaleString()}`,
  };
}

export function estimateTourTicketsAverage(destination: string): {
  averageTicketPerPersonINR: number;
  breakdown: { item: string; priceINR: number }[];
} {
  const destLower = destination.toLowerCase();

  if (destLower.includes("varanasi")) {
    return {
      averageTicketPerPersonINR: 620,
      breakdown: [
        { item: "Subah-e-Banaras Morning Shared Wooden Boat", priceINR: 180 },
        { item: "Kashi Vishwanath Sugam Darshan Pass (Optional)", priceINR: 300 },
        { item: "Sarnath Buddhist Stupa & Museum Entry", priceINR: 25 },
        { item: "Ramnagar Fort Palace Museum Ticket", priceINR: 50 },
        { item: "Dashashwamedh Aarti Ghat Berth", priceINR: 65 },
      ],
    };
  }

  if (destLower.includes("jaipur")) {
    return {
      averageTicketPerPersonINR: 850,
      breakdown: [
        { item: "Amer Fort Composite Heritage Entry", priceINR: 100 },
        { item: "City Palace & Museum Ticket", priceINR: 300 },
        { item: "Hawa Mahal Entry Pass", priceINR: 50 },
        { item: "Jantar Mantar Astronomical Observatory", priceINR: 50 },
        { item: "Chokhi Dhani Cultural Entry", priceINR: 350 },
      ],
    };
  }

  if (destLower.includes("agra")) {
    return {
      averageTicketPerPersonINR: 340,
      breakdown: [
        { item: "Taj Mahal Monument Entry", priceINR: 50 },
        { item: "Taj Mahal Main Mausoleum Pass", priceINR: 200 },
        { item: "Agra Fort Entry Pass", priceINR: 50 },
        { item: "Mehtab Bagh Sunset View Ticket", priceINR: 40 },
      ],
    };
  }

  if (destLower.includes("delhi")) {
    return {
      averageTicketPerPersonINR: 380,
      breakdown: [
        { item: "Red Fort Heritage Monument Pass", priceINR: 50 },
        { item: "Qutub Minar Complex Entry", priceINR: 50 },
        { item: "Humayun's Tomb Garden Pass", priceINR: 50 },
        { item: "National Museum Exhibition Entry", priceINR: 30 },
        { item: "Akshardham Exhibition & Light Show", priceINR: 200 },
      ],
    };
  }

  if (destLower.includes("karnataka") || destLower.includes("bengaluru") || destLower.includes("mysuru")) {
    return {
      averageTicketPerPersonINR: 580,
      breakdown: [
        { item: "Mysore Palace Royal Durbar Entry", priceINR: 100 },
        { item: "Bengaluru Palace Audio Guide Pass", priceINR: 250 },
        { item: "Hampi Monument Complex Heritage Pass", priceINR: 50 },
        { item: "Lalbagh Botanical Garden & Glasshouse", priceINR: 30 },
        { item: "Chamundi Hill Temple Darshan", priceINR: 150 },
      ],
    };
  }

  // General default for heritage and travel destinations
  return {
    averageTicketPerPersonINR: 500,
    breakdown: [
      { item: "Heritage Monument Entry Tickets", priceINR: 150 },
      { item: "Local Museum & Cultural Exhibition Passes", priceINR: 100 },
      { item: "Scenic Viewpoint / Waterway Access", priceINR: 150 },
      { item: "Sacred Darshan & Temple Offerings", priceINR: 100 },
    ],
  };
}
