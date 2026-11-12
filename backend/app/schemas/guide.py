from __future__ import annotations

from typing import List

from pydantic import BaseModel


class GuideResponse(BaseModel):
    id: str
    name: str
    phone: str
    specialty: str
    languages: List[str]
    hourlyRateINR: int
    dailyRateINR: int
    isGovtVerified: bool
    city: str


class GuideAllotRequest(BaseModel):
    tripId: str
    notes: str = ""
