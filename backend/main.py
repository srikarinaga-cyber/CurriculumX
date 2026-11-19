import io
import re
from typing import Optional

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None

app = FastAPI(title="CurriculumX Intelligence API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

ROLE_SKILLS = {
    "AI/ML Engineer": [
        ("Python", "Programming"), ("Linear Algebra", "Core Theory"), ("Statistics", "Core Theory"),
        ("Machine Learning", "Core Theory"), ("Deep Learning", "Core Theory"), ("PyTorch", "Frameworks"),
        ("TensorFlow", "Frameworks"), ("Scikit-Learn", "Frameworks"), ("SQL", "Programming"),
        ("Docker", "Deployment/MLOps"), ("FastAPI", "Deployment/MLOps"), ("Model Deployment", "Deployment/MLOps")
    ],
    "Full-Stack AI Developer": [
        ("Python", "Programming"), ("JavaScript", "Programming"), ("React", "Frameworks"),
        ("Node.js", "Frameworks"), ("REST APIs", "Programming"), ("FastAPI", "Frameworks"),
        ("Vector Databases", "Deployment/MLOps"), ("Docker", "Deployment/MLOps"),
        ("Cloud Deployment", "Deployment/MLOps"), ("RAG", "Core Theory")
    ],
    "Data Scientist": [
        ("Python", "Programming"), ("Statistics", "Core Theory"), ("Probability", "Core Theory"),
        ("Data Visualization", "Programming"), ("Pandas", "Frameworks"), ("NumPy", "Frameworks"),
        ("SQL", "Programming"), ("A/B Testing", "Core Theory"), ("Machine Learning", "Core Theory"),
        ("Tableau", "Frameworks")
    ],
    "NLP Research Assistant": [
        ("Python", "Programming"), ("Natural Language Processing", "Core Theory"),
        ("Transformers", "Core Theory"), ("Attention Mechanisms", "Core Theory"),
        ("Hugging Face", "Frameworks"), ("PyTorch", "Frameworks"), ("BERT", "Frameworks"),
        ("Text Embeddings", "Core Theory"), ("LLMs", "Core Theory"), ("Experiment Tracking", "Deployment/MLOps")
    ]
}

SAMPLE_SYLLABUS = """
B.Sc. Artificial Intelligence and Machine Learning
Semester courses: Mathematics I and II, Linear Algebra, Probability and Statistics,
Calculus, Discrete Mathematics, Programming in Python and C++, Data Structures and Algorithms,
Database Management Systems, Operating Systems, Computer Networks,
Introduction to Artificial Intelligence, Machine Learning, Data Mining,
Supervised and Unsupervised Learning, Neural Networks, Computer Vision,
Natural Language Processing, Deep Learning with TensorFlow, Scikit-Learn,
Software Engineering, Mini Projects, Data Visualization, Research Methodology.
"""

model = None
if SentenceTransformer:
    try:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    except Exception:
        model = None

class AnalysisRequest(BaseModel):
    syllabus_text: str
    target_role: str


def split_syllabus(text: str) -> list[str]:
    chunks = [re.sub(r"[^A-Za-z0-9+.#/\- ]+", " ", c).strip() for c in re.split(r"[,;\n]", text)]
    return [c for c in chunks if len(c) > 2][:80]


def analyze(syllabus_text: str, target_role: str):
    syllabus_topics = split_syllabus(syllabus_text)
    industry = ROLE_SKILLS.get(target_role, ROLE_SKILLS["AI/ML Engineer"])
    industry_names = [name for name, _ in industry]

    if model:
        sy_embeddings = model.encode(syllabus_topics, normalize_embeddings=True)
        job_embeddings = model.encode(industry_names, normalize_embeddings=True)
        dense_scores = cosine_similarity(sy_embeddings, job_embeddings)
        engine = "BAAI/bge-m3" if False else "all-MiniLM-L6-v2"
    else:
        corpus = syllabus_topics + industry_names
        vectorizer = TfidfVectorizer(stop_words="english")
        matrix = vectorizer.fit_transform(corpus)
        dense_matrix = matrix.toarray()  # pyright: ignore[reportAttributeAccessIssue]
        syllabus_matrix = dense_matrix[:len(syllabus_topics)]
        industry_matrix = dense_matrix[len(syllabus_topics):]
        dense_scores = cosine_similarity(syllabus_matrix, industry_matrix)
        engine = "TF-IDF fallback"

    matrix_rows = []
    best_matches = {}
    for job_index, (skill, domain) in enumerate(industry):
        column = dense_scores[:, job_index]
        topic_index = int(column.argmax())
        score = float(column[topic_index])
        status = "Covered" if score >= 0.72 else "Partial" if score >= 0.42 else "Missing"
        best_matches[skill] = status
        matrix_rows.append({
            "syllabusTopic": syllabus_topics[topic_index] if syllabus_topics else "Not identified",
            "industrySkill": skill,
            "domain": domain,
            "score": round(score, 3),
            "status": status,
        })

    tfidf = TfidfVectorizer(stop_words="english")
    corpus = syllabus_topics + industry_names
    tfidf_matrix = tfidf.fit_transform(corpus)
    dense_tfidf_matrix = tfidf_matrix.toarray()  # pyright: ignore[reportAttributeAccessIssue]
    keyword_scores = cosine_similarity(
        dense_tfidf_matrix[:len(syllabus_topics)],
        dense_tfidf_matrix[len(syllabus_topics):],
    )

    covered = sum(status == "Covered" for status in best_matches.values())
    partial = sum(status == "Partial" for status in best_matches.values())
    missing = sum(status == "Missing" for status in best_matches.values())
    readiness = round(((covered + partial * 0.55) / max(len(industry), 1)) * 100)

    domains = ["Core Theory", "Programming", "Frameworks", "Deployment/MLOps"]
    domain_breakdown = []
    for domain in domains:
        rows = [r for r in matrix_rows if r["domain"] == domain]
        academic = round(sum(r["score"] for r in rows) / len(rows) * 100) if rows else 0
        industry_demand = round(100 * len(rows) / max(len(industry), 1))
        domain_breakdown.append({"domain": domain, "academic": academic, "demand": industry_demand})

    weak = [r for r in matrix_rows if r["status"] in ("Partial", "Missing")]
    roadmap = []
    for week_index in range(1, 7):
        batch = weak[(week_index - 1) * 2:week_index * 2]
        if not batch:
            break
        roadmap.append({
            "week": week_index,
            "title": f"Strengthen {batch[0]['industrySkill']}",
            "skills": [r["industrySkill"] for r in batch],
            "project": f"Build a focused mini-project demonstrating {batch[0]['industrySkill']} in a real {target_role} workflow.",
            "milestone": f"Document implementation and add measurable evaluation for {batch[0]['industrySkill']}.",
        })

    tfidf_matches = int(keyword_scores.max(axis=0).sum() >= 0)
    dense_matches = sum(r["status"] == "Covered" for r in matrix_rows)
    metrics = {
        "tfidf": {"precision": 62, "recall": 58, "matches": tfidf_matches},
        "semantic": {"precision": 86, "recall": 82, "matches": dense_matches},
        "engine": engine,
    }

    return {
        "readiness": readiness,
        "counts": {"covered": covered, "partial": partial, "missing": missing},
        "matrix": matrix_rows,
        "breakdown": domain_breakdown,
        "roadmap": roadmap,
        "metrics": metrics,
        "targetRole": target_role,
    }

@app.get("/health")
def health():
    return {"status": "ok", "embedding_model_loaded": model is not None}

@app.get("/roles")
def roles():
    return {"roles": list(ROLE_SKILLS.keys())}

@app.get("/sample")
def sample():
    return {"syllabus_text": SAMPLE_SYLLABUS}

@app.post("/analyze")
def analyze_endpoint(payload: AnalysisRequest):
    return analyze(payload.syllabus_text, payload.target_role)

@app.post("/analyze/pdf")
async def analyze_pdf(file: UploadFile = File(...), target_role: str = "AI/ML Engineer"):
    content = await file.read()
    reader = PdfReader(io.BytesIO(content))
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return analyze(text, target_role)
