export type TransitMode = "flight" | "train" | "cab" | "self_car";

export interface SingleLegTransitCost {
  mode: TransitMode;
  direction: "approaching" | "departure";
  directionLabel: string;
  from: string;
  to: string;
  distanceKm: number;
  fuelCost?: number;
  fuelLiters?: number;
  tollCost?: number;
  ticketPricePerPerson?: number;
  passengersCount: number;
  totalCost: number;
  summaryText: string;
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

// Well-known road distances between major hubs (in km)
const CORRIDOR_DISTANCES: Record<string, number> = {
  "delhi-varanasi": 820,
  "varanasi-delhi": 820,
  "lucknow-varanasi": 315,
  "varanasi-lucknow": 315,
  "jaipur-varanasi": 860,
  "varanasi-jaipur": 860,
  "mumbai-varanasi": 1500,
  "varanasi-mumbai": 1500,
  "kolkata-varanasi": 680,
  "varanasi-kolkata": 680,
  "patna-varanasi": 250,
  "varanasi-patna": 250,
  "delhi-jaipur": 280,
  "jaipur-delhi": 280,
  "delhi-agra": 230,
  "agra-delhi": 230,
  "mumbai-goa": 590,
  "goa-mumbai": 590,
  "bangalore-goa": 560,
  "goa-bangalore": 560,
};

export function estimateCorridorDistance(fromStr: string, destStr: string): number {
  const cleanFrom = fromStr.toLowerCase().split(",")[0].trim();
  const cleanDest = destStr.toLowerCase().split(",")[0].trim();
  const key1 = `${cleanFrom}-${cleanDest}`;
  const key2 = `${cleanDest}-${cleanFrom}`;

  if (CORRIDOR_DISTANCES[key1]) return CORRIDOR_DISTANCES[key1];
  if (CORRIDOR_DISTANCES[key2]) return CORRIDOR_DISTANCES[key2];

  // Default regional estimate based on length or standard 450 km default
  return 650;
}

/**
 * Calculate one-way transit cost for either Approaching (inbound) or Departure (outbound)
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

  if (mode === "self_car") {
    const mileage = fuelType === "diesel" ? 17 : fuelType === "ev" ? 6 : 14;
    const fuelRate = fuelType === "diesel" ? 89 : fuelType === "ev" ? 12 : 101.5;
    const fuelLiters = Math.round(distanceKm / mileage);
    const fuelCost = Math.round(fuelLiters * fuelRate);
    const tollCost = Math.round(distanceKm * 2.2);
    const totalCost = fuelCost + tollCost;

    return {
      mode: "self_car",
      direction,
      directionLabel,
      from,
      to,
      distanceKm,
      fuelCost,
      fuelLiters,
      tollCost,
      passengersCount: count,
      totalCost,
      summaryText: `${directionLabel} via Self Car (${distanceKm} km): Fuel ₹${fuelCost.toLocaleString()} (${fuelLiters}L) + Tolls ₹${tollCost.toLocaleString()}`,
    };
  }

  if (mode === "flight") {
    const baseAirfareOneWay = Math.min(8500, Math.max(3800, Math.round(distanceKm * 4.5)));
    const totalCost = baseAirfareOneWay * count;

    return {
      mode: "flight",
      direction,
      directionLabel,
      from,
      to,
      distanceKm,
      ticketPricePerPerson: baseAirfareOneWay,
      passengersCount: count,
      totalCost,
      summaryText: `${directionLabel} via Flight (${count} pax): ₹${baseAirfareOneWay.toLocaleString()}/person (Total: ₹${totalCost.toLocaleString()})`,
    };
  }

  if (mode === "train") {
    const trainOneWay = Math.round(500 + distanceKm * 1.5);
    const totalCost = trainOneWay * count;

    return {
      mode: "train",
      direction,
      directionLabel,
      from,
      to,
      distanceKm,
      ticketPricePerPerson: trainOneWay,
      passengersCount: count,
      totalCost,
      summaryText: `${directionLabel} via Train (${count} pax): ₹${trainOneWay.toLocaleString()}/person (Total: ₹${totalCost.toLocaleString()})`,
    };
  }

  // Outstation Cab
  const cabRatePerKm = 13;
  const driverBatta = 400;
  const tollEstimate = Math.round(distanceKm * 2.1);
  const totalCost = distanceKm * cabRatePerKm + driverBatta + tollEstimate;

  return {
    mode: "cab",
    direction,
    directionLabel,
    from,
    to,
    distanceKm,
    tollCost: tollEstimate,
    passengersCount: count,
    totalCost,
    summaryText: `${directionLabel} via Cab (${distanceKm} km): ₹${cabRatePerKm}/km + Tolls & Batta (Total: ₹${totalCost.toLocaleString()})`,
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

  // General default for heritage cities
  return {
    averageTicketPerPersonINR: 500,
    breakdown: [
      { item: "Heritage Monument Entry Tickets", priceINR: 150 },
      { item: "Local Museum & Cultural Exhibition Passes", priceINR: 100 },
      { item: "Scenic Waterway / Viewpoint Berths", priceINR: 150 },
      { item: "Sacred Darshan & Temple Offerings", priceINR: 100 },
    ],
  };
}
