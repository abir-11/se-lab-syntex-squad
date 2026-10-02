from fastapi import HTTPException, status

from app.database.mongodb import users_collection
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user(name: str, email: str, password: str, path: str):

    # Check if email already exists
    existing_user = users_collection.find_one({
        "email": email.lower()
    })

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate path
    if path.lower() not in ["beginner", "skilled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Path must be either 'beginner' or 'skilled'"
        )

    # Create user document
    user = {
        "name": name,
        "email": email.lower(),
        "password_hash": hash_password(password),
        "path": path.lower()
    }

    # Insert user into MongoDB
    result = users_collection.insert_one(user)

    # Create JWT token
    token = create_access_token({
        "user_id": str(result.inserted_id),
        "email": user["email"]
    })

    return {
        "user_id": str(result.inserted_id),
        "name": user["name"],
        "email": user["email"],
        "path": user["path"],
        "access_token": token,
        "token_type": "bearer"
    }


def login_user(email: str, password: str):

    # Find user
    user = users_collection.find_one({
        "email": email.lower()
    })

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT token
    token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"]
    })

    return {
        "user_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "path": user["path"],
        "access_token": token,
        "token_type": "bearer"
    }
