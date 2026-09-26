"""
User Profile Endpoints (/api/profile)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserProfileUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get(
    "",
    response_model=UserResponse,
    summary="Get user profile",
    description="Returns current authenticated clinician profile details."
)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put(
    "",
    response_model=UserResponse,
    summary="Update user profile",
    description="Updates user profile fields (name, age, gender, department, institution). Email and ID cannot be changed."
)
def update_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.age is not None:
        current_user.age = update_data.age
    if update_data.gender is not None:
        current_user.gender = update_data.gender
    if update_data.department is not None:
        current_user.department = update_data.department
    if update_data.institution is not None:
        current_user.institution = update_data.institution

    db.commit()
    db.refresh(current_user)
    return current_user
