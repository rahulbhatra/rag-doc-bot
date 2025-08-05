from datetime import datetime
from fastapi.testclient import TestClient
import sys, os

from httpx import AsyncClient, ASGITransport, Response
import pytest

# Adjust path to find `backend` if not installed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.fastapi.main import app  # Adjust if your FastAPI app is located elsewhere

client = TestClient(app)

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.mark.anyio
async def test_full_session_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Create session
        res = await client.post("/sessions")
        assert res.status_code == 200
        session_id = res.json()["id"]

        # 2. Add message
        msg = {
            "session_id": session_id,
            "role": "user",
            "text": "Hello, world!",
            "timestamp": datetime.utcnow().isoformat(),
        }
        res = await client.post(f"/sessions/{session_id}/messages", json=msg)
        assert res.status_code == 200

        # 3. Rename session
        res = await client.put(f"/sessions/{session_id}/rename", json={"title": "Updated"})
        assert res.status_code == 200

        # 4. Get sessions and verify title
        res = await client.get("/sessions")
        assert any(s["id"] == session_id and s["title"] == "Updated" for s in res.json())

        # 5. Delete session
        res = await client.delete(f"/sessions/{session_id}")
        assert res.status_code == 200