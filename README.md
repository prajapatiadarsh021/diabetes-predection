# 🩺 Smart Diabetes Risk Prediction & Health Analytics System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An intelligent, full-stack clinical risk assessment and population health analytics platform. The system leverages machine learning trained on clinical biomarkers (Pima Indians Diabetes Dataset) to predict diabetes risk probability, attribute primary biomarker risk factors, and deliver actionable lifestyle recommendations alongside interactive population-level health visualizations.

---

## 🌟 Key Features

- **🤖 Machine Learning Inference Pipeline**: Trains, evaluates, and serves classification models (Logistic Regression, Decision Tree, Random Forest, Support Vector Machine, and Gradient Boosting), serving predictions via high-performance REST endpoints.
- **🔬 Biomarker Factor Attribution**: Breaks down individual clinical parameters (Fasting Glucose, BMI, Pedigree, Blood Pressure, Age, Insulin) to explain risk score contributions and recommend tailored clinical next steps.
- **📊 Interactive Analytics Dashboard**: Population-level visualizations featuring risk distribution donuts, chronological risk trajectories, age demographic stratifications, and clinical scatter plots.
- **🔐 JWT Clinician Authentication**: Secure registration and login for medical personnel with encrypted token storage and profile customization.
- **📜 Comprehensive Prediction History**: Searchable, filterable audit trail of previous patient assessments with real-time recalculations.
- **✨ Modern Responsive Interface**: Glassmorphism aesthetic built with React, Tailwind CSS, Recharts, and Lucide icons.
- **📖 Self-Documenting REST API**: Built-in interactive Swagger UI (`/docs`) and ReDoc (`/redoc`).

---

## 🏗️ Architecture & Tech Stack

```text
diabetes-predection/
├── backend/                         # FastAPI REST API & ML Pipeline
│   ├── app/
│   │   ├── main.py                  # API entry point & CORS configuration
│   │   ├── config.py                # Environment configuration loader
│   │   ├── database.py              # SQLAlchemy database session management
│   │   ├── ml/                      # ML training, model evaluation & inference
│   │   │   ├── train_model.py       # Multi-model benchmarking script
│   │   │   ├── predict.py           # Inference & factor impact attribution
│   │   │   └── model/               # Serialized model artifacts (.joblib)
│   │   ├── models/                  # SQLAlchemy ORM models (User, Prediction)
│   │   ├── routes/                  # API routers (auth, predictions, analytics, profile)
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   └── services/                # Business logic & JWT services
│   ├── data/                        # Dataset storage (diabetes.csv)
│   ├── requirements.txt             # Python backend dependencies
│   ├── .env.example                 # Backend environment variable template
│   └── README.md                    # Detailed backend guide
│
├── src/                             # React Frontend (Vite)
│   ├── components/                  # UI components (RiskCard, ChartCard, Navbar, etc.)
│   ├── context/                     # Global state (AuthContext, PredictionContext)
│   ├── pages/                       # App views (Dashboard, Prediction, History, Analytics)
│   ├── services/                    # API client integration (predictionService.js)
│   ├── App.jsx                      # App root & routing
│   └── main.jsx                     # Vite entry point
├── public/                          # Static assets and icons
├── package.json                     # Frontend dependencies
├── vite.config.js                   # Vite configuration
└── LICENSE                          # MIT License
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ and **npm**
- **Python**: v3.11+ and **pip**
- **Git**

---

### 2. Backend Setup

```powershell
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment (optional but recommended)
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain and benchmark the ML models
python app/ml/train_model.py

# Launch the FastAPI backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API Base URL: `http://127.0.0.1:8000`
- Swagger UI Docs: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

### 3. Frontend Setup

In a new terminal window:

```powershell
# From the project root
npm install

# Start the Vite development server
npm run dev
```

The web application will be accessible at: `http://localhost:5173`

---

## 📊 ML Model Performance Benchmark

The system benchmarks multiple algorithms on the Pima Indians Diabetes Dataset:

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|
| **Gradient Boosting** | 74.03% | 64.58% | 57.41% | 60.78% | **0.8228** |
| **Logistic Regression** | 70.78% | 60.00% | 50.00% | 54.55% | 0.8130 |
| **Random Forest** | 75.32% | 69.05% | 53.70% | 60.42% | 0.8074 |
| **Support Vector Machine** | 74.03% | 65.22% | 55.56% | 60.00% | 0.7964 |
| **Decision Tree** | 76.62% | 65.00% | 72.22% | 68.42% | 0.7840 |

---

## ⚖️ Medical & Ethical Disclaimer

> **Important Medical Notice**: This application is an educational demonstration developed for academic and informational purposes only. It is **not** an approved medical diagnostic device and does not substitute for professional medical advice, clinical diagnosis, or treatment.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
