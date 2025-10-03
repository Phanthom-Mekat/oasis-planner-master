#!/usr/bin/env python3
"""
Simple API test script to understand NASA API response formats.
This script directly calls NASA APIs and saves responses to JSON files.
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
NASA_API_KEY = "6hVAPnmzFoh4oPyXalocM2ZGn2yc7SlCgyKEXCSS"
NASA_BASE_URL = "https://api.nasa.gov"
DHAKA_COORDS = {"lat": 23.8103, "lon": 90.4125}
BANGLADESH_BBOX = "88,20,93,27"

def test_earth_imagery():
    """Test NASA Earth Imagery API"""
    print("Testing Earth Imagery API...")
    
    url = f"{NASA_BASE_URL}/planetary/earth/imagery"
    params = {
        "lon": DHAKA_COORDS["lon"],
        "lat": DHAKA_COORDS["lat"],
        "dim": 0.1,
        "api_key": NASA_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        result = {
            "api": "Earth Imagery",
            "url": response.url,
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "content_type": response.headers.get('content-type', ''),
            "is_image": 'image' in response.headers.get('content-type', ''),
            "content_length": len(response.content) if hasattr(response, 'content') else 0,
            "success": True
        }
        
        print(f"Success: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            "api": "Earth Imagery",
            "error": str(e),
            "success": False
        }

def test_eonet_disasters():
    """Test EONET Natural Disasters API"""
    print("Testing EONET Disasters API...")
    
    url = "https://eonet.gsfc.nasa.gov/api/v3/events"
    params = {
        "days": 30,
        "status": "open"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        result = {
            "api": "EONET Disasters",
            "url": response.url,
            "status_code": response.status_code,
            "data_structure": {
                "type": type(data).__name__,
                "keys": list(data.keys()) if isinstance(data, dict) else "Not a dict",
                "events_count": len(data.get("events", [])) if isinstance(data, dict) else 0
            },
            "sample_event": data.get("events", [{}])[0] if data.get("events") else None,
            "success": True
        }
        
        print(f"Success: {response.status_code}, Events: {len(data.get('events', []))}")
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            "api": "EONET Disasters",
            "error": str(e),
            "success": False
        }

def test_nasa_image_search():
    """Test NASA Image and Video Library API"""
    print("Testing NASA Image Search API...")
    
    url = "https://images-api.nasa.gov/search"
    params = {
        "q": "Dhaka Bangladesh",
        "media_type": "image"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        result = {
            "api": "NASA Image Search",
            "url": response.url,
            "status_code": response.status_code,
            "data_structure": {
                "type": type(data).__name__,
                "keys": list(data.keys()) if isinstance(data, dict) else "Not a dict"
            },
            "collection_info": data.get("collection", {}),
            "items_count": len(data.get("collection", {}).get("items", [])),
            "sample_item": data.get("collection", {}).get("items", [{}])[0] if data.get("collection", {}).get("items") else None,
            "success": True
        }
        
        print(f"Success: {response.status_code}, Items: {result['items_count']}")
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            "api": "NASA Image Search",
            "error": str(e),
            "success": False
        }

def test_apod():
    """Test Astronomy Picture of the Day API"""
    print("Testing APOD API...")
    
    url = f"{NASA_BASE_URL}/planetary/apod"
    params = {
        "api_key": NASA_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        result = {
            "api": "APOD",
            "url": response.url,
            "status_code": response.status_code,
            "data_structure": {
                "type": type(data).__name__,
                "keys": list(data.keys()) if isinstance(data, dict) else "Not a dict"
            },
            "sample_data": data,
            "success": True
        }
        
        print(f"Success: {response.status_code}, Title: {data.get('title', 'N/A')}")
        return result
        
    except Exception as e:
        print(f"Error: {e}")
        return {
            "api": "APOD",
            "error": str(e),
            "success": False
        }

def main():
    """Run all API tests and save results"""
    print("NASA API Response Format Tester")
    print("=" * 60)
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "test_parameters": {
            "dhaka_coords": DHAKA_COORDS,
            "bangladesh_bbox": BANGLADESH_BBOX,
            "nasa_api_key": NASA_API_KEY[:10] + "..."  # Hide full key
        },
        "api_tests": {}
    }
    
    # Run all tests
    results["api_tests"]["earth_imagery"] = test_earth_imagery()
    results["api_tests"]["eonet_disasters"] = test_eonet_disasters()
    results["api_tests"]["nasa_image_search"] = test_nasa_image_search()
    results["api_tests"]["apod"] = test_apod()
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"nasa_api_responses_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"Test Results Summary:")
    print(f"Results saved to: {filename}")
    
    successful_tests = sum(1 for test in results["api_tests"].values() if test.get("success", False))
    total_tests = len(results["api_tests"])
    
    print(f"Successful: {successful_tests}/{total_tests}")
    print(f"Failed: {total_tests - successful_tests}/{total_tests}")
    
    # Print detailed analysis
    print(f"\nAPI Response Analysis:")
    for api_name, api_data in results["api_tests"].items():
        print(f"\n{api_name.upper()}:")
        print("-" * 30)
        
        if api_data.get("success"):
            print(f"Status: {api_data.get('status_code')}")
            print(f"URL: {api_data.get('url', 'N/A')}")
            
            if "data_structure" in api_data:
                structure = api_data["data_structure"]
                print(f"Data Type: {structure.get('type')}")
                print(f"Keys: {structure.get('keys')}")
                
                if "events_count" in structure:
                    print(f"Events: {structure['events_count']}")
                if "items_count" in structure:
                    print(f"Items: {structure['items_count']}")
            
            if "sample_data" in api_data:
                sample = api_data["sample_data"]
                if isinstance(sample, dict):
                    print(f"Sample Keys: {list(sample.keys())}")
                    if "title" in sample:
                        print(f"Title: {sample['title']}")
            
            if "is_image" in api_data:
                print(f"Is Image: {api_data['is_image']}")
                print(f"Content Length: {api_data.get('content_length', 0)} bytes")
        else:
            print(f"Error: {api_data.get('error', 'Unknown error')}")
    
    print(f"\nKey Insights for Frontend Development:")
    print("=" * 60)
    
    # Analyze for frontend development
    for api_name, api_data in results["api_tests"].items():
        if api_data.get("success"):
            print(f"\n{api_name}:")
            
            if api_name == "earth_imagery":
                print("  - Returns image URL directly")
                print("  - Use in <img> tag or deck.gl BitmapLayer")
                print("  - No JSON parsing needed")
            
            elif api_name == "eonet_disasters":
                print("  - Returns JSON with 'events' array")
                print("  - Each event has coordinates, title, category")
                print("  - Use for ScatterplotLayer markers")
                print("  - Format: {events: [{title, categories, geometry}]}")
            
            elif api_name == "nasa_image_search":
                print("  - Returns JSON with 'collection.items' array")
                print("  - Each item has data array with metadata")
                print("  - Use for image galleries")
                print("  - Format: {collection: {items: [{data: [...]}]}}")
            
            elif api_name == "apod":
                print("  - Returns single object with image data")
                print("  - Has 'url', 'hdurl', 'title', 'explanation'")
                print("  - Use for featured image display")
                print("  - Format: {url, hdurl, title, explanation, date}")
    
    return results

if __name__ == "__main__":
    main()
