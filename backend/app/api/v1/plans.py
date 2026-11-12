from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import GeneratePlanRequest, ReplanRequest
from app.services.plan_generator import (
    generate_fallback_plan,
    generate_plan_with_gemini,
    replan_day_for_delay,
)
from app.services.transit_engine import (
    calculate_single_leg_transit_cost,
    estimate_tour_tickets_average,
    get_local_fare_shield,
)

router = APIRouter(tags=["Planning & Transit"])


@router.post("/trips/generate-plan")
async def generate_plan(payload: GeneratePlanRequest) -> Dict[str, Any]:
    if not payload.destination or not payload.startDate or not payload.endDate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Destination and dates are required.",
        )

    specs = payload.specifications
    approaching_mode = specs.approachingTransitMode or specs.transitMode or "self_car"
    departure_mode = specs.departureTransitMode or specs.transitMode or "self_car"
    passengers = specs.passengersCount or 1
    approaching_fuel = specs.approachingCarFuelType or specs.carFuelType or "petrol"
    departure_fuel = specs.departureCarFuelType or specs.carFuelType or "petrol"

    approaching_cost = calculate_single_leg_transit_cost(
        mode=approaching_mode,
        origin=payload.fromCity,
        destination=payload.destination,
        direction="approaching",
        passengers_count=passengers,
        fuel_type=approaching_fuel,
    )
    departure_cost = calculate_single_leg_transit_cost(
        mode=departure_mode,
        origin=payload.fromCity,
        destination=payload.destination,
        direction="departure",
        passengers_count=passengers,
        fuel_type=departure_fuel,
    )
    tickets_estimate = estimate_tour_tickets_average(payload.destination)

    combined_total = approaching_cost["totalCost"] + departure_cost["totalCost"]
    estimated_transit_cost = {
        "mode": approaching_mode,
        "distanceKm": approaching_cost["distanceKm"],
        "roundTripDistanceKm": approaching_cost["distanceKm"] * 2,
        "fuelCost": (approaching_cost.get("fuelCost") or 0) + (departure_cost.get("fuelCost") or 0),
        "tollCost": (approaching_cost.get("tollCost") or 0) + (departure_cost.get("tollCost") or 0),
        "passengersCount": passengers,
        "roundTripTotal": combined_total,
        "summaryText": (
            f"Approaching ({approaching_mode.upper()}): ₹{approaching_cost['totalCost']:,} + "
            f"Departure ({departure_mode.upper()}): ₹{departure_cost['totalCost']:,}"
        ),
    }

    gemini_plan = await generate_plan_with_gemini(
        destination=payload.destination,
        from_city=payload.fromCity,
        start_date=payload.startDate,
        end_date=payload.endDate,
        budget=payload.budget,
        currency=payload.currency,
        category=payload.category,
        specs=specs,
        approaching_cost=approaching_cost,
        departure_cost=departure_cost,
    )

    if gemini_plan:
        return {
            "success": True,
            "source": "autonomous-engine",
            "proposedPlan": gemini_plan,
            "estimatedTicketCost": tickets_estimate["averageTicketPerPersonINR"],
            "ticketBreakdown": tickets_estimate["breakdown"],
            "approachingTransitCost": approaching_cost,
            "departureTransitCost": departure_cost,
            "estimatedTransitCost": estimated_transit_cost,
        }

    fallback_plan = generate_fallback_plan(
        destination=payload.destination,
        from_city=payload.fromCity,
        start_date=payload.startDate,
        end_date=payload.endDate,
        currency=payload.currency,
        specs=specs,
        approaching_cost=approaching_cost,
        departure_cost=departure_cost,
    )
    return {
        "success": True,
        "source": "expert-engine",
        "proposedPlan": fallback_plan,
        "estimatedTicketCost": tickets_estimate["averageTicketPerPersonINR"],
        "ticketBreakdown": tickets_estimate["breakdown"],
        "approachingTransitCost": approaching_cost,
        "departureTransitCost": departure_cost,
        "estimatedTransitCost": estimated_transit_cost,
    }


@router.post("/trips/{trip_id}/replan")
async def replan_trip_for_dwell(
    trip_id: str,
    payload: ReplanRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")
    if not trip.proposed_plan:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Trip has no proposed plan yet.")

    previous_plan = trip.proposed_plan
    updated_plan = replan_day_for_delay(
        proposed_plan=previous_plan,
        day_number=payload.dayNumber,
        current_stop_index=payload.currentStopIndex,
        delay_minutes=payload.delayMinutes,
    )

    auto_applied = current_user.tier == "pro"
    if auto_applied:
        trip.proposed_plan = updated_plan
        trip.updated_at = datetime.now(timezone.utc)
        await db.commit()

    return {
        "autoApplied": auto_applied,
        "tier": current_user.tier,
        "proposedPlan": updated_plan,
        "undoPlan": previous_plan if auto_applied else None,
    }


@router.get("/transit/fare-shield")
async def fare_shield(
    origin: str = Query(..., min_length=1),
    destination: str = Query(..., min_length=1),
    city: str = Query(default="Varanasi"),
) -> Dict[str, Any]:
    return get_local_fare_shield(origin=origin, destination=destination, city=city)
