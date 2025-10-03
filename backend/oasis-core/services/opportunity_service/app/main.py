from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.opportunity import router as opportunity_router
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(opportunity_router, prefix="/api/v1/dhaka", tags=["opportunity"])

@app.on_event("startup")
async def startup():
    print("\n" + "=" * 80)
    print(f"🚀 {settings.app_name} Starting...")
    print("=" * 80)
    
    # Check data source availability
    try:
        from app.core.data_processor import NASA_DATA_AVAILABLE
        from app.core.nasa_data_reader import OSMNX_AVAILABLE
        
        if NASA_DATA_AVAILABLE:
            print("✅ NASA Data Reader: AVAILABLE")
            print("   - VNP46A3 Nighttime Lights: Ready")
            print("   - MODIS Land Cover: Ready (if pyhdf installed)")
        else:
            print("⚠️  NASA Data Reader: NOT AVAILABLE")
        
        if OSMNX_AVAILABLE:
            print("✅ OSMnx Transport Network: AVAILABLE")
            print("   - OpenStreetMap road data will be downloaded")
        else:
            print("⚠️  OSMnx: NOT AVAILABLE")
            print("   - Transport access will be estimated")
    except Exception as e:
        print(f"⚠️  Could not check data sources: {e}")
    
    print("=" * 80)
    print(f"Service ready on port {settings.port}")
    print("=" * 80 + "\n")

@app.get("/")
async def root():
    from app.core.data_processor import NASA_DATA_AVAILABLE
    return {
        "service": settings.app_name,
        "status": "running",
        "nasa_data_available": NASA_DATA_AVAILABLE,
        "endpoints": [
            "/api/v1/dhaka/opportunity_index",
            "/api/v1/dhaka/opportunity_index/cell/{cell_id}",
            "/health"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)

