from fastapi import FastAPI, HTTPException, Query, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
import logging
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="ChopNow Recommendation Engine")

# Mock database for demonstration
class MockDB:
    def __init__(self):
        # Mock user embeddings (would be generated from user preferences and behavior)
        self.user_embeddings = {
            "user1": np.array([0.5, 0.8, 0.2, 0.1, 0.9]),
            "user2": np.array([0.1, 0.2, 0.9, 0.8, 0.1]),
            "user3": np.array([0.9, 0.1, 0.2, 0.3, 0.5]),
        }
        
        # Mock bag embeddings (would be generated from bag attributes)
        self.bag_embeddings = {
            "bag1": np.array([0.6, 0.7, 0.1, 0.2, 0.8]),  # Similar to user1
            "bag2": np.array([0.2, 0.1, 0.8, 0.9, 0.2]),  # Similar to user2
            "bag3": np.array([0.8, 0.2, 0.3, 0.1, 0.6]),  # Similar to user3
            "bag4": np.array([0.5, 0.5, 0.5, 0.5, 0.5]),  # Neutral
            "bag5": np.array([0.7, 0.6, 0.3, 0.2, 0.7]),  # Similar to user1
        }
        
        # Mock bag details
        self.bags = {
            "bag1": {
                "id": "bag1",
                "name": "Evening Bread Mix",
                "vendor": "Lagos Bakery",
                "price": 1500,
                "originalValue": 4500,
                "image": "bread-mix.jpg",
                "category": "bakery",
                "tags": ["bread", "pastry", "dinner"],
                "location": {"lat": 6.5244, "lng": 3.3792}
            },
            "bag2": {
                "id": "bag2",
                "name": "Veggie Surprise",
                "vendor": "Green Harvest",
                "price": 2200,
                "originalValue": 6000,
                "image": "veggie-surprise.jpg",
                "category": "grocery",
                "tags": ["vegetables", "organic", "healthy"],
                "location": {"lat": 6.5350, "lng": 3.3892}
            },
            "bag3": {
                "id": "bag3",
                "name": "Lunch Special",
                "vendor": "Spice Haven",
                "price": 2500,
                "originalValue": 7500,
                "image": "lunch-special.jpg",
                "category": "restaurant",
                "tags": ["lunch", "spicy", "meal"],
                "location": {"lat": 6.5150, "lng": 3.3692}
            },
            "bag4": {
                "id": "bag4",
                "name": "Fruit Basket",
                "vendor": "Fresh Picks",
                "price": 1800,
                "originalValue": 5000,
                "image": "fruit-basket.jpg",
                "category": "grocery",
                "tags": ["fruits", "fresh", "healthy"],
                "location": {"lat": 6.5100, "lng": 3.3800}
            },
            "bag5": {
                "id": "bag5",
                "name": "Pastry Box",
                "vendor": "Sweet Delights",
                "price": 1200,
                "originalValue": 3600,
                "image": "pastry-box.jpg",
                "category": "bakery",
                "tags": ["pastry", "sweet", "dessert"],
                "location": {"lat": 6.5300, "lng": 3.3750}
            }
        }
        
        # Mock trending bags (would be determined by algorithm)
        self.trending_bags = ["bag3", "bag5", "bag1"]
        
        # Mock popular bags (would be determined by algorithm)
        self.popular_bags = ["bag1", "bag2", "bag4"]

    def get_user_embedding(self, user_id):
        """Get user embedding or create a new one if not exists"""
        if user_id in self.user_embeddings:
            return self.user_embeddings[user_id]
        # Return a default embedding for new users
        return np.array([0.5, 0.5, 0.5, 0.5, 0.5])
    
    def get_bag_details(self, bag_ids):
        """Get details for a list of bag IDs"""
        return [self.bags[bag_id] for bag_id in bag_ids if bag_id in self.bags]
    
    def get_all_bags(self):
        """Get all bags"""
        return list(self.bags.values())
    
    def get_trending_bags(self):
        """Get trending bags"""
        return self.get_bag_details(self.trending_bags)
    
    def get_popular_bags(self):
        """Get popular bags"""
        return self.get_bag_details(self.popular_bags)
    
    def get_nearby_bags(self, lat, lng, radius=5.0):
        """Get bags near a location within radius (km)"""
        nearby_bags = []
        for bag_id, bag in self.bags.items():
            # Simple distance calculation (not accurate for real geo)
            bag_lat = bag["location"]["lat"]
            bag_lng = bag["location"]["lng"]
            distance = np.sqrt((bag_lat - lat)**2 + (bag_lng - lng)**2) * 111  # Rough km conversion
            if distance <= radius:
                bag_with_distance = bag.copy()
                bag_with_distance["distance"] = round(distance, 1)
                nearby_bags.append(bag_with_distance)
        return nearby_bags
    
    def get_personalized_recommendations(self, user_id, count=5):
        """Get personalized recommendations for a user"""
        user_embedding = self.get_user_embedding(user_id)
        
        # Calculate similarity between user and all bags
        similarities = {}
        for bag_id, bag_embedding in self.bag_embeddings.items():
            similarity = cosine_similarity([user_embedding], [bag_embedding])[0][0]
            similarities[bag_id] = similarity
        
        # Sort bags by similarity and get top N
        sorted_bags = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
        top_bag_ids = [bag_id for bag_id, _ in sorted_bags[:count]]
        
        return self.get_bag_details(top_bag_ids)

# Initialize mock database
db = MockDB()

# Pydantic models
class Location(BaseModel):
    lat: float
    lng: float

class UserPreferences(BaseModel):
    user_id: str
    dietary_preferences: List[str] = Field(default_factory=list)
    favorite_cuisines: List[str] = Field(default_factory=list)
    favorite_vendors: List[str] = Field(default_factory=list)
    past_orders: List[str] = Field(default_factory=list)
    location: Optional[Location] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    recommendation_type: str
    explanation: str

# Routes
@app.get("/")
def read_root():
    return {"message": "ChopNow Recommendation Engine API"}

@app.post("/recommendations/for-you", response_model=RecommendationResponse)
def get_personalized_recommendations(preferences: UserPreferences):
    """Get personalized recommendations based on user preferences"""
    try:
        recommendations = db.get_personalized_recommendations(preferences.user_id)
        
        return {
            "recommendations": recommendations,
            "recommendation_type": "personalized",
            "explanation": "Based on your preferences and past orders"
        }
    except Exception as e:
        logger.error(f"Error generating personalized recommendations: {str(e)}")
        # Fallback to popular recommendations
        return {
            "recommendations": db.get_popular_bags(),
            "recommendation_type": "popular",
            "explanation": "Popular picks you might enjoy"
        }

@app.get("/recommendations/nearby", response_model=RecommendationResponse)
def get_nearby_recommendations(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: float = Query(5.0, description="Search radius in kilometers")
):
    """Get recommendations for bags near a location"""
    try:
        nearby_bags = db.get_nearby_bags(lat, lng, radius)
        
        return {
            "recommendations": nearby_bags,
            "recommendation_type": "nearby",
            "explanation": f"Bags within {radius}km of your location"
        }
    except Exception as e:
        logger.error(f"Error generating nearby recommendations: {str(e)}")
        return {
            "recommendations": db.get_popular_bags(),
            "recommendation_type": "popular",
            "explanation": "Popular picks you might enjoy"
        }

@app.get("/recommendations/trending", response_model=RecommendationResponse)
def get_trending_recommendations():
    """Get trending bags"""
    try:
        trending_bags = db.get_trending_bags()
        
        return {
            "recommendations": trending_bags,
            "recommendation_type": "trending",
            "explanation": "Currently trending in your area"
        }
    except Exception as e:
        logger.error(f"Error generating trending recommendations: {str(e)}")
        return {
            "recommendations": db.get_popular_bags(),
            "recommendation_type": "popular",
            "explanation": "Popular picks you might enjoy"
        }

@app.get("/recommendations/popular", response_model=RecommendationResponse)
def get_popular_recommendations():
    """Get popular bags"""
    try:
        popular_bags = db.get_popular_bags()
        
        return {
            "recommendations": popular_bags,
            "recommendation_type": "popular",
            "explanation": "Most popular bags across ChopNow"
        }
    except Exception as e:
        logger.error(f"Error generating popular recommendations: {str(e)}")
        return {
            "recommendations": db.get_all_bags()[:5],
            "recommendation_type": "all",
            "explanation": "Explore these bags"
        }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
