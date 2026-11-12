from __future__ import annotations

from typing import Any, Dict, List, Optional

import pytest
from httpx import ASGITransport, AsyncClient

from app.db.appwrite_client import appwrite_client
from app.main import app


class FakeAppwriteStore:
    """In-memory Appwrite store for deterministic offline unit/integration tests."""

    def __init__(self) -> None:
        self.collections: Dict[str, Dict[str, Dict[str, Any]]] = {}
        self._counter = 0

    def _next_id(self) -> str:
        self._counter += 1
        return f"doc_{self._counter}"

    async def create_auth_user(self, email: str, password: str, name: str) -> Dict[str, Any]:
        return {"$id": "user_1", "email": email, "name": name}

    async def verify_email_password(self, email: str, password: str) -> Dict[str, Any]:
        return {"userId": "user_1", "email": email}

    async def update_auth_user_name(self, user_id: str, name: str) -> None:
        return None

    async def list_documents(
        self, collection_id: str, queries: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        docs = list(self.collections.get(collection_id, {}).values())
        return docs

    async def get_document(self, collection_id: str, document_id: str) -> Optional[Dict[str, Any]]:
        return self.collections.get(collection_id, {}).get(document_id)

    async def create_document(
        self,
        collection_id: str,
        data: Dict[str, Any],
        document_id: str = "unique()",
    ) -> Dict[str, Any]:
        doc_id = self._next_id() if document_id == "unique()" else document_id
        doc = {"$id": doc_id, **data}
        self.collections.setdefault(collection_id, {})[doc_id] = doc
        return doc

    async def update_document(
        self, collection_id: str, document_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        existing = self.collections.get(collection_id, {}).get(document_id, {"$id": document_id})
        existing.update(data)
        self.collections.setdefault(collection_id, {})[document_id] = existing
        return existing

    async def delete_document(self, collection_id: str, document_id: str) -> None:
        self.collections.get(collection_id, {}).pop(document_id, None)


@pytest.mark.asyncio
async def test_health_and_core_flows(monkeypatch: pytest.MonkeyPatch) -> None:
    store = FakeAppwriteStore()
    for method_name in (
        "create_auth_user",
        "verify_email_password",
        "update_auth_user_name",
        "list_documents",
        "get_document",
        "create_document",
        "update_document",
        "delete_document",
    ):
        monkeypatch.setattr(appwrite_client, method_name, getattr(store, method_name))

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health
        res = await client.get("/health")
        assert res.status_code == 200
        assert res.json()["datastore"] == "appwrite"

        # 2. Register & Login
        reg_res = await client.post(
            "/api/v1/auth/register",
            json={
                "fullName": "Daksh Test",
                "email": "daksh_test@example.com",
                "password": "password123",
                "phone": "+919876543210",
                "state": "Uttar Pradesh",
                "username": "daksh_test",
            },
        )
        assert reg_res.status_code == 201
        token = reg_res.json()["accessToken"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create trip & generate plan
        trip_res = await client.post(
            "/api/v1/trips",
            headers=headers,
            json={
                "title": "Varanasi Spiritual Retreat",
                "from": "Delhi",
                "destination": "Varanasi",
                "startDate": "2026-11-12",
                "endDate": "2026-11-14",
                "category": "Spiritual",
                "budget": 15000,
                "currency": "INR",
                "status": "active",
            },
        )
        assert trip_res.status_code == 201
        trip_id = trip_res.json()["id"]

        plan_res = await client.post(
            "/api/v1/trips/generate-plan",
            json={
                "destination": "Varanasi",
                "from": "Delhi",
                "startDate": "2026-11-12",
                "endDate": "2026-11-14",
                "budget": 15000,
                "currency": "INR",
                "category": "Spiritual",
                "specifications": {
                    "pace": "moderate",
                    "includeRestaurants": True,
                    "dietaryPreference": "pure_veg",
                    "approachingTransitMode": "train",
                    "departureTransitMode": "train",
                    "passengersCount": 2,
                },
            },
        )
        assert plan_res.status_code == 200
        assert len(plan_res.json()["proposedPlan"]) == 3

        # 4. Sync transit expenses (idempotent)
        sync_res = await client.put(
            "/api/v1/expenses/sync-transit",
            headers=headers,
            json={
                "tripId": trip_id,
                "approaching": {"title": "Inbound Train", "amountINR": 3460},
                "departure": {"title": "Outbound Train", "amountINR": 3460},
            },
        )
        assert sync_res.status_code == 200
        assert len(sync_res.json()) == 2

        # 5. Guides
        guides_res = await client.get("/api/v1/guides?city=Varanasi")
        assert guides_res.status_code == 200
        assert len(guides_res.json()) == 3
