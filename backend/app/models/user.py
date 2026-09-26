from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    department = Column(String(100), nullable=True, default="Clinical Informatics")
    institution = Column(String(150), nullable=True, default="University Health Consortium")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to user predictions
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
