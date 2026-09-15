import os
import io
from PIL import Image
from google import genai
from google.genai import types
from services.prompts import SYSTEM_INSTRUCTION, build_explanation_prompt

_client = None


def _get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set in .env")
        _client = genai.Client(api_key=api_key)
    return _client


def generate_explanation(
    class_label: str,
    confidence: float,
    class_code: str = "",
    original_image_bytes: bytes | None = None,
    heatmap_image_bytes: bytes | None = None,
) -> str:
    """Call Gemini for a natural-language explanation. If image bytes are
    provided, the model receives the original lesion photo and the Grad-CAM
    heatmap alongside the text prompt, so the explanation can reference what
    is actually visible in the image rather than only the class/confidence
    numbers. class_code (e.g. "mel", "bcc", "nv") determines the risk-tier
    tone in the prompt. Disclaimer is NOT included here, it is appended
    separately in routes/predict.py."""
    try:
        client = _get_client()
        prompt = build_explanation_prompt(class_label, confidence, class_code)

        content_parts: list = [prompt]

        if original_image_bytes:
            content_parts.append(Image.open(io.BytesIO(original_image_bytes)))
        if heatmap_image_bytes:
            content_parts.append(Image.open(io.BytesIO(heatmap_image_bytes)))

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=content_parts,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
            ),
        )
        return response.text
    except Exception as e:
        return (
            f"Automatic explanation is currently unavailable ({type(e).__name__}). "
            f"The model detected category: {class_label}."
        )