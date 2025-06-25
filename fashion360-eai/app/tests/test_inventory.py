import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_inventory():
    response = client.post("/inventory/", json={
        "sku": "TESTSKU01",
        "name": "Test Product",
        "quantity": 100,
        "location": "WH-Test",
        "description": "Test item"
    })
    assert response.status_code == 200
    assert response.json()["sku"] == "TESTSKU01"

def test_read_inventory():
    # Assuming ID 1 exists
    response = client.get("/inventory/1")
    assert response.status_code == 200
    assert "sku" in response.json()

def test_update_inventory():
    response = client.put("/inventory/1", json={
        "sku": "UPDATEDSKU01",
        "name": "Updated Product",
        "quantity": 200,
        "location": "WH-Updated",
        "description": "Updated item"
    })
    assert response.status_code == 200
    assert response.json()["sku"] == "UPDATEDSKU01"

def test_delete_inventory():
    response = client.delete("/inventory/1")
    assert response.status_code == 200
    assert "deleted" in response.json()["detail"]
