import time
import base64
import binascii
from fastapi import APIRouter, HTTPException
from schemas.response_models import PredictResponse, PredictionDetail
from services.model_service import predict as run_prediction, generate_gradcam
from services.gemini_client import generate_explanation
from services.prompts import DISCLAIMER_TEXT

router = APIRouter()

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024


@router.post("/api/predict")
def predict(payload: dict):
    start = time.time()

    image_b64 = payload.get("image")
    if not image_b64:
        raise HTTPException(status_code=400, detail={
            "error": "invalid_image",
            "message": "Field 'image' is required (base64)."
        })

    try:
        image_bytes = base64.b64decode(image_b64, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail={
            "error": "invalid_image",
            "message": "Unable to process image. Make sure it is valid base64."
        })

    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail={
            "error": "invalid_image",
            "message": "Image size exceeds 10MB."
        })

    result = run_prediction(image_bytes)
    heatmap_b64 = generate_gradcam(image_bytes, result["class"])

    heatmap_bytes = base64.b64decode(heatmap_b64)

    explanation = generate_explanation(
        result["class_label_readable"],
        result["confidence"],
        class_code=result["class"],
        original_image_bytes=image_bytes,
        heatmap_image_bytes=heatmap_bytes,
    )

    elapsed_ms = int((time.time() - start) * 1000)

    return PredictResponse(
        prediction=PredictionDetail(
            **{"class": result["class"]},
            class_label_readable=result["class_label_readable"],
            confidence=result["confidence"],
            all_probabilities=result["all_probabilities"],
        ),
        gradcam_heatmap=heatmap_b64,
        llm_explanation=explanation,
        disclaimer=DISCLAIMER_TEXT,
        processing_time_ms=elapsed_ms,
    )