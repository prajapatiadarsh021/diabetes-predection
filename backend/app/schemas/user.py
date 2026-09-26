from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Full name of user")
    email: EmailStr = Field(..., description="Valid user email address")
    password: str = Field(..., min_length=6, max_length=100, description="Password (min 6 characters)")
    age: Optional[int] = Field(None, ge=1, le=120, description="User age in years")
    gender: Optional[str] = Field("Female", description="Gender")
    department: Optional[str] = Field("Clinical Informatics", description="Institutional department")
    institution: Optional[str] = Field("University Health Consortium", description="Organization or College")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., description="Account password")

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    department: Optional[str] = None
    institution: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    age: Optional[int] = Field(None, ge=1, le=120)
    gender: Optional[str] = None
    department: Optional[str] = None
    institution: Optional[str] = None
