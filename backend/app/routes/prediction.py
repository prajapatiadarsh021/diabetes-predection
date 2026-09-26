"""
Prediction Route (/api/predictions/predict)
"""

from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.auth_service import get_optional_current_user
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Estimate diabetes risk probability from clinical biomarkers",
    description="Validates biometric inputs, runs the trained ML classification pipeline, determines risk tier, saves record, and returns analysis."
)
def run_prediction(
    req: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    result = PredictionService.create_prediction(req, db, current_user)
    return result
