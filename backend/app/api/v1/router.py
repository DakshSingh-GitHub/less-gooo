from fastapi import APIRouter

from app.api.v1 import auth, expenses, guides, maps, plans, posts, trips

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(trips.router)
api_router.include_router(plans.router)
api_router.include_router(expenses.router)
api_router.include_router(posts.router)
api_router.include_router(guides.router)
api_router.include_router(maps.router)
