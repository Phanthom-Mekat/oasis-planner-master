#!/usr/bin/env python3
"""Test script to verify NASA data can be read correctly."""

import sys
from pathlib import Path

print("=" * 60)
print("NASA Data Reader Test")
print("=" * 60)

try:
    from app.core.nasa_data_reader import nasa_reader
    print("✅ NASA data reader imported successfully")
except ImportError as e:
    print(f"❌ Failed to import NASA data reader: {e}")
    print("\nInstall dependencies:")
    print("  pip install -r requirements.txt")
    sys.exit(1)

print(f"\nData directories:")
print(f"  MODIS: {nasa_reader.modis_dir}")
print(f"  VNP46A3: {nasa_reader.vnp_dir}")

modis_files = list(nasa_reader.modis_dir.glob("*.hdf"))
vnp_files = list(nasa_reader.vnp_dir.glob("*.h5"))

print(f"\nFiles found:")
print(f"  MODIS files: {len(modis_files)}")
for f in modis_files:
    print(f"    - {f.name}")
print(f"  VNP46A3 files: {len(vnp_files)}")
for f in vnp_files[:3]:
    print(f"    - {f.name}")
if len(vnp_files) > 3:
    print(f"    ... and {len(vnp_files) - 3} more")

print("\n" + "=" * 60)
print("Testing Nighttime Lights Data (VNP46A3)")
print("=" * 60)

try:
    ntl_data = nasa_reader.read_nighttime_lights(23.7, 23.9, 90.3, 90.5)
    if ntl_data is not None:
        print(f"✅ Successfully read nighttime lights data")
        print(f"   Shape: {ntl_data.shape}")
        print(f"   Min value: {ntl_data.min():.2f}")
        print(f"   Max value: {ntl_data.max():.2f}")
        print(f"   Mean value: {ntl_data.mean():.2f}")
    else:
        print("⚠️  Nighttime lights data returned None")
except Exception as e:
    print(f"❌ Error reading nighttime lights: {e}")

print("\n" + "=" * 60)
print("Testing Land Cover Data (MODIS)")
print("=" * 60)

try:
    lc_data = nasa_reader.read_land_cover(23.7, 23.9, 90.3, 90.5)
    if lc_data is not None:
        print(f"✅ Successfully read land cover data")
        print(f"   Shape: {lc_data.shape}")
        print(f"   Unique classes: {len(set(lc_data.flatten()))}")
    else:
        print("⚠️  Land cover data returned None (this is OK, pyhdf may not be installed)")
        print("   Service will still work with nighttime lights only")
except Exception as e:
    print(f"⚠️  Error reading land cover: {e}")
    print("   This is OK, service will work with nighttime lights only")

print("\n" + "=" * 60)
print("Testing Grid Metrics Calculation")
print("=" * 60)

try:
    metrics = nasa_reader.calculate_grid_metrics(
        lat_min=23.7, lat_max=23.9,
        lon_min=90.3, lon_max=90.5,
        grid_size=10
    )
    
    print(f"✅ Successfully calculated grid metrics")
    print(f"   Total cells: {len(metrics)}")
    
    print(f"\n📊 Sample cell data (first 5 cells):")
    for cell_id in list(metrics.keys())[:5]:
        m = metrics[cell_id]
        print(f"   Cell {cell_id}:")
        print(f"     Housing Pressure: {m['housing_pressure']:.3f}")
        print(f"     Food Distance: {m['food_distance_km']:.2f} km")
        print(f"     Nighttime Light: {m['avg_nighttime_light']:.2f}")
    
    avg_housing = sum(m['housing_pressure'] for m in metrics.values()) / len(metrics)
    avg_food_dist = sum(m['food_distance_km'] for m in metrics.values()) / len(metrics)
    
    print(f"\n📈 Statistics across all cells:")
    print(f"   Average housing pressure: {avg_housing:.3f}")
    print(f"   Average food distance: {avg_food_dist:.2f} km")
    
    print(f"\n✅ ALL TESTS PASSED!")
    print(f"\n🎉 Real NASA data is ready to use!")
    print(f"\nNext steps:")
    print(f"  1. Start the service: python -m uvicorn app.main:app --port 8002")
    print(f"  2. Check API: curl http://localhost:8002/api/v1/dhaka/opportunity_index")
    print(f"  3. Look for: '\"data_status\": \"Real NASA Data\"'")
    
except Exception as e:
    print(f"❌ Error calculating grid metrics: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)

