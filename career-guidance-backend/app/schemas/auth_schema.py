from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    path: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
