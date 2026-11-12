from __future__ import annotations

from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.post import Post, PostLike
from app.models.user import User
from app.schemas.post import LikeToggleResponse, PostCreateRequest, PostResponse

router = APIRouter(prefix="/posts", tags=["Community Feed"])


async def _get_liked_by_map(db: AsyncSession, post_ids: List[str]) -> Dict[str, List[str]]:
    if not post_ids:
        return {}
    result = await db.execute(select(PostLike).where(PostLike.post_id.in_(post_ids)))
    liked_map: Dict[str, List[str]] = {pid: [] for pid in post_ids}
    for row in result.scalars().all():
        liked_map.setdefault(row.post_id, []).append(row.user_id)
    return liked_map


def _to_post_response(p: Post, liked_by: List[str]) -> PostResponse:
    return PostResponse(
        id=p.id,
        userId=p.user_id,
        authorName=p.author_name,
        authorUsername=p.author_username,
        title=p.title,
        content=p.content,
        category=p.category,
        tags=p.tags or [],
        likesCount=p.likes_count,
        likedBy=liked_by,
        createdAt=p.created_at,
    )


@router.get("", response_model=List[PostResponse])
async def list_posts(
    sub_filter: str = Query(default="latest", pattern="^(latest|hot|growing|mine)$"),
    category: Optional[str] = Query(default=None),
    tag: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[PostResponse]:
    stmt = select(Post)
    if sub_filter == "mine":
        stmt = stmt.where(Post.user_id == current_user.id)
    if category and category.lower() != "all":
        stmt = stmt.where(Post.category == category)

    if sub_filter == "hot":
        stmt = stmt.order_by(Post.likes_count.desc(), Post.created_at.desc())
    else:
        stmt = stmt.order_by(Post.created_at.desc())

    result = await db.execute(stmt.limit(100))
    posts = list(result.scalars().all())

    if tag:
        tag_lower = tag.lower()
        posts = [p for p in posts if any(t.lower() == tag_lower for t in (p.tags or []))]

    if q and q.strip():
        ql = q.strip().lower()
        posts = [
            p
            for p in posts
            if ql in p.title.lower()
            or ql in p.content.lower()
            or ql in p.author_name.lower()
            or ql in p.author_username.lower()
            or ql in p.category.lower()
            or any(ql in t.lower() for t in (p.tags or []))
        ]

    liked_map = await _get_liked_by_map(db, [p.id for p in posts])
    return [_to_post_response(p, liked_map.get(p.id, [])) for p in posts]


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PostResponse:
    post = Post(
        user_id=current_user.id,
        author_name=current_user.full_name,
        author_username=current_user.username,
        title=payload.title.strip(),
        content=payload.content.strip(),
        category=payload.category.strip() or "Experiences",
        tags=payload.tags,
        likes_count=0,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return _to_post_response(post, [])


@router.post("/{post_id}/like", response_model=LikeToggleResponse)
async def toggle_like_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> LikeToggleResponse:
    post_res = await db.execute(select(Post).where(Post.id == post_id))
    post = post_res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    like_res = await db.execute(
        select(PostLike).where(PostLike.post_id == post_id, PostLike.user_id == current_user.id)
    )
    existing_like = like_res.scalar_one_or_none()

    if existing_like:
        await db.execute(
            delete(PostLike).where(PostLike.post_id == post_id, PostLike.user_id == current_user.id)
        )
        post.likes_count = max(0, post.likes_count - 1)
    else:
        db.add(PostLike(post_id=post_id, user_id=current_user.id))
        post.likes_count = post.likes_count + 1

    await db.commit()
    await db.refresh(post)

    liked_map = await _get_liked_by_map(db, [post_id])
    return LikeToggleResponse(likesCount=post.likes_count, likedBy=liked_map.get(post_id, []))


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    post_res = await db.execute(select(Post).where(Post.id == post_id))
    post = post_res.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the post owner can delete it.")

    await db.execute(delete(Post).where(Post.id == post_id))
    await db.commit()
