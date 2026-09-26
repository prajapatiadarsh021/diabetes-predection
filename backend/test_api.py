"""
Automated Verification Script for FastAPI Backend Endpoints
"""

import sys
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    print("Testing Backend Endpoints with TestClient...\n")
    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[OK] GET /api/health:", res.json())

        # 1b. Register new user test
        register_payload = {
            "full_name": "Dr. Clara Oswald",
            "email": "clara.oswald@hospital.org",
            "password": "securepassword123",
            "age": 30,
            "gender": "Female",
            "department": "Endocrinology",
            "institution": "St. Jude Research Hospital"
        }
        res = client.post("/api/auth/register", json=register_payload)
        assert res.status_code == 201, f"Register failed: {res.text}"
        print("[OK] POST /api/auth/register: Registered user", res.json()["email"])

        # 2. Login as demo user
        login_payload = {
            "email": "alex.morgan@healthai.edu",
            "password": "password123"
        }
        res = client.post("/api/auth/login", json=login_payload)
        assert res.status_code == 200, f"Login failed: {res.text}"
        token_data = res.json()
        token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"[OK] POST /api/auth/login: Logged in successfully as {token_data['user']['full_name']}")

        # 3. GET /api/auth/me
        res = client.get("/api/auth/me", headers=headers)
        assert res.status_code == 200, f"Auth me failed: {res.text}"
        print(f"[OK] GET /api/auth/me: Verified token owner: {res.json()['email']}")

        # 4. Predict endpoint (High Risk test)
        predict_payload = {
            "patient_name": "Test Clinical Case",
            "age": 52,
            "gender": "Female",
            "pregnancies": 3,
            "glucose": 165,
            "blood_pressure": 88,
            "skin_thickness": 34,
            "insulin": 195,
            "bmi": 35.4,
            "diabetes_pedigree": 0.75
        }
        res = client.post("/api/predictions/predict", json=predict_payload, headers=headers)
        assert res.status_code == 201, f"Prediction failed: {res.text}"
        pred_data = res.json()
        pred_id = pred_data["prediction_id"]
        print(f"[OK] POST /api/predictions/predict: ID={pred_id}, Risk={pred_data['risk_category']}, Prob={pred_data['probability']}")
        assert "disclaimer" in pred_data
        assert "primary_factors" in pred_data

        # 5. Prediction history
        res = client.get("/api/predictions/history?page=1&page_size=5", headers=headers)
        assert res.status_code == 200, f"History failed: {res.text}"
        history_data = res.json()
        print(f"[OK] GET /api/predictions/history: Total records={history_data['total']}, Returned={len(history_data['predictions'])}")

        # 6. Single prediction detail
        res = client.get(f"/api/predictions/{pred_id}", headers=headers)
        assert res.status_code == 200, f"Detail failed: {res.text}"
        print(f"[OK] GET /api/predictions/{pred_id}: Detail verified successfully")

        # 7. Dashboard Analytics
        res = client.get("/api/analytics/dashboard", headers=headers)
        assert res.status_code == 200, f"Analytics dashboard failed: {res.text}"
        analytics_data = res.json()
        print(f"[OK] GET /api/analytics/dashboard: Total predictions={analytics_data['total_predictions']}, High risk={analytics_data['higher_risk_predictions']}")

        # 8. Model Performance
        res = client.get("/api/analytics/model-performance")
        assert res.status_code == 200, f"Model performance failed: {res.text}"
        perf_data = res.json()
        print(f"[OK] GET /api/analytics/model-performance: Model={perf_data['model_name']}, Accuracy={perf_data['accuracy']}%, ROC-AUC={perf_data['roc_auc']}")

        # 9. Profile GET & PUT
        res = client.get("/api/profile", headers=headers)
        assert res.status_code == 200, f"Profile GET failed: {res.text}"
        update_res = client.put("/api/profile", json={"department": "Endocrinology & AI Research"}, headers=headers)
        assert update_res.status_code == 200, f"Profile PUT failed: {update_res.text}"
        assert update_res.json()["department"] == "Endocrinology & AI Research"
        print(f"[OK] GET & PUT /api/profile: Profile updated successfully")

        # 10. Delete prediction
        del_res = client.delete(f"/api/predictions/{pred_id}", headers=headers)
        assert del_res.status_code == 200, f"Delete failed: {del_res.text}"
        print(f"[OK] DELETE /api/predictions/{pred_id}: Deleted successfully")

        print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY! (10/10)")

if __name__ == "__main__":
    run_tests()
