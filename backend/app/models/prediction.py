from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    patient_name = Column(String(100), nullable=True, default="Anonymous Case")
    age = Column(Float, nullable=False)
    gender = Column(String(20), nullable=False, default="Female")
    pregnancies = Column(Integer, nullable=False, default=0)
    glucose = Column(Float, nullable=False)
    blood_pressure = Column(Float, nullable=False)
    skin_thickness = Column(Float, nullable=False)
    insulin = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    diabetes_pedigree = Column(Float, nullable=False)
    risk_category = Column(String(50), nullable=False)
    probability = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship to user
    user = relationship("User", back_populates="predictions")
