"""
Prediction and Analytics Service
"""

from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_
from datetime import datetime
from fastapi import HTTPException, status

from app.models.prediction import Prediction
from app.models.user import User
from app.schemas.prediction import PredictionRequest
from app.ml.predict import predict_diabetes_risk, get_model_bundle

class PredictionService:
    @staticmethod
    def create_prediction(req: PredictionRequest, db: Session, user: Optional[User] = None) -> Dict[str, Any]:
        input_data = req.model_dump()
        
        # Execute machine learning model inference
        ml_result = predict_diabetes_risk(input_data)
        
        # Persist to database
        db_prediction = Prediction(
            user_id=user.id if user else None,
            patient_name=req.patient_name or "Anonymous Case",
            age=req.age,
            gender=req.gender,
            pregnancies=req.pregnancies,
            glucose=req.glucose,
            blood_pressure=req.blood_pressure,
            skin_thickness=req.skin_thickness,
            insulin=req.insulin,
            bmi=req.bmi,
            diabetes_pedigree=req.diabetes_pedigree,
            risk_category=ml_result["risk_category"],
            probability=ml_result["probability"],
            created_at=datetime.utcnow()
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)

        return {
            "prediction_id": db_prediction.id,
            "risk_category": db_prediction.risk_category,
            "probability": db_prediction.probability,
            "patient_name": db_prediction.patient_name,
            "age": db_prediction.age,
            "gender": db_prediction.gender,
            "pregnancies": db_prediction.pregnancies,
            "glucose": db_prediction.glucose,
            "blood_pressure": db_prediction.blood_pressure,
            "skin_thickness": db_prediction.skin_thickness,
            "insulin": db_prediction.insulin,
            "bmi": db_prediction.bmi,
            "diabetes_pedigree": db_prediction.diabetes_pedigree,
            "created_at": db_prediction.created_at,
            "primary_factors": ml_result["primary_factors"],
            "recommendations": ml_result["recommendations"]
        }

    @staticmethod
    def get_history(
        db: Session,
        user: Optional[User] = None,
        search: Optional[str] = None,
        risk_category: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        page_size: int = 10
    ) -> Dict[str, Any]:
        query = db.query(Prediction)
        
        if user:
            # If user is logged in, show their records (and any unassigned demo records if desired)
            query = query.filter(or_(Prediction.user_id == user.id, Prediction.user_id == None))
        
        # Search filter
        if search:
            s = f"%{search}%"
            query = query.filter(
                or_(
                    Prediction.patient_name.ilike(s),
                    Prediction.risk_category.ilike(s),
                    Prediction.id.like(s)
                )
            )

        # Risk category filter
        if risk_category and risk_category.upper() != "ALL":
            query = query.filter(Prediction.risk_category.ilike(f"%{risk_category}%"))

        # Sorting
        sort_column = getattr(Prediction, sort_by, Prediction.created_at)
        if sort_order.lower() == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))

        total = query.count()
        total_pages = max(1, (total + page_size - 1) // page_size)
        offset = (page - 1) * page_size
        items = query.offset(offset).limit(page_size).all()

        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "predictions": items
        }

    @staticmethod
    def get_prediction_by_id(prediction_id: int, db: Session, user: Optional[User] = None) -> Prediction:
        query = db.query(Prediction).filter(Prediction.id == prediction_id)
        if user:
            # If authenticated, ensure the record belongs to the user or is public demo
            query = query.filter(or_(Prediction.user_id == user.id, Prediction.user_id == None))
        
        item = query.first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Prediction record #{prediction_id} not found or access denied."
            )
        return item

    @staticmethod
    def delete_prediction(prediction_id: int, db: Session, user: Optional[User] = None) -> bool:
        item = PredictionService.get_prediction_by_id(prediction_id, db, user)
        db.delete(item)
        db.commit()
        return True

    @staticmethod
    def get_dashboard_analytics(db: Session, user: Optional[User] = None) -> Dict[str, Any]:
        query = db.query(Prediction)
        if user:
            query = query.filter(or_(Prediction.user_id == user.id, Prediction.user_id == None))
        
        all_records = query.order_by(asc(Prediction.created_at)).all()
        total = len(all_records)

        higher_risk = sum(1 for p in all_records if "Higher" in p.risk_category or "High" in p.risk_category)
        moderate_risk = sum(1 for p in all_records if "Moderate" in p.risk_category)
        lower_risk = sum(1 for p in all_records if "Lower" in p.risk_category or "Low" in p.risk_category)

        avg_prob = round((sum(p.probability for p in all_records) / total * 100), 1) if total > 0 else 0.0

        # Donut distribution
        risk_distribution = [
            {"name": "Lower Risk (<30%)", "value": lower_risk, "color": "#10b981"},
            {"name": "Moderate Risk (30-60%)", "value": moderate_risk, "color": "#f59e0b"},
            {"name": "Higher Risk (>60%)", "value": higher_risk, "color": "#ef4444"}
        ]

        # Trend trajectory (last 15 records)
        prediction_trends = [
            {
                "id": p.id,
                "date": p.created_at.strftime("%b %d"),
                "probability": round(p.probability * 100, 1),
                "glucose": p.glucose,
                "risk": p.risk_category
            }
            for p in all_records[-15:]
        ]

        # Age group stratification
        age_buckets = {"< 30": {"low": 0, "moderate": 0, "high": 0},
                       "30 - 39": {"low": 0, "moderate": 0, "high": 0},
                       "40 - 49": {"low": 0, "moderate": 0, "high": 0},
                       "50+": {"low": 0, "moderate": 0, "high": 0}}
        for p in all_records:
            if p.age < 30:
                bucket = "< 30"
            elif p.age < 40:
                bucket = "30 - 39"
            elif p.age < 50:
                bucket = "40 - 49"
            else:
                bucket = "50+"

            if "Higher" in p.risk_category or "High" in p.risk_category:
                age_buckets[bucket]["high"] += 1
            elif "Moderate" in p.risk_category:
                age_buckets[bucket]["moderate"] += 1
            else:
                age_buckets[bucket]["low"] += 1

        age_groups = [
            {"group": k, "low": v["low"], "moderate": v["moderate"], "high": v["high"]}
            for k, v in age_buckets.items()
        ]

        # Glucose vs BMI correlation points
        glucose_bmi_data = [
            {
                "id": p.id,
                "name": p.patient_name,
                "glucose": p.glucose,
                "bmi": p.bmi,
                "probability": round(p.probability * 100, 1),
                "risk": p.risk_category
            }
            for p in all_records
        ]

        return {
            "total_predictions": total,
            "higher_risk_predictions": higher_risk,
            "moderate_risk_predictions": moderate_risk,
            "lower_risk_predictions": lower_risk,
            "average_risk_probability": avg_prob,
            "risk_distribution": risk_distribution,
            "prediction_trends": prediction_trends,
            "age_groups": age_groups,
            "glucose_bmi_data": glucose_bmi_data
        }

    @staticmethod
    def get_model_performance() -> Dict[str, Any]:
        bundle = get_model_bundle()
        return {
            "model_name": bundle["model_name"],
            "accuracy": bundle["metrics"]["accuracy"],
            "precision": bundle["metrics"]["precision"],
            "recall": bundle["metrics"]["recall"],
            "f1_score": bundle["metrics"]["f1_score"],
            "roc_auc": bundle["metrics"]["roc_auc"],
            "confusion_matrix": bundle["confusion_matrix"],
            "feature_importance": bundle["feature_importance"],
            "dataset_info": bundle["dataset_info"]
        }
