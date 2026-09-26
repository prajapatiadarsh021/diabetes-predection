"""
Authentication Endpoints (/api/auth)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new clinician account",
    description="Validates user credentials, ensures email uniqueness, hashes the password, and creates the account."
)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A clinician with this email address is already registered."
        )

    # Hash password securely
    hashed_pwd = hash_password(req.password)

    new_user = User(
        full_name=req.full_name,
        email=req.email.lower(),
        hashed_password=hashed_pwd,
        age=req.age,
        gender=req.gender,
        department=req.department or "Clinical Informatics",
        institution=req.institution or "University Health Consortium",
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Sign in to obtain JWT access token",
    description="Authenticates clinician credentials and generates a signed bearer token."
)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token
    token = create_access_token(data={"sub": str(user.id), "email": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user",
    description="Returns profile details of the bearer token owner."
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
