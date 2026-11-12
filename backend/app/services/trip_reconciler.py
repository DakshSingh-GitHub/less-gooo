from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple


def get_local_today_date_string() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def normalize_date_string(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None
    trimmed = date_str.strip()[:10]
    return trimmed if re.match(r"^\d{4}-\d{2}-\d{2}$", trimmed) else None


def reconcile_trips_with_current_date(
    trips: List[Dict[str, Any]],
    today: Optional[str] = None,
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Reconciles a user's Appwrite trip documents with `today`.
    Returns (trips, changed_trips) where changed_trips is a list of
    {"id": trip_id, "status": new_status, "updatedAt": iso_str}.
    """
    today_str = normalize_date_string(today) or get_local_today_date_string()
    now_iso = datetime.now(timezone.utc).isoformat()
    changed_trips: List[Dict[str, Any]] = []

    for trip in trips:
        status_val = trip.get("status")
        if status_val in ("completed", "draft"):
            continue
        end = normalize_date_string(trip.get("endDate"))
        if end and today_str > end:
            trip["status"] = "completed"
            trip["updatedAt"] = now_iso
            changed_trips.append({"id": trip.get("$id") or trip.get("id"), "status": "completed", "updatedAt": now_iso})

    has_active = any(t.get("status") == "active" for t in trips)
    if not has_active:
        matching_upcoming = [
            t
            for t in trips
            if t.get("status") == "upcoming"
            and (s := normalize_date_string(t.get("startDate"))) is not None
            and (e := normalize_date_string(t.get("endDate"))) is not None
            and s <= today_str <= e
        ]
        matching_upcoming.sort(key=lambda t: normalize_date_string(t.get("startDate")) or "")
        if matching_upcoming:
            target = matching_upcoming[0]
            target["status"] = "active"
            target["updatedAt"] = now_iso
            changed_trips.append({"id": target.get("$id") or target.get("id"), "status": "active", "updatedAt": now_iso})

    return trips, changed_trips
