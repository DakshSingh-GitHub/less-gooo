from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import settings
from app.core.deps import get_current_user
from app.core.security import create_access_token
from app.db.appwrite_client import appwrite_client, q_equal, q_limit
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    UserProfileResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


def _to_profile(doc: Dict[str, Any]) -> UserProfileResponse:
    return UserProfileResponse(
        userId=doc.get("userId") or doc.get("$id", ""),
        fullName=doc.get("fullName", ""),
        email=doc.get("email", ""),
        phone=doc.get("phone", ""),
        state=doc.get("state", ""),
        username=doc.get("username", ""),
        tier="pro" if doc.get("tier") == "pro" else "free",
        createdAt=doc.get("createdAt") or doc.get("$createdAt") or datetime.now(timezone.utc),
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> AuthResponse:
    clean_email = payload.email.strip().lower()
    clean_username = payload.username.lstrip("@").strip().lower().replace(" ", "_")

    existing_username = await appwrite_client.list_documents(
        settings.APPWRITE_USERS_COLLECTION_ID,
        [q_equal("username", [clean_username]), q_limit(1)],
    )
    if existing_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken.")

    auth_user = await appwrite_client.create_auth_user(
        email=clean_email,
        password=payload.password,
        name=payload.fullName.strip(),
    )
    user_id = auth_user["$id"]
    now_iso = datetime.now(timezone.utc).isoformat()

    profile_data = {
        "userId": user_id,
        "fullName": payload.fullName.strip(),
        "email": clean_email,
        "phone": payload.phone.strip(),
        "state": payload.state.strip(),
        "username": clean_username,
        "tier": "free",
        "createdAt": now_iso,
    }
    created_doc = await appwrite_client.create_document(
        settings.APPWRITE_USERS_COLLECTION_ID,
        data=profile_data,
        document_id=user_id,
    )

    token = create_access_token(user_id, {"tier": "free"})
    return AuthResponse(accessToken=token, profile=_to_profile(created_doc))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest) -> AuthResponse:
    clean_email = payload.email.strip().lower()
    session = await appwrite_client.verify_email_password(clean_email, payload.password)
    user_id = session["userId"]

    profile = await appwrite_client.get_document(settings.APPWRITE_USERS_COLLECTION_ID, user_id)
    if not profile:
        profile = {
            "userId": user_id,
            "fullName": "",
            "email": clean_email,
            "phone": "",
            "state": "",
            "username": clean_email.split("@")[0],
            "tier": "free",
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }

    token = create_access_token(user_id, {"tier": profile.get("tier", "free")})
    return AuthResponse(accessToken=token, profile=_to_profile(profile))


@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)) -> UserProfileResponse:
    return _to_profile(current_user)


@router.patch("/profile", response_model=UserProfileResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> UserProfileResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    updates: Dict[str, Any] = {}
    if payload.fullName is not None:
        updates["fullName"] = payload.fullName.strip()
        try:
            await appwrite_client.update_auth_user_name(user_id, updates["fullName"])
        except Exception:
            pass
    if payload.phone is not None:
        updates["phone"] = payload.phone.strip()
    if payload.state is not None:
        updates["state"] = payload.state.strip()

    if not updates:
        return _to_profile(current_user)

    updated_doc = await appwrite_client.update_document(
        settings.APPWRITE_USERS_COLLECTION_ID, user_id, updates
    )
    return _to_profile(updated_doc)
