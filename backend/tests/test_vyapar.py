"""Tests for Vyapar AI Endpoints and Multi-Agent Shop Management."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_vyapar_briefing_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/sme/vyapar/briefing")
        assert resp.status_code == 200
        data = resp.json()
        assert data["owner"] == "Rajesh Bhai"
        assert data["yesterday_sales"] == 48750
        assert data["profit"] == 11430
        assert data["outstanding_payments"] == 72500
        assert len(data["proactive_alerts"]) == 3


@pytest.mark.asyncio
async def test_vyapar_supplier_comparison():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/sme/vyapar/suppliers/compare")
        assert resp.status_code == 200
        data = resp.json()
        assert data["potential_saving"] == 670
        assert data["best_option"]["supplier_name"] == "Mahesh Traders"
        assert len(data["suppliers"]) == 3


@pytest.mark.asyncio
async def test_vyapar_customer_overdue():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/sme/vyapar/customers/overdue")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_outstanding"] == 72500
        assert len(data["customers"]) == 3
        # Check Sharma Construction recovery probability
        sharma = next(c for c in data["customers"] if c["name"] == "Sharma Construction")
        assert sharma["amount"] == 32000
        assert sharma["recovery_probability"] == 92


@pytest.mark.asyncio
async def test_vyapar_reminders_send():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/sme/vyapar/reminders/send", json={"total": 72500})
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert data["sent_count"] == 3


@pytest.mark.asyncio
async def test_vyapar_shelf_space_analysis():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/sme/vyapar/shelf-analysis")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["products"]) == 2
        assert data["estimated_additional_monthly_profit"]["formatted"] == "₹18,000–₹24,000"


@pytest.mark.asyncio
async def test_vyapar_proactive_alerts():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/v1/sme/vyapar/proactive-alerts")
        assert resp.status_code == 200
        data = resp.json()
        assert "Copper Wire" in data["detected_item"]
        assert data["potential_lost_sales_if_ignored"] == 45000


@pytest.mark.asyncio
async def test_vyapar_hinglish_query():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/v1/sme/query", json={"query": "Good morning. Aaj shop ka status batao."})
        assert resp.status_code == 200
        data = resp.json()
        assert data["enterprise"] == "Rajesh Hardware & Electricals (Thane)"
        assert "₹48,750" in data["final_answer"]
