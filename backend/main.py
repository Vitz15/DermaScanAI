from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes.predict import router as predict_router
from services.model_service import load_model_if_needed

app = FastAPI(title="DermaScan AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)


@app.on_event("startup")
def startup_event():
    load_model_if_needed()


@app.get("/api/health")
def health():
    return {"status": "ok"}