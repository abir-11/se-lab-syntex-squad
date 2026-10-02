def test_full_career_platform_flow(client):
    test_email = "pytest_user@test.com"
    test_password = "SecurePassword123!"

    registration_response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": test_email,
            "password": test_password,
            "path": "beginner"
        }
    )
    assert registration_response.status_code == 200
    registration_data = registration_response.json()
    assert registration_data["success"] is True
    assert "access_token" in registration_data["data"]

    token = registration_data["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": test_email,
            "password": test_password
        }
    )
    assert login_response.status_code == 200
    assert login_response.json()["success"] is True

    me_response = client.get("/api/auth/me", headers=headers)
    assert me_response.status_code == 200
    assert me_response.json()["data"]["email"] == test_email

    profile_response = client.put(
        "/api/users/profile",
        headers=headers,
        json={
            "profile": {
                "education": "Computer Science",
                "department": "Computer Science",
                "interests": ["Programming", "Technology"],
                "skills": ["Python", "JavaScript"],
                "academic_strengths": ["Mathematics"],
                "experience": "Beginner",
                "career_goal": "Software Developer"
            }
        }
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["success"] is True

    preferences_response = client.put(
        "/api/users/preferences",
        headers=headers,
        json={
            "job_preferences": {
                "job_types": ["Full-time"],
                "work_mode": "Remote",
                "salary_range": "60k-80k"
            }
        }
    )
    assert preferences_response.status_code == 200

    recommendation_response = client.get(
        "/api/career/my-recommendation",
        headers=headers
    )
    assert recommendation_response.status_code == 200
    recommendation_data = recommendation_response.json()["data"]
    initial_match = recommendation_data["match_percentage"]
    assert recommendation_data["match_breakdown"]["skills"][
        "matched_skills"
    ] == ["Python", "JavaScript"]
    assert recommendation_data["match_breakdown"]["skills"][
        "missing_skills"
    ] == ["Problem Solving", "Programming"]

    roadmap_response = client.get(
        "/api/career/roadmap",
        headers=headers
    )
    assert roadmap_response.status_code == 200
    roadmap_data = roadmap_response.json()
    assert roadmap_data["total_skills_to_master"] == 2
    assert len(roadmap_data["roadmap"]) == 2

    skill_response = client.post(
        "/api/career/roadmap/complete",
        headers=headers,
        json={"skill": "Problem Solving"}
    )
    assert skill_response.status_code == 200
    first_updated_match = skill_response.json()["new_match_percentage"]
    assert first_updated_match > initial_match
    assert "Problem Solving" in skill_response.json()["updated_skills"]

    second_skill_response = client.post(
        "/api/career/roadmap/complete",
        headers=headers,
        json={"skill": "Programming"}
    )
    assert second_skill_response.status_code == 200
    final_match = second_skill_response.json()["new_match_percentage"]
    assert final_match > first_updated_match

    final_roadmap_response = client.get(
        "/api/career/roadmap",
        headers=headers
    )
    assert final_roadmap_response.status_code == 200
    assert final_roadmap_response.json()["total_skills_to_master"] == 0
    assert final_roadmap_response.json()["roadmap"] == []


def test_invalid_login(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "nonexistent@test.com",
            "password": "WrongPassword"
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"