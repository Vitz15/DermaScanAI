from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime


class PredictionDetail(BaseModel):
    class_name: str = Field(alias="class")
    class_label_readable: str
    confidence: float
    all_probabilities: Dict[str, float]

    class Config:
        populate_by_name = True


class PredictResponse(BaseModel):
    prediction: PredictionDetail
    gradcam_heatmap: str
    llm_explanation: str
    disclaimer: str
    processing_time_ms: int
    analysis_id: str
    created_at: datetime

class PredictRequest(BaseModel):
    image: str

class HistoryItemSummary(BaseModel):
    id: str
    predicted_class: str
    class_label_readable: str
    confidence: float
    created_at: datetime


class HistoryItemDetail(HistoryItemSummary):
    all_probabilities: Dict[str, float]
    original_image: Optional[str] = None
    gradcam_heatmap: Optional[str] = None
    llm_explanation: str
    processing_time_ms: int


class HistoryListResponse(BaseModel):
    items: List[HistoryItemSummary]
    total: int