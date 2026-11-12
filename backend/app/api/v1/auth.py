from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    UserProfileResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


def _to_profile(user: User) -> UserProfileResponse:
    return UserProfileResponse(
        userId=user.id,
        fullName=user.full_name,
        email=user.email,
        phone=user.phone,
        state=user.state,
        username=user.username,
        tier=user.tier if user.tier in ("free", "pro") else "free",
        createdAt=user.created_at,
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> AuthResponse:
    clean_email = payload.email.strip().lower()
    clean_username = payload.username.lstrip("@").strip().lower().replace(" ", "_")

    existing_email = await db.execute(select(User).where(User.email == clean_email))
    if existing_email.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered.")

    existing_username = await db.execute(select(User).where(User.username == clean_username))
    if existing_username.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken.")

    user = User(
        full_name=payload.fullName.strip(),
        email=clean_email,
        username=clean_username,
        password_hash=hash_password(payload.password),
        phone=payload.phone.strip(),
        state=payload.state.strip(),
        tier="free",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id, {"tier": user.tier})
    return AuthResponse(accessToken=token, profile=_to_profile(user))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> AuthResponse:
    clean_email = payload.email.strip().lower()
    result = await db.execute(select(User).where(User.email == clean_email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(user.id, {"tier": user.tier})
    return AuthResponse(accessToken=token, profile=_to_profile(user))


@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: User = Depends(get_current_user)) -> UserProfileResponse:
    return _to_profile(current_user)


@router.patch("/profile", response_model=UserProfileResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserProfileResponse:
    if payload.fullName is not None:
        current_user.full_name = payload.fullName.strip()
    if payload.phone is not None:
        current_user.phone = payload.phone.strip()
    if payload.state is not None:
        current_user.state = payload.state.strip()

    await db.commit()
    await db.refresh(current_user)
    return _to_profile(current_user)
