"""
Main FastAPI Application Entrypoint
Smart Diabetes Risk Prediction and Health Analytics System
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.prediction import Prediction
from app.services.auth_service import hash_password
from app.routes.auth import router as auth_router
from app.routes.prediction import router as prediction_router
from app.routes.history import router as history_router
from app.routes.analytics import router as analytics_router
from app.routes.profile import router as profile_router

def seed_initial_data():
    """Seed initial demo clinician and sample cohort predictions if database is fresh."""
    db = SessionLocal()
    try:
        # Check if users table is empty
        demo_user = db.query(User).filter(User.email == "alex.morgan@healthai.edu").first()
        if not demo_user:
            demo_user = User(
                full_name="Dr. Alex Morgan",
                email="alex.morgan@healthai.edu",
                hashed_password=hash_password("password123"),
                age=34,
                gender="Female",
                department="Biomedical Informatics & Data Science",
                institution="University Health Sciences Institute"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print("Seeded demo clinician: alex.morgan@healthai.edu / password123")

        # Check if predictions exist, if not seed baseline clinical cases
        if db.query(Prediction).count() == 0:
            sample_cases = [
                {
                    "patient_name": "Sarah Jenkins", "age": 48, "gender": "Female", "pregnancies": 3,
                    "glucose": 148, "blood_pressure": 84, "skin_thickness": 32, "insulin": 178,
                    "bmi": 33.6, "diabetes_pedigree": 0.627, "risk_category": "Higher predicted risk",
                    "probability": 0.784
                },
                {
                    "patient_name": "David Chen", "age": 29, "gender": "Male", "pregnancies": 0,
                    "glucose": 88, "blood_pressure": 72, "skin_thickness": 19, "insulin": 54,
                    "bmi": 22.4, "diabetes_pedigree": 0.231, "risk_category": "Lower predicted risk",
                    "probability": 0.122
                },
                {
                    "patient_name": "Elena Rostova", "age": 42, "gender": "Female", "pregnancies": 2,
                    "glucose": 118, "blood_pressure": 80, "skin_thickness": 28, "insulin": 110,
                    "bmi": 28.1, "diabetes_pedigree": 0.485, "risk_category": "Moderate predicted risk",
                    "probability": 0.448
                },
                {
                    "patient_name": "Marcus Vance", "age": 56, "gender": "Male", "pregnancies": 0,
                    "glucose": 165, "blood_pressure": 92, "skin_thickness": 35, "insulin": 210,
                    "bmi": 36.2, "diabetes_pedigree": 0.812, "risk_category": "Higher predicted risk",
                    "probability": 0.886
                },
                {
                    "patient_name": "Amina Patel", "age": 33, "gender": "Female", "pregnancies": 1,
                    "glucose": 94, "blood_pressure": 74, "skin_thickness": 22, "insulin": 68,
                    "bmi": 23.8, "diabetes_pedigree": 0.198, "risk_category": "Lower predicted risk",
                    "probability": 0.145
                },
                {
                    "patient_name": "Carlos Gomez", "age": 51, "gender": "Male", "pregnancies": 0,
                    "glucose": 124, "blood_pressure": 86, "skin_thickness": 29, "insulin": 135,
                    "bmi": 29.4, "diabetes_pedigree": 0.540, "risk_category": "Moderate predicted risk",
                    "probability": 0.521
                }
            ]
            for case in sample_cases:
                pred = Prediction(user_id=demo_user.id, **case)
                db.add(pred)
            db.commit()
            print(f"Seeded {len(sample_cases)} baseline clinical prediction cases.")
    except Exception as e:
        print("Initial database seeding notice:", e)
    finally:
        db.close()

# Ensure database tables exist at module load
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if not exist and seed initial demo data
    Base.metadata.create_all(bind=engine)
    seed_initial_data()
    yield
    # Shutdown
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-style backend for the **Smart Diabetes Risk Prediction and Health Analytics System**.\n\n"
        "Provides RESTful endpoints for user authentication (JWT), machine learning risk assessment, "
        "patient prediction history, and population health analytics.\n\n"
        "**Medical Disclaimer:** This system provides an AI-based risk estimate for educational and "
        "informational purposes only. It is not a medical diagnosis and should not replace professional medical advice."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if settings.cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Centralized Error Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        errors.append(f"{field}: {msg}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error: " + "; ".join(errors)}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Never expose internal Python traceback in production
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing your request."}
    )

# Health check route
@app.get(
    "/api/health",
    tags=["System"],
    summary="Health check endpoint",
    description="Returns current health status of the API service."
)
def health_check():
    return {
        "status": "healthy",
        "service": "Diabetes Prediction API",
        "version": settings.VERSION
    }

# Root welcome
@app.get(
    "/",
    tags=["System"],
    include_in_schema=False
)
def root_index():
    return {
        "message": "Smart Diabetes Risk Prediction API is running.",
        "documentation": "/docs",
        "health": "/api/health"
    }

# Register API Routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(prediction_router, prefix=settings.API_PREFIX)
app.include_router(history_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router, prefix=settings.API_PREFIX)
app.include_router(profile_router, prefix=settings.API_PREFIX)
