import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.classification_service import ClassificationService
from services.embedding_service import EmbeddingService, SimilarityService
from services.risk_service import RiskService
from services.graph_service import GraphService
from services.visual_service import VisualService
from services.root_cause_service import RootCauseService, RecommendationService
from models.providers import get_provider

app = FastAPI(
    title="PRAVAH-AI Machine Learning & Graph Intelligence Microservice",
    description="Predictive Resolution & Anomaly Vector Analysis for Grievances",
    version="1.0.0"
)

# Enable CORS for Next.js web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service Singletons
classification_service = ClassificationService()
embedding_service = EmbeddingService()
similarity_service = SimilarityService()
risk_service = RiskService()
graph_service = GraphService()
visual_service = VisualService()
root_cause_service = RootCauseService()
recommendation_service = RecommendationService()
provider = get_provider()

# ----------------- Request Models -----------------
class ClassifyRequest(BaseModel):
    text: str
    title: Optional[str] = ""

class EmbedRequest(BaseModel):
    text: str

class SimilarityRequest(BaseModel):
    items: List[Dict[str, Any]]
    threshold: Optional[float] = 0.80

class RiskRequest(BaseModel):
    transfer_count: int = 0
    inactivity_days: float = 0.0
    officer_workload_ratio: float = 1.0
    dept_backlog: int = 50
    category_lag_days: float = 5.0
    severity: str = "MEDIUM"
    is_deadlocked: bool = False

class DeadlockRequest(BaseModel):
    transfers: List[Dict[str, str]]

class VisualRequest(BaseModel):
    filename: str
    category_hint: Optional[str] = ""

class RootCauseRequest(BaseModel):
    complaints: List[Dict[str, Any]]

class RecommendationRequest(BaseModel):
    risk_score: int
    is_deadlocked: bool
    transfers_count: int
    inactivity_days: float
    officer_workload_pct: int

# ----------------- API Endpoints -----------------
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "PRAVAH-AI ML Microservice",
        "provider_mode": "demo" if provider.is_demo() else "real",
        "version": "1.0.0"
    }

@app.post("/ai/classify")
def classify_complaint(req: ClassifyRequest):
    combined_text = f"{req.title} {req.text}"
    return classification_service.classify(combined_text)

@app.post("/ai/embed")
def embed_complaint(req: EmbedRequest):
    vector = embedding_service.embed_text(req.text)
    return {
        "vector": vector,
        "dimensions": len(vector),
        "model": "all-MiniLM-L6-v2 (compat)"
    }

@app.post("/ai/similarity")
def compute_similarity(req: SimilarityRequest):
    clusters = similarity_service.find_clusters(req.items, req.threshold or 0.80)
    return {
        "cluster_count": len(clusters),
        "clusters": clusters
    }

@app.post("/ai/risk")
def predict_sla_risk(req: RiskRequest):
    return risk_service.predict_risk(req.model_dump())

@app.post("/ai/deadlock")
def detect_deadlock(req: DeadlockRequest):
    return graph_service.analyze_routing(req.transfers)

@app.post("/ai/visual-analysis")
def analyze_visual_evidence(req: VisualRequest):
    return visual_service.analyze_image(req.filename, req.category_hint or "")

@app.post("/ai/root-cause")
def detect_root_causes(req: RootCauseRequest):
    causes = root_cause_service.analyze_patterns(req.complaints)
    return {
        "detected_count": len(causes),
        "root_causes": causes
    }

@app.post("/ai/recommendation")
def generate_recommendation(req: RecommendationRequest):
    return recommendation_service.generate_recommendation(req.model_dump())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
