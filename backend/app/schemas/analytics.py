from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class DashboardAnalyticsResponse(BaseModel):
    total_predictions: int
    higher_risk_predictions: int
    moderate_risk_predictions: int
    lower_risk_predictions: int
    average_risk_probability: float
    risk_distribution: List[Dict[str, Any]]
    prediction_trends: List[Dict[str, Any]]
    age_groups: List[Dict[str, Any]]
    glucose_bmi_data: List[Dict[str, Any]]

class FeatureImportanceItem(BaseModel):
    name: str
    importance: float

class ConfusionMatrixData(BaseModel):
    true_negative: int
    false_positive: int
    false_negative: int
    true_positive: int

class ModelPerformanceResponse(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: ConfusionMatrixData
    feature_importance: List[FeatureImportanceItem]
    dataset_info: Dict[str, Any]
