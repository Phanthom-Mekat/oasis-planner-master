# NASA Data Integration for Opportunity Mapper

## Data Files Detected

### MODIS Land Cover (MCD12Q1)
- ✅ `MCD12Q1.A2024001.h25v06.061.2025206054404.hdf`
- ✅ `MCD12Q1.A2024001.h26v06.061.2025206051632.hdf`

**Purpose**: Identify agricultural land vs urban areas to calculate food access

### Black Marble Nighttime Lights (VNP46A3)
- ✅ 13 monthly files from 2024-2025 (h27v06 tile)

**Purpose**: Use nighttime lights as proxy for infrastructure density and housing pressure

## How It Works

### 1. Housing Pressure (from VNP46A3)
- Reads: `Gap_Filled_DNB_BRDF_Corrected_NTL` dataset
- Calculation: Higher nighttime lights = More infrastructure = Higher housing pressure
- Formula: `housing_pressure = min(1.0, avg_nighttime_light / 100.0)`

### 2. Food Access (from MCD12Q1)
- Reads: `LC_Type1` land cover classification
- Identifies: Cropland pixels (classes 12-14 in IGBP classification)
- Calculation: Distance to food sources based on cropland ratio
- Formula: `food_distance_km = 8.0 * (1 - cropland_ratio)`

### 3. Population Density (Derived)
- Derived from housing pressure (nighttime lights intensity)
- Formula: `population = 15000 + (housing_pressure * 15000)`
- Range: 15,000 - 30,000 people/km²

### 4. Transport Access (Simulated)
- Currently estimated from infrastructure density
- Formula: `transport_score = 0.5 + (housing_pressure * 0.4)`
- Future: Will integrate OpenStreetMap road network data

## Data Processing Flow

```
NASA HDF/HDF5 Files
        ↓
Extract Dhaka Region (23.7-23.9°N, 90.3-90.5°E)
        ↓
Divide into 10x10 Grid (100 cells)
        ↓
Calculate Metrics per Cell
        ↓
Compute Opportunity Score
```

## Opportunity Score Formula

```
Opportunity Score = 
    (Food Access × 30%) + 
    (Transport Access × 35%) + 
    (Housing Availability × 35%)

Where:
- Food Access = 1 - (distance_to_food / 8km)
- Transport Access = road connectivity score (0-1)
- Housing Availability = 1 - housing_pressure
```

## Installation

```bash
cd backend/oasis-core/services/opportunity_service
pip install -r requirements.txt
```

**Required packages for NASA data:**
- `h5py` - Read HDF5 files (VNP46A3)
- `pyhdf` - Read HDF4 files (MODIS)
- `numpy` - Numerical processing
- `rasterio` - Geospatial raster processing
- `pyproj` - Coordinate transformations

## Usage

The service automatically detects and uses real NASA data when available:

```python
# In data_processor.py
nasa_metrics = nasa_reader.calculate_grid_metrics(
    lat_min=23.7, lat_max=23.9,
    lon_min=90.3, lon_max=90.5,
    grid_size=10
)
```

## API Response

When real data is used, the API response includes:

```json
{
  "metadata": {
    "data_status": "Real NASA Data",
    "nasa_data_available": true,
    "data_sources": [
      "NASA VNP46A3 - Black Marble Nighttime Lights",
      "NASA MODIS MCD12Q1 - Land Cover Classification"
    ]
  }
}
```

## Troubleshooting

### If NASA data fails to load:
1. Check file permissions in `data/` folders
2. Verify HDF libraries are installed
3. Check logs for specific error messages
4. Service falls back to simulated data automatically

### Verify data is working:
```bash
# Start the service
python -m uvicorn app.main:app --port 8002

# Check the metadata
curl http://localhost:8002/api/v1/dhaka/opportunity_index | grep "data_status"
```

Should show: `"data_status": "Real NASA Data"`

## Data Coverage

**Spatial Coverage:**
- Tiles: h25v06, h26v06, h27v06
- Region: Bangladesh and surrounding areas
- Dhaka Bounds: 23.7-23.9°N, 90.3-90.5°E
- Resolution: ~500m per pixel

**Temporal Coverage:**
- MODIS: 2024 annual composite
- VNP46A3: Monthly composites throughout 2024-2025

## Future Enhancements

1. **Add real population data** from NASA SEDAC GPW
2. **Integrate OpenStreetMap** for actual transport network
3. **Time series analysis** using multiple months of VNP46A3
4. **Validation** with ground truth data
5. **Cache processed results** for faster API responses

