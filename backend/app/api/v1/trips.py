from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import (
    TripCompleteRequest,
    TripCreateRequest,
    TripResponse,
    TripUpdateRequest,
)
from app.services.trip_reconciler import reconcile_trips_with_current_date

router = APIRouter(prefix="/trips", tags=["Trips"])


def _to_trip_response(t: Trip) -> TripResponse:
    return TripResponse(
        id=t.id,
        userId=t.user_id,
        title=t.title,
        fromCity=t.from_city,
        destination=t.destination,
        startDate=t.start_date,
        endDate=t.end_date,
        category=t.category,
        budget=t.budget,
        currency=t.currency,
        status=t.status,  # type: ignore[arg-type]
        notes=t.notes,
        specifications=t.specifications,
        proposedPlan=t.proposed_plan,
        estimatedTicketCost=t.estimated_ticket_cost,
        estimatedTransitCost=t.estimated_transit_cost,
        approachingTransitCost=t.approaching_transit_cost,
        departureTransitCost=t.departure_transit_cost,
        createdAt=t.created_at,
        updatedAt=t.updated_at,
    )


async def _demote_active_trips(db: AsyncSession, user_id: str) -> None:
    await db.execute(
        update(Trip)
        .where(Trip.user_id == user_id, Trip.status == "active")
        .values(status="upcoming", updated_at=datetime.now(timezone.utc))
    )


@router.get("", response_model=List[TripResponse])
async def list_trips(
    today: Optional[str] = Query(default=None, description="Client local date YYYY-MM-DD"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[TripResponse]:
    result = await db.execute(
        select(Trip).where(Trip.user_id == current_user.id).order_by(Trip.created_at.desc())
    )
    trips = list(result.scalars().all())
    trips, changed = reconcile_trips_with_current_date(trips, today=today)
    if changed:
        await db.commit()
    return [_to_trip_response(t) for t in trips]


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    payload: TripCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    if payload.status == "active":
        await _demote_active_trips(db, current_user.id)

    trip = Trip(
        user_id=current_user.id,
        title=payload.title.strip(),
        from_city=payload.fromCity.strip() if payload.fromCity else None,
        destination=payload.destination.strip(),
        start_date=payload.startDate,
        end_date=payload.endDate,
        category=payload.category,
        budget=payload.budget,
        currency=payload.currency,
        status=payload.status,
        notes=payload.notes,
        specifications=payload.specifications,
    )
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return _to_trip_response(trip)


@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: str,
    payload: TripUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    if payload.status == "active" and trip.status != "active":
        await _demote_active_trips(db, current_user.id)

    field_map = {
        "title": "title",
        "fromCity": "from_city",
        "destination": "destination",
        "startDate": "start_date",
        "endDate": "end_date",
        "category": "category",
        "budget": "budget",
        "currency": "currency",
        "status": "status",
        "notes": "notes",
        "specifications": "specifications",
        "proposedPlan": "proposed_plan",
        "estimatedTicketCost": "estimated_ticket_cost",
        "estimatedTransitCost": "estimated_transit_cost",
        "approachingTransitCost": "approaching_transit_cost",
        "departureTransitCost": "departure_transit_cost",
    }
    updates = payload.model_dump(exclude_unset=True)
    for schema_key, model_attr in field_map.items():
        if schema_key in updates:
            setattr(trip, model_attr, updates[schema_key])

    trip.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(trip)
    return _to_trip_response(trip)


@router.post("/{trip_id}/activate", response_model=TripResponse)
async def activate_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    await _demote_active_trips(db, current_user.id)
    trip.status = "active"
    trip.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(trip)
    return _to_trip_response(trip)


@router.post("/{trip_id}/complete", response_model=TripResponse)
async def complete_trip(
    trip_id: str,
    payload: Optional[TripCompleteRequest] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TripResponse:
    result = await db.execute(select(Trip).where(Trip.id == trip_id, Trip.user_id == current_user.id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    trip.status = "completed"
    if payload and payload.endDate:
        trip.end_date = payload.endDate
    trip.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(trip)
    return _to_trip_response(trip)
