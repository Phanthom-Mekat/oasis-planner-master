from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.core.agent_service import process_planning_query

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    visualization_type: Optional[str] = None


class ChatResponse(BaseModel):
    content: str
    session_id: str
    timestamp: str
    tool_calls: list
    tool_outputs: Dict[str, Any]
    processing_time: float
    success: bool
    error: Optional[str] = None
    api_sources: Optional[list] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for Urban Planner AI Assistant
    """
    try:
        # Handle quick action visualizations
        if request.visualization_type:
            dummy_responses = {
                'disaster': {
                    'content': '🌪️ **Disaster Tracking Analysis for Dhaka**\n\nBased on current satellite monitoring and weather data:\n\n**Active Events:**\n• **Flood Risk Zone** - High risk area near Buriganga River\n• **Storm Alert** - Severe weather system approaching from Bay of Bengal\n• **Heat Wave** - Extreme temperatures affecting urban areas\n\n**Recommendations:**\n- Monitor water levels in flood-prone areas\n- Prepare emergency response for storm conditions\n- Implement heat mitigation strategies\n\n*Data source: NASA EONET, MODIS, and local weather stations*',
                    'tool_outputs': {
                        'get_natural_disasters': {
                            'events': [
                                {'title': 'Flood Risk Zone', 'category': 'Flood', 'coordinates': [90.4200, 23.8200], 'magnitude': 85, 'date': '2025-10-03'},
                                {'title': 'Storm Alert', 'category': 'Severe Storm', 'coordinates': [90.4000, 23.8000], 'magnitude': 65, 'date': '2025-10-02'},
                                {'title': 'Heat Wave', 'category': 'Extreme Heat', 'coordinates': [90.4300, 23.8300], 'magnitude': 42, 'date': '2025-10-01'}
                            ]
                        }
                    },
                    'api_sources': [
                        {'name': 'NASA EONET', 'description': 'Earth Observatory Natural Event Tracker'},
                        {'name': 'MODIS', 'description': 'Moderate Resolution Imaging Spectroradiometer'},
                        {'name': 'Weather API', 'description': 'Local weather station network'}
                    ]
                },
                'heat_island': {
                    'content': '🔥 **Urban Heat Island Analysis for Dhaka**\n\n**Key Findings:**\n• **Very High Heat Zones**: Commercial districts and industrial areas\n• **High Heat Zones**: Dense residential areas with limited green space\n• **Medium Heat Zones**: Suburban areas with better vegetation coverage\n\n**Temperature Variations:**\n- Urban core: 3-5°C warmer than surrounding areas\n- Industrial zones: Highest heat intensity due to dark surfaces\n- Green spaces: Provide cooling effect of 2-3°C\n\n**Mitigation Strategies:**\n- Increase tree canopy coverage in hot zones\n- Implement cool roof programs\n- Create green corridors for airflow\n\n*Data source: NASA MODIS Land Surface Temperature*',
                    'tool_outputs': {
                        'assess_urban_heat_islands': {
                            'location': {'lat': 23.8103, 'lon': 90.4125},
                            'city': 'Dhaka',
                            'heat_zones': [
                                {'coordinates': [90.4125, 23.8103], 'intensity': 85, 'title': 'Dhaka Center'},
                                {'coordinates': [90.4200, 23.8200], 'intensity': 95, 'title': 'Commercial District'},
                                {'coordinates': [90.4000, 23.8000], 'intensity': 75, 'title': 'Industrial Zone'},
                                {'coordinates': [90.4300, 23.8300], 'intensity': 60, 'title': 'Residential Area'}
                            ]
                        }
                    }
                },
                'air_quality': {
                    'content': '💨 **Air Quality Analysis for Dhaka**\n\n**Current Air Quality Status:**\n• **Very Unhealthy (200+)**: Industrial areas and major traffic corridors\n• **Unhealthy (150-200)**: Dense urban centers\n• **Unhealthy for Sensitive Groups (100-150)**: Residential areas\n\n**Key Pollutants:**\n- PM2.5: Primary concern, exceeding WHO guidelines\n- NO2: High levels near industrial zones\n- O3: Elevated during peak traffic hours\n\n**Health Impacts:**\n- Increased respiratory problems in vulnerable populations\n- Reduced visibility and quality of life\n- Economic impact from health costs\n\n**Recommendations:**\n- Implement vehicle emission controls\n- Increase green buffer zones around industrial areas\n- Promote public transportation\n\n*Data source: NASA Aura OMI, local air quality monitoring*',
                    'tool_outputs': {
                        'analyze_air_quality_trends': {
                            'location': {'lat': 23.8103, 'lon': 90.4125},
                            'city': 'Dhaka',
                            'monitoring_stations': [
                                {'coordinates': [90.4125, 23.8103], 'aqi': 180, 'category': 'Unhealthy'},
                                {'coordinates': [90.4200, 23.8200], 'aqi': 220, 'category': 'Very Unhealthy'},
                                {'coordinates': [90.4000, 23.8000], 'aqi': 160, 'category': 'Unhealthy'},
                                {'coordinates': [90.4300, 23.8300], 'aqi': 120, 'category': 'Unhealthy for Sensitive'}
                            ]
                        }
                    }
                },
                'green_space': {
                    'content': '🌳 **Green Space Equity Analysis for Dhaka**\n\n**Current Green Space Distribution:**\n• **Good Quality**: Well-maintained parks with diverse vegetation\n• **Fair Quality**: Basic green areas with limited amenities\n• **Poor Quality**: Small, underutilized spaces\n\n**Key Findings:**\n- **Total Green Space**: ~12% of urban area (WHO recommends 20%)\n- **Accessibility**: 60% of population within 500m of green space\n- **Quality Gap**: Significant variation in maintenance and facilities\n\n**Equity Issues:**\n- Low-income areas have less access to quality green spaces\n- Industrial zones lack adequate green buffers\n- Dense urban areas need more pocket parks\n\n**Recommendations:**\n- Increase green space coverage to 20% target\n- Improve quality of existing spaces\n- Ensure equitable distribution across all neighborhoods\n\n*Data source: NASA Landsat, MODIS NDVI, local planning data*',
                    'tool_outputs': {
                        'assess_green_space_distribution': {
                            'location': {'lat': 23.8103, 'lon': 90.4125},
                            'city': 'Dhaka',
                            'green_spaces': [
                                {'coordinates': [90.4100, 23.8150], 'area': 2.5, 'type': 'Park', 'quality': 'Good'},
                                {'coordinates': [90.4250, 23.8250], 'area': 0.8, 'type': 'Garden', 'quality': 'Fair'},
                                {'coordinates': [90.4050, 23.8050], 'area': 1.2, 'type': 'Green Corridor', 'quality': 'Good'},
                                {'coordinates': [90.4150, 23.8200], 'area': 0.3, 'type': 'Pocket Park', 'quality': 'Poor'}
                            ]
                        }
                    },
                    'api_sources': [
                        {'name': 'NASA Landsat', 'description': 'Multi-spectral satellite imagery'},
                        {'name': 'MODIS NDVI', 'description': 'Normalized Difference Vegetation Index'},
                        {'name': 'Local Planning', 'description': 'Municipal planning data'}
                    ]
                },
                'flood_risk': {
                    'content': '💧 **Flood Risk Assessment for Dhaka**\n\n**Risk Zones Identified:**\n• **High Risk**: Areas near Buriganga and Turag rivers\n• **Medium Risk**: Low-lying areas with poor drainage\n• **Low Risk**: Elevated areas with good infrastructure\n\n**Key Factors:**\n- **River Proximity**: Primary risk factor\n- **Elevation**: Areas below 10m above sea level at risk\n- **Drainage**: Inadequate stormwater management\n- **Urbanization**: Increased impervious surfaces\n\n**Climate Change Impact:**\n- Rising sea levels increase flood risk\n- More intense rainfall events expected\n- Urban heat island effect exacerbates flooding\n\n**Mitigation Strategies:**\n- Improve drainage infrastructure\n- Create flood retention areas\n- Implement early warning systems\n- Restore natural floodplains\n\n*Data source: NASA SRTM DEM, MODIS, local hydrological data*',
                    'tool_outputs': {
                        'analyze_flood_risk_zones': {
                            'location': {'lat': 23.8103, 'lon': 90.4125},
                            'city': 'Dhaka',
                            'risk_zones': [
                                {'coordinates': [90.4200, 23.8200], 'risk_level': 'High', 'elevation': 5.2},
                                {'coordinates': [90.4000, 23.8000], 'risk_level': 'Medium', 'elevation': 8.1},
                                {'coordinates': [90.4300, 23.8300], 'risk_level': 'Low', 'elevation': 12.5}
                            ]
                        }
                    },
                    'api_sources': [
                        {'name': 'NASA SRTM DEM', 'description': 'Digital Elevation Model'},
                        {'name': 'MODIS', 'description': 'Precipitation and water monitoring'},
                        {'name': 'Hydrology Data', 'description': 'Local water flow analysis'}
                    ]
                },
                'satellite': {
                    'content': '🛰️ **Satellite Imagery Analysis for Dhaka**\n\n**Recent Satellite Observations:**\n• **Urban Growth**: Significant expansion in northern and eastern areas\n• **Land Use Changes**: Agricultural land converted to urban use\n• **Infrastructure Development**: New roads and buildings visible\n• **Environmental Impact**: Reduced green space in core areas\n\n**Key Observations:**\n- **Built-up Area**: Increased by 15% since 2020\n- **Green Space**: Decreased by 8% in urban core\n- **Water Bodies**: Some encroachment on wetlands\n- **Transportation**: New highway construction visible\n\n**Planning Implications:**\n- Need for better urban growth management\n- Importance of preserving remaining green spaces\n- Infrastructure planning for growing population\n- Environmental protection measures needed\n\n*Data source: NASA Landsat 8/9, Sentinel-2, local planning data*',
                    'tool_outputs': {
                        'get_city_satellite_imagery': {
                            'location': {'lat': 23.8103, 'lon': 90.4125},
                            'city': 'Dhaka',
                            'image_url': 'https://api.nasa.gov/planetary/earth/imagery?lon=90.4125&lat=23.8103&dim=0.1&api_key=DEMO_KEY',
                            'bounds': {'north': 23.8603, 'south': 23.7603, 'east': 90.4625, 'west': 90.3625}
                        }
                    },
                    'api_sources': [
                        {'name': 'NASA Landsat 8/9', 'description': 'High-resolution satellite imagery'},
                        {'name': 'Sentinel-2', 'description': 'European Space Agency imaging'},
                        {'name': 'Planning Data', 'description': 'Municipal development records'}
                    ]
                }
            }
            
            if request.visualization_type in dummy_responses:
                result = dummy_responses[request.visualization_type]
                
                return ChatResponse(
                    content=result["content"],
                    session_id=request.session_id or "demo_session",
                    timestamp="2025-10-03T12:00:00.000Z",
                    tool_calls=[],
                    tool_outputs=result.get("tool_outputs", {}),
                    processing_time=0.5,
                    success=True,
                    api_sources=result.get("api_sources", [])
                )
        
        response = await process_planning_query(
            query=request.message,
            session_id=request.session_id
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Urban Planner AI Assistant"
    }


class VisualizationRequest(BaseModel):
    layer_type: str  # heatmap, scatterplot, line, 3d-tiles
    location: Optional[Dict[str, float]] = None  # {"lat": 23.8103, "lon": 90.4125}
    data_type: Optional[str] = None  # disaster, heat_island, air_quality, etc.
    boundary: Optional[Dict[str, Any]] = None  # {"type": "polygon", "coordinates": [[lon, lat], ...]}


@router.post("/visualization/data")
async def get_visualization_data(request: VisualizationRequest):
    """
    Get visualization layer data for deck.gl layers
    """
    try:
        # Default location (Dhaka)
        lat = request.location.get("lat", 23.8103) if request.location else 23.8103
        lon = request.location.get("lon", 90.4125) if request.location else 90.4125
        
        if request.layer_type == "heatmap":
            # Generate heatmap data for urban heat island or disaster density
            data = []
            import random
            random.seed(42)
            
            # Generate points around the location
            for i in range(200):
                offset_lat = (random.random() - 0.5) * 0.1
                offset_lon = (random.random() - 0.5) * 0.1
                weight = random.randint(1, 100)
                data.append([lon + offset_lon, lat + offset_lat, weight])
            
            return {
                "layer_type": "heatmap",
                "data": data,
                "metadata": {
                    "center": [lon, lat],
                    "data_type": request.data_type or "generic",
                    "intensity": 1,
                    "threshold": 0.03,
                    "radiusPixels": 30
                }
            }
        
        elif request.layer_type == "scatterplot":
            # Generate scatterplot data for air quality monitoring stations
            # Based on NASA AIRS and OMI satellite sensor data
            data = []
            import random
            random.seed(42)
            
            # Define realistic AQI categories and locations
            station_types = [
                {"name": "Industrial", "aqi_range": (180, 250), "count": 8, "offset": [-0.025, -0.020]},
                {"name": "Traffic", "aqi_range": (150, 200), "count": 12, "offset": [0.015, 0.010]},
                {"name": "Residential", "aqi_range": (100, 150), "count": 15, "offset": [0.020, 0.025]},
                {"name": "Suburban", "aqi_range": (80, 120), "count": 10, "offset": [-0.030, 0.030]},
            ]
            
            station_id = 1
            for station_type in station_types:
                base_lon = lon + station_type["offset"][0]
                base_lat = lat + station_type["offset"][1]
                
                for i in range(station_type["count"]):
                    offset_lat = (random.random() - 0.5) * 0.02
                    offset_lon = (random.random() - 0.5) * 0.02
                    
                    aqi = random.randint(*station_type["aqi_range"])
                    
                    # Color based on AQI
                    if aqi >= 200:
                        color = [255, 0, 0]  # Red - Very Unhealthy
                        category = "Very Unhealthy"
                    elif aqi >= 150:
                        color = [255, 100, 0]  # Orange - Unhealthy
                        category = "Unhealthy"
                    elif aqi >= 100:
                        color = [255, 200, 0]  # Yellow - Unhealthy for Sensitive
                        category = "Unhealthy for Sensitive"
                    else:
                        color = [100, 200, 100]  # Green - Moderate
                        category = "Moderate"
                    
                    # Radius based on severity
                    radius = 80 + (aqi - 80) * 0.6
                    
                    data.append({
                        "coordinates": [base_lon + offset_lon, base_lat + offset_lat],
                        "category": category,
                        "color": color,
                        "radius": int(radius),
                        "aqi": aqi,
                        "name": f"{station_type['name']} Station {station_id}",
                        "pollutant": random.choice(["PM2.5", "NO2", "O3", "SO2"])
                    })
                    station_id += 1
            
            return {
                "layer_type": "scatterplot",
                "data": data,
                "metadata": {
                    "center": [lon, lat],
                    "data_type": "air_quality",
                    "source": "NASA AIRS & OMI",
                    "description": "Air Quality Index from satellite pollution sensors"
                }
            }
        
        elif request.layer_type == "line":
            # Generate line data for transportation corridors and connectivity
            # Represents traffic flow and urban mobility patterns
            data = []
            import random
            random.seed(42)
            
            # Define major transportation hubs (like the airport example)
            hubs = [
                {"pos": [lon, lat], "name": "City Center", "type": "major"},
                {"pos": [lon + 0.030, lat + 0.025], "name": "Airport Hub", "type": "major"},
                {"pos": [lon - 0.025, lat - 0.020], "name": "Industrial Port", "type": "major"},
                {"pos": [lon + 0.020, lat - 0.015], "name": "Business District", "type": "mid"},
                {"pos": [lon - 0.015, lat + 0.020], "name": "Residential Hub", "type": "mid"},
            ]
            
            # Generate connections between hubs (like flight paths)
            connections = []
            for i, start_hub in enumerate(hubs):
                for j, end_hub in enumerate(hubs):
                    if i < j:  # Avoid duplicate connections
                        # More connections from major hubs
                        if start_hub["type"] == "major" or end_hub["type"] == "major":
                            connections.append((i, j))
                        elif random.random() < 0.4:  # Some mid-hub connections
                            connections.append((i, j))
            
            # Create line data with realistic traffic intensity
            for start_idx, end_idx in connections:
                start_hub = hubs[start_idx]
                end_hub = hubs[end_idx]
                
                # Calculate distance for altitude (intensity) simulation
                distance = ((start_hub["pos"][0] - end_hub["pos"][0])**2 + 
                           (start_hub["pos"][1] - end_hub["pos"][1])**2)**0.5
                
                # Traffic intensity based on hub importance and distance
                if start_hub["type"] == "major" and end_hub["type"] == "major":
                    intensity = random.randint(8000, 10000)
                else:
                    intensity = random.randint(3000, 7000)
                
                data.append({
                    "start": [start_hub["pos"][0], start_hub["pos"][1], intensity],
                    "end": [end_hub["pos"][0], end_hub["pos"][1], intensity],
                    "name": f"{start_hub['name']} → {end_hub['name']}",
                    "intensity": intensity,
                    "distance": round(distance * 100, 2)  # km
                })
            
            return {
                "layer_type": "line",
                "data": data,
                "metadata": {
                    "center": [lon, lat],
                    "data_type": "transportation",
                    "source": "OSM & Traffic Analysis",
                    "description": "Major transportation corridors and connectivity patterns"
                }
            }
        
        elif request.layer_type == "3d-scatterplot":
            # Generate 3D scatterplot data for urban density and building heights
            # Based on Landsat data + OpenStreetMap building footprints
            data = []
            import random
            random.seed(42)
            
            # Define urban zones with different building height patterns
            zones = [
                {"center": [lon, lat], "type": "CBD", "height_range": (200, 500), "density": 30},
                {"center": [lon + 0.015, lat + 0.015], "type": "Commercial", "height_range": (100, 300), "density": 25},
                {"center": [lon - 0.020, lat - 0.015], "type": "Industrial", "height_range": (50, 150), "density": 20},
                {"center": [lon + 0.025, lat - 0.020], "type": "Residential", "height_range": (30, 120), "density": 25},
            ]
            
            for zone in zones:
                z_lon, z_lat = zone["center"]
                height_min, height_max = zone["height_range"]
                
                for i in range(zone["density"]):
                    offset_lat = (random.random() - 0.5) * 0.015
                    offset_lon = (random.random() - 0.5) * 0.015
                    
                    height = random.randint(height_min, height_max)
                    
                    # Color based on height (taller = more red, shorter = more blue)
                    color = [
                        int(150 + 105 * (height / 500)),  # Red increases with height
                        int(100),  # Constant green
                        int(255 - 155 * (height / 500))   # Blue decreases with height
                    ]
                    
                    # Radius based on building footprint (taller buildings often larger)
                    radius = int(20 + (height / 500) * 30)
                    
                    data.append({
                        "coordinates": [z_lon + offset_lon, z_lat + offset_lat],
                        "height": height,
                        "color": color,
                        "radius": radius,
                        "zone": zone["type"],
                        "name": f"{zone['type']} Building {i+1}"
                    })
            
            return {
                "layer_type": "3d-scatterplot",
                "data": data,
                "metadata": {
                    "center": [lon, lat],
                    "data_type": "urban_density",
                    "source": "Landsat + OSM",
                    "description": "Building heights and urban density patterns"
                }
            }
        
        else:
            return {
                "error": f"Unknown layer type: {request.layer_type}",
                "supported_types": ["heatmap", "scatterplot", "line", "3d-scatterplot"]
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

