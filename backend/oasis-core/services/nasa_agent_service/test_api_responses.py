#!/usr/bin/env python3
"""
Test script to capture and analyze NASA API responses for Urban Planning AI Assistant.
This script tests all tools and saves their outputs to JSON files for analysis.
"""

import json
import asyncio
from datetime import datetime, timedelta
from app.tools.urban_planning_tools import (
    get_city_satellite_imagery, get_natural_disasters, analyze_air_quality_trends,
    assess_urban_heat_islands, monitor_urban_sprawl, analyze_flood_risk_zones,
    assess_green_space_distribution, analyze_nighttime_lights
)

# Test parameters
DHAKA_COORDS = {"lat": 23.8103, "lon": 90.4125}
BANGLADESH_BBOX = "88,20,93,27"
TEST_DATE = "2024-01-01"
END_DATE = "2024-01-31"

async def test_all_tools():
    """Test all urban planning tools and save responses to JSON files"""
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "test_parameters": {
            "dhaka_coords": DHAKA_COORDS,
            "bangladesh_bbox": BANGLADESH_BBOX,
            "test_date": TEST_DATE,
            "end_date": END_DATE
        },
        "tool_responses": {}
    }
    
    print("🧪 Testing Urban Planning AI Tools...")
    print("=" * 60)
    
    # Test 1: Satellite Imagery
    print("\n1. 🛰️ Testing Satellite Imagery...")
    try:
        response = get_city_satellite_imagery(
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"],
            date=TEST_DATE,
            dim=0.1
        )
        results["tool_responses"]["satellite_imagery"] = {
            "tool": "get_city_satellite_imagery",
            "parameters": {"lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"], "date": TEST_DATE, "dim": 0.1},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["satellite_imagery"] = {
            "tool": "get_city_satellite_imagery",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 2: Natural Disasters
    print("\n2. 🌪️ Testing Natural Disasters...")
    try:
        response = get_natural_disasters(days=30, bbox=BANGLADESH_BBOX)
        results["tool_responses"]["natural_disasters"] = {
            "tool": "get_natural_disasters",
            "parameters": {"days": 30, "bbox": BANGLADESH_BBOX},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["natural_disasters"] = {
            "tool": "get_natural_disasters",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 3: Air Quality Analysis
    print("\n3. 💨 Testing Air Quality Analysis...")
    try:
        response = analyze_air_quality_trends(
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"],
            start_date=TEST_DATE,
            end_date=END_DATE
        )
        results["tool_responses"]["air_quality"] = {
            "tool": "analyze_air_quality_trends",
            "parameters": {"lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"], "start_date": TEST_DATE, "end_date": END_DATE},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["air_quality"] = {
            "tool": "analyze_air_quality_trends",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 4: Urban Heat Islands
    print("\n4. 🔥 Testing Urban Heat Islands...")
    try:
        response = assess_urban_heat_islands(
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"],
            city_name="Dhaka"
        )
        results["tool_responses"]["heat_islands"] = {
            "tool": "assess_urban_heat_islands",
            "parameters": {"lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"], "city_name": "Dhaka"},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["heat_islands"] = {
            "tool": "assess_urban_heat_islands",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 5: Urban Sprawl
    print("\n5. 🏘️ Testing Urban Sprawl...")
    try:
        response = monitor_urban_sprawl(
            city_name="Dhaka",
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"],
            years_back=5
        )
        results["tool_responses"]["urban_sprawl"] = {
            "tool": "monitor_urban_sprawl",
            "parameters": {"city_name": "Dhaka", "lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"], "years_back": 5},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["urban_sprawl"] = {
            "tool": "monitor_urban_sprawl",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 6: Flood Risk
    print("\n6. 💧 Testing Flood Risk...")
    try:
        response = analyze_flood_risk_zones(
            city_name="Dhaka",
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"]
        )
        results["tool_responses"]["flood_risk"] = {
            "tool": "analyze_flood_risk_zones",
            "parameters": {"city_name": "Dhaka", "lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"]},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["flood_risk"] = {
            "tool": "analyze_flood_risk_zones",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 7: Green Space
    print("\n7. 🌳 Testing Green Space...")
    try:
        response = assess_green_space_distribution(
            city_name="Dhaka",
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"]
        )
        results["tool_responses"]["green_space"] = {
            "tool": "assess_green_space_distribution",
            "parameters": {"city_name": "Dhaka", "lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"]},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["green_space"] = {
            "tool": "assess_green_space_distribution",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Test 8: Nighttime Lights
    print("\n8. 💡 Testing Nighttime Lights...")
    try:
        response = analyze_nighttime_lights(
            city_name="Dhaka",
            lat=DHAKA_COORDS["lat"],
            lon=DHAKA_COORDS["lon"]
        )
        results["tool_responses"]["nighttime_lights"] = {
            "tool": "analyze_nighttime_lights",
            "parameters": {"city_name": "Dhaka", "lat": DHAKA_COORDS["lat"], "lon": DHAKA_COORDS["lon"]},
            "response": response,
            "response_type": type(response).__name__,
            "success": True
        }
        print(f"✅ Success: {len(response)} characters")
    except Exception as e:
        results["tool_responses"]["nighttime_lights"] = {
            "tool": "analyze_nighttime_lights",
            "error": str(e),
            "success": False
        }
        print(f"❌ Error: {e}")
    
    # Save results to JSON
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"api_test_results_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"📊 Test Results Summary:")
    print(f"📁 Results saved to: {filename}")
    
    successful_tests = sum(1 for tool in results["tool_responses"].values() if tool.get("success", False))
    total_tests = len(results["tool_responses"])
    
    print(f"✅ Successful: {successful_tests}/{total_tests}")
    print(f"❌ Failed: {total_tests - successful_tests}/{total_tests}")
    
    # Print response analysis
    print(f"\n📋 Response Analysis:")
    for tool_name, tool_data in results["tool_responses"].items():
        if tool_data.get("success"):
            response = tool_data["response"]
            print(f"  {tool_name}: {len(response)} chars, type: {tool_data['response_type']}")
            
            # Try to parse as JSON to check structure
            try:
                parsed = json.loads(response)
                if isinstance(parsed, dict):
                    print(f"    Keys: {list(parsed.keys())}")
                elif isinstance(parsed, list):
                    print(f"    List length: {len(parsed)}")
            except:
                print(f"    Raw string response")
        else:
            print(f"  {tool_name}: ERROR - {tool_data.get('error', 'Unknown error')}")
    
    return results

def analyze_response_structure(results):
    """Analyze the structure of API responses for better understanding"""
    
    print(f"\n🔍 Detailed Response Structure Analysis:")
    print("=" * 60)
    
    for tool_name, tool_data in results["tool_responses"].items():
        if not tool_data.get("success"):
            continue
            
        print(f"\n{tool_name.upper()}:")
        print("-" * 40)
        
        response = tool_data["response"]
        
        # Try to parse as JSON
        try:
            parsed = json.loads(response)
            print(f"✅ Valid JSON structure")
            
            if isinstance(parsed, dict):
                print(f"📊 Dictionary with {len(parsed)} keys:")
                for key, value in parsed.items():
                    value_type = type(value).__name__
                    if isinstance(value, (list, dict)):
                        print(f"  - {key}: {value_type} (length: {len(value)})")
                    else:
                        print(f"  - {key}: {value_type} = {str(value)[:100]}{'...' if len(str(value)) > 100 else ''}")
            
            elif isinstance(parsed, list):
                print(f"📊 List with {len(parsed)} items")
                if parsed:
                    print(f"  First item type: {type(parsed[0]).__name__}")
                    if isinstance(parsed[0], dict):
                        print(f"  First item keys: {list(parsed[0].keys())}")
            
        except json.JSONDecodeError:
            print(f"❌ Not valid JSON - raw string response")
            print(f"📝 Content preview: {response[:200]}{'...' if len(response) > 200 else ''}")
        
        print()

if __name__ == "__main__":
    print("🚀 Urban Planning AI - API Response Tester")
    print("=" * 60)
    
    # Run the tests
    results = asyncio.run(test_all_tools())
    
    # Analyze the results
    analyze_response_structure(results)
    
    print("\n🎯 Next Steps:")
    print("1. Review the JSON file for detailed responses")
    print("2. Use this data to improve frontend visualization")
    print("3. Update tool outputs to match expected formats")
    print("4. Test with real NASA API calls")
