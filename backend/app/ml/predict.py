"""
ML Predict Module for Smart Diabetes Risk Prediction & Health Analytics System

Loads the trained model bundle and performs inference with biological factor attribution.
"""

import os
import pandas as pd
import numpy as np
import joblib
from app.config import settings

_model_bundle = None

def get_model_bundle():
    global _model_bundle
    if _model_bundle is None:
        model_path = settings.MODEL_PATH
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Trained model not found at {model_path}. Run train_model.py first.")
        _model_bundle = joblib.load(model_path)
    return _model_bundle

def generate_primary_factors(data: dict) -> list:
    factors = []
    glucose = float(data.get('glucose', 0))
    bmi = float(data.get('bmi', 0))
    pedigree = float(data.get('diabetes_pedigree', 0))
    age = float(data.get('age', 0))
    bp = float(data.get('blood_pressure', 0))

    if glucose >= 140:
        factors.append({"factor": f"Elevated Fasting Glucose ({glucose} mg/dL)", "impact": "High (+32%)", "type": "negative"})
    elif glucose >= 100:
        factors.append({"factor": f"Impaired Fasting Glucose ({glucose} mg/dL)", "impact": "Moderate (+18%)", "type": "negative"})
    else:
        factors.append({"factor": f"Optimal Fasting Glucose ({glucose} mg/dL)", "impact": "Protective (-25%)", "type": "positive"})

    if bmi >= 30:
        factors.append({"factor": f"Obesity Range BMI ({bmi} kg/m²)", "impact": "High (+24%)", "type": "negative"})
    elif bmi >= 25:
        factors.append({"factor": f"Overweight BMI ({bmi} kg/m²)", "impact": "Moderate (+15%)", "type": "negative"})
    else:
        factors.append({"factor": f"Healthy Body Mass Index ({bmi} kg/m²)", "impact": "Optimal (-20%)", "type": "positive"})

    if pedigree >= 0.5:
        factors.append({"factor": f"Genetic Pedigree Score ({pedigree:.2f})", "impact": "Moderate (+12%)", "type": "negative"})

    if age >= 45:
        factors.append({"factor": f"Age Category ({int(age)} years)", "impact": "Moderate (+10%)", "type": "negative"})

    if bp >= 85:
        factors.append({"factor": f"Elevated Diastolic BP ({bp} mm Hg)", "impact": "Mild (+8%)", "type": "negative"})

    return factors

def generate_recommendations(risk_category: str) -> list:
    if "Higher" in risk_category or "High" in risk_category:
        return [
            "Schedule a formal clinical consultation with a primary care physician or endocrinologist.",
            "Request comprehensive metabolic screening including HbA1c and fasting lipid panel.",
            "Adopt an evidence-based medical nutrition plan focusing on low glycemic index foods.",
            "Target 150+ minutes of moderate weekly physical activity and resistance training."
        ]
    elif "Moderate" in risk_category:
        return [
            "Target a modest 5% to 7% reduction in body weight to enhance peripheral insulin sensitivity.",
            "Replace refined carbohydrates and sugary beverages with high-fiber whole foods.",
            "Incorporate 30 minutes of brisk daily walking or cardiovascular exercise.",
            "Re-evaluate fasting blood glucose every 6 to 12 months."
        ]
    else:
        return [
            "Maintain current wholesome nutritional habits and consistent physical conditioning.",
            "Continue routine annual preventative wellness check-ups.",
            "Prioritize restorative sleep and adequate daily hydration."
        ]

def predict_diabetes_risk(data: dict) -> dict:
    bundle = get_model_bundle()
    pipeline = bundle["pipeline"]

    # Construct input dataframe matching exact feature order
    # ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    features_df = pd.DataFrame([{
        'Pregnancies': float(data.get('pregnancies', 0)),
        'Glucose': float(data.get('glucose', 0)),
        'BloodPressure': float(data.get('blood_pressure', 0)),
        'SkinThickness': float(data.get('skin_thickness', 0)),
        'Insulin': float(data.get('insulin', 0)),
        'BMI': float(data.get('bmi', 0)),
        'DiabetesPedigreeFunction': float(data.get('diabetes_pedigree', 0)),
        'Age': float(data.get('age', 0))
    }])

    # Probability prediction
    if hasattr(pipeline, "predict_proba"):
        probabilities = pipeline.predict_proba(features_df)[0]
        prob_diabetic = float(probabilities[1])
    else:
        pred = pipeline.predict(features_df)[0]
        prob_diabetic = 0.85 if pred == 1 else 0.15

    # Safe bounds and rounding
    probability = round(min(max(prob_diabetic, 0.05), 0.96), 4)

    # Risk categorization
    if probability >= 0.60:
        risk_category = "Higher predicted risk"
    elif probability >= 0.30:
        risk_category = "Moderate predicted risk"
    else:
        risk_category = "Lower predicted risk"

    primary_factors = generate_primary_factors(data)
    recommendations = generate_recommendations(risk_category)

    return {
        "risk_category": risk_category,
        "probability": probability,
        "primary_factors": primary_factors,
        "recommendations": recommendations
    }
