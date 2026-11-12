from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.appwrite_client import appwrite_client, q_equal, q_order_desc
from app.schemas.trip import (
    TripCompleteRequest,
    TripCreateRequest,
    TripResponse,
    TripUpdateRequest,
)
from app.services.trip_reconciler import reconcile_trips_with_current_date

router = APIRouter(prefix="/trips", tags=["Trips"])

_JSON_FIELDS = {
    "specifications",
    "proposedPlan",
    "estimatedTransitCost",
    "approachingTransitCost",
    "departureTransitCost",
}


def _parse_json_field(val: Any) -> Any:
    if isinstance(val, str):
        try:
            return json.loads(val)
        except Exception:
            return None
    return val


def _to_trip_response(doc: Dict[str, Any]) -> TripResponse:
    now_iso = datetime.now(timezone.utc).isoformat()
    return TripResponse(
        id=doc.get("$id") or doc.get("id", ""),
        userId=doc.get("userId", ""),
        title=doc.get("title", ""),
        fromCity=doc.get("from"),
        destination=doc.get("destination", ""),
        startDate=doc.get("startDate", ""),
        endDate=doc.get("endDate", ""),
        category=doc.get("category", "Vacation"),
        budget=float(doc.get("budget", 0) or 0),
        currency=doc.get("currency", "INR"),
        status=doc.get("status", "upcoming"),
        notes=doc.get("notes"),
        specifications=_parse_json_field(doc.get("specifications")),
        proposedPlan=_parse_json_field(doc.get("proposedPlan")),
        estimatedTicketCost=doc.get("estimatedTicketCost"),
        estimatedTransitCost=_parse_json_field(doc.get("estimatedTransitCost")),
        approachingTransitCost=_parse_json_field(doc.get("approachingTransitCost")),
        departureTransitCost=_parse_json_field(doc.get("departureTransitCost")),
        createdAt=doc.get("createdAt") or doc.get("$createdAt") or now_iso,
        updatedAt=doc.get("updatedAt") or doc.get("$updatedAt") or now_iso,
    )


async def _demote_active_trips(user_id: str) -> None:
    active_docs = await appwrite_client.list_documents(
        settings.APPWRITE_TRIPS_COLLECTION_ID,
        [q_equal("userId", [user_id]), q_equal("status", ["active"])],
    )
    now_iso = datetime.now(timezone.utc).isoformat()
    for doc in active_docs:
        await appwrite_client.update_document(
            settings.APPWRITE_TRIPS_COLLECTION_ID,
            doc["$id"],
            {"status": "upcoming", "updatedAt": now_iso},
        )


@router.get("", response_model=List[TripResponse])
async def list_trips(
    today: Optional[str] = Query(default=None, description="Client local date YYYY-MM-DD"),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> List[TripResponse]:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    docs = await appwrite_client.list_documents(
        settings.APPWRITE_TRIPS_COLLECTION_ID,
        [q_equal("userId", [user_id]), q_order_desc("createdAt")],
    )
    docs, changed = reconcile_trips_with_current_date(docs, today=today)
    for ch in changed:
        if ch.get("id"):
            await appwrite_client.update_document(
                settings.APPWRITE_TRIPS_COLLECTION_ID,
                ch["id"],
                {"status": ch["status"], "updatedAt": ch["updatedAt"]},
            )
    return [_to_trip_response(d) for d in docs]


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    payload: TripCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> TripResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    if payload.status == "active":
        await _demote_active_trips(user_id)

    now_iso = datetime.now(timezone.utc).isoformat()
    doc_data: Dict[str, Any] = {
        "userId": user_id,
        "title": payload.title.strip(),
        "destination": payload.destination.strip(),
        "startDate": payload.startDate,
        "endDate": payload.endDate,
        "category": payload.category,
        "budget": payload.budget,
        "currency": payload.currency,
        "status": payload.status,
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }
    if payload.fromCity:
        doc_data["from"] = payload.fromCity.strip()
    if payload.notes is not None:
        doc_data["notes"] = payload.notes
    if payload.specifications is not None:
        doc_data["specifications"] = json.dumps(payload.specifications)

    created = await appwrite_client.create_document(settings.APPWRITE_TRIPS_COLLECTION_ID, doc_data)
    return _to_trip_response(created)


@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: str,
    payload: TripUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> TripResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    existing = await appwrite_client.get_document(settings.APPWRITE_TRIPS_COLLECTION_ID, trip_id)
    if not existing or existing.get("userId") != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    if payload.status == "active" and existing.get("status") != "active":
        await _demote_active_trips(user_id)

    updates = payload.model_dump(exclude_unset=True, by_alias=True)
    appwrite_updates: Dict[str, Any] = {"updatedAt": datetime.now(timezone.utc).isoformat()}
    for k, v in updates.items():
        if k in _JSON_FIELDS and v is not None:
            appwrite_updates[k] = json.dumps(v)
        else:
            appwrite_updates[k] = v

    updated = await appwrite_client.update_document(
        settings.APPWRITE_TRIPS_COLLECTION_ID, trip_id, appwrite_updates
    )
    return _to_trip_response(updated)


@router.post("/{trip_id}/activate", response_model=TripResponse)
async def activate_trip(
    trip_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> TripResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    existing = await appwrite_client.get_document(settings.APPWRITE_TRIPS_COLLECTION_ID, trip_id)
    if not existing or existing.get("userId") != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    await _demote_active_trips(user_id)
    updated = await appwrite_client.update_document(
        settings.APPWRITE_TRIPS_COLLECTION_ID,
        trip_id,
        {"status": "active", "updatedAt": datetime.now(timezone.utc).isoformat()},
    )
    return _to_trip_response(updated)


@router.post("/{trip_id}/complete", response_model=TripResponse)
async def complete_trip(
    trip_id: str,
    payload: Optional[TripCompleteRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> TripResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    existing = await appwrite_client.get_document(settings.APPWRITE_TRIPS_COLLECTION_ID, trip_id)
    if not existing or existing.get("userId") != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    data: Dict[str, Any] = {
        "status": "completed",
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    if payload and payload.endDate:
        data["endDate"] = payload.endDate

    updated = await appwrite_client.update_document(
        settings.APPWRITE_TRIPS_COLLECTION_ID, trip_id, data
    )
    return _to_trip_response(updated)
