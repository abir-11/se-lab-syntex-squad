from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest
)

from app.services.auth_service import (
    register_user,
    login_user
)

from app.database.mongodb import users_collection
from app.utils.security import get_current_user

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

security = HTTPBearer()


@router.post("/register")
def register(data: RegisterRequest):

    result = register_user(
        name=data.name,
        email=data.email,
        password=data.password,
        path=data.path
    )

    return {
        "success": True,
        "message": "User registered successfully",
        "data": result
    }


@router.post("/login")
def login(data: LoginRequest):

    result = login_user(
        email=data.email,
        password=data.password
    )

    return {
        "success": True,
        "message": "Login successful",
        "data": result
    }


@router.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    user_id = get_current_user(credentials.credentials)

    from bson import ObjectId

    user = users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    return {
        "success": True,
        "data": {
            "user_id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "path": user["path"]
        }
    }
