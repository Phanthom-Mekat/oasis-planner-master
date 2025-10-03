# Oasis Backend - Quick Start Guide

## Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your API keys:
   - NASA_API_KEY (get from https://api.nasa.gov/)
   - OPENAI_API_KEY (optional, for AI features)

## Running Services

### Geospatial Service (Port 8000)
```bash
cd services/geospatial_service
uvicorn app.main:app --reload --port 8000
```

### Simulation Service (Port 8001)
```bash
cd services/simulation_service
uvicorn app.main:app --reload --port 8001
```

## API Documentation

- Geospatial: http://localhost:8000/docs
- Simulation: http://localhost:8001/docs

## Key Endpoints

### Geospatial Service
- `GET /api/v1/geo/layers/{city_id}` - Get climate data layers
- `GET /api/v1/geo/analytics/summary/{city_id}` - Dashboard analytics
- `GET /api/v1/geo/real-time/climate?lat={lat}&lon={lon}` - Real-time data

### Simulation Service
- `POST /api/v1/simulate/predict/impact` - Predict intervention impacts
- `POST /api/v1/simulate/ai/query` - AI Chief of Staff queries

## Testing

```bash
# Test Geospatial
curl http://localhost:8000/api/v1/geo/health

# Test real-time climate for Dhaka
curl "http://localhost:8000/api/v1/geo/real-time/climate?lat=23.8103&lon=90.4125"

# Test Simulation
curl http://localhost:8001/api/v1/simulate/health
```
