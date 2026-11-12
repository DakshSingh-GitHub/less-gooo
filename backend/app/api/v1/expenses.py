from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreateRequest,
    ExpenseResponse,
    SyncTransitExpensesRequest,
)

router = APIRouter(prefix="/expenses", tags=["Expenses"])


def _to_expense_response(e: Expense) -> ExpenseResponse:
    return ExpenseResponse(
        id=e.id,
        userId=e.user_id,
        tripId=e.trip_id,
        itineraryId=e.itinerary_id,
        title=e.title,
        amountINR=e.amount_inr,
        category=e.category,  # type: ignore[arg-type]
        timestamp=e.timestamp,
    )


@router.get("", response_model=List[ExpenseResponse])
async def list_expenses(
    trip_id: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[ExpenseResponse]:
    stmt = select(Expense).where(Expense.user_id == current_user.id)
    if trip_id:
        stmt = stmt.where(Expense.trip_id == trip_id)
    if category:
        stmt = stmt.where(Expense.category == category)
    stmt = stmt.order_by(Expense.created_at.desc())

    result = await db.execute(stmt)
    return [_to_expense_response(e) for e in result.scalars().all()]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    payload: ExpenseCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ExpenseResponse:
    now_str = payload.timestamp or datetime.now().strftime("%I:%M %p")
    expense = Expense(
        user_id=current_user.id,
        trip_id=payload.tripId,
        itinerary_id=payload.itineraryId,
        title=payload.title.strip(),
        amount_inr=payload.amountINR,
        category=payload.category,
        timestamp=now_str,
    )
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return _to_expense_response(expense)


@router.put("/sync-transit", response_model=List[ExpenseResponse])
async def sync_transit_expenses(
    payload: SyncTransitExpensesRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[ExpenseResponse]:
    """
    Atomically replace all previous 'transit' expenses for (user_id, trip_id)
    so plan regenerations never duplicate transit costs.
    """
    await db.execute(
        delete(Expense).where(
            Expense.user_id == current_user.id,
            Expense.trip_id == payload.tripId,
            Expense.category == "transit",
        )
    )

    now_str = datetime.now().strftime("%I:%M %p")
    approaching = Expense(
        user_id=current_user.id,
        trip_id=payload.tripId,
        title=payload.approaching.title,
        amount_inr=payload.approaching.amountINR,
        category="transit",
        timestamp=now_str,
    )
    departure = Expense(
        user_id=current_user.id,
        trip_id=payload.tripId,
        title=payload.departure.title,
        amount_inr=payload.departure.amountINR,
        category="transit",
        timestamp=now_str,
    )
    db.add_all([approaching, departure])
    await db.commit()

    result = await db.execute(
        select(Expense)
        .where(Expense.user_id == current_user.id)
        .order_by(Expense.created_at.desc())
    )
    return [_to_expense_response(e) for e in result.scalars().all()]
