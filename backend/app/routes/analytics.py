"""
Analytics Endpoints (/api/analytics)
"""

from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.analytics import DashboardAnalyticsResponse, ModelPerformanceResponse
from app.services.auth_service import get_optional_current_user
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get(
    "/dashboard",
    response_model=DashboardAnalyticsResponse,
    summary="Get aggregated health analytics for dashboard",
    description="Returns total counts, risk tier distributions, chronological trajectory, age group stratification, and glucose-to-BMI correlation points."
)
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    return PredictionService.get_dashboard_analytics(db, current_user)

@router.get(
    "/model-performance",
    response_model=ModelPerformanceResponse,
    summary="Get machine learning model validation metrics",
    description="Returns cross-validation test scores: Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix, and Feature Importance."
)
def get_model_metrics():
    return PredictionService.get_model_performance()
