from __future__ import annotations

from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query, status

from app.services.geo_proxy import geocode_query, get_driving_route, reverse_geocode

router = APIRouter(prefix="/maps", tags=["Maps Proxy"])


@router.get("/geocode")
async def geocode(q: str = Query(..., min_length=2)) -> Any:
    try:
        return await geocode_query(q)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Geocoding error: {exc}")


@router.get("/reverse")
async def reverse(lat: float = Query(...), lon: float = Query(...)) -> Any:
    try:
        return await reverse_geocode(lat, lon)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Reverse geocoding error: {exc}")


@router.get("/route")
async def route(
    orig_lat: float = Query(...),
    orig_lng: float = Query(...),
    dest_lat: float = Query(...),
    dest_lng: float = Query(...),
) -> Any:
    try:
        return await get_driving_route(orig_lat, orig_lng, dest_lat, dest_lng)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Routing error: {exc}")
