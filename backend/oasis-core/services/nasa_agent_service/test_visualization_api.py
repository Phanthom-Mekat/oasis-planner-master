"""
Test script for NASA Agent Visualization API
Tests the new /visualization/data endpoint with different layer types
"""

import requests
import json

BASE_URL = "http://localhost:8004/api/v1"

def test_visualization_endpoint(layer_type, location=None):
    """Test visualization data endpoint"""
    endpoint = f"{BASE_URL}/visualization/data"
    
    payload = {
        "layer_type": layer_type,
        "location": location or {"lat": 23.8103, "lon": 90.4125},
        "data_type": "urban_analysis"
    }
    
    print(f"\n{'='*60}")
    print(f"Testing {layer_type.upper()} layer...")
    print(f"{'='*60}")
    
    try:
        response = requests.post(endpoint, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {response.status_code}")
            print(f"✅ Layer Type: {data.get('layer_type')}")
            print(f"✅ Data Points: {len(data.get('data', []))}")
            print(f"✅ Metadata: {json.dumps(data.get('metadata', {}), indent=2)}")
            
            # Show sample data
            if data.get('data'):
                print(f"\n📊 Sample Data (first 3 items):")
                for i, item in enumerate(data['data'][:3]):
                    print(f"  [{i+1}] {item}")
            
            return True
        else:
            print(f"❌ Status: {response.status_code}")
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False


def test_all_layers():
    """Test all available layer types"""
    print("\n" + "="*60)
    print("NASA AGENT VISUALIZATION API TEST")
    print("="*60)
    
    layer_types = [
        "heatmap",
        "scatterplot",
        "line",
        "3d-scatterplot"
    ]
    
    results = {}
    
    for layer_type in layer_types:
        results[layer_type] = test_visualization_endpoint(layer_type)
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for layer_type, success in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{layer_type:20s} {status}")
    
    total = len(results)
    passed = sum(1 for s in results.values() if s)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("="*60)


if __name__ == "__main__":
    print("\n🚀 Starting NASA Agent Visualization API Tests...\n")
    print("⚠️  Make sure the backend is running at http://localhost:8004")
    
    input("\nPress Enter to continue...")
    
    test_all_layers()
