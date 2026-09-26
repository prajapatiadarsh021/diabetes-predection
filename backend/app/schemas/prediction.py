from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class FactorImpact(BaseModel):
    factor: str
    impact: str
    type: str  # 'positive' or 'negative'

class PredictionRequest(BaseModel):
    patient_name: Optional[str] = Field("Anonymous Case", description="Optional patient name or identifier")
    age: float = Field(..., ge=1, le=120, description="Patient age in years (1 - 120)")
    gender: str = Field("Female", description="Biological gender (Female, Male, Other)")
    pregnancies: int = Field(0, ge=0, le=25, description="Number of pregnancies (0 - 25)")
    glucose: float = Field(..., ge=40, le=350, description="Fasting plasma glucose in mg/dL (40 - 350)")
    blood_pressure: float = Field(..., ge=30, le=180, description="Diastolic blood pressure in mm Hg (30 - 180)")
    skin_thickness: float = Field(..., ge=0, le=99, description="Triceps skinfold thickness in mm (0 - 99)")
    insulin: float = Field(..., ge=0, le=900, description="2-Hour serum insulin in µU/mL (0 - 900)")
    bmi: float = Field(..., ge=10.0, le=75.0, description="Body Mass Index in kg/m² (10.0 - 75.0)")
    diabetes_pedigree: float = Field(..., ge=0.01, le=3.0, description="Diabetes pedigree function score (0.01 - 3.0)")

class PredictionResponse(BaseModel):
    prediction_id: int
    risk_category: str
    probability: float
    patient_name: Optional[str] = None
    age: float
    gender: str
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree: float
    created_at: datetime
    primary_factors: Optional[List[FactorImpact]] = None
    recommendations: Optional[List[str]] = None
    disclaimer: str = (
        "This system provides an AI-based risk estimate for educational and informational purposes only. "
        "It is not a medical diagnosis and should not replace professional medical advice."
    )

    class Config:
        from_attributes = True

class PredictionHistoryItem(BaseModel):
    id: int
    user_id: Optional[int] = None
    patient_name: Optional[str] = None
    age: float
    gender: str
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree: float
    risk_category: str
    probability: float
    created_at: datetime

    class Config:
        from_attributes = True

class PredictionHistoryResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    predictions: List[PredictionHistoryItem]
