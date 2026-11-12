from __future__ import annotations

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env."""

    APP_NAME: str = "LessGooo API"
    API_V1_PREFIX: str = "/api/v1"

    # Appwrite Cloud configuration
    APPWRITE_ENDPOINT: str = "https://nyc.cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID: str = "6addf37400385e615d7d"
    APPWRITE_DATABASE_ID: str = "6addf6920037cf1f242e"
    APPWRITE_API_KEY: str = ""
    APPWRITE_USERS_COLLECTION_ID: str = "6addf762000aef39ee91"
    APPWRITE_TRIPS_COLLECTION_ID: str = "trips"
    APPWRITE_ITINERARIES_COLLECTION_ID: str = "itineraries"
    APPWRITE_EXPENSES_COLLECTION_ID: str = "expenses"
    APPWRITE_GUIDES_COLLECTION_ID: str = "guides"
    APPWRITE_POSTS_COLLECTION_ID: str = "posts"

    # Auth & AI
    JWT_SECRET_KEY: str = "lessgooo-dev-secret-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    GEMINI_API_KEY: str = ""
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
