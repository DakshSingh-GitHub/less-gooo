from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_health_and_core_flows() -> None:
    # Ensure lifespan runs so tables and seed guides are created
    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            # 1. Health
            res = await client.get("/health")
            assert res.status_code == 200
            assert res.json()["status"] == "ok"

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
            assert reg_res.status_code in (201, 409)

            login_res = await client.post(
                "/api/v1/auth/login",
                json={"email": "daksh_test@example.com", "password": "password123"},
            )
            assert login_res.status_code == 200
            token = login_res.json()["accessToken"]
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
            assert len(sync_res.json()) >= 2

            # 5. Guides
            guides_res = await client.get("/api/v1/guides?city=Varanasi")
            assert guides_res.status_code == 200
            assert len(guides_res.json()) == 3
