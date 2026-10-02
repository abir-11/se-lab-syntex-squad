from fastapi import HTTPException, status
from bson import ObjectId

from app.database.mongodb import users_collection


def get_user_by_id(user_id: str):
    try:
        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user


def get_user_profile(user_id: str):
    user = get_user_by_id(user_id)

    return {
        "user_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "path": user["path"],
        "profile": user.get("profile", {}),
        "job_preferences": user.get("job_preferences", {})
    }


def update_user_profile(user_id: str, profile_data: dict):
    get_user_by_id(user_id)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "profile": profile_data
            }
        }
    )

    return get_user_profile(user_id)


def update_job_preferences(user_id: str, preferences_data: dict):
    get_user_by_id(user_id)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "job_preferences": preferences_data
            }
        }
    )

    return get_user_profile(user_id)
