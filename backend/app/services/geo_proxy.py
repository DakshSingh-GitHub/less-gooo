from __future__ import annotations

import time
from typing import Any, Dict, Optional, Tuple

import httpx

NOMINATIM_BASE = "https://nominatim.openstreetmap.org"
OSRM_BASE = "https://router.project-osrm.org"
USER_AGENT = "LessGoooTravelCompanion/1.0"

# Simple in-memory TTL cache: key -> (expires_at, data)
_cache: Dict[str, Tuple[float, Any]] = {}


def _get_cached(key: str) -> Optional[Any]:
    entry = _cache.get(key)
    if not entry:
        return None
    expires_at, data = entry
    if time.time() > expires_at:
        _cache.pop(key, None)
        return None
    return data


def _set_cached(key: str, data: Any, ttl_seconds: int) -> None:
    _cache[key] = (time.time() + ttl_seconds, data)


async def geocode_query(query: str) -> Any:
    key = f"geo:{query.strip().lower()}"
    cached = _get_cached(key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(
            f"{NOMINATIM_BASE}/search",
            params={"format": "json", "q": query, "limit": 1},
            headers={"Accept-Language": "en", "User-Agent": USER_AGENT},
        )
        res.raise_for_status()
        data = res.json()
        _set_cached(key, data, ttl_seconds=86400)
        return data


async def reverse_geocode(lat: float, lon: float) -> Any:
    key = f"rev:{round(lat, 4)}:{round(lon, 4)}"
    cached = _get_cached(key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.get(
            f"{NOMINATIM_BASE}/reverse",
            params={"format": "json", "lat": lat, "lon": lon},
            headers={"Accept-Language": "en", "User-Agent": USER_AGENT},
        )
        res.raise_for_status()
        data = res.json()
        _set_cached(key, data, ttl_seconds=86400)
        return data


async def get_driving_route(orig_lat: float, orig_lng: float, dest_lat: float, dest_lng: float) -> Any:
    key = f"route:{round(orig_lat, 4)},{round(orig_lng, 4)}->{round(dest_lat, 4)},{round(dest_lng, 4)}"
    cached = _get_cached(key)
    if cached is not None:
        return cached

    url = f"{OSRM_BASE}/route/v1/driving/{orig_lng},{orig_lat};{dest_lng},{dest_lat}"
    async with httpx.AsyncClient(timeout=12.0) as client:
        res = await client.get(
            url,
            params={"overview": "full", "geometries": "geojson", "steps": "true"},
            headers={"User-Agent": USER_AGENT},
        )
        res.raise_for_status()
        data = res.json()
        _set_cached(key, data, ttl_seconds=900)
        return data
