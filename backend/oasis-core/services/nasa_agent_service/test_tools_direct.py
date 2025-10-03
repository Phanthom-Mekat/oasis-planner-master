#!/usr/bin/env python3
"""
Direct test of urban planning tools to verify they work correctly.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.tools.urban_planning_tools import get_natural_disasters, get_city_satellite_imagery

def test_tools():
    print("Testing Urban Planning Tools Directly...")
    print("=" * 50)
    
    # Test 1: Natural Disasters
    print("\n1. Testing get_natural_disasters...")
    try:
        result = get_natural_disasters.invoke({"days": 30, "bbox": "88,20,93,27"})
        print(f"✅ Success: {len(result)} characters")
        print(f"Preview: {result[:200]}...")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Satellite Imagery
    print("\n2. Testing get_city_satellite_imagery...")
    try:
        result = get_city_satellite_imagery.invoke({
            "lat": 23.8103, 
            "lon": 90.4125, 
            "date": "2024-01-01", 
            "dim": 0.1
        })
        print(f"✅ Success: {len(result)} characters")
        print(f"Preview: {result[:200]}...")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_tools()
