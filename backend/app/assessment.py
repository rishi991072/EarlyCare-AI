from app.schemas import AssessmentRequest, AssessmentResponse

SUPPORTED_SYMPTOMS = [
    {"id": "fever", "label": "Fever"},
    {"id": "cough", "label": "Cough"},
    {"id": "headache", "label": "Headache"},
    {"id": "sore_throat", "label": "Sore throat"},
    {"id": "fatigue", "label": "Fatigue"},
    {"id": "nausea", "label": "Nausea"},
    {"id": "vomiting", "label": "Vomiting"},
    {"id": "diarrhea", "label": "Diarrhea"},
    {"id": "body_ache", "label": "Body ache"},
    {"id": "rash", "label": "Rash"},
    {"id": "shortness_of_breath", "label": "Shortness of breath"},
    {"id": "chest_pain", "label": "Chest pain"},
    {"id": "confusion", "label": "New confusion"},
    {"id": "fainting", "label": "Fainting / loss of consciousness"},
    {"id": "severe_bleeding", "label": "Severe bleeding"},
]

URGENT_SYMPTOMS = {
    "shortness_of_breath", "chest_pain", "confusion",
    "fainting", "severe_bleeding"
}

def assess(request: AssessmentRequest) -> AssessmentResponse:
    known = {item["id"] for item in SUPPORTED_SYMPTOMS}
    unknown = sorted(set(request.symptoms) - known)
    if unknown:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=f"Unsupported symptom ID(s): {', '.join(unknown)}")

    warning_signs = [s.replace("_", " ") for s in request.symptoms if s in URGENT_SYMPTOMS]
    if warning_signs:
        return AssessmentResponse(
            assessment_type="safety_screen",
            urgency="emergency",
            title="Seek emergency medical help",
            summary="One or more selected symptoms may indicate a medical emergency. Do not rely on this app to assess their cause.",
            warning_signs=warning_signs,
            next_steps=[
                "Contact local emergency services now or go to the nearest emergency department.",
                "In India, call 112 for emergency assistance.",
                "Do not delay urgent care while completing this assessment."
            ],
            limitations=[
                "This is a conservative warning-sign screen, not a diagnosis or complete triage protocol.",
                "The app cannot determine the cause or severity of your symptoms."
            ],
            model_used=False,
        )

    if request.severity == "severe" or (request.temperature_c is not None and request.temperature_c >= 40):
        urgency = "prompt_medical_advice"
        title = "Contact a healthcare professional promptly"
        summary = "The reported severity or temperature warrants prompt professional advice. This app cannot determine the cause."
        next_steps = [
            "Contact a qualified healthcare professional promptly for advice.",
            "Seek emergency care if symptoms become severe, worsen rapidly, or you feel unsafe.",
            "Drink fluids if you can do so safely and rest while arranging care."
        ]
    else:
        urgency = "routine_guidance"
        title = "Review your symptoms and monitor changes"
        summary = "Your selected answers did not trigger the app's limited emergency warning checks. This does not rule out a serious condition."
        next_steps = [
            "Consider contacting a healthcare professional if symptoms persist, worsen, or concern you.",
            "Monitor your symptoms and temperature if you have a thermometer.",
            "Seek urgent care if you develop breathing difficulty, chest pain, confusion, fainting, or severe bleeding."
        ]

    if request.duration_days >= 7:
        next_steps.insert(0, "Because symptoms have lasted a week or longer, arrange medical advice.")

    return AssessmentResponse(
        assessment_type="rule_based_screening",
        urgency=urgency,
        title=title,
        summary=summary,
        warning_signs=[],
        next_steps=next_steps,
        limitations=[
            "This is preliminary health information, not a medical diagnosis.",
            "No machine-learning disease prediction is enabled in this version.",
            "A lack of listed warning signs does not mean that a condition is harmless."
        ],
        model_used=False,
    )
