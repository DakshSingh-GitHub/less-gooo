from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.appwrite_client import appwrite_client, q_equal, q_order_desc
from app.schemas.expense import (
    ExpenseCreateRequest,
    ExpenseResponse,
    SyncTransitExpensesRequest,
)

router = APIRouter(prefix="/expenses", tags=["Expenses"])


def _to_expense_response(doc: Dict[str, Any]) -> ExpenseResponse:
    return ExpenseResponse(
        id=doc.get("$id") or doc.get("id", ""),
        userId=doc.get("userId", ""),
        tripId=doc.get("tripId"),
        itineraryId=doc.get("itineraryId"),
        title=doc.get("title", ""),
        amountINR=float(doc.get("amountINR", 0) or 0),
        category=doc.get("category", "transit"),
        timestamp=doc.get("timestamp", ""),
    )


@router.get("", response_model=List[ExpenseResponse])
async def list_expenses(
    trip_id: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> List[ExpenseResponse]:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    queries = [q_equal("userId", [user_id]), q_order_desc("timestamp")]
    if trip_id:
        queries.append(q_equal("tripId", [trip_id]))
    if category:
        queries.append(q_equal("category", [category]))

    docs = await appwrite_client.list_documents(settings.APPWRITE_EXPENSES_COLLECTION_ID, queries)
    return [_to_expense_response(d) for d in docs]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    payload: ExpenseCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> ExpenseResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    now_str = payload.timestamp or datetime.now().strftime("%I:%M %p")
    data: Dict[str, Any] = {
        "userId": user_id,
        "title": payload.title.strip(),
        "amountINR": payload.amountINR,
        "category": payload.category,
        "timestamp": now_str,
    }
    if payload.tripId:
        data["tripId"] = payload.tripId
    if payload.itineraryId:
        data["itineraryId"] = payload.itineraryId

    created = await appwrite_client.create_document(settings.APPWRITE_EXPENSES_COLLECTION_ID, data)
    return _to_expense_response(created)


@router.put("/sync-transit", response_model=List[ExpenseResponse])
async def sync_transit_expenses(
    payload: SyncTransitExpensesRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> List[ExpenseResponse]:
    """
    Replace all previous 'transit' expenses for (user_id, trip_id) in Appwrite
    so plan regenerations never duplicate transit costs.
    """
    user_id = current_user.get("userId") or current_user.get("$id", "")
    existing = await appwrite_client.list_documents(
        settings.APPWRITE_EXPENSES_COLLECTION_ID,
        [
            q_equal("userId", [user_id]),
            q_equal("tripId", [payload.tripId]),
            q_equal("category", ["transit"]),
        ],
    )
    for doc in existing:
        await appwrite_client.delete_document(settings.APPWRITE_EXPENSES_COLLECTION_ID, doc["$id"])

    now_str = datetime.now().strftime("%I:%M %p")
    await appwrite_client.create_document(
        settings.APPWRITE_EXPENSES_COLLECTION_ID,
        {
            "userId": user_id,
            "tripId": payload.tripId,
            "title": payload.approaching.title,
            "amountINR": payload.approaching.amountINR,
            "category": "transit",
            "timestamp": now_str,
        },
    )
    await appwrite_client.create_document(
        settings.APPWRITE_EXPENSES_COLLECTION_ID,
        {
            "userId": user_id,
            "tripId": payload.tripId,
            "title": payload.departure.title,
            "amountINR": payload.departure.amountINR,
            "category": "transit",
            "timestamp": now_str,
        },
    )

    updated_docs = await appwrite_client.list_documents(
        settings.APPWRITE_EXPENSES_COLLECTION_ID,
        [q_equal("userId", [user_id]), q_order_desc("timestamp")],
    )
    return [_to_expense_response(d) for d in updated_docs]
