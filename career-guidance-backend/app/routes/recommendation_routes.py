from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from app.schemas.recommendation_schema import CareerRecommendationRequest
from app.services.recommendation_service import (
    recommend_career,
    recommend_for_user,
    save_recommendation,
    get_recommendation_history,
    get_user_recommendation
)
from app.utils.security import get_current_user
from app.services.user_service import (
    get_user_profile,
    update_user_profile
)

router = APIRouter(
    prefix="/api/career",
    tags=["Career Recommendation"],
)

security = HTTPBearer()


class CompleteSkillRequest(BaseModel):
    skill: str


@router.post("/recommend")
def get_career_recommendation(
    data: CareerRecommendationRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = get_current_user(credentials.credentials)

    result = recommend_career(data)

    return {
        "success": True,
        "user_id": user_id,
        "data": result,
    }


@router.get("/my-recommendation")
def get_my_recommendation(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = get_current_user(credentials.credentials)

    # Generate recommendation
    result = recommend_for_user(user_id)

    # Save recommendation history
    saved = save_recommendation(user_id, result)

    return {
        "success": True,
        "user_id": user_id,
        "data": result,
        "saved": saved
    }


@router.get("/history")
def get_history(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = get_current_user(credentials.credentials)

    history = get_recommendation_history(user_id)

    return {
        "success": True,
        "user_id": user_id,
        "count": len(history),
        "data": history
    }


@router.get("/roadmap")
def get_career_roadmap(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = get_current_user(credentials.credentials)

    recommendation = get_user_recommendation(user_id)

    if not recommendation:
        raise HTTPException(
            status_code=404,
            detail=(
                "No recommendation found. Run "
                "/api/career/my-recommendation first."
            )
        )

    recommendation_data = recommendation["data"]
    top_career = recommendation_data["recommended_career"]
    skills_breakdown = recommendation_data["match_breakdown"]["skills"]
    missing_skills = skills_breakdown.get("missing_skills", [])

    roadmap_steps = []

    for index, skill in enumerate(missing_skills, start=1):
        roadmap_steps.append({
            "step": index,
            "skill_to_learn": skill,
            "status": "Pending",
            "action": (
                "Complete foundational modules and practical projects "
                f"in {skill}."
            )
        })

    return {
        "success": True,
        "target_career": top_career,
        "current_match_percentage": recommendation_data[
            "match_percentage"
        ],
        "total_skills_to_master": len(missing_skills),
        "roadmap": roadmap_steps
    }


@router.post("/roadmap/complete")
def complete_roadmap_skill(
    request: CompleteSkillRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    user_id = get_current_user(credentials.credentials)
    skill_to_add = request.skill.strip()

    if not skill_to_add:
        raise HTTPException(
            status_code=400,
            detail="Skill cannot be empty"
        )

    user_profile = get_user_profile(user_id)
    profile = user_profile.get("profile", {})
    existing_skills = list(profile.get("skills", []))

    if not any(
        skill.lower() == skill_to_add.lower()
        for skill in existing_skills
    ):
        existing_skills.append(skill_to_add)
        updated_profile = {
            **profile,
            "skills": existing_skills
        }
        update_user_profile(user_id, updated_profile)

    updated_recommendation = recommend_for_user(user_id)
    save_recommendation(user_id, updated_recommendation)

    return {
        "success": True,
        "message": f"Successfully learned '{skill_to_add}'!",
        "new_match_percentage": updated_recommendation[
            "match_percentage"
        ],
        "updated_skills": existing_skills
    }