from __future__ import annotations

from typing import Any, Dict, List

CORRIDOR_DISTANCES: Dict[str, int] = {
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
}


def estimate_corridor_distance(from_str: str, dest_str: str) -> int:
    clean_from = from_str.lower().split(",")[0].strip()
    clean_dest = dest_str.lower().split(",")[0].strip()
    key1 = f"{clean_from}-{clean_dest}"
    key2 = f"{clean_dest}-{clean_from}"

    if key1 in CORRIDOR_DISTANCES:
        return CORRIDOR_DISTANCES[key1]
    if key2 in CORRIDOR_DISTANCES:
        return CORRIDOR_DISTANCES[key2]
    return 650


def calculate_single_leg_transit_cost(
    mode: str,
    origin: str,
    destination: str,
    direction: str,
    passengers_count: int = 1,
    fuel_type: str = "petrol",
) -> Dict[str, Any]:
    from_city = (origin or "Origin") if direction == "approaching" else destination
    to_city = destination if direction == "approaching" else (origin or "Origin")
    distance_km = estimate_corridor_distance(origin or "Origin", destination)
    count = max(1, passengers_count)
    direction_label = "Approaching (Inbound)" if direction == "approaching" else "Departure (Outbound)"

    if mode == "self_car":
        mileage = 17 if fuel_type == "diesel" else 6 if fuel_type == "ev" else 14
        fuel_rate = 89 if fuel_type == "diesel" else 12 if fuel_type == "ev" else 101.5
        fuel_liters = round(distance_km / mileage)
        fuel_cost = round(fuel_liters * fuel_rate)
        toll_cost = round(distance_km * 2.2)
        total_cost = fuel_cost + toll_cost
        return {
            "mode": "self_car",
            "direction": direction,
            "directionLabel": direction_label,
            "from": from_city,
            "to": to_city,
            "distanceKm": distance_km,
            "fuelCost": fuel_cost,
            "fuelLiters": fuel_liters,
            "tollCost": toll_cost,
            "passengersCount": count,
            "totalCost": total_cost,
            "summaryText": f"{direction_label} via Self Car ({distance_km} km): Fuel ₹{fuel_cost:,} ({fuel_liters}L) + Tolls ₹{toll_cost:,}",
        }

    if mode == "flight":
        base_airfare = min(8500, max(3800, round(distance_km * 4.5)))
        total_cost = base_airfare * count
        return {
            "mode": "flight",
            "direction": direction,
            "directionLabel": direction_label,
            "from": from_city,
            "to": to_city,
            "distanceKm": distance_km,
            "ticketPricePerPerson": base_airfare,
            "passengersCount": count,
            "totalCost": total_cost,
            "summaryText": f"{direction_label} via Flight ({count} pax): ₹{base_airfare:,}/person (Total: ₹{total_cost:,})",
        }

    if mode == "train":
        train_one_way = round(500 + distance_km * 1.5)
        total_cost = train_one_way * count
        return {
            "mode": "train",
            "direction": direction,
            "directionLabel": direction_label,
            "from": from_city,
            "to": to_city,
            "distanceKm": distance_km,
            "ticketPricePerPerson": train_one_way,
            "passengersCount": count,
            "totalCost": total_cost,
            "summaryText": f"{direction_label} via Train ({count} pax): ₹{train_one_way:,}/person (Total: ₹{total_cost:,})",
        }

    # Outstation Cab
    cab_rate_per_km = 13
    driver_batta = 400
    toll_estimate = round(distance_km * 2.1)
    total_cost = distance_km * cab_rate_per_km + driver_batta + toll_estimate
    return {
        "mode": "cab",
        "direction": direction,
        "directionLabel": direction_label,
        "from": from_city,
        "to": to_city,
        "distanceKm": distance_km,
        "tollCost": toll_estimate,
        "passengersCount": count,
        "totalCost": total_cost,
        "summaryText": f"{direction_label} via Cab ({distance_km} km): ₹{cab_rate_per_km}/km + Tolls & Batta (Total: ₹{total_cost:,})",
    }


def estimate_tour_tickets_average(destination: str) -> Dict[str, Any]:
    dest_lower = destination.lower()
    if "varanasi" in dest_lower:
        return {
            "averageTicketPerPersonINR": 620,
            "breakdown": [
                {"item": "Subah-e-Banaras Morning Shared Wooden Boat", "priceINR": 180},
                {"item": "Kashi Vishwanath Sugam Darshan Pass (Optional)", "priceINR": 300},
                {"item": "Sarnath Archaeological Museum & Stupa Entry", "priceINR": 25},
                {"item": "Ramnagar Fort & Heritage Museum", "priceINR": 50},
                {"item": "Evening Ganga Aarti Shared Boat Seating", "priceINR": 65},
            ],
        }

    return {
        "averageTicketPerPersonINR": 480,
        "breakdown": [
            {"item": "Primary Heritage Monument / Fort Entry", "priceINR": 150},
            {"item": "Local Cultural Museum & Exhibition", "priceINR": 80},
            {"item": "Sunset Boating / Scenic Viewing Deck", "priceINR": 250},
        ],
    }


def get_local_fare_shield(origin: str, destination: str, city: str = "Varanasi") -> Dict[str, Any]:
    """Local intra-city fare brackets and negotiation phrases (from START.md)."""
    return {
        "city": city,
        "origin": origin,
        "destination": destination,
        "currency": "INR",
        "brackets": [
            {"mode": "E-Rickshaw (Shared)", "minINR": 15, "maxINR": 25, "unit": "per seat"},
            {"mode": "E-Rickshaw (Full Reserved)", "minINR": 60, "maxINR": 90, "unit": "full vehicle"},
            {"mode": "Auto Rickshaw (CNG)", "minINR": 80, "maxINR": 120, "unit": "full vehicle"},
            {"mode": "App Cab / Taxi", "minINR": 180, "maxINR": 240, "unit": "full vehicle"},
        ],
        "negotiationPhrase": f"{destination} bhaiya, ₹60–₹80 hi lagta hai, meter ya standard rate pe chaliye.",
    }
