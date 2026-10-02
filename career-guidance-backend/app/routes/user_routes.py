from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.utils.security import get_current_user

from app.schemas.user_schema import (
    UpdateProfileRequest,
    UpdatePreferencesRequest
)

from app.services.user_service import (
    get_user_profile,
    update_user_profile,
    update_job_preferences
)

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

security = HTTPBearer()


@router.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user(credentials.credentials)

    return {
        "success": True,
        "data": get_user_profile(user_id)
    }


@router.put("/profile")
def update_profile(
    data: UpdateProfileRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user(credentials.credentials)

    result = update_user_profile(
        user_id,
        data.profile.model_dump()
    )

    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": result
    }


@router.put("/preferences")
def update_preferences(
    data: UpdatePreferencesRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user(credentials.credentials)

    result = update_job_preferences(
        user_id,
        data.job_preferences.model_dump()
    )

    return {
        "success": True,
        "message": "Job preferences updated successfully",
        "data": result
    }
