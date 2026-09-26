# Smart Diabetes Risk Prediction & Health Analytics System - Backend API

Production-ready, high-performance REST API backend built with **FastAPI**, **SQLAlchemy**, and **Scikit-learn** for the **Smart Diabetes Risk Prediction and Health Analytics System** college project.

---

## 🌟 Key Features

- **Machine Learning Inference Pipeline**: Trains and compares 5 classification models (Logistic Regression, Decision Tree, Random Forest, Support Vector Machine, Gradient Boosting) on the validated Pima Indians Diabetes Dataset, selecting the champion model based on validation metrics.
- **Biomarker Factor Attribution**: Evaluates individual clinical biomarkers (Fasting Glucose, BMI, Pedigree, BP, Age) to return interpretable factor impacts (e.g. `+32% High Risk contribution`) and tailored lifestyle advice.
- **JWT Authentication**: Secure user registration, password hashing via bcrypt, and signed bearer access tokens.
- **SQLite Database with SQLAlchemy ORM**: Automated schema creation, relationship mapping (`User` ↔ `Prediction`), and pre-seeded demonstration data (`alex.morgan@healthai.edu` / `password123`).
- **Population Health Analytics**: Pre-computed metrics for risk distribution, chronological trajectories, demographic age stratifications, and biomarker correlation points.
- **CORS Configured**: Plug-and-play communication with React / Vite development servers (`http://localhost:5173`).
- **Interactive Documentation**: Instant Swagger UI (`/docs`) and ReDoc (`/redoc`).
- **Medical Safety Notice**: Explicit non-diagnostic disclaimers attached to all risk evaluation responses.

---

## 🏗️ Project Architecture

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application entrypoint, CORS, exception handlers
│   ├── database.py              # SQLAlchemy engine and session dependency
│   ├── config.py                # Environment configuration loader
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py              # User ORM model
│   │   └── prediction.py        # Prediction ORM model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py              # User request & response Pydantic schemas
│   │   ├── prediction.py        # Prediction request, response, and history schemas
│   │   └── analytics.py         # Dashboard analytics & model performance schemas
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py              # Authentication endpoints (/api/auth)
│   │   ├── prediction.py        # Prediction endpoint (/api/predictions/predict)
│   │   ├── history.py           # History list, get detail, delete (/api/predictions)
│   │   ├── analytics.py         # Dashboard analytics & model metrics (/api/analytics)
│   │   └── profile.py           # User profile endpoints (/api/profile)
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py      # Password hashing, JWT creation & verification
│   │   └── prediction_service.py # ML inference execution and database persistence
│   │
│   └── ml/
│       ├── __init__.py
│       ├── train_model.py       # ML training and model comparison pipeline
│       ├── predict.py           # ML inference and factor attribution helper
│       └── model/
│           └── diabetes_model.joblib # Serialized model bundle
│
├── data/
│   └── diabetes.csv             # Pima Indians Diabetes Dataset (768 records)
│
├── test_api.py                  # Automated verification test suite
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables
└── README.md                    # Project documentation
```

---

## 🛠️ Technology Stack

- **Python**: 3.11+ (compatible with 3.11, 3.12, 3.13, 3.14)
- **FastAPI**: Modern, high-performance web framework for building APIs
- **Uvicorn**: ASGI web server implementation
- **SQLAlchemy 2.0**: Python SQL toolkit and Object Relational Mapper
- **SQLite**: Lightweight database
- **Pydantic v2**: Data validation and schema settings
- **Scikit-learn**: Machine learning model training, cross-validation, and metrics
- **Joblib**: Efficient serialization of trained model pipelines
- **Bcrypt**: Secure cryptographic password hashing
- **PyJWT & Cryptography**: JSON Web Token creation and verification

---

## 🚀 Getting Started (Windows PowerShell & VS Code)

### 1. Navigate to the backend directory

```powershell
cd "c:\Users\praja\OneDrive\Desktop\diabetes prediction\backend"
```

### 2. Install Dependencies

```powershell
python -m pip install -r requirements.txt
```

### 3. (Optional) Train the Machine Learning Model

The trained model bundle is pre-generated in `app/ml/model/diabetes_model.joblib`. If you wish to retrain or compare classification models from scratch:

```powershell
python app/ml/train_model.py
```

This will output a comparative validation table:

```text
======================================================================
Model                     | Accuracy | Precision | Recall  | F1     | ROC-AUC
======================================================================
Logistic Regression       |   70.78% |     60.0% |   50.0% | 54.55% |   0.813
Decision Tree             |   76.62% |     65.0% |  72.22% | 68.42% |   0.784
Random Forest             |   75.32% |    69.05% |   53.7% | 60.42% |  0.8074
Support Vector Machine    |   74.03% |    65.22% |  55.56% |  60.0% |  0.7964
Gradient Boosting         |   74.03% |    64.58% |  57.41% | 60.78% |  0.8228
======================================================================
```

### 4. Run the Backend Server

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will be live at:
- **Base URL**: `http://127.0.0.1:8000`
- **Swagger UI Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Interactive Docs**: `http://127.0.0.1:8000/redoc`
- **Health Check**: `http://127.0.0.1:8000/api/health`

### 5. Run the Automated Verification Test Suite

```powershell
python test_api.py
```

---

## 📡 REST API Reference

### 1. System & Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/` | API welcome banner and docs links |

### 2. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new clinician account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | **Yes (Bearer JWT)** |

### 3. Predictions (`/api/predictions`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/predictions/predict` | Evaluate health parameters with ML model | Optional |
| `GET` | `/api/predictions/history` | Paginated prediction history with search & filter | Optional |
| `GET` | `/api/predictions/{id}` | Detailed clinical analysis for single prediction | Optional |
| `DELETE` | `/api/predictions/{id}` | Delete a prediction record | Optional |

### 4. Population Analytics (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | Aggregated metrics for charts (donut, trends, age, scatter) | Optional |
| `GET` | `/api/analytics/model-performance`| ML model metrics (Accuracy, ROC-AUC, Confusion Matrix) | No |

### 5. Clinician Profile (`/api/profile`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/profile` | View user profile details | **Yes (Bearer JWT)** |
| `PUT` | `/api/profile` | Update profile (name, age, gender, department) | **Yes (Bearer JWT)** |

---

## 💻 Example API Requests & Responses

### 1. Predict Diabetes Risk

**Request (`POST http://127.0.0.1:8000/api/predictions/predict`):**

```json
{
  "patient_name": "Sarah Jenkins",
  "age": 48,
  "gender": "Female",
  "pregnancies": 3,
  "glucose": 148,
  "blood_pressure": 84,
  "skin_thickness": 32,
  "insulin": 178,
  "bmi": 33.6,
  "diabetes_pedigree": 0.627
}
```

**Response (`201 Created`):**

```json
{
  "prediction_id": 8,
  "risk_category": "Higher predicted risk",
  "probability": 0.9011,
  "patient_name": "Sarah Jenkins",
  "age": 48.0,
  "gender": "Female",
  "pregnancies": 3,
  "glucose": 148.0,
  "blood_pressure": 84.0,
  "skin_thickness": 32.0,
  "insulin": 178.0,
  "bmi": 33.6,
  "diabetes_pedigree": 0.627,
  "created_at": "2026-09-19T06:28:30.123456",
  "primary_factors": [
    {
      "factor": "Elevated Fasting Glucose (148.0 mg/dL)",
      "impact": "High (+32%)",
      "type": "negative"
    },
    {
      "factor": "Obesity Range BMI (33.6 kg/m²)",
      "impact": "High (+24%)",
      "type": "negative"
    },
    {
      "factor": "Genetic Pedigree Score (0.63)",
      "impact": "Moderate (+12%)",
      "type": "negative"
    },
    {
      "factor": "Age Category (48 years)",
      "impact": "Moderate (+10%)",
      "type": "negative"
    }
  ],
  "recommendations": [
    "Schedule a formal clinical consultation with a primary care physician or endocrinologist.",
    "Request comprehensive metabolic screening including HbA1c and fasting lipid panel.",
    "Adopt an evidence-based medical nutrition plan focusing on low glycemic index foods.",
    "Target 150+ minutes of moderate weekly physical activity and resistance training."
  ],
  "disclaimer": "This system provides an AI-based risk estimate for educational and informational purposes only. It is not a medical diagnosis and should not replace professional medical advice."
}
```

---

### 2. Login as Demo Clinician

**Request (`POST http://127.0.0.1:8000/api/auth/login`):**

```json
{
  "email": "alex.morgan@healthai.edu",
  "password": "password123"
}
```

**Response (`200 OK`):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "full_name": "Dr. Alex Morgan",
    "email": "alex.morgan@healthai.edu",
    "age": 34,
    "gender": "Female",
    "department": "Biomedical Informatics & Data Science",
    "institution": "University Health Sciences Institute",
    "created_at": "2026-09-19T06:25:00.000000"
  }
}
```

---

## 🔗 Connecting with the React Frontend

The React frontend (`src/services/predictionService.js`) can easily be toggled to connect directly to this backend:

```javascript
// In src/services/predictionService.js:
const USE_REMOTE_API = true;
const BACKEND_API_URL = 'http://127.0.0.1:8000/api/predictions/predict';

export async function predictDiabetesRisk(formData) {
  if (USE_REMOTE_API) {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return await response.json();
  }
  // ...
}
```

---

## ⚖️ Medical & Ethical Disclaimer

> **“This system provides an AI-based risk estimate for educational and informational purposes only. It is not a medical diagnosis and should not replace professional medical advice.”**

This project is an academic demonstration developed for college capstone presentation. No clinical decisions, treatments, or medication changes should be based on this software.
