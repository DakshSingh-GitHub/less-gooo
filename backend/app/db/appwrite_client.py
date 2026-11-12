from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

import httpx
from fastapi import HTTPException, status

from app.core.config import settings


def q_equal(attribute: str, values: List[Any]) -> str:
    return json.dumps({"method": "equal", "attribute": attribute, "values": values})


def q_order_desc(attribute: str) -> str:
    return json.dumps({"method": "orderDesc", "attribute": attribute})


def q_limit(value: int) -> str:
    return json.dumps({"method": "limit", "values": [value]})


class AppwriteClient:
    """Async REST client for Appwrite Cloud Auth & Databases."""

    def _base_headers(self, include_api_key: bool = True) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "X-Appwrite-Project": settings.APPWRITE_PROJECT_ID,
        }
        if include_api_key and settings.APPWRITE_API_KEY:
            headers["X-Appwrite-Key"] = settings.APPWRITE_API_KEY
        return headers

    def _db_url(self, collection_id: str, document_id: Optional[str] = None) -> str:
        base = (
            f"{settings.APPWRITE_ENDPOINT.rstrip('/')}"
            f"/databases/{settings.APPWRITE_DATABASE_ID}/collections/{collection_id}/documents"
        )
        return f"{base}/{document_id}" if document_id else base

    async def _request(
        self,
        method: str,
        url: str,
        *,
        json_body: Optional[Dict[str, Any]] = None,
        params: Optional[List[tuple]] = None,
        include_api_key: bool = True,
    ) -> Any:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.request(
                method,
                url,
                json=json_body,
                params=params,
                headers=self._base_headers(include_api_key=include_api_key),
            )
        if res.status_code == 204:
            return None
        data = res.json() if res.content else {}
        if not res.is_success:
            msg = data.get("message") or f"Appwrite error ({res.status_code})"
            raise HTTPException(status_code=res.status_code, detail=msg)
        return data

    # --- Appwrite Auth ---
    async def create_auth_user(self, email: str, password: str, name: str) -> Dict[str, Any]:
        url = f"{settings.APPWRITE_ENDPOINT.rstrip('/')}/users"
        return await self._request(
            "POST",
            url,
            json_body={
                "userId": "unique()",
                "email": email,
                "password": password,
                "name": name,
            },
        )

    async def verify_email_password(self, email: str, password: str) -> Dict[str, Any]:
        url = f"{settings.APPWRITE_ENDPOINT.rstrip('/')}/account/sessions/email"
        return await self._request(
            "POST",
            url,
            json_body={"email": email, "password": password},
            include_api_key=False,
        )

    async def update_auth_user_name(self, user_id: str, name: str) -> None:
        url = f"{settings.APPWRITE_ENDPOINT.rstrip('/')}/users/{user_id}/name"
        await self._request("PATCH", url, json_body={"name": name})

    # --- Appwrite Databases ---
    async def list_documents(
        self, collection_id: str, queries: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        params = [("queries[]", q) for q in (queries or [])]
        data = await self._request("GET", self._db_url(collection_id), params=params)
        return list(data.get("documents", []))

    async def get_document(self, collection_id: str, document_id: str) -> Optional[Dict[str, Any]]:
        try:
            return await self._request("GET", self._db_url(collection_id, document_id))
        except HTTPException as exc:
            if exc.status_code == status.HTTP_404_NOT_FOUND:
                return None
            raise

    async def create_document(
        self,
        collection_id: str,
        data: Dict[str, Any],
        document_id: str = "unique()",
    ) -> Dict[str, Any]:
        return await self._request(
            "POST",
            self._db_url(collection_id),
            json_body={"documentId": document_id, "data": data},
        )

    async def update_document(
        self, collection_id: str, document_id: str, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        return await self._request(
            "PATCH",
            self._db_url(collection_id, document_id),
            json_body={"data": data},
        )

    async def delete_document(self, collection_id: str, document_id: str) -> None:
        await self._request("DELETE", self._db_url(collection_id, document_id))


appwrite_client = AppwriteClient()
