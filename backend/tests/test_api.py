from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_symptoms_endpoint():
    response = client.get("/api/v1/symptoms")
    assert response.status_code == 200
    assert len(response.json()["symptoms"]) > 0

def test_emergency_warning_takes_priority():
    response = client.post("/api/v1/assessments", json={
        "age": 30,
        "symptoms": ["chest_pain"],
        "duration_days": 1,
        "severity": "mild",
        "demo_mode": True
    })
    assert response.status_code == 200
    assert response.json()["urgency"] == "emergency"
    assert response.json()["model_used"] is False

def test_invalid_age_rejected():
    response = client.post("/api/v1/assessments", json={
        "age": 0,
        "symptoms": ["cough"],
        "duration_days": 1,
        "severity": "mild"
    })
    assert response.status_code == 422

def test_regular_assessment_is_not_diagnosis():
    response = client.post("/api/v1/assessments", json={
        "age": 24,
        "symptoms": ["cough", "fatigue"],
        "duration_days": 2,
        "severity": "mild"
    })
    assert response.status_code == 200
    assert response.json()["model_used"] is False
