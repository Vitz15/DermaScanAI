from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    predicted_class = Column(String, nullable=False)
    class_label_readable = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    all_probabilities = Column(JSON, nullable=False)
    original_image = Column(Text, nullable=True)
    gradcam_heatmap = Column(Text, nullable=True)
    llm_explanation = Column(Text, nullable=False)
    processing_time_ms = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())