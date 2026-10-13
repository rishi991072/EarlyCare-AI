from typing import Literal
from pydantic import BaseModel, Field, field_validator

Severity = Literal["mild", "moderate", "severe"]

class AssessmentRequest(BaseModel):
    age: int = Field(ge=1, le=120)
    symptoms: list[str] = Field(min_length=1, max_length=12)
    duration_days: int = Field(ge=0, le=365)
    severity: Severity
    temperature_c: float | None = Field(default=None, ge=30, le=45)
    demo_mode: bool = False

    @field_validator("symptoms")
    @classmethod
    def validate_symptoms(cls, values: list[str]) -> list[str]:
        cleaned = list(dict.fromkeys(s.strip().lower() for s in values if s.strip()))
        if not cleaned:
            raise ValueError("Select at least one symptom.")
        return cleaned

class AssessmentResponse(BaseModel):
    assessment_type: str
    urgency: Literal["emergency", "prompt_medical_advice", "routine_guidance"]
    title: str
    summary: str
    warning_signs: list[str]
    next_steps: list[str]
    limitations: list[str]
    model_used: bool
