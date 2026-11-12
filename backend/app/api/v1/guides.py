from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.appwrite_client import appwrite_client
from app.schemas.guide import GuideAllotRequest, GuideResponse

router = APIRouter(prefix="/guides", tags=["Local Guides"])

DEFAULT_PILOT_GUIDES: List[Dict[str, Any]] = [
    {
        "id": "guide_varanasi_1",
        "name": "Pandit Raghavendra Mishra",
        "phone": "+919839011223",
        "specialty": "Senior Specialist",
        "languages": ["Hindi", "English", "Sanskrit"],
        "hourlyRateINR": 450,
        "dailyRateINR": 2200,
        "isGovtVerified": True,
        "city": "Varanasi",
    },
    {
        "id": "guide_varanasi_2",
        "name": "Ananya Tiwari",
        "phone": "+919839044556",
        "specialty": "Heritage Scholar",
        "languages": ["Hindi", "English", "Bengali"],
        "hourlyRateINR": 500,
        "dailyRateINR": 2500,
        "isGovtVerified": True,
        "city": "Varanasi",
    },
    {
        "id": "guide_varanasi_3",
        "name": "Vikram Singh Chauhan",
        "phone": "+919839077889",
        "specialty": "Spiritual Walk Leader",
        "languages": ["Hindi", "English"],
        "hourlyRateINR": 400,
        "dailyRateINR": 1800,
        "isGovtVerified": True,
        "city": "Varanasi",
    },
]


def _parse_langs(val: Any) -> List[str]:
    if isinstance(val, list):
        return [str(x) for x in val]
    if isinstance(val, str):
        try:
            parsed = json.loads(val)
            if isinstance(parsed, list):
                return [str(x) for x in parsed]
        except Exception:
            return [s.strip() for s in val.split(",") if s.strip()]
    return []


def _to_guide_response(doc: Dict[str, Any]) -> GuideResponse:
    return GuideResponse(
        id=doc.get("$id") or doc.get("id", ""),
        name=doc.get("name", ""),
        phone=doc.get("phone", ""),
        specialty=doc.get("specialty", ""),
        languages=_parse_langs(doc.get("languages")),
        hourlyRateINR=int(doc.get("hourlyRateINR", 400)),
        dailyRateINR=int(doc.get("dailyRateINR", 2000)),
        isGovtVerified=bool(doc.get("isGovtVerified", False)),
        city=doc.get("city", "Varanasi"),
    )


@router.get("", response_model=List[GuideResponse])
async def list_guides(
    city: Optional[str] = Query(default=None),
    specialty: Optional[str] = Query(default=None),
    verified_only: bool = Query(default=False),
) -> List[GuideResponse]:
    try:
        docs = await appwrite_client.list_documents(settings.APPWRITE_GUIDES_COLLECTION_ID)
        guides = [_to_guide_response(d) for d in docs] if docs else [GuideResponse(**g) for g in DEFAULT_PILOT_GUIDES]
    except HTTPException:
        guides = [GuideResponse(**g) for g in DEFAULT_PILOT_GUIDES]

    if city:
        cl = city.strip().lower()
        guides = [g for g in guides if cl in g.city.lower()]
    if specialty:
        sl = specialty.strip().lower()
        guides = [g for g in guides if sl in g.specialty.lower()]
    if verified_only:
        guides = [g for g in guides if g.isGovtVerified]
    return guides


@router.post("/{guide_id}/allot")
async def allot_guide(
    guide_id: str,
    payload: GuideAllotRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    guide: Optional[GuideResponse] = None
    try:
        doc = await appwrite_client.get_document(settings.APPWRITE_GUIDES_COLLECTION_ID, guide_id)
        if doc:
            guide = _to_guide_response(doc)
    except HTTPException:
        pass

    if not guide:
        match = next((g for g in DEFAULT_PILOT_GUIDES if g["id"] == guide_id), None)
        if match:
            guide = GuideResponse(**match)

    if not guide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Guide not found.")

    return {
        "status": "allotted",
        "tripId": payload.tripId,
        "priority": current_user.get("tier") == "pro",
        "guide": guide,
    }
