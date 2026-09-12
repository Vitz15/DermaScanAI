import os
import google.generativeai as genai
from services.prompts import SYSTEM_INSTRUCTION, build_explanation_prompt

_configured = False


def _ensure_configured():
    global _configured
    if not _configured:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY belum diset di .env")
        genai.configure(api_key=api_key)
        _configured = True


def generate_explanation(class_label: str, confidence: float) -> str:
    try:
        _ensure_configured()
        model = genai.GenerativeModel(
            "gemini-2.0-flash",
            system_instruction=SYSTEM_INSTRUCTION,
        )
        prompt = build_explanation_prompt(class_label, confidence)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return (
            f"Penjelasan otomatis sedang tidak tersedia ({type(e).__name__}). "
            f"Model mendeteksi kategori: {class_label}."
        )