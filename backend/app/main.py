
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.schemas import AssessmentRequest, AssessmentResponse
from app.assessment import SUPPORTED_SYMPTOMS, assess

app = FastAPI(
    title="EarlyCare AI",
    description=(
        "Preliminary health screening and health risk awareness. "
        "Not a diagnostic tool."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Locate the frontend build created by Docker.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"


@app.get("/")
def home():
    index_file = FRONTEND_DIST / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {
        "project": "EarlyCare AI",
        "message": "Frontend build not found.",
        "version": app.version,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "EarlyCare AI"}


@app.get("/api/v1/symptoms")
def get_symptoms():
    return {"symptoms": SUPPORTED_SYMPTOMS}


@app.post("/api/v1/assessments", response_model=AssessmentResponse)
def create_assessment(request: AssessmentRequest):
    return assess(request)


@app.get("/api/v1/model-info")
def model_info():
    return {
        "model_status": "not_enabled",
        "model_used": False,
        "reason": (
            "A validated dataset and reproducible evaluation must be "
            "completed before enabling disease predictions."
        ),
        "metrics": None,
        "limitations": [
            "Current assessments use limited rule-based safety checks only.",
            "No disease probability or model accuracy is claimed.",
            "The app is not a substitute for professional medical care.",
        ],
    }


# Serve compiled frontend assets.
ASSETS_DIR = FRONTEND_DIST / "assets"

if ASSETS_DIR.is_dir():
    app.mount(
        "/assets",
        StaticFiles(directory=str(ASSETS_DIR)),
        name="assets",
    )
