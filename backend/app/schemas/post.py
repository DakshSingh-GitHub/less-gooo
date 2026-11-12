from __future__ import annotations

from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class PostCreateRequest(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1, max_length=10000)
    category: str = Field(default="Experiences", max_length=64)
    tags: List[str] = Field(default_factory=list)


class PostResponse(BaseModel):
    id: str
    userId: str
    authorName: str
    authorUsername: str
    title: str
    content: str
    category: str
    tags: List[str]
    likesCount: int
    likedBy: List[str]
    createdAt: datetime


class LikeToggleResponse(BaseModel):
    likesCount: int
    likedBy: List[str]
