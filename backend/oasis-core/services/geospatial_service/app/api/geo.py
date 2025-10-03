"""Enhanced API routes for geospatial data with NASA integration."""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from ..core.nasa_client import nasa_client
import structlog

logger = structlog.get_logger()
router = APIRouter()

# Pydantic Models
class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class ClimateLayerResponse(BaseModel):
    layer_id: str
    name: str
    type: str
    data_url: str
    metadata: Dict[str, Any]

class AnalyticsSummary(BaseModel):
    city_id: str
    population: int
    area_km2: float
    temperature_avg: float
    heat_islands_count: int
    flood_risk_areas: int
    green_cover_percent: float
    air_quality_index: int
    timestamp: str

# Dhaka City Configuration
DHAKA_CONFIG = {
    "city_id": "dhaka_bd",
    "name": "Dhaka",
    "country": "Bangladesh",
    "center": {"lat": 23.8103, "lon": 90.4125},
    "bbox": [90.3, 23.7, 90.5, 23.9],
    "population": 22000000,
    "area_km2": 306.4
}

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "geospatial", "timestamp": datetime.utcnow().isoformat()}

@router.get("/layers/{city_id}", response_model=List[ClimateLayerResponse])
async def get_climate_layers(
    city_id: str,
    layer_types: Optional[List[str]] = Query(None, description="Filter by layer types")
):
    """Fetches GeoJSON or tile URLs for primary data layers with NASA integration."""
    try:
        async with nasa_client as client:
            if city_id == "dhaka_bd":
                center = DHAKA_CONFIG["center"]
                bbox = DHAKA_CONFIG["bbox"]
                
                # Get real NASA data
                temp_data = await client.get_modis_data(
                    center["lat"], center["lon"],
                    (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
                    datetime.now().strftime("%Y-%m-%d")
                )
                
                air_quality = await client.get_air_quality_data(
                    center["lat"], center["lon"],
                    datetime.now().strftime("%Y-%m-%d")
                )
                
                layers = [
                    ClimateLayerResponse(
                        layer_id="heat_islands",
                        name="Urban Heat Islands",
                        type="raster",
                        data_url=f"https://gibs.earthdata.nasa.gov/wms/epsg4326/best/MODIS_Terra_Land_Surface_Temp_Day",
                        metadata={
                            "source": "MODIS Terra",
                            "current_temp": temp_data["temperature"]["current"],
                            "max_temp": temp_data["temperature"]["daily_max"]
                        }
                    ),
                    ClimateLayerResponse(
                        layer_id="air_quality",
                        name="Air Quality Index",
                        type="point",
                        data_url="/api/v1/geo/air-quality/dhaka_bd",
                        metadata={
                            "source": "Sentinel-5P TROPOMI",
                            "aqi": air_quality["aqi"],
                            "pm25": air_quality["pollutants"]["pm25"]
                        }
                    )
                ]
                
                if layer_types:
                    layers = [l for l in layers if l.layer_id in layer_types]
                
                return layers
            else:
                raise HTTPException(status_code=404, detail=f"City {city_id} not found")
                
    except Exception as e:
        logger.error(f"Error fetching layers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/summary/{city_id}", response_model=AnalyticsSummary)
async def get_analytics_summary(city_id: str):
    """Provides comprehensive analytics for dashboard metrics."""
    try:
        if city_id != "dhaka_bd":
            raise HTTPException(status_code=404, detail=f"City {city_id} not found")
        
        async with nasa_client as client:
            center = DHAKA_CONFIG["center"]
            
            temp_data = await client.get_modis_data(
                center["lat"], center["lon"],
                (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
                datetime.now().strftime("%Y-%m-%d")
            )
            
            air_data = await client.get_air_quality_data(center["lat"], center["lon"], datetime.now().strftime("%Y-%m-%d"))
            
            return AnalyticsSummary(
                city_id=city_id,
                population=DHAKA_CONFIG["population"],
                area_km2=DHAKA_CONFIG["area_km2"],
                temperature_avg=temp_data["temperature"]["current"],
                heat_islands_count=12,
                flood_risk_areas=8,
                green_cover_percent=25.3,
                air_quality_index=air_data["aqi"],
                timestamp=datetime.utcnow().isoformat()
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/real-time/climate")
async def get_real_time_climate(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Get real-time climate data for a specific location."""
    try:
        async with nasa_client as client:
            temp_data = await client.get_modis_data(
                lat, lon,
                (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
                datetime.now().strftime("%Y-%m-%d")
            )
            
            air_data = await client.get_air_quality_data(lat, lon, datetime.now().strftime("%Y-%m-%d"))
            
            return {
                "location": {"latitude": lat, "longitude": lon},
                "temperature": temp_data["temperature"],
                "air_quality": air_data,
                "timestamp": datetime.utcnow().isoformat()
            }
    except Exception as e:
        logger.error(f"Error fetching real-time data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
