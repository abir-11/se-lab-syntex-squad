from pydantic import BaseModel
from typing import List, Optional


class JobPreferences(BaseModel):
    job_types: List[str] = []
    work_mode: Optional[str] = None
    salary_range: Optional[str] = None


class UserProfile(BaseModel):
    education: Optional[str] = None
    department: Optional[str] = None
    interests: List[str] = []
    skills: List[str] = []
    academic_strengths: List[str] = []
    experience: Optional[str] = None
    career_goal: Optional[str] = None


class UpdateProfileRequest(BaseModel):
    profile: UserProfile


class UpdatePreferencesRequest(BaseModel):
    job_preferences: JobPreferences
