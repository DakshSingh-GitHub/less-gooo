from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field

ExpenseCategory = Literal["transit", "food", "temple", "guide", "shopping", "stay"]


class ExpenseCreateRequest(BaseModel):
    tripId: Optional[str] = None
    itineraryId: Optional[str] = None
    title: str = Field(min_length=1, max_length=255)
    amountINR: float = Field(ge=0)
    category: ExpenseCategory = "transit"
    timestamp: Optional[str] = None


class TransitExpenseLeg(BaseModel):
    title: str
    amountINR: float = Field(ge=0)


class SyncTransitExpensesRequest(BaseModel):
    tripId: str
    approaching: TransitExpenseLeg
    departure: TransitExpenseLeg


class ExpenseResponse(BaseModel):
    id: str
    userId: str
    tripId: Optional[str] = None
    itineraryId: Optional[str] = None
    title: str
    amountINR: float
    category: ExpenseCategory
    timestamp: str
