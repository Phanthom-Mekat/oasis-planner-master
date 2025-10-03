# 🏙️ Urban Growth Prediction Service

GPU-accelerated urban growth prediction using NASA satellite data and RAPIDS cuML.

## 🎯 Overview

This service uses a trained Random Forest Regressor to predict urban growth patterns in Dhaka, Bangladesh. The model predicts **GHS built-up intensity change** based on baseline conditions and satellite observations.

### Model Details

- **Algorithm**: Random Forest Regressor (GPU-accelerated with cuML)
- **Training Data**: 208,461 pixels from Dhaka region
- **Features**:
  - GHS Built-up Surface (baseline intensity)
  - MODIS Land Cover classification
  - VIIRS Nighttime Lights radiance
  - Derived features (normalized, log-transformed)

- **Target**: Predicted change in GHS intensity (growth)
- **Performance**:
  - R² Score: 0.10 (training), 0.003 (test)
  - MAE: 36.73
  - Training Time: ~1 second on NVIDIA P100

## 📦 Installation

1. Navigate to service directory:
```bash
cd backend/oasis-core/services/urban_growth_service
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Ensure model file is in place:
```
backend/oasis-core/aimodel/urban_growth_model_20251002_222438.joblib
```

## 🚀 Running the Service

### Option 1: Direct Run
```bash
python -m uvicorn app.main:app --reload --port 8003
```

### Option 2: Using Batch File (Windows)
```bash
cd backend/oasis-core
start_growth.bat
```

### Option 3: Start All Services
```bash
cd backend/oasis-core
python start_services.py
```

## 📡 API Endpoints

### Health Check
```http
GET /api/v1/health
```

Returns service health status.

### Predict Urban Growth
```http
POST /api/v1/predict
Content-Type: application/json

{
  "bbox": [90.2, 23.6, 90.6, 24.0],
  "grid_size": 20,
  "year": 2025
}
```

**Response**: GeoJSON FeatureCollection with predicted growth for each grid cell.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": 1,
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "properties": {
        "cell_id": 1,
        "ghs_baseline": 25000,
        "predicted_change": 45.2,
        "predicted_intensity": 25045.2,
        "growth_rate": 0.0018,
        "land_cover_type": 13,
        "nighttime_lights": 65.3,
        "year": 2025
      }
    }
  ],
  "metadata": {
    "bbox": [90.2, 23.6, 90.6, 24.0],
    "grid_size": 20,
    "total_cells": 400,
    "target_year": 2025,
    "model": "Urban Growth RF Regressor"
  }
}
```

### Dhaka Overview
```http
GET /api/v1/dhaka/overview
```

Returns city statistics and model metadata.

## 🔧 Configuration

Edit `app/core/config.py`:

```python
class Settings(BaseSettings):
    app_name: str = "Urban Growth Prediction Service"
    port: int = 8003
    model_path: str = "../../aimodel/urban_growth_model_20251002_222438.joblib"
    dhaka_bbox: tuple = (90.2, 23.6, 90.6, 24.0)
```

## 🎨 Frontend Integration

The service is integrated with a deck.gl-powered 3D visualization at:
```
http://localhost:3000/dashboard/growth
```

**Features**:
- 3D extruded blocks showing growth intensity
- Interactive tooltips with detailed metrics
- Adjustable target year (2025-2050)
- Configurable grid resolution (10x10 to 40x40)
- NASA-themed dark UI with animated starfield

## 📊 Data Sources

- **GHS Built-up Surface**: European Commission JRC
- **MODIS Land Cover (MCD12Q1)**: NASA Terra/Aqua
- **VIIRS Nighttime Lights (VNP46A4)**: NASA/NOAA Suomi NPP

## 🎓 Model Training

The model was trained using the `train.py` script with:
- **Training Year**: 2015 (features)
- **Label Year**: 2020 (target)
- **Prediction Approach**: Temporal change (GHS_2020 - GHS_2015)
- **GPU**: NVIDIA P100 with RAPIDS cuML

For retraining, see: `train.py` in project root.

## 🐛 Troubleshooting

### Model not found
```bash
# Ensure model file exists
ls -l backend/oasis-core/aimodel/urban_growth_model_20251002_222438.joblib
```

### cuML import errors
```bash
# Install RAPIDS for your CUDA version
pip install cuml-cu11==24.2.0
```

### Port already in use
```bash
# Change port in config.py or use different port
python -m uvicorn app.main:app --port 8004
```

## 📈 Future Improvements

- Load actual GHS/MODIS/VIIRS data for real-time inference
- Implement area-specific predictions (user-drawn polygons)
- Add temporal trend analysis
- Integrate additional features (elevation, road density, population)
- Support multiple cities/regions

## 📝 License

Part of Oasis Planner - Climate Action Platform

