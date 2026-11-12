from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.appwrite_client import appwrite_client, q_equal, q_limit, q_order_desc
from app.schemas.post import LikeToggleResponse, PostCreateRequest, PostResponse

router = APIRouter(prefix="/posts", tags=["Community Feed"])


def _parse_json_list(val: Any) -> List[str]:
    if isinstance(val, list):
        return [str(x) for x in val]
    if isinstance(val, str):
        try:
            parsed = json.loads(val)
            if isinstance(parsed, list):
                return [str(x) for x in parsed]
        except Exception:
            return [s.strip() for s in val.split(",") if s.strip()]
    return []


def _to_post_response(doc: Dict[str, Any]) -> PostResponse:
    return PostResponse(
        id=doc.get("$id") or doc.get("id", ""),
        userId=doc.get("userId") or doc.get("user_id", ""),
        authorName=doc.get("authorName") or doc.get("author_name") or "Anonymous Traveller",
        authorUsername=doc.get("authorUsername") or doc.get("author_username") or "traveller",
        title=doc.get("title", ""),
        content=doc.get("content", ""),
        category=doc.get("category") or "Experiences",
        tags=_parse_json_list(doc.get("tags")),
        likesCount=int(doc.get("likesCount") if doc.get("likesCount") is not None else doc.get("likes_count", 0)),
        likedBy=_parse_json_list(doc.get("likedBy") if doc.get("likedBy") is not None else doc.get("liked_by")),
        createdAt=doc.get("createdAt") or doc.get("created_at") or doc.get("$createdAt") or datetime.now(timezone.utc),
    )


@router.get("", response_model=List[PostResponse])
async def list_posts(
    sub_filter: str = Query(default="latest", pattern="^(latest|hot|growing|mine)$"),
    category: Optional[str] = Query(default=None),
    tag: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> List[PostResponse]:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    queries: List[str] = [q_order_desc("createdAt"), q_limit(100)]
    if sub_filter == "mine":
        queries.append(q_equal("userId", [user_id]))
    if category and category.lower() != "all":
        queries.append(q_equal("category", [category]))

    docs = await appwrite_client.list_documents(settings.APPWRITE_POSTS_COLLECTION_ID, queries)
    posts = [_to_post_response(d) for d in docs]

    if sub_filter == "hot":
        posts.sort(key=lambda p: p.likesCount, reverse=True)

    if tag:
        tag_lower = tag.lower()
        posts = [p for p in posts if any(t.lower() == tag_lower for t in p.tags)]

    if q and q.strip():
        ql = q.strip().lower()
        posts = [
            p
            for p in posts
            if ql in p.title.lower()
            or ql in p.content.lower()
            or ql in p.authorName.lower()
            or ql in p.authorUsername.lower()
            or ql in p.category.lower()
            or any(ql in t.lower() for t in p.tags)
        ]

    return posts


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> PostResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    author_name = current_user.get("fullName") or "Traveller"
    author_username = current_user.get("username") or "traveller"
    now_iso = datetime.now(timezone.utc).isoformat()
    tags_json = json.dumps(payload.tags)

    serialized = {
        "userId": user_id,
        "user_id": user_id,
        "authorName": author_name,
        "author_name": author_name,
        "authorUsername": author_username,
        "author_username": author_username,
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "category": payload.category.strip() or "Experiences",
        "tags": tags_json,
        "likesCount": 0,
        "likes_count": 0,
        "likedBy": "[]",
        "liked_by": "[]",
        "createdAt": now_iso,
        "created_at": now_iso,
    }
    created = await appwrite_client.create_document(settings.APPWRITE_POSTS_COLLECTION_ID, serialized)
    return _to_post_response(created)


@router.post("/{post_id}/like", response_model=LikeToggleResponse)
async def toggle_like_post(
    post_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> LikeToggleResponse:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    doc = await appwrite_client.get_document(settings.APPWRITE_POSTS_COLLECTION_ID, post_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    post = _to_post_response(doc)
    has_liked = user_id in post.likedBy
    new_liked_by = [uid for uid in post.likedBy if uid != user_id] if has_liked else [*post.likedBy, user_id]
    new_likes_count = max(0, post.likesCount + (-1 if has_liked else 1))
    liked_by_json = json.dumps(new_liked_by)

    await appwrite_client.update_document(
        settings.APPWRITE_POSTS_COLLECTION_ID,
        post_id,
        {
            "likesCount": new_likes_count,
            "likes_count": new_likes_count,
            "likedBy": liked_by_json,
            "liked_by": liked_by_json,
        },
    )
    return LikeToggleResponse(likesCount=new_likes_count, likedBy=new_liked_by)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> None:
    user_id = current_user.get("userId") or current_user.get("$id", "")
    doc = await appwrite_client.get_document(settings.APPWRITE_POSTS_COLLECTION_ID, post_id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
    owner_id = doc.get("userId") or doc.get("user_id")
    if owner_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the post owner can delete it.")

    await appwrite_client.delete_document(settings.APPWRITE_POSTS_COLLECTION_ID, post_id)
