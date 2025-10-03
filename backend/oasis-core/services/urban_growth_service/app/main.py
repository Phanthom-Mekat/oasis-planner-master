from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.api import predict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Predicts urban growth using GPU-trained Random Forest model"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router, prefix="/api/v1", tags=["predictions"])

@app.on_event("startup")
async def startup():
    from app.core.predictor import get_predictor
    
    print("\n" + "=" * 80)
    print(f"🚀 {settings.app_name} Starting...")
    print("=" * 80)
    print(f"📍 Location: Dhaka, Bangladesh")
    print(f"🎯 Task: Urban Growth Prediction (Change Detection)")
    
    # Initialize predictor
    try:
        predictor = get_predictor(settings.model_path)
        
        if predictor.use_real_model:
            print(f"✅ Mode: REAL TRAINED MODEL (scikit-learn)")
            print(f"   Model: Random Forest Regressor")
            print(f"   Training: 208K samples from Dhaka")
            print(f"   Features: {len(predictor.feature_names)}")
            print(f"   Performance: R²=0.30 (training)")
        else:
            print(f"⚠️  Mode: RULE-BASED FALLBACK")
            print(f"   Reason: Model file not found or failed to load")
            print(f"   Features: {len(predictor.feature_names)}")
            print(f"   Note: Place model file at: {settings.model_path}")
            
    except Exception as e:
        print(f"❌ Error initializing predictor: {e}")
    
    print("=" * 80)
    print(f"Service ready on port {settings.port}")
    print("=" * 80 + "\n")

@app.get("/")
async def root():
    return {
        "service": settings.app_name,
        "version": settings.version,
        "status": "running",
        "endpoints": {
            "health": "/api/v1/health",
            "predict": "/api/v1/predict",
            "overview": "/api/v1/dhaka/overview"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)

