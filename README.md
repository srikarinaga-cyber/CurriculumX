# CurriculumX

CurriculumX is a full-stack academic and career intelligence platform built with Next.js, FastAPI, semantic embeddings, Tailwind CSS, and Recharts.

## Run locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open http://localhost:3000. The sample syllabus and analysis work through the local FastAPI API.
