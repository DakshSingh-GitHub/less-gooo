import { NextResponse } from "next/server";
import { ProposedPlanDay, PlanSpecifications } from "@/lib/appwrite";
import {
  calculateSingleLegTransitCost,
  estimateTourTicketsAverage,
  SingleLegTransitCost,
} from "@/lib/transitEngine";

interface RequestBody {
  destination: string;
  from?: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  category: string;
  specifications: PlanSpecifications;
}

// Built-in expert destination knowledge base
const DESTINATION_KNOWLEDGE: Record<string, {
  sights: { title: string; category: "sightseeing" | "culture"; desc: string; transit: string; cost: string }[];
  pureVegFood: { title: string; desc: string; transit: string; cost: string }[];
  allFood: { title: string; desc: string; transit: string; cost: string }[];
  hospitals: { title: string; desc: string }[];
  medicalStores: { title: string; desc: string }[];
}> = {
  varanasi: {
    sights: [
      { title: "Subah-e-Banaras & Sunrise Boat Ride at Assi Ghat", category: "sightseeing", desc: "Experience morning Vedic chants, yoga, and a calm wooden boat cruise along the ancient ghats.", transit: "Walk / E-Rickshaw (₹20-₹40)", cost: "₹150-₹250/person" },
      { title: "Kashi Vishwanath Temple Corridor & Darshan", category: "culture", desc: "Sacred Jyotirlinga pilgrimage through the newly restored heritage corridor.", transit: "Battery E-Rickshaw to Godowlia (₹30-₹50)", cost: "Free / Sugam Darshan ₹300" },
      { title: "Sarnath Buddhist Stupa & Archaeological Museum", category: "sightseeing", desc: "Where Buddha delivered his first sermon; site of Emperor Ashoka's lion capital.", transit: "CNG Auto / Cab (₹200-₹350)", cost: "₹25 entry" },
      { title: "Manikarnika & Harishchandra Heritage Ghat Walk", category: "culture", desc: "Sacred cremation ghats symbolizing the eternal cycle of life and liberation (Moksha).", transit: "Scenic Ghat Pathway Walk", cost: "Free" },
      { title: "Ramnagar Fort & Heritage Museum", category: "sightseeing", desc: "18th-century sandstone fort across the Ganges with royal vintage car and weaponry collections.", transit: "Auto / Boat crossing (₹120-₹200)", cost: "₹50 entry" },
      { title: "Ganga Sand Dunes & Twilight Ghat Stroll", category: "sightseeing", desc: "Golden hour peaceful stroll across the opposite bank sands.", transit: "Rowboat / Ferry (₹50-₹100)", cost: "Free" },
      { title: "Grand Evening Ganga Aarti at Dashashwamedh Ghat", category: "culture", desc: "Unmissable synchronized brass lamp ritual conducted by young priests at sunset.", transit: "Walk to Ghat (Vehicle-free zone)", cost: "Free / Boat seat ₹100" }
    ],
    pureVegFood: [
      { title: "Kashi Chaat Bhandar (100% Pure Veg)", desc: "Famous for legendary Banarasi Tamatar Chaat, Palak Patta Chaat, and Gulab Jamun.", transit: "Walk from Godowlia Crossing", cost: "₹120-₹200" },
      { title: "Blue Lassi Shop (Pure Veg)", desc: "Traditional clay-cup lassi with fresh seasonal fruits, rabdi, and dry fruits.", transit: "Narrow Manikarnika Alley Walk", cost: "₹80-₹140" },
      { title: "Shree Shivay Satvik Bhojnalaya (Pure Veg)", desc: "Pure vegetarian Satvik Thali prepared with heritage ghee and regional recipes.", transit: "E-Rickshaw (₹30)", cost: "₹250-₹400" },
      { title: "Pahlwan Chana Dahi & Malaiyo Stall (Pure Veg)", desc: "Winter saffron milk froth foam (Malaiyo) and spicy soaked chana breakfast.", transit: "Morning walk near Lanka Gate", cost: "₹60-₹100" }
    ],
    allFood: [
      { title: "Dolphin Restaurant (Riverfront)", desc: "Rooftop dining with panoramic views of Manmandir Ghat, offering multi-cuisine menus.", transit: "Walk from Dashashwamedh", cost: "₹450-₹800" },
      { title: "Open Hand Bistro & Crafts", desc: "Artisan coffee, fresh salads, and sandwiches in a relaxed creative cafe.", transit: "E-rickshaw to Assi Ghat", cost: "₹300-₹600" }
    ],
    hospitals: [
      { title: "Sir Sunderlal Hospital & BHU Trauma Centre (24x7)", desc: "Premier multispecialty emergency & trauma care center with round-the-clock specialists." },
      { title: "Heritage Hospitals Ltd., Lanka (24x7)", desc: "Modern private multispecialty hospital with 24-hour pharmacy, ICU, and ambulance service." }
    ],
    medicalStores: [
      { title: "Apollo Pharmacy 24x7 (Godowlia Crossing)", desc: "Fully stocked licensed 24-hour medical and pharmacy store." },
      { title: "BHU Campus Medical Hall (24x7)", desc: "Subsidized government-approved dispensary and emergency medicines." }
    ]
  }
};

function generateFallbackPlan(
  destination: string,
  from: string,
  startDate: string,
  endDate: string,
  budget: number,
  currency: string,
  specs: PlanSpecifications,
  approachingCost?: SingleLegTransitCost,
  departureCost?: SingleLegTransitCost
): ProposedPlanDay[] {
  const destLower = destination.toLowerCase();
  const matchedKey = Object.keys(DESTINATION_KNOWLEDGE).find((k) => destLower.includes(k));
  const data = matchedKey ? DESTINATION_KNOWLEDGE[matchedKey] : null;

  // Calculate day count
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const dayCount = Math.max(1, Math.min(7, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));

  const days: ProposedPlanDay[] = [];
  const paceMaxStops = specs.pace === "relaxed" ? 3 : specs.pace === "moderate" ? 4 : 5;

  for (let i = 1; i <= dayCount; i++) {
    const curDate = new Date(start);
    curDate.setDate(curDate.getDate() + (i - 1));
    const dateStr = curDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    const theme =
      i === 1
        ? `Inbound Arrival (${from || "Origin"} ➔ ${destination} via ${specs.approachingTransitMode?.toUpperCase() || "Transit"})`
        : i === 2
        ? "Sacred Core, Architecture & Cultural Immersion"
        : i === 3
        ? "Artisan Corridors, Waterways & Riverfront Horizons"
        : i === dayCount
        ? `Departure Reflections & Return Journey (${destination} ➔ ${from || "Origin"} via ${specs.departureTransitMode?.toUpperCase() || "Transit"})`
        : `Deep Discovery & Cultural Landmarks (Day ${i})`;

    const stops: ProposedPlanDay["stops"] = [];

    // Day 1 Inbound Arrival Waypoint
    if (i === 1 && approachingCost) {
      stops.push({
        time: "07:00 AM - 09:30 AM",
        title: `Arrival at ${destination} via ${approachingCost.mode.toUpperCase()}`,
        category: "transit",
        description: approachingCost.summaryText,
        transitNote: `${approachingCost.directionLabel} check-in & settlement`,
        estimatedCost: `${currency} ${approachingCost.totalCost.toLocaleString()}`
      });
    }

    // 1. Morning Stop
    if (data && data.sights[i - 1]) {
      const s = data.sights[i - 1];
      stops.push({
        time: i === 1 ? "10:30 AM - 12:30 PM" : "06:30 AM - 08:30 AM",
        title: s.title,
        category: s.category,
        description: s.desc,
        transitNote: s.transit,
        estimatedCost: `${currency} ${s.cost}`
      });
    } else {
      stops.push({
        time: i === 1 ? "10:30 AM - 12:30 PM" : "07:30 AM - 09:00 AM",
        title: `Morning Exploration & Landmark Walk in ${destination}`,
        category: "sightseeing",
        description: `Explore prime cultural corridors and scenic morning views of ${destination}.`,
        transitNote: "Local E-Rickshaw / Walking",
        estimatedCost: `${currency} 50 - 150`
      });
    }

    // 2. Midday / Culinary Stop
    const isPureVeg = specs.dietaryPreference === "pure_veg";
    if (specs.includeRestaurants) {
      if (data && isPureVeg && data.pureVegFood[i - 1]) {
        const f = data.pureVegFood[i - 1];
        stops.push({
          time: "01:00 PM - 02:15 PM",
          title: f.title,
          category: "food",
          isPureVeg: true,
          description: `${f.desc} (100% Pure Vegetarian / Satvik Certified)`,
          transitNote: f.transit,
          estimatedCost: `${currency} ${f.cost}`
        });
      } else if (data && !isPureVeg && data.allFood[i - 1]) {
        const f = data.allFood[i - 1];
        stops.push({
          time: "01:00 PM - 02:15 PM",
          title: f.title,
          category: "food",
          isPureVeg: false,
          description: f.desc,
          transitNote: f.transit,
          estimatedCost: `${currency} ${f.cost}`
        });
      } else {
        stops.push({
          time: "01:00 PM - 02:00 PM",
          title: isPureVeg ? `Traditional Pure Veg Luncheon in ${destination}` : `Local Culinary Dining in ${destination}`,
          category: "food",
          isPureVeg,
          description: isPureVeg
            ? "Authentic local thali and delicacies prepared strictly vegetarian with traditional spices."
            : "Regional specialties and authentic local dining experience.",
          transitNote: "Walk / Short transit",
          estimatedCost: `${currency} 200 - 450`
        });
      }
    }

    // 3. Afternoon Rest / Stay window if requested
    if (specs.includeStayRest && stops.length < paceMaxStops && i !== dayCount) {
      stops.push({
        time: "02:30 PM - 04:00 PM",
        title: `Afternoon Rest & Refreshment (${specs.stayType || "Heritage Stay"})`,
        category: "rest",
        description: "Scheduled quiet window to recharge and avoid peak afternoon pedestrian rush.",
        transitNote: "On-site / Relaxed",
        estimatedCost: "Included in stay"
      });
    }

    // 4. Afternoon / Evening Cultural Highlight
    if (data && data.sights[data.sights.length - i] && stops.length < paceMaxStops) {
      const s = data.sights[data.sights.length - i];
      stops.push({
        time: "05:00 PM - 07:00 PM",
        title: s.title,
        category: s.category,
        description: s.desc,
        transitNote: s.transit,
        estimatedCost: `${currency} ${s.cost}`
      });
    } else if (stops.length < paceMaxStops) {
      stops.push({
        time: "05:30 PM - 07:30 PM",
        title: `Sunset Twilight & Heritage Gathering in ${destination}`,
        category: "culture",
        description: `Experience the evening atmosphere, local artisans, and iconic landmarks of ${destination}.`,
        transitNote: "Auto-rickshaw / Walking",
        estimatedCost: `${currency} 100 - 200`
      });
    }

    // Final Day Outbound Departure Waypoint
    if (i === dayCount && departureCost) {
      stops.push({
        time: "06:00 PM - 09:00 PM",
        title: `Departure & Return Journey via ${departureCost.mode.toUpperCase()}`,
        category: "transit",
        description: departureCost.summaryText,
        transitNote: `${departureCost.directionLabel} return to ${from || "Origin"}`,
        estimatedCost: `${currency} ${departureCost.totalCost.toLocaleString()}`
      });
    }

    // Emergency / Healthcare safety marker on Day 1
    if (i === 1 && specs.necessities.hospital) {
      const hosp = data?.hospitals[0] || {
        title: `Designated 24/7 District Emergency Care Centre (${destination})`,
        desc: "Emergency trauma, cardiology, and round-the-clock doctor availability."
      };
      stops.push({
        time: "Safety Marker (24x7)",
        title: `🏥 Nearest Emergency Healthcare: ${hosp.title}`,
        category: "medical",
        description: `${hosp.desc} Verified for multi-generational travel peace of mind.`,
        transitNote: "Keep direct contact handy"
      });
    }

    days.push({
      dayNumber: i,
      date: dateStr,
      theme,
      stops
    });
  }

  return days;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const {
      destination,
      from = "",
      startDate,
      endDate,
      budget = 0,
      currency = "INR",
      category = "Vacation",
      specifications
    } = body;

    if (!destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Destination and dates are required." },
        { status: 400 }
      );
    }

    // 1. Calculate Approaching (Inbound) and Departure (Outbound) transit costs separately
    const approachingMode =
      specifications.approachingTransitMode || specifications.transitMode || "self_car";
    const departureMode =
      specifications.departureTransitMode || specifications.transitMode || "self_car";
    const passengersCount = specifications.passengersCount || 1;
    const approachingFuel =
      specifications.approachingCarFuelType || specifications.carFuelType || "petrol";
    const departureFuel =
      specifications.departureCarFuelType || specifications.carFuelType || "petrol";

    const approachingTransitCost = calculateSingleLegTransitCost(
      approachingMode,
      from,
      destination,
      "approaching",
      passengersCount,
      approachingFuel
    );

    const departureTransitCost = calculateSingleLegTransitCost(
      departureMode,
      from,
      destination,
      "departure",
      passengersCount,
      departureFuel
    );

    // 2. Calculate average attraction / sightseeing ticket costs
    const ticketsEstimate = estimateTourTicketsAverage(destination);

    // Combined round-trip breakdown for convenience
    const combinedRoundTripTotal = approachingTransitCost.totalCost + departureTransitCost.totalCost;
    const estimatedTransitCost = {
      mode: approachingMode,
      distanceKm: approachingTransitCost.distanceKm,
      roundTripDistanceKm: approachingTransitCost.distanceKm * 2,
      fuelCost: (approachingTransitCost.fuelCost || 0) + (departureTransitCost.fuelCost || 0),
      tollCost: (approachingTransitCost.tollCost || 0) + (departureTransitCost.tollCost || 0),
      passengersCount,
      roundTripTotal: combinedRoundTripTotal,
      summaryText: `Approaching (${approachingMode.toUpperCase()}): ₹${approachingTransitCost.totalCost.toLocaleString()} + Departure (${departureMode.toUpperCase()}): ₹${departureTransitCost.totalCost.toLocaleString()}`,
    };

    // 3. Attempt autonomous generation if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
You are an expert travel planner for LessGooo, an editorial spatial travel platform.
Generate a structured, authentic proposed day-by-day travel plan.

Destination: ${destination}
Origin (From): ${from}
Duration: ${startDate} to ${endDate}
Category: ${category}
Allocated Budget: ${currency} ${budget}
Approaching (Inbound) Transit: ${approachingMode.toUpperCase()} (${approachingTransitCost.summaryText})
Departure (Outbound) Transit: ${departureMode.toUpperCase()} (${departureTransitCost.summaryText})
Number of Passengers: ${passengersCount}
Pace: ${specifications.pace}
Include Restaurants: ${specifications.includeRestaurants}
Dietary Preference: ${specifications.dietaryPreference === "pure_veg" ? "STRICTLY 100% PURE VEGETARIAN / SATVIK ONLY" : "All Cuisines"}
Include Stay Window: ${specifications.includeStayRest}
Stay Type: ${specifications.stayType}
Emergency Hospital Needed: ${specifications.necessities.hospital}
24x7 Pharmacy Needed: ${specifications.necessities.medicalStore}

Make sure Day 1 incorporates the arrival via ${approachingMode.toUpperCase()}, and the final day concludes with departure via ${departureMode.toUpperCase()}.

Respond ONLY with a JSON array conforming to this TypeScript schema:
Array<{
  dayNumber: number;
  date: string;
  theme: string;
  stops: Array<{
    time: string;
    title: string;
    category: "sightseeing" | "food" | "culture" | "rest" | "medical" | "transit";
    description: string;
    isPureVeg?: boolean;
    transitNote?: string;
    estimatedCost?: string;
  }>;
}>
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const text = response.text?.trim();
        if (text) {
          const parsedPlan: ProposedPlanDay[] = JSON.parse(text);
          if (Array.isArray(parsedPlan) && parsedPlan.length > 0) {
            return NextResponse.json({
              success: true,
              source: "autonomous-engine",
              proposedPlan: parsedPlan,
              estimatedTicketCost: ticketsEstimate.averageTicketPerPersonINR,
              ticketBreakdown: ticketsEstimate.breakdown,
              approachingTransitCost,
              departureTransitCost,
              estimatedTransitCost,
            });
          }
        }
      } catch (genErr) {
        console.warn("Itinerary generation fallback engaged:", genErr);
      }
    }

    // Intelligent algorithmic fallback with full domain knowledge
    const proposedPlan = generateFallbackPlan(
      destination,
      from,
      startDate,
      endDate,
      budget,
      currency,
      specifications,
      approachingTransitCost,
      departureTransitCost
    );

    return NextResponse.json({
      success: true,
      source: "expert-engine",
      proposedPlan,
      estimatedTicketCost: ticketsEstimate.averageTicketPerPersonINR,
      ticketBreakdown: ticketsEstimate.breakdown,
      approachingTransitCost,
      departureTransitCost,
      estimatedTransitCost,
    });
  } catch (err: any) {
    console.error("Proposed plan generation error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate proposed plan" },
      { status: 500 }
    );
  }
}
