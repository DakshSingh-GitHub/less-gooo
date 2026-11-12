from __future__ import annotations

import uuid
from typing import List

from sqlalchemy import Boolean, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Guide(Base):
    """Verified local guide for Senior Companion and cultural tours."""

    __tablename__ = "guides"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    specialty: Mapped[str] = mapped_column(String(60), nullable=False)
    languages: Mapped[List[str]] = mapped_column(JSON, nullable=False, default=list)
    hourly_rate_inr: Mapped[int] = mapped_column(Integer, nullable=False)
    daily_rate_inr: Mapped[int] = mapped_column(Integer, nullable=False)
    is_govt_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False, default="Varanasi")
