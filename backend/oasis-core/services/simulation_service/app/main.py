"""Oasis Simulation Service - AI-Powered Climate Impact Analysis."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import simulate
from app.core.config import settings
import structlog

# Configure logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ]
)

logger = structlog.get_logger()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="AI-driven simulation engine for urban climate interventions",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(simulate.router, prefix="/api/v1/simulate", tags=["Simulation"])

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Oasis Simulation Service", version=settings.VERSION)
    # Initialize ChromaDB
    # Initialize LLM connections

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Oasis Simulation Service")
