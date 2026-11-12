from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Trip(Base):
    """User trip record including specifications, proposed plan, and transit cost breakdowns."""

    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    from_city: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[str] = mapped_column(String(50), nullable=False)
    end_date: Mapped[str] = mapped_column(String(50), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="Vacation")
    budget: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    status: Mapped[str] = mapped_column(String(20), index=True, nullable=False, default="upcoming")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    specifications: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    proposed_plan: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
    estimated_ticket_cost: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    estimated_transit_cost: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    approaching_transit_cost: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    departure_transit_cost: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
