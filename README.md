# EarlyCare AI
AI-Powered Early Disease Screening and Health Risk Assessment System

EarlyCare AI is a college-project MVP for preliminary symptom assessment and health awareness. It is **not a diagnostic tool** and does not replace a qualified healthcare professional.

## Current status
- Working React + Vite + TypeScript frontend
- Working Python FastAPI backend
- Symptom assessment form with validation
- Safety-first warning-sign checks
- Clearly labelled synthetic demonstration mode
- API documentation at `/docs`
- ML training scaffold and dataset documentation
- No unvalidated disease predictions or invented accuracy scores

The machine-learning component is deliberately not represented as clinically validated. Before adding predictions, select a suitable public dataset, verify its licence and target labels, train/evaluate models, and document limitations.

## Requirements
- Python 3.10+
- Node.js 20+ and npm
- Windows PowerShell (commands below are for PowerShell)

## 1. Start the backend
Open PowerShell in this project directory:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend:
- API: http://127.0.0.1:8000
- Interactive API docs: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

Keep this terminal open.

## 2. Start the frontend
Open a **second** PowerShell terminal in the project directory:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

The frontend expects the API at `http://127.0.0.1:8000`. Set `VITE_API_BASE_URL` if you use a different address.

## API endpoints
- `GET /` — project information
- `GET /health` — service health
- `GET /api/v1/symptoms` — supported symptom options
- `POST /api/v1/assessments` — preliminary assessment and warning-sign screening
- `GET /api/v1/model-info` — transparent model status and limitations

## Important safety and privacy notes
- The app does not diagnose a disease or prescribe medication.
- Warning signs are intended as conservative prompts, not a complete triage protocol.
- If someone may be experiencing a medical emergency, contact local emergency services immediately. In India, 112 is the national emergency number.
- Do not enter identifying or highly sensitive information in this student demo.
- Assessment history is not persisted. Do not add storage without an explicit consent and privacy design.

## Project structure
```text
EarlyCare-AI/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── assessment.py
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── data/
│   ├── raw/README.md
│   └── processed/README.md
├── models/README.md
├── notebooks/README.md
└── docs/
    ├── concept-note.md
    ├── dataset-documentation.md
    └── model-card.md
```

## Next development milestone
Choose and verify a real dataset before training any ML model. Record its source, licence, intended target, feature definitions, population, collection method, and known biases. Do not use synthetic demo examples as model training evidence.
