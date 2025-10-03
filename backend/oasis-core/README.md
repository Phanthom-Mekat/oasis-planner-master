# Oasis Core Backend

This backend powers the Oasis Platform for climate-resilient urban planning, aligned with NASA Space Apps Challenge 2025 Dhaka City Project Plan.

## Architecture
- **FastAPI microservices**: Geospatial & Simulation
- **Database**: SQLite/ChromaDB
- **ORM**: SQLAlchemy 2.0 (async)
- **Geospatial**: GeoPandas, Rasterio, Shapely
- **AI/LLM**: LangChain, LlamaIndex

## Services
- `geospatial_service`: Map data, analytics, NASA dataset integration
- `simulation_service`: Predictive models, AI Chief of Staff

## Endpoints
- `/api/v1/geo/layers/{city_id}`: GeoJSON/tile URLs for Dhaka data layers
- `/api/v1/geo/analytics/summary/{city_id}`: Key stats for dashboard
- `/api/v1/simulate/predict/impact`: Accepts interventions, returns impact report
- `/api/v1/simulate/ai/query`: Natural language queries for dashboard/AI Chief of Staff

## Setup
1. Copy `.env.example` to `.env` and fill in secrets
2. Install dependencies: `pip install -r requirements.txt`
3. Run services: `uvicorn app.main:app --reload`

## Next Steps
- Implement real NASA API integration
- Add database models and migrations
- Expand endpoints per project plan
