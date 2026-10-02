from datetime import datetime, timezone

from app.schemas.recommendation_schema import CareerRecommendationRequest
from app.database.mongodb import careers_collection, recommendations_collection
from app.services.user_service import get_user_profile


def normalize(value):
    """
    Convert text to lowercase and remove extra spaces.
    """
    return value.lower().strip()


def calculate_list_match(user_values, career_values):
    """
    Calculate percentage match between two lists.
    """

    if not user_values or not career_values:
        return 0

    user_values = {
        normalize(value)
        for value in user_values
        if value
    }

    career_values = {
        normalize(value)
        for value in career_values
        if value
    }

    if not user_values or not career_values:
        return 0

    matches = user_values.intersection(career_values)

    percentage = (
        len(matches) / len(career_values)
    ) * 100

    return round(percentage, 2)


def calculate_text_match(user_value, career_values):
    """
    Calculate match for a single value.

    Exact match = 100%
    Partial match = 70%
    No match = 0%
    """

    if not user_value or not career_values:
        return 0

    user_value = normalize(user_value)

    normalized_career_values = [
        normalize(value)
        for value in career_values
        if value
    ]

    if not normalized_career_values:
        return 0

    # Exact match
    if user_value in normalized_career_values:
        return 100

    # Partial match
    for career_value in normalized_career_values:
        if (
            user_value in career_value
            or career_value in user_value
        ):
            return 70

    # Word-based match
    user_words = set(user_value.split())

    for career_value in normalized_career_values:
        career_words = set(career_value.split())

        if user_words.intersection(career_words):
            return 50

    return 0


def recommend_career(data: CareerRecommendationRequest):

    # =====================================================
    # USER INFORMATION
    # =====================================================

    user_skills = data.skills
    user_interests = data.interests

    user_education = data.education
    user_department = data.department
    user_experience = data.experience
    user_work_preference = data.work_preference
    user_career_goal = data.career_goal

    # =====================================================
    # GET CAREERS FROM MONGODB
    # =====================================================

    careers = careers_collection.find()

    recommendations = []

    for career in careers:

        # =================================================
        # CAREER INFORMATION
        # =================================================

        career_interests = career.get(
            "interests",
            []
        )

        career_education = career.get(
            "education",
            []
        )

        career_departments = career.get(
            "departments",
            []
        )

        career_experience = career.get(
            "experience",
            []
        )

        career_work_preferences = career.get(
            "work_preference",
            []
        )

        career_goals = career.get(
            "career_goals",
            []
        )

        # =================================================
        # 1. SKILLS — 30%
        # =================================================

        required_skills = career.get(
            "required_skills",
            []
        )

        user_skills_lower = [
            skill.strip().lower()
            for skill in user_skills
            if skill
        ]

        matched_skills = [
            skill
            for skill in required_skills
            if skill.lower() in user_skills_lower
        ]

        missing_skills = [
            skill
            for skill in required_skills
            if skill.lower() not in user_skills_lower
        ]

        if required_skills:
            skill_match = round(
                (len(matched_skills) / len(required_skills)) * 100,
                2
            )
        else:
            skill_match = 0.0

        skill_score = round(
            (skill_match / 100) * 30,
            2
        )

        # =================================================
        # 2. INTERESTS — 20%
        # =================================================

        interest_match = calculate_list_match(
            user_interests,
            career_interests
        )

        interest_score = interest_match * 0.20

        # =================================================
        # 3. EDUCATION — 10%
        # =================================================

        education_match = calculate_text_match(
            user_education,
            career_education
        )

        education_score = education_match * 0.10

        # =================================================
        # 4. DEPARTMENT — 10%
        # =================================================

        department_match = calculate_text_match(
            user_department,
            career_departments
        )

        department_score = department_match * 0.10

        # =================================================
        # 5. EXPERIENCE — 10%
        # =================================================

        experience_match = calculate_text_match(
            user_experience,
            career_experience
        )

        experience_score = experience_match * 0.10

        # =================================================
        # 6. WORK PREFERENCE — 5%
        # =================================================

        work_preference_match = calculate_text_match(
            user_work_preference,
            career_work_preferences
        )

        work_preference_score = (
            work_preference_match * 0.05
        )

        # =================================================
        # 7. CAREER GOAL — 15%
        # =================================================

        career_goal_match = calculate_text_match(
            user_career_goal,
            career_goals
        )

        career_goal_score = (
            career_goal_match * 0.15
        )

        # =================================================
        # FINAL SCORE
        # =================================================

        final_score = (
            skill_score
            + interest_score
            + education_score
            + department_score
            + experience_score
            + work_preference_score
            + career_goal_score
        )

        final_score = round(
            final_score,
            2
        )

        # =================================================
        # MATCH BREAKDOWN
        # =================================================

        match_breakdown = {

            "skills": {
                "match_percentage": round(
                    skill_match,
                    2
                ),
                "weight": 30,
                "score": round(
                    skill_score,
                    2
                ),
                "matched_skills": matched_skills,
                "missing_skills": missing_skills
            },

            "interests": {
                "match_percentage": round(
                    interest_match,
                    2
                ),
                "weight": 20,
                "score": round(
                    interest_score,
                    2
                )
            },

            "education": {
                "match_percentage": round(
                    education_match,
                    2
                ),
                "weight": 10,
                "score": round(
                    education_score,
                    2
                )
            },

            "department": {
                "match_percentage": round(
                    department_match,
                    2
                ),
                "weight": 10,
                "score": round(
                    department_score,
                    2
                )
            },

            "experience": {
                "match_percentage": round(
                    experience_match,
                    2
                ),
                "weight": 10,
                "score": round(
                    experience_score,
                    2
                )
            },

            "work_preference": {
                "match_percentage": round(
                    work_preference_match,
                    2
                ),
                "weight": 5,
                "score": round(
                    work_preference_score,
                    2
                )
            },

            "career_goal": {
                "match_percentage": round(
                    career_goal_match,
                    2
                ),
                "weight": 15,
                "score": round(
                    career_goal_score,
                    2
                )
            }
        }

        # =================================================
        # ADD RECOMMENDATION
        # =================================================

        recommendations.append({

            "career_name": career.get(
                "career_name"
            ),

            "score": final_score,

            "match_percentage": round(
                final_score
            ),

            "description": career.get(
                "description"
            ),

            "demand": career.get(
                "demand"
            ),

            "match_breakdown": match_breakdown
        })

    # =====================================================
    # SORT CAREERS
    # =====================================================

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    # =====================================================
    # NO CAREERS FOUND
    # =====================================================

    if not recommendations:

        return {
            "recommended_career": None,
            "score": 0,
            "match_percentage": 0,
            "description": None,
            "demand": None,
            "match_breakdown": {},
            "recommendations": []
        }

    # =====================================================
    # BEST CAREER
    # =====================================================

    best_career = recommendations[0]

    return {

        "recommended_career": best_career[
            "career_name"
        ],

        "score": best_career[
            "score"
        ],

        "match_percentage": best_career[
            "match_percentage"
        ],

        "description": best_career[
            "description"
        ],

        "demand": best_career[
            "demand"
        ],

        "match_breakdown": best_career[
            "match_breakdown"
        ],

        "recommendations": recommendations
    }


def recommend_for_user(user_id: str):
    """
    Generate career recommendations using
    the logged-in user's saved profile and preferences.
    """

    user_data = get_user_profile(user_id)

    profile = user_data.get("profile", {})
    preferences = user_data.get("job_preferences", {})

    # Get saved profile data
    department = profile.get("department", "")
    skills = profile.get("skills", [])
    interests = profile.get("interests", [])
    experience = profile.get("experience", "")
    career_goal = profile.get("career_goal", "")

    # Get saved job preference
    work_preference = preferences.get("work_mode", "")
    education = profile.get("education", "")

    # Create the same input format
    # expected by the existing recommendation engine.
    recommendation_data = CareerRecommendationRequest(
        education=education,
        department=department,
        skills=skills,
        interests=interests,
        experience=experience,
        work_preference=work_preference,
        career_goal=career_goal
    )

    # Use the existing recommendation engine
    return recommend_career(recommendation_data)


def save_recommendation(user_id: str, recommendation_result: dict):
    document = {
        "user_id": user_id,
        "recommended_career": recommendation_result["recommended_career"],
        "score": recommendation_result["score"],
        "match_percentage": recommendation_result["match_percentage"],
        "description": recommendation_result["description"],
        "demand": recommendation_result["demand"],
        "match_breakdown": recommendation_result["match_breakdown"],
        "recommendations": recommendation_result["recommendations"],
        "created_at": datetime.now(timezone.utc)
    }

    result = recommendations_collection.insert_one(document)

    return {
        "recommendation_id": str(result.inserted_id),
        "user_id": user_id,
        "recommended_career": recommendation_result["recommended_career"],
        "score": recommendation_result["score"],
        "match_percentage": recommendation_result["match_percentage"],
        "created_at": document["created_at"]
    }


def get_recommendation_history(user_id: str):
    recommendations = recommendations_collection.find(
        {"user_id": user_id}
    ).sort("created_at", -1)

    history = []

    for recommendation in recommendations:
        history.append({
            "recommendation_id": str(recommendation["_id"]),
            "recommended_career": recommendation["recommended_career"],
            "score": recommendation["score"],
            "match_percentage": recommendation["match_percentage"],
            "description": recommendation["description"],
            "demand": recommendation["demand"],
            "created_at": recommendation["created_at"]
        })

    return history


def get_user_recommendation(user_id: str):
    recommendation = recommendations_collection.find_one(
        {"user_id": user_id},
        sort=[("created_at", -1)]
    )

    if not recommendation:
        return None

    return {
        "data": {
            "recommended_career": recommendation[
                "recommended_career"
            ],
            "match_percentage": recommendation[
                "match_percentage"
            ],
            "match_breakdown": recommendation[
                "match_breakdown"
            ]
        }
    }