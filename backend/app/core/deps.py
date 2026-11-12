from __future__ import annotations

from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.appwrite_client import appwrite_client, q_equal, q_limit

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Dict[str, Any]:
    """Resolve and return the authenticated user profile from Appwrite."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
        )

    payload = decode_access_token(credentials.credentials)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
        )

    user_id = str(payload["sub"])
    tier = str(payload.get("tier", "free"))
    email = str(payload.get("email", ""))
    name = str(payload.get("name", "Traveler"))
    username = str(payload.get("username", "traveler"))

    profile: Optional[Dict[str, Any]] = None
    try:
        profile = await appwrite_client.get_document(settings.APPWRITE_USERS_COLLECTION_ID, user_id)
        if not profile:
            # Check if document was created with an auto ID and userId attribute
            docs = await appwrite_client.list_documents(
                settings.APPWRITE_USERS_COLLECTION_ID,
                [q_equal("userId", [user_id]), q_limit(1)],
            )
            if docs:
                profile = docs[0]
    except Exception:
        profile = None

    # If Appwrite database document lookup failed or wasn't configured,
    # fallback to JWT claims so the user is NEVER kicked out of their session
    if not profile:
        profile = {
            "userId": user_id,
            "$id": user_id,
            "fullName": name,
            "email": email,
            "username": username,
            "phone": "",
            "state": "",
            "tier": tier,
        }

    return profile


async def require_pro_tier(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Ensure the authenticated user is on the Pro tier."""
    if current_user.get("tier") != "pro":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires a LessGooo+ Pro subscription.",
        )
    return current_user
