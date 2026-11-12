from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator, Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models import Guide


async def _seed_default_guides() -> None:
    """Seed initial verified Varanasi guides if the guides table is empty."""
    async with AsyncSessionLocal() as db:
        existing = await db.execute(select(Guide).limit(1))
        if existing.scalar_one_or_none():
            return
        db.add_all(
            [
                Guide(
                    name="Pandit Raghavendra Mishra",
                    phone="+919839011223",
                    specialty="Senior Specialist",
                    languages=["Hindi", "English", "Sanskrit"],
                    hourly_rate_inr=450,
                    daily_rate_inr=2200,
                    is_govt_verified=True,
                    city="Varanasi",
                ),
                Guide(
                    name="Ananya Tiwari",
                    phone="+919839044556",
                    specialty="Heritage Scholar",
                    languages=["Hindi", "English", "Bengali"],
                    hourly_rate_inr=500,
                    daily_rate_inr=2500,
                    is_govt_verified=True,
                    city="Varanasi",
                ),
                Guide(
                    name="Vikram Singh Chauhan",
                    phone="+919839077889",
                    specialty="Spiritual Walk Leader",
                    languages=["Hindi", "English"],
                    hourly_rate_inr=400,
                    daily_rate_inr=1800,
                    is_govt_verified=True,
                    city="Varanasi",
                ),
            ]
        )
        await db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await _seed_default_guides()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, str]:
    return {"status": "ok", "service": settings.APP_NAME}
