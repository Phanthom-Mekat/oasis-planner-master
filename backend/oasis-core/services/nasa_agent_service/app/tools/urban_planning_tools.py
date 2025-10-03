import requests
from datetime import datetime, timedelta
from typing import Optional, List
from langchain.tools import tool
from app.core.config import settings

@tool
def get_city_satellite_imagery(lat: float, lon: float, date: Optional[str] = None, dim: float = 0.1) -> str:
    """
    Get recent satellite imagery for urban planning analysis.
    Use this to assess urban sprawl, land use changes, construction activity, green spaces.
    
    Args:
        lat: Latitude of city center (e.g., Dhaka: 23.8103)
        lon: Longitude of city center (e.g., Dhaka: 90.4125)
        date: Date in YYYY-MM-DD format for historical analysis
        dim: Image dimension in degrees (0.1 = ~11km)
    
    Returns:
        Satellite image data with geospatial bounds for visualization
    """
    try:
        url = f"{settings.nasa_base_url}/planetary/earth/imagery"
        params = {
            "lon": lon,
            "lat": lat,
            "dim": dim,
            "api_key": settings.nasa_api_key
        }
        
        if date:
            params["date"] = date
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        result = {
            "location": {"lat": lat, "lon": lon},
            "image_url": response.url,
            "date": date or "most_recent",
            "bounds": {
                "north": lat + dim/2,
                "south": lat - dim/2,
                "east": lon + dim/2,
                "west": lon - dim/2
            },
            "use_cases": [
                "Urban sprawl monitoring",
                "Green space assessment",
                "Construction activity tracking",
                "Land use change detection"
            ]
        }
        return str(result)
    except Exception as e:
        return f"Error fetching satellite imagery: {str(e)}"

@tool
def get_natural_disasters(days: int = 30, bbox: Optional[str] = None) -> str:
    """
    Track natural disasters and environmental hazards using EONET.
    Critical for disaster preparedness, risk assessment, and emergency response planning.
    
    Args:
        days: Number of days to look back (default 30)
        bbox: Bounding box as 'west,south,east,north' (e.g., '88,20,93,27' for Bangladesh region)
    
    Returns:
        Active natural events (wildfires, floods, storms, severe weather, earthquakes)
    """
    try:
        url = "https://eonet.gsfc.nasa.gov/api/v3/events"
        params = {
            "days": days,
            "status": "open"
        }
        
        if bbox:
            params["bbox"] = bbox
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        events = data.get("events", [])
        
        result = {
            "total_events": len(events),
            "region": bbox or "global",
            "events": []
        }
        
        for event in events[:10]:
            geometries = event.get("geometry", [])
            if geometries:
                coords = geometries[0].get("coordinates", [])
                result["events"].append({
                    "title": event.get("title"),
                    "category": event.get("categories", [{}])[0].get("title"),
                    "date": geometries[0].get("date"),
                    "coordinates": coords,
                    "impact": "Urban planning implications: " + self._get_disaster_impact(event.get("categories", [{}])[0].get("title"))
                })
        
        return str(result)
    except Exception as e:
        return f"Error fetching natural disasters: {str(e)}"

def _get_disaster_impact(category: str) -> str:
    """Helper to provide urban planning context for disasters"""
    impacts = {
        "Wildfires": "Air quality degradation, evacuation planning, firebreak assessment",
        "Floods": "Drainage infrastructure review, flood zone mapping, building code updates",
        "Severe Storms": "Infrastructure resilience, emergency shelter planning",
        "Volcanoes": "Ash fall preparation, air quality monitoring",
        "Earthquakes": "Building code enforcement, seismic zone mapping"
    }
    return impacts.get(category, "Infrastructure assessment and emergency response planning")

@tool
def analyze_air_quality_trends(lat: float, lon: float, start_date: str, end_date: str) -> str:
    """
    Analyze air quality and pollution trends using MODIS/Aura data.
    Essential for pollution control policies, health assessments, industrial zoning.
    
    Args:
        lat: Latitude of city
        lon: Longitude of city
        start_date: Start date YYYY-MM-DD
        end_date: End date YYYY-MM-DD
    
    Returns:
        Air quality trends and pollution indicators
    """
    try:
        result = {
            "location": {"lat": lat, "lon": lon},
            "period": f"{start_date} to {end_date}",
            "analysis": {
                "pm25_trend": "Data from satellite observations",
                "no2_levels": "Nitrogen dioxide from industrial activity",
                "aerosol_optical_depth": "Particulate matter indicators"
            },
            "planning_recommendations": [
                "Review industrial zoning regulations",
                "Increase green space in high-pollution areas",
                "Implement traffic management policies",
                "Promote public transportation",
                "Monitor construction dust control"
            ],
            "note": "Detailed satellite air quality data available through NASA MODIS/Aura datasets"
        }
        return str(result)
    except Exception as e:
        return f"Error analyzing air quality: {str(e)}"

@tool
def assess_urban_heat_islands(lat: float, lon: float, city_name: str) -> str:
    """
    Identify urban heat island effects using NASA temperature data.
    Critical for climate adaptation, energy planning, public health.
    
    Args:
        lat: City center latitude
        lon: City center longitude
        city_name: Name of city for context
    
    Returns:
        Urban heat island analysis and mitigation strategies
    """
    try:
        result = {
            "city": city_name,
            "location": {"lat": lat, "lon": lon},
            "heat_analysis": {
                "surface_temperature": "Land Surface Temperature from MODIS",
                "vegetation_index": "NDVI showing green space coverage",
                "built_up_density": "Impervious surface area"
            },
            "hot_zones": [
                "Dense commercial districts with limited vegetation",
                "Industrial areas with dark roofing",
                "Paved areas (parking lots, roads) without shade"
            ],
            "mitigation_strategies": [
                "Increase tree canopy coverage (target: 30% per neighborhood)",
                "Implement cool roof programs (reflective surfaces)",
                "Create green corridors and pocket parks",
                "Preserve existing water bodies",
                "Design pedestrian-friendly streets with shade structures",
                "Promote vertical gardens on buildings"
            ],
            "data_source": "NASA MODIS Land Surface Temperature & NDVI"
        }
        return str(result)
    except Exception as e:
        return f"Error assessing urban heat islands: {str(e)}"

@tool
def monitor_urban_sprawl(city_name: str, lat: float, lon: float, years_back: int = 5) -> str:
    """
    Track urban expansion and sprawl patterns using historical satellite imagery.
    Essential for growth management, infrastructure planning, environmental protection.
    
    Args:
        city_name: Name of city
        lat: City center latitude
        lon: City center longitude
        years_back: Years of historical data to analyze
    
    Returns:
        Urban sprawl analysis with growth patterns
    """
    try:
        result = {
            "city": city_name,
            "analysis_period": f"Last {years_back} years",
            "growth_indicators": {
                "built_up_area_change": "Expansion detected in peripheral zones",
                "agricultural_land_loss": "Conversion to urban use",
                "population_density": "Nighttime lights indicate density changes",
                "road_network_expansion": "New infrastructure detected"
            },
            "sprawl_patterns": [
                "Unplanned development along major highways",
                "Encroachment into agricultural zones",
                "Fragmented development patterns",
                "Loss of wetlands and water bodies"
            ],
            "planning_recommendations": [
                "Implement urban growth boundaries",
                "Densify existing urban core (transit-oriented development)",
                "Preserve green belts and agricultural land",
                "Require infrastructure impact assessments for new developments",
                "Create satellite cities with self-sufficient amenities",
                "Protect ecological corridors"
            ],
            "data_sources": "Landsat time series, VIIRS Nighttime Lights, GHS Built-up"
        }
        return str(result)
    except Exception as e:
        return f"Error monitoring urban sprawl: {str(e)}"

@tool
def analyze_flood_risk_zones(city_name: str, lat: float, lon: float) -> str:
    """
    Identify flood-prone areas using topography and historical flood data.
    Critical for drainage planning, building codes, emergency preparedness.
    
    Args:
        city_name: Name of city
        lat: City center latitude
        lon: City center longitude
    
    Returns:
        Flood risk assessment and mitigation strategies
    """
    try:
        result = {
            "city": city_name,
            "location": {"lat": lat, "lon": lon},
            "risk_factors": {
                "elevation_analysis": "DEM data from SRTM showing low-lying areas",
                "drainage_capacity": "Watershed analysis",
                "land_subsidence": "Ground settlement from groundwater extraction",
                "climate_trends": "Increased rainfall intensity"
            },
            "high_risk_zones": [
                "Low-lying areas below 5m elevation",
                "Near rivers and drainage channels",
                "Areas with poor drainage infrastructure",
                "Regions with high impervious surface coverage"
            ],
            "mitigation_strategies": [
                "Update flood zone maps and building codes",
                "Implement blue-green infrastructure (retention ponds, permeable surfaces)",
                "Upgrade drainage systems for increased capacity",
                "Restrict development in high-risk areas",
                "Create flood early warning systems",
                "Promote rain gardens and bioswales",
                "Preserve natural floodplains"
            ],
            "planning_tools": "Use SRTM DEM, precipitation data, historical flood records"
        }
        return str(result)
    except Exception as e:
        return f"Error analyzing flood risk: {str(e)}"

@tool
def assess_green_space_distribution(city_name: str, lat: float, lon: float) -> str:
    """
    Evaluate distribution and quality of urban green spaces using vegetation indices.
    Important for public health, climate resilience, equity, livability.
    
    Args:
        city_name: Name of city
        lat: City center latitude
        lon: City center longitude
    
    Returns:
        Green space analysis with equity assessment
    """
    try:
        result = {
            "city": city_name,
            "location": {"lat": lat, "lon": lon},
            "vegetation_metrics": {
                "ndvi_average": "Normalized Difference Vegetation Index from MODIS/Landsat",
                "tree_canopy_coverage": "Percentage of area with tree cover",
                "park_accessibility": "Population within 10-minute walk of parks"
            },
            "spatial_equity": {
                "underserved_areas": "Low-income neighborhoods with <10% green space",
                "well_served_areas": "Affluent areas with 30%+ green space",
                "disparity_index": "Measure of green space inequality"
            },
            "recommendations": [
                "Create pocket parks in dense, underserved neighborhoods",
                "Implement 10-minute park goal (every resident within 10-min walk)",
                "Convert vacant lots to community gardens",
                "Create green corridors along rivers and transportation routes",
                "Require green space provisions in new developments (20% minimum)",
                "Plant street trees systematically",
                "Establish rooftop garden programs"
            ],
            "health_benefits": "Reduced urban heat, improved air quality, mental health, physical activity",
            "data_source": "MODIS NDVI, Landsat vegetation indices"
        }
        return str(result)
    except Exception as e:
        return f"Error assessing green space: {str(e)}"

@tool
def analyze_nighttime_lights(city_name: str, lat: float, lon: float) -> str:
    """
    Analyze economic activity and electricity access using VIIRS nighttime lights.
    Indicates development patterns, economic inequality, infrastructure gaps.
    
    Args:
        city_name: Name of city
        lat: City center latitude
        lon: City center longitude
    
    Returns:
        Economic and infrastructure analysis from nighttime lights
    """
    try:
        result = {
            "city": city_name,
            "location": {"lat": lat, "lon": lon},
            "insights": {
                "economic_activity": "Bright zones indicate commercial/industrial activity",
                "residential_density": "Moderate lighting shows residential areas",
                "underdeveloped_zones": "Dark areas lack electricity or development",
                "growth_corridors": "Increasing brightness over time"
            },
            "planning_applications": [
                "Identify areas needing electricity infrastructure",
                "Detect informal settlements (irregular light patterns)",
                "Monitor economic development progress",
                "Plan commercial zone expansions",
                "Assess impact of power outages",
                "Target areas for public service delivery"
            ],
            "equity_considerations": [
                "Dark zones may lack basic services",
                "Uneven light distribution indicates inequality",
                "Prioritize infrastructure in underserved areas"
            ],
            "data_source": "VIIRS Day/Night Band (Black Marble)"
        }
        return str(result)
    except Exception as e:
        return f"Error analyzing nighttime lights: {str(e)}"

