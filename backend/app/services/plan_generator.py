from __future__ import annotations

import json
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.schemas.trip import PlanSpecificationsSchema

DESTINATION_KNOWLEDGE: Dict[str, Dict[str, List[Dict[str, str]]]] = {
    "varanasi": {
        "sights": [
            {
                "title": "Subah-e-Banaras & Sunrise Boat Ride at Assi Ghat",
                "category": "sightseeing",
                "desc": "Experience morning Vedic chants, yoga, and a calm wooden boat cruise along the ancient ghats.",
                "transit": "Walk / E-Rickshaw (₹20-₹40)",
                "cost": "₹150-₹250/person",
            },
            {
                "title": "Kashi Vishwanath Temple Corridor & Darshan",
                "category": "culture",
                "desc": "Sacred Jyotirlinga pilgrimage through the newly restored heritage corridor.",
                "transit": "Battery E-Rickshaw to Godowlia (₹30-₹50)",
                "cost": "Free / Sugam Darshan ₹300",
            },
            {
                "title": "Sarnath Buddhist Stupa & Archaeological Museum",
                "category": "sightseeing",
                "desc": "Where Buddha delivered his first sermon; site of Emperor Ashoka's lion capital.",
                "transit": "CNG Auto / Cab (₹200-₹350)",
                "cost": "₹25 entry",
            },
            {
                "title": "Manikarnika & Harishchandra Heritage Ghat Walk",
                "category": "culture",
                "desc": "Sacred cremation ghats symbolizing the eternal cycle of life and liberation (Moksha).",
                "transit": "Scenic Ghat Pathway Walk",
                "cost": "Free",
            },
            {
                "title": "Ramnagar Fort & Heritage Museum",
                "category": "sightseeing",
                "desc": "18th-century sandstone fort across the Ganges with royal vintage car and weaponry collections.",
                "transit": "Auto / Boat crossing (₹120-₹200)",
                "cost": "₹50 entry",
            },
            {
                "title": "Ganga Sand Dunes & Twilight Ghat Stroll",
                "category": "sightseeing",
                "desc": "Golden hour peaceful stroll across the opposite bank sands.",
                "transit": "Rowboat / Ferry (₹50-₹100)",
                "cost": "Free",
            },
            {
                "title": "Grand Evening Ganga Aarti at Dashashwamedh Ghat",
                "category": "culture",
                "desc": "Unmissable synchronized brass lamp ritual conducted by young priests at sunset.",
                "transit": "Walk to Ghat (Vehicle-free zone)",
                "cost": "Free / Boat seat ₹100",
            },
        ],
        "pureVegFood": [
            {
                "title": "Kashi Chaat Bhandar (100% Pure Veg)",
                "desc": "Famous for legendary Banarasi Tamatar Chaat, Palak Patta Chaat, and Gulab Jamun.",
                "transit": "Walk from Godowlia Crossing",
                "cost": "₹120-₹200",
            },
            {
                "title": "Blue Lassi Shop (Pure Veg)",
                "desc": "Traditional clay-cup lassi with fresh seasonal fruits, rabdi, and dry fruits.",
                "transit": "Narrow Manikarnika Alley Walk",
                "cost": "₹80-₹140",
            },
            {
                "title": "Shree Shivay Satvik Bhojnalaya (Pure Veg)",
                "desc": "Pure vegetarian Satvik Thali prepared with heritage ghee and regional recipes.",
                "transit": "E-Rickshaw (₹30)",
                "cost": "₹250-₹400",
            },
            {
                "title": "Pahlwan Chana Dahi & Malaiyo Stall (Pure Veg)",
                "desc": "Winter saffron milk froth foam (Malaiyo) and spicy soaked chana breakfast.",
                "transit": "Morning walk near Lanka Gate",
                "cost": "₹60-₹100",
            },
        ],
        "allFood": [
            {
                "title": "Dolphin Restaurant (Riverfront)",
                "desc": "Rooftop dining with panoramic views of Manmandir Ghat, offering multi-cuisine menus.",
                "transit": "Walk from Dashashwamedh",
                "cost": "₹450-₹800",
            },
            {
                "title": "Open Hand Bistro & Crafts",
                "desc": "Artisan coffee, fresh salads, and sandwiches in a relaxed creative cafe.",
                "transit": "E-rickshaw to Assi Ghat",
                "cost": "₹300-₹600",
            },
        ],
        "hospitals": [
            {
                "title": "Sir Sunderlal Hospital & BHU Trauma Centre (24x7)",
                "desc": "Premier multispecialty emergency & trauma care center with round-the-clock specialists.",
            },
            {
                "title": "Heritage Hospitals Ltd., Lanka (24x7)",
                "desc": "Modern private multispecialty hospital with 24-hour pharmacy, ICU, and ambulance service.",
            },
        ],
    }
}


def generate_fallback_plan(
    destination: str,
    from_city: str,
    start_date: str,
    end_date: str,
    currency: str,
    specs: PlanSpecificationsSchema,
    approaching_cost: Dict[str, Any],
    departure_cost: Dict[str, Any],
) -> List[Dict[str, Any]]:
    dest_lower = destination.lower()
    matched_key = next((k for k in DESTINATION_KNOWLEDGE if k in dest_lower), None)
    data = DESTINATION_KNOWLEDGE[matched_key] if matched_key else None

    try:
        start = datetime.strptime(start_date[:10], "%Y-%m-%d")
        end = datetime.strptime(end_date[:10], "%Y-%m-%d")
        diff_days = abs((end - start).days) + 1
    except ValueError:
        start = datetime.now()
        diff_days = 3

    day_count = max(1, min(7, diff_days))
    pace_max_stops = 3 if specs.pace == "relaxed" else 4 if specs.pace == "moderate" else 5
    days: List[Dict[str, Any]] = []

    for i in range(1, day_count + 1):
        cur_date = start + timedelta(days=i - 1)
        date_str = cur_date.strftime("%a, %b %d")

        if i == 1:
            theme = f"Inbound Arrival ({from_city or 'Origin'} ➔ {destination} via {specs.approachingTransitMode.upper()})"
        elif i == 2:
            theme = "Sacred Core, Architecture & Cultural Immersion"
        elif i == 3:
            theme = "Artisan Corridors, Waterways & Riverfront Horizons"
        elif i == day_count:
            theme = f"Departure Reflections & Return Journey ({destination} ➔ {from_city or 'Origin'} via {specs.departureTransitMode.upper()})"
        else:
            theme = f"Deep Discovery & Cultural Landmarks (Day {i})"

        stops: List[Dict[str, Any]] = []

        if i == 1 and approaching_cost:
            stops.append(
                {
                    "time": "07:00 AM - 09:30 AM",
                    "title": f"Arrival at {destination} via {approaching_cost['mode'].upper()}",
                    "category": "transit",
                    "description": approaching_cost["summaryText"],
                    "transitNote": f"{approaching_cost['directionLabel']} check-in & settlement",
                    "estimatedCost": f"{currency} {approaching_cost['totalCost']:,}",
                }
            )

        if data and i - 1 < len(data["sights"]):
            s = data["sights"][i - 1]
            stops.append(
                {
                    "time": "10:30 AM - 12:30 PM" if i == 1 else "06:30 AM - 08:30 AM",
                    "title": s["title"],
                    "category": s["category"],
                    "description": s["desc"],
                    "transitNote": s["transit"],
                    "estimatedCost": f"{currency} {s['cost']}",
                }
            )
        else:
            stops.append(
                {
                    "time": "10:30 AM - 12:30 PM" if i == 1 else "07:30 AM - 09:00 AM",
                    "title": f"Morning Exploration & Landmark Walk in {destination}",
                    "category": "sightseeing",
                    "description": f"Explore prime cultural corridors and scenic morning views of {destination}.",
                    "transitNote": "Local E-Rickshaw / Walking",
                    "estimatedCost": f"{currency} 50 - 150",
                }
            )

        is_pure_veg = specs.dietaryPreference == "pure_veg"
        if specs.includeRestaurants:
            if data and is_pure_veg and i - 1 < len(data["pureVegFood"]):
                f = data["pureVegFood"][i - 1]
                stops.append(
                    {
                        "time": "01:00 PM - 02:15 PM",
                        "title": f["title"],
                        "category": "food",
                        "isPureVeg": True,
                        "description": f"{f['desc']} (100% Pure Vegetarian / Satvik Certified)",
                        "transitNote": f["transit"],
                        "estimatedCost": f"{currency} {f['cost']}",
                    }
                )
            elif data and not is_pure_veg and i - 1 < len(data["allFood"]):
                f = data["allFood"][i - 1]
                stops.append(
                    {
                        "time": "01:00 PM - 02:15 PM",
                        "title": f["title"],
                        "category": "food",
                        "isPureVeg": False,
                        "description": f["desc"],
                        "transitNote": f["transit"],
                        "estimatedCost": f"{currency} {f['cost']}",
                    }
                )
            else:
                stops.append(
                    {
                        "time": "01:00 PM - 02:00 PM",
                        "title": f"Traditional Pure Veg Luncheon in {destination}" if is_pure_veg else f"Local Culinary Dining in {destination}",
                        "category": "food",
                        "isPureVeg": is_pure_veg,
                        "description": (
                            "Authentic local thali and delicacies prepared strictly vegetarian with traditional spices."
                            if is_pure_veg
                            else "Regional specialties and authentic local dining experience."
                        ),
                        "transitNote": "Walk / Short transit",
                        "estimatedCost": f"{currency} 200 - 450",
                    }
                )

        if specs.includeStayRest and len(stops) < pace_max_stops and i != day_count:
            stops.append(
                {
                    "time": "02:30 PM - 04:00 PM",
                    "title": f"Afternoon Rest & Refreshment ({specs.stayType or 'Heritage Stay'})",
                    "category": "rest",
                    "description": "Scheduled quiet window to recharge and avoid peak afternoon pedestrian rush.",
                    "transitNote": "On-site / Relaxed",
                    "estimatedCost": "Included in stay",
                }
            )

        if data and len(data["sights"]) - i >= 0 and len(stops) < pace_max_stops:
            s = data["sights"][len(data["sights"]) - i]
            stops.append(
                {
                    "time": "05:00 PM - 07:00 PM",
                    "title": s["title"],
                    "category": s["category"],
                    "description": s["desc"],
                    "transitNote": s["transit"],
                    "estimatedCost": f"{currency} {s['cost']}",
                }
            )
        elif len(stops) < pace_max_stops:
            stops.append(
                {
                    "time": "05:30 PM - 07:30 PM",
                    "title": f"Sunset Twilight & Heritage Gathering in {destination}",
                    "category": "culture",
                    "description": f"Experience the evening atmosphere, local artisans, and iconic landmarks of {destination}.",
                    "transitNote": "Auto-rickshaw / Walking",
                    "estimatedCost": f"{currency} 100 - 200",
                }
            )

        if i == day_count and departure_cost:
            stops.append(
                {
                    "time": "06:00 PM - 09:00 PM",
                    "title": f"Departure & Return Journey via {departure_cost['mode'].upper()}",
                    "category": "transit",
                    "description": departure_cost["summaryText"],
                    "transitNote": f"{departure_cost['directionLabel']} return to {from_city or 'Origin'}",
                    "estimatedCost": f"{currency} {departure_cost['totalCost']:,}",
                }
            )

        if i == 1 and specs.necessities.hospital:
            hosp = (
                data["hospitals"][0]
                if data and data.get("hospitals")
                else {
                    "title": f"Designated 24/7 District Emergency Care Centre ({destination})",
                    "desc": "Emergency trauma, cardiology, and round-the-clock doctor availability.",
                }
            )
            stops.append(
                {
                    "time": "Safety Marker (24x7)",
                    "title": f"🏥 Nearest Emergency Healthcare: {hosp['title']}",
                    "category": "medical",
                    "description": f"{hosp['desc']} Verified for multi-generational travel peace of mind.",
                    "transitNote": "Keep direct contact handy",
                }
            )

        days.append({"dayNumber": i, "date": date_str, "theme": theme, "stops": stops})

    return days


async def generate_plan_with_gemini(
    destination: str,
    from_city: str,
    start_date: str,
    end_date: str,
    budget: float,
    currency: str,
    category: str,
    specs: PlanSpecificationsSchema,
    approaching_cost: Dict[str, Any],
    departure_cost: Dict[str, Any],
) -> Optional[List[Dict[str, Any]]]:
    """Attempt autonomous itinerary generation using google-genai; returns None on failure."""
    if not settings.GEMINI_API_KEY:
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        dietary_text = (
            "STRICTLY 100% PURE VEGETARIAN / SATVIK ONLY"
            if specs.dietaryPreference == "pure_veg"
            else "All Cuisines"
        )
        prompt = f"""
You are an expert travel planner for LessGooo, an editorial spatial travel platform.
Generate a structured, authentic proposed day-by-day travel plan.

Destination: {destination}
Origin (From): {from_city}
Duration: {start_date} to {end_date}
Category: {category}
Allocated Budget: {currency} {budget}
Approaching (Inbound) Transit: {specs.approachingTransitMode.upper()} ({approaching_cost['summaryText']})
Departure (Outbound) Transit: {specs.departureTransitMode.upper()} ({departure_cost['summaryText']})
Number of Passengers: {specs.passengersCount}
Pace: {specs.pace}
Include Restaurants: {specs.includeRestaurants}
Dietary Preference: {dietary_text}
Include Stay Window: {specs.includeStayRest}
Stay Type: {specs.stayType}
Emergency Hospital Needed: {specs.necessities.hospital}
24x7 Pharmacy Needed: {specs.necessities.medicalStore}

Make sure Day 1 incorporates the arrival via {specs.approachingTransitMode.upper()}, and the final day concludes with departure via {specs.departureTransitMode.upper()}.

Respond ONLY with a JSON array conforming to this schema:
Array<{{
  dayNumber: number,
  date: string,
  theme: string,
  stops: Array<{{
    time: string,
    title: string,
    category: "sightseeing" | "food" | "culture" | "rest" | "medical" | "transit",
    description: string,
    isPureVeg?: boolean,
    transitNote?: string,
    estimatedCost?: string
  }}>
}}>
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        text = (response.text or "").strip()
        if not text:
            return None
        parsed = json.loads(text)
        if isinstance(parsed, list) and len(parsed) > 0:
            return parsed
        return None
    except Exception:
        return None


def _shift_time_range(time_str: str, delay_minutes: int) -> str:
    """Shift 'HH:MM AM - HH:MM PM' ranges forward by delay_minutes when parseable."""
    matches = re.findall(r"(\d{1,2}:\d{2}\s*(?:AM|PM))", time_str, flags=re.IGNORECASE)
    if len(matches) != 2:
        return time_str
    shifted: List[str] = []
    for m in matches:
        try:
            dt = datetime.strptime(m.upper().strip(), "%I:%M %p") + timedelta(minutes=delay_minutes)
            shifted.append(dt.strftime("%I:%M %p"))
        except ValueError:
            return time_str
    return f"{shifted[0]} - {shifted[1]}"


def replan_day_for_delay(
    proposed_plan: List[Dict[str, Any]],
    day_number: int,
    current_stop_index: int,
    delay_minutes: int,
) -> List[Dict[str, Any]]:
    """Shift downstream non-medical/non-fixed stops for a delayed day."""
    updated_plan = json.loads(json.dumps(proposed_plan))
    for day in updated_plan:
        if day.get("dayNumber") != day_number:
            continue
        stops = day.get("stops", [])
        for idx in range(current_stop_index + 1, len(stops)):
            stop = stops[idx]
            if stop.get("category") == "medical":
                continue
            stop["time"] = _shift_time_range(stop.get("time", ""), delay_minutes)
    return updated_plan
