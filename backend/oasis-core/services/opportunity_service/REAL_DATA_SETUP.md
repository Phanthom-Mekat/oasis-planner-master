# Real NASA Data Setup - Opportunity Service

## ✅ Your Data Files

You have successfully placed NASA data in:
- `backend/oasis-core/data/MODIS/` - 2 MODIS land cover files
- `backend/oasis-core/data/VNP46A3/` - 13 nighttime lights files

## 🚀 Installation Steps

### 1. Install NASA Data Processing Libraries

```bash
cd backend/oasis-core/services/opportunity_service
pip install -r requirements.txt
```

**New packages being installed:**
- `h5py==3.12.1` - For reading VNP46A3 HDF5 files
- `numpy==2.2.1` - Numerical processing
- `rasterio==1.4.3` - Geospatial processing
- `pyproj==3.7.0` - Coordinate transformations
- `pyhdf==0.11.4` - For reading MODIS HDF4 files

**Note:** `pyhdf` may require system dependencies:

**Windows:**
- Usually installs via pip automatically
- If fails, download wheel from: https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyhdf

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install libhdf4-dev

# Mac
brew install hdf4
```

### 2. Test the NASA Data Reader

Create a test script:

```bash
cd backend/oasis-core/services/opportunity_service
```

Create `test_nasa_data.py`:

```python
from app.core.nasa_data_reader import nasa_reader

print("Testing NASA Data Reader...")
print(f"MODIS dir: {nasa_reader.modis_dir}")
print(f"VNP dir: {nasa_reader.vnp_dir}")

metrics = nasa_reader.calculate_grid_metrics(
    lat_min=23.7, lat_max=23.9,
    lon_min=90.3, lon_max=90.5,
    grid_size=10
)

print(f"\n✅ Successfully loaded {len(metrics)} grid cells")
print(f"\nSample cell data:")
for cell_id in list(metrics.keys())[:3]:
    print(f"  Cell {cell_id}: {metrics[cell_id]}")
```

Run it:
```bash
python test_nasa_data.py
```

**Expected Output:**
```
Testing NASA Data Reader...
✅ Successfully loaded 100 grid cells
Sample cell data:
  Cell 1: {'housing_pressure': 0.234, 'food_distance_km': 5.67, 'avg_nighttime_light': 23.4}
  Cell 2: {'housing_pressure': 0.456, 'food_distance_km': 3.21, 'avg_nighttime_light': 45.6}
  ...
```

### 3. Start the Service

```bash
cd backend/oasis-core

# Option 1: Start all services
python start_services.py

# Option 2: Start opportunity service only
start_opp.bat
```

### 4. Verify Real Data is Being Used

```bash
# Check the API
curl http://localhost:8002/api/v1/dhaka/opportunity_index
```

Look for in the response:
```json
{
  "metadata": {
    "data_status": "Real NASA Data",
    "nasa_data_available": true,
    "data_sources": [
      "NASA VNP46A3 - Black Marble Nighttime Lights (Housing Pressure)",
      "NASA MODIS MCD12Q1 - Land Cover Classification (Food Access)"
    ]
  }
}
```

### 5. View in Frontend

Start the frontend:
```bash
cd frontend
npm run dev
```

Navigate to:
```
http://localhost:3000/dashboard/opportunity
```

You should now see **real NASA data** visualized on the map!

## 🎯 What Changed

### Before (Random Data):
```python
pop_density = random.randint(5000, 30000)
food_distance = random.uniform(0.5, 8.0)
housing_pressure = random.uniform(0.3, 0.95)
```

### After (Real NASA Data):
```python
# From VNP46A3 nighttime lights
housing_pressure = nighttime_light_intensity / 100.0

# From MODIS land cover
cropland_ratio = cropland_pixels / total_pixels
food_distance = 8.0 * (1 - cropland_ratio)

# Derived from infrastructure
pop_density = 15000 + (housing_pressure * 15000)
```

## 📊 Data Interpretation

### Housing Pressure
- **Source**: VNP46A3 nighttime lights
- **Low (0.0-0.3)**: Dark areas, low infrastructure
- **Medium (0.3-0.7)**: Moderate development
- **High (0.7-1.0)**: Bright areas, high density

### Food Access
- **Source**: MODIS land cover classification
- **Good (<3km)**: Near agricultural areas
- **Fair (3-5km)**: Moderate distance
- **Poor (>5km)**: Far from food sources

### Opportunity Score
- **High (>0.7)**: Green zones - Good access to resources
- **Medium (0.4-0.7)**: Yellow zones - Moderate opportunity
- **Low (<0.4)**: Red zones - Priority intervention areas

## 🐛 Troubleshooting

### "pyhdf installation failed"
```bash
# Windows: Download pre-built wheel
pip install https://download.lfd.uci.edu/.../pyhdf-0.11.4-...whl

# Or skip MODIS for now (service will work with just nighttime lights)
pip install -r requirements.txt --ignore-installed pyhdf
```

### "NASA data not loading"
- Check file permissions
- Ensure files are in correct directories
- Check logs: `python -m uvicorn app.main:app --log-level debug`

### "Metadata shows 'Demo/Simulated Data'"
- NASA data reader failed to load
- Check Python console for error messages
- Verify all dependencies installed correctly

## 🎉 Success Indicators

✅ No errors during `pip install`
✅ Test script shows "Successfully loaded 100 grid cells"
✅ API metadata shows `"data_status": "Real NASA Data"`
✅ Frontend displays realistic patterns (darker/brighter zones)
✅ Clicking cells shows varying metrics (not all random)

## 📈 Next Steps

1. **Validate results** - Compare with known high/low density areas in Dhaka
2. **Add OpenStreetMap** - Get real transport network data
3. **Time series** - Use multiple VNP46A3 months to show trends
4. **Population data** - Download NASA SEDAC GPW for real population
5. **Ground truth** - Validate with local surveys/reports

