import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Diabetes Risk Prediction & Health Analytics API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./diabetes.db"
    
    # Security
    SECRET_KEY: str = "smart-diabetes-ai-production-secret-key-2026-secure-jwt"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    
    # Model Artifact
    MODEL_PATH: str = os.path.join(os.path.dirname(__file__), "ml", "model", "diabetes_model.joblib")
    DATASET_PATH: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "diabetes.csv")

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
