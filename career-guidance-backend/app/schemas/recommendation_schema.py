from pydantic import BaseModel
from typing import List


class CareerRecommendationRequest(BaseModel):
    education: str
    department: str
    skills: List[str]
    interests: List[str]
    experience: str
    work_preference: str
    career_goal: str
