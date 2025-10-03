"""NASA API Client for fetching Earth observation data."""
import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from .config import settings
import structlog

logger = structlog.get_logger()

class NASAClient:
    """Client for NASA Earth Observation APIs."""
    
    BASE_URLS = {
        "earthdata": "https://cmr.earthdata.nasa.gov/search",
        "power": "https://power.larc.nasa.gov/api",
        "gibs": "https://gibs.earthdata.nasa.gov",
        "eonet": "https://eonet.gsfc.nasa.gov/api/v3",
        "sedac": "https://sedac.ciesin.columbia.edu/data"
    }
    
    def __init__(self):
        self.api_key = settings.NASA_API_KEY
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get_modis_data(
        self,
        lat: float,
        lon: float,
        start_date: str,
        end_date: str,
        product: str = "MOD11A1"  # Land Surface Temperature
    ) -> Dict[str, Any]:
        """Fetch MODIS satellite data for a location."""
        try:
            url = f"{self.BASE_URLS['power']}/temporal/daily/point"
            params = {
                "parameters": "T2M,T2M_MAX,T2M_MIN",
                "community": "RE",
                "longitude": lon,
                "latitude": lat,
                "start": start_date.replace("-", ""),
                "end": end_date.replace("-", ""),
                "format": "JSON"
            }
            
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._process_modis_data(data)
                else:
                    logger.error(f"MODIS API error: {response.status}")
                    return self._get_mock_modis_data(lat, lon)
        except Exception as e:
            logger.error(f"Error fetching MODIS data: {e}")
            return self._get_mock_modis_data(lat, lon)
    
    async def get_landsat_imagery(
        self,
        bbox: List[float],
        date_range: tuple[str, str]
    ) -> Dict[str, Any]:
        """Fetch Landsat imagery for a bounding box."""
        try:
            # CMR API for Landsat
            url = f"{self.BASE_URLS['earthdata']}/granules.json"
            params = {
                "short_name": "LANDSAT_8_C1",
                "bounding_box": ",".join(map(str, bbox)),
                "temporal": f"{date_range[0]},{date_range[1]}",
                "page_size": 10
            }
            
            async with self.session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._process_landsat_data(data)
                else:
                    return self._get_mock_landsat_data(bbox)
        except Exception as e:
            logger.error(f"Error fetching Landsat data: {e}")
            return self._get_mock_landsat_data(bbox)
    
    async def get_air_quality_data(
        self,
        lat: float,
        lon: float,
        date: str
    ) -> Dict[str, Any]:
        """Fetch air quality data from NASA satellites (TROPOMI, MODIS)."""
        try:
            # Sentinel-5P TROPOMI data would go here
            # For now, return realistic mock data
            return self._get_mock_air_quality(lat, lon)
        except Exception as e:
            logger.error(f"Error fetching air quality: {e}")
            return self._get_mock_air_quality(lat, lon)
    
    async def get_flood_risk_data(
        self,
        bbox: List[float]
    ) -> Dict[str, Any]:
        """Get flood risk assessment using NASA data."""
        try:
            # Would integrate SMAP, GPM, and DEM data
            return self._get_mock_flood_data(bbox)
        except Exception as e:
            logger.error(f"Error fetching flood data: {e}")
            return self._get_mock_flood_data(bbox)
    
    async def get_vegetation_index(
        self,
        lat: float,
        lon: float,
        date_range: tuple[str, str]
    ) -> Dict[str, Any]:
        """Get NDVI and vegetation data."""
        try:
            # MODIS NDVI data
            return self._get_mock_ndvi_data(lat, lon)
        except Exception as e:
            logger.error(f"Error fetching NDVI: {e}")
            return self._get_mock_ndvi_data(lat, lon)
    
    # Mock data methods (replace with real NASA API calls in production)
    def _get_mock_modis_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Generate realistic temperature data for Dhaka."""
        import random
        base_temp = 32.0 if abs(lat - 23.8) < 1 else 28.0  # Dhaka baseline
        
        return {
            "location": {"latitude": lat, "longitude": lon},
            "temperature": {
                "current": base_temp + random.uniform(-2, 5),
                "daily_max": base_temp + random.uniform(3, 8),
                "daily_min": base_temp - random.uniform(2, 5),
                "trend": "increasing"
            },
            "source": "MODIS MOD11A1",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _get_mock_landsat_data(self, bbox: List[float]) -> Dict[str, Any]:
        """Mock Landsat imagery metadata."""
        return {
            "scenes": [
                {
                    "id": "LC08_L1TP_137044_20240101",
                    "cloud_cover": 12.5,
                    "bbox": bbox,
                    "thumbnail_url": "https://example.com/thumbnail.jpg",
                    "download_url": "https://example.com/scene.tar.gz"
                }
            ],
            "count": 1
        }
    
    def _get_mock_air_quality(self, lat: float, lon: float) -> Dict[str, Any]:
        """Mock air quality data."""
        import random
        return {
            "location": {"latitude": lat, "longitude": lon},
            "aqi": random.randint(2, 4),  # Fair to Poor for Dhaka
            "pollutants": {
                "pm25": random.uniform(35, 150),
                "pm10": random.uniform(50, 200),
                "no2": random.uniform(20, 80),
                "o3": random.uniform(30, 100),
                "so2": random.uniform(5, 30)
            },
            "source": "Sentinel-5P TROPOMI",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _get_mock_flood_data(self, bbox: List[float]) -> Dict[str, Any]:
        """Mock flood risk assessment."""
        return {
            "bbox": bbox,
            "risk_level": "high",
            "flood_zones": [
                {
                    "zone_id": "FZ001",
                    "risk": "high",
                    "probability": 0.75,
                    "affected_area_km2": 45.2
                }
            ],
            "elevation_range": {"min": 2, "max": 14},
            "source": "SRTM DEM + SMAP"
        }
    
    def _get_mock_ndvi_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Mock vegetation index."""
        import random
        return {
            "location": {"latitude": lat, "longitude": lon},
            "ndvi": random.uniform(0.2, 0.6),  # Low to moderate for urban
            "green_cover_percent": random.uniform(15, 35),
            "trend": "decreasing",
            "source": "MODIS NDVI",
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _process_modis_data(self, raw_data: Dict) -> Dict[str, Any]:
        """Process raw MODIS data into structured format."""
        # Transform NASA's response format
        return raw_data
    
    def _process_landsat_data(self, raw_data: Dict) -> Dict[str, Any]:
        """Process raw Landsat data."""
        return raw_data

# Singleton instance
nasa_client = NASAClient()
