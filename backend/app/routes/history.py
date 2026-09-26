"""
Prediction History Endpoints (/api/predictions)
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.prediction import PredictionHistoryResponse, PredictionResponse
from app.services.auth_service import get_optional_current_user
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/predictions", tags=["History"])

@router.get(
    "/history",
    response_model=PredictionHistoryResponse,
    summary="Get paginated history of clinical predictions",
    description="Supports search keywords, risk level filtering, column sorting, and pagination."
)
def get_prediction_history(
    search: Optional[str] = Query(None, description="Search by patient name, ID, or risk category"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category (e.g. Higher, Moderate, Lower)"),
    sort_by: str = Query("created_at", description="Sort field (created_at, glucose, bmi, probability)"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort direction"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    return PredictionService.get_history(
        db=db,
        user=current_user,
        search=search,
        risk_category=risk_category,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size
    )

@router.get(
    "/{prediction_id}",
    response_model=PredictionResponse,
    summary="Get single prediction by ID",
    description="Returns detailed clinical parameters and model findings for a specific assessment."
)
def get_prediction_detail(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    item = PredictionService.get_prediction_by_id(prediction_id, db, current_user)
    # Map into response
    input_data = {
        "age": item.age,
        "glucose": item.glucose,
        "bmi": item.bmi,
        "diabetes_pedigree": item.diabetes_pedigree,
        "blood_pressure": item.blood_pressure
    }
    from app.ml.predict import generate_primary_factors, generate_recommendations
    factors = generate_primary_factors(input_data)
    recs = generate_recommendations(item.risk_category)

    return {
        "prediction_id": item.id,
        "risk_category": item.risk_category,
        "probability": item.probability,
        "patient_name": item.patient_name,
        "age": item.age,
        "gender": item.gender,
        "pregnancies": item.pregnancies,
        "glucose": item.glucose,
        "blood_pressure": item.blood_pressure,
        "skin_thickness": item.skin_thickness,
        "insulin": item.insulin,
        "bmi": item.bmi,
        "diabetes_pedigree": item.diabetes_pedigree,
        "created_at": item.created_at,
        "primary_factors": factors,
        "recommendations": recs
    }

@router.delete(
    "/{prediction_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a prediction record",
    description="Removes a specific prediction record from the database."
)
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    PredictionService.delete_prediction(prediction_id, db, current_user)
    return {"status": "success", "message": f"Prediction #{prediction_id} deleted successfully."}
