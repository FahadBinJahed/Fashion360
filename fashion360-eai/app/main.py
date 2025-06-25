from fastapi import FastAPI
from dotenv import load_dotenv
from app.api.v1.endpoints import router as api_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="Fashion360 EAI System",
    description="Enterprise Application Integration for Fashion360",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, specify actual domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all endpoints
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Fashion360 EAI System"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
