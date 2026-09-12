from pydantic import BaseModel, Field
from typing import Dict


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

class PredictRequest(BaseModel):
    image: str