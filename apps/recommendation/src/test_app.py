import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "ChopNow Recommendation Engine API"}

def test_personalized_recommendations():
    # Test with valid user data
    user_data = {
        "user_id": "test_user",
        "dietary_preferences": ["vegetarian"],
        "favorite_cuisines": ["italian"],
        "favorite_vendors": ["vendor1"],
        "past_orders": ["bag1"],
        "location": {"lat": 6.5244, "lng": 3.3792}
    }
    
    response = client.post("/recommendations/for-you", json=user_data)
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "recommendations" in data
    assert "recommendation_type" in data
    assert "explanation" in data
    
    # Even with no history, we should get some recommendations
    assert len(data["recommendations"]) > 0

def test_nearby_recommendations():
    # Test with valid location
    response = client.get("/recommendations/nearby?lat=6.5244&lng=3.3792&radius=5.0")
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "recommendations" in data
    assert "recommendation_type" in data
    assert "explanation" in data
    
    # Verify recommendation type
    assert data["recommendation_type"] == "nearby"

def test_trending_recommendations():
    response = client.get("/recommendations/trending")
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "recommendations" in data
    assert "recommendation_type" in data
    assert "explanation" in data
    
    # Verify recommendation type
    assert data["recommendation_type"] == "trending"
