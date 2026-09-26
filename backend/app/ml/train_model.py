"""
Train Model Pipeline for Smart Diabetes Risk Prediction & Health Analytics System

This script:
1. Loads the standard Pima Indians Diabetes Dataset (data/diabetes.csv).
2. Cleans physiological zero-values by imputing medians.
3. Standardizes features with StandardScaler.
4. Compares 5 classification algorithms:
   - Logistic Regression
   - Decision Tree Classifier
   - Random Forest Classifier
   - Support Vector Machine (SVC)
   - Gradient Boosting Classifier
5. Evaluates Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrix.
6. Selects the champion model based on validation performance and serializes it with joblib.
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
)
import joblib

def load_and_preprocess_data(dataset_path: str):
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at: {dataset_path}")

    df = pd.read_csv(dataset_path)
    print(f"Loaded dataset from {dataset_path} with shape: {df.shape}")

    # The canonical Pima columns
    feature_cols = [
        'Pregnancies',
        'Glucose',
        'BloodPressure',
        'SkinThickness',
        'Insulin',
        'BMI',
        'DiabetesPedigreeFunction',
        'Age'
    ]
    target_col = 'Outcome'

    # In biological parameters, 0 indicates missing values for Glucose, BP, Skin, Insulin, BMI
    zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    for col in zero_cols:
        df[col] = df[col].replace(0, np.nan)

    X = df[feature_cols]
    y = df[target_col]

    return X, y, feature_cols, df.shape

def train_and_compare_models(dataset_path: str, model_output_path: str):
    X, y, feature_cols, shape = load_and_preprocess_data(dataset_path)

    # Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=5, min_samples_split=6, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=6, min_samples_split=4, random_state=42),
        "Support Vector Machine": SVC(probability=True, kernel='rbf', C=1.0, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=120, learning_rate=0.08, max_depth=4, random_state=42)
    }

    results = {}
    fitted_pipelines = {}

    print("\n" + "="*70)
    print(f"{'Model':<25} | {'Accuracy':<8} | {'Precision':<9} | {'Recall':<7} | {'F1':<6} | {'ROC-AUC':<7}")
    print("="*70)

    for name, clf in models.items():
        # Pipeline: Median Imputer -> Standard Scaler -> Classifier
        pipe = Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler()),
            ('classifier', clf)
        ])

        pipe.fit(X_train, y_train)
        fitted_pipelines[name] = pipe

        y_pred = pipe.predict(X_test)
        y_prob = pipe.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred)

        results[name] = {
            "accuracy": round(float(acc) * 100, 2),
            "precision": round(float(prec) * 100, 2),
            "recall": round(float(rec) * 100, 2),
            "f1_score": round(float(f1) * 100, 2),
            "roc_auc": round(float(auc), 4),
            "confusion_matrix": {
                "true_negative": int(cm[0, 0]),
                "false_positive": int(cm[0, 1]),
                "false_negative": int(cm[1, 0]),
                "true_positive": int(cm[1, 1])
            }
        }

        print(f"{name:<25} | {results[name]['accuracy']:>7}% | {results[name]['precision']:>8}% | {results[name]['recall']:>6}% | {results[name]['f1_score']:>5}% | {results[name]['roc_auc']:>7}")

    print("="*70)

    # Select champion model based on highest ROC-AUC with strong recall
    champion_name = max(results.keys(), key=lambda k: (results[k]["roc_auc"] * 0.6 + results[k]["recall"] * 0.4))
    champion_pipeline = fitted_pipelines[champion_name]
    champion_metrics = results[champion_name]

    print(f"\nChampion Model Selected: '{champion_name}'")
    print(f"Metrics: Accuracy: {champion_metrics['accuracy']}%, ROC-AUC: {champion_metrics['roc_auc']}, Recall: {champion_metrics['recall']}%")

    # Extract Feature Importances if available
    classifier_step = champion_pipeline.named_steps['classifier']
    feature_importances = []
    if hasattr(classifier_step, 'feature_importances_'):
        raw_importances = classifier_step.feature_importances_
        for feat, imp in zip(feature_cols, raw_importances):
            feature_importances.append({
                "name": feat,
                "importance": round(float(imp) * 100, 2)
            })
        feature_importances.sort(key=lambda x: x["importance"], reverse=True)
    elif hasattr(classifier_step, 'coef_'):
        raw_coefs = np.abs(classifier_step.coef_[0])
        total = np.sum(raw_coefs)
        for feat, coef in zip(feature_cols, raw_coefs):
            feature_importances.append({
                "name": feat,
                "importance": round(float(coef / total) * 100, 2)
            })
        feature_importances.sort(key=lambda x: x["importance"], reverse=True)

    # Build model artifact bundle
    os.makedirs(os.path.dirname(model_output_path), exist_ok=True)
    artifact_bundle = {
        "pipeline": champion_pipeline,
        "model_name": champion_name,
        "feature_names": feature_cols,
        "metrics": champion_metrics,
        "all_comparisons": results,
        "confusion_matrix": champion_metrics["confusion_matrix"],
        "feature_importance": feature_importances,
        "dataset_info": {
            "samples": shape[0],
            "features": shape[1] - 1,
            "training_samples": len(X_train),
            "testing_samples": len(X_test)
        }
    }

    joblib.dump(artifact_bundle, model_output_path)
    print(f"Saved trained model bundle to: {model_output_path}")

    return artifact_bundle

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    data_path = os.path.join(base_dir, "data", "diabetes.csv")
    out_path = os.path.join(base_dir, "app", "ml", "model", "diabetes_model.joblib")
    train_and_compare_models(data_path, out_path)
