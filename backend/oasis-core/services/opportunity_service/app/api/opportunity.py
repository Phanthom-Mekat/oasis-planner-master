from fastapi import APIRouter, HTTPException
from app.core.config import settings
from app.core.data_processor import make_opportunity_geojson, get_cell_details

router = APIRouter()

@router.get("/opportunity_index")
async def get_opportunity_index():
    try:
        geojson = make_opportunity_geojson(settings.dhaka_bounds)
        return geojson
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/opportunity_index/cell/{cell_id}")
async def get_cell_info(cell_id: int):
    try:
        details = get_cell_details(cell_id, settings.dhaka_bounds)
        
        if "error" in details:
            raise HTTPException(status_code=404, detail="Cell not found")
        
        return details
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "opportunity_service"}

