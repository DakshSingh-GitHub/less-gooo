from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.guide import Guide
from app.models.user import User
from app.schemas.guide import GuideAllotRequest, GuideResponse

router = APIRouter(prefix="/guides", tags=["Local Guides"])


def _to_guide_response(g: Guide) -> GuideResponse:
    return GuideResponse(
        id=g.id,
        name=g.name,
        phone=g.phone,
        specialty=g.specialty,
        languages=g.languages or [],
        hourlyRateINR=g.hourly_rate_inr,
        dailyRateINR=g.daily_rate_inr,
        isGovtVerified=g.is_govt_verified,
        city=g.city,
    )


@router.get("", response_model=List[GuideResponse])
async def list_guides(
    city: Optional[str] = Query(default=None),
    specialty: Optional[str] = Query(default=None),
    verified_only: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
) -> List[GuideResponse]:
    stmt = select(Guide)
    if city:
        stmt = stmt.where(Guide.city.ilike(f"%{city.strip()}%"))
    if specialty:
        stmt = stmt.where(Guide.specialty.ilike(f"%{specialty.strip()}%"))
    if verified_only:
        stmt = stmt.where(Guide.is_govt_verified.is_(True))

    result = await db.execute(stmt)
    return [_to_guide_response(g) for g in result.scalars().all()]


@router.post("/{guide_id}/allot")
async def allot_guide(
    guide_id: str,
    payload: GuideAllotRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    result = await db.execute(select(Guide).where(Guide.id == guide_id))
    guide = result.scalar_one_or_none()
    if not guide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found.")

    return {
        "status": "allotted",
        "tripId": payload.tripId,
        "priority": current_user.tier == "pro",
        "guide": _to_guide_response(guide),
    }
