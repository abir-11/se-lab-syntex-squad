from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.recommendation_routes import router as recommendation_router
from app.database.mongodb import test_database_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    test_database_connection()
    yield

app = FastAPI(
    title="Career Guidance & Skill Development Platform API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Authentication
app.include_router(auth_router)
app.include_router(user_router)

# Career Recommendation
app.include_router(recommendation_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Career Guidance Platform Backend API is running"
    }