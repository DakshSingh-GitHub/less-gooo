from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from app.models.trip import Trip


def get_local_today_date_string() -> str:
    return datetime.now().strftime("%Y-%m-%d")


def normalize_date_string(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None
    trimmed = date_str.strip()[:10]
    return trimmed if re.match(r"^\d{4}-\d{2}-\d{2}$", trimmed) else None


def get_automated_trip_status(
    start_date: str,
    end_date: str,
    today: Optional[str] = None,
) -> str:
    today_str = normalize_date_string(today) or get_local_today_date_string()
    start = normalize_date_string(start_date)
    end = normalize_date_string(end_date)

    if not start or not end:
        return "upcoming"
    if today_str > end:
        return "completed"
    if start <= today_str <= end:
        return "active"
    return "upcoming"


def reconcile_trips_with_current_date(
    trips: List[Trip],
    today: Optional[str] = None,
) -> Tuple[List[Trip], bool]:
    """
    Reconciles a user's trips with `today`:
    1. Marks expired active/upcoming trips (today > end_date) as 'completed'.
    2. If no trip is currently 'active', promotes the earliest matching 'upcoming'
       trip (start_date <= today <= end_date) to 'active'.
    Returns (trips, changed).
    """
    today_str = normalize_date_string(today) or get_local_today_date_string()
    now_utc = datetime.now(timezone.utc)
    changed = False

    # Pass 1: Expire trips past their end date
    for trip in trips:
        if trip.status in ("completed", "draft"):
            continue
        end = normalize_date_string(trip.end_date)
        if end and today_str > end:
            trip.status = "completed"
            trip.updated_at = now_utc
            changed = True

    # Pass 2: Promote a matching upcoming trip if none is active
    has_active = any(t.status == "active" for t in trips)
    if not has_active:
        matching_upcoming = [
            t
            for t in trips
            if t.status == "upcoming"
            and (s := normalize_date_string(t.start_date)) is not None
            and (e := normalize_date_string(t.end_date)) is not None
            and s <= today_str <= e
        ]
        matching_upcoming.sort(key=lambda t: normalize_date_string(t.start_date) or "")
        if matching_upcoming:
            matching_upcoming[0].status = "active"
            matching_upcoming[0].updated_at = now_utc
            changed = True

    return trips, changed
