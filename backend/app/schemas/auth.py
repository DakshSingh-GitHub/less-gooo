from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    fullName: str = Field(min_length=1, max_length=128)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    phone: str = Field(default="", max_length=20)
    state: str = Field(default="", max_length=100)
    username: str = Field(min_length=2, max_length=64)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class ProfileUpdateRequest(BaseModel):
    fullName: Optional[str] = Field(default=None, min_length=1, max_length=128)
    phone: Optional[str] = Field(default=None, max_length=20)
    state: Optional[str] = Field(default=None, max_length=100)


class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    userId: str
    fullName: str
    email: EmailStr
    phone: str
    state: str
    username: str
    tier: Literal["free", "pro"] = "free"
    createdAt: datetime


class AuthResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    profile: UserProfileResponse
