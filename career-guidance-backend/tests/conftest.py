import pytest
from fastapi.testclient import TestClient

from app.database.mongodb import db
from app.main import app


TEST_CAREER_NAME = "Pytest Software Engineer"


@pytest.fixture(scope="module")
def client():
    """Provide a TestClient instance for API requests."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def cleanup_database():
    """Remove test users, recommendations, and the seeded test career."""
    db.users.delete_many({"email": {"$regex": "@test.com$"}})
    db.recommendations.delete_many({})
    db.careers.delete_many({"career_name": TEST_CAREER_NAME})
    db.careers.insert_one({
        "career_name": TEST_CAREER_NAME,
        "required_skills": [
            "Python",
            "JavaScript",
            "Problem Solving",
            "Programming"
        ],
        "interests": ["Programming", "Technology"],
        "education": ["Computer Science"],
        "departments": ["Computer Science"],
        "experience": ["Beginner"],
        "work_preference": ["Remote"],
        "career_goals": ["Software Developer"],
        "description": "Test career",
        "demand": "High"
    })

    yield

    db.users.delete_many({"email": {"$regex": "@test.com$"}})
    db.recommendations.delete_many({})
    db.careers.delete_many({"career_name": TEST_CAREER_NAME})