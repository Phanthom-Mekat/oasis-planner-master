# Opportunity Service - Access & Equity Mapper

This service provides the Opportunity Index API for mapping access deserts across Dhaka.

## Features

- Multi-layered opportunity scoring based on:
  - Population Density (NASA SEDAC)
  - Food Access Distance (NASA MODIS Land Cover)
  - Transport Network Access (OpenStreetMap)
  - Housing Pressure (NASA Black Marble/VIIRS)

- Endpoints:
  - `GET /api/v1/dhaka/opportunity_index` - Get full GeoJSON with opportunity scores
  - `GET /api/v1/dhaka/opportunity_index/cell/{cell_id}` - Get detailed cell information
  - `GET /health` - Health check

## Setup

1. Install dependencies:
```bash
cd backend/oasis-core/services/opportunity_service
pip install -r requirements.txt
```

2. Run the service:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

Or use the batch file:
```bash
cd backend/oasis-core
start_opp.bat
```

## API Usage

### Get Opportunity Index
```bash
curl http://localhost:8002/api/v1/dhaka/opportunity_index
```

Returns GeoJSON FeatureCollection with opportunity scores for each grid cell.

### Get Cell Details
```bash
curl http://localhost:8002/api/v1/dhaka/opportunity_index/cell/1
```

Returns detailed metrics and recommendations for a specific cell.

## Data Sources

For production use, replace the demo data generator with real NASA data:

1. **Population Density**: NASA SEDAC Population Density
2. **Land Use**: NASA MODIS Land Cover (MCD12Q1)
3. **Infrastructure**: NASA Black Marble / VIIRS Nighttime Lights
4. **Roads**: OpenStreetMap road network data

## Configuration

Edit `app/core/config.py` to adjust:
- Service port (default: 8002)
- Dhaka boundary coordinates
- Grid resolution

