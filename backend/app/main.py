from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import AssessmentRequest, AssessmentResponse
from app.assessment import SUPPORTED_SYMPTOMS, assess

app = FastAPI(
    title="EarlyCare AI",
    description="Preliminary health screening and health risk awareness. Not a diagnostic tool.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.get("/")
def home():
    return {
        "project": "EarlyCare AI",
        "message": "EarlyCare AI API is running!",
        "version": app.version,
        "purpose": "Preliminary health screening",
        "diagnosis": False,
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "EarlyCare AI API"}

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
        "reason": "A validated dataset and reproducible evaluation must be completed before enabling disease predictions.",
        "metrics": None,
        "limitations": [
            "Current assessments use limited rule-based safety checks only.",
            "No disease probability or model accuracy is claimed.",
            "The app is not a substitute for professional medical care."
        ],
    }
