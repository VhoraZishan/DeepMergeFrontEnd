#!/usr/bin/env python3
"""
Test script for CMLRE Marine Data Platform API endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(method, url, data=None, params=None):
    """Test an API endpoint and print results"""
    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}{url}", params=params)
        elif method == "POST":
            response = requests.post(f"{BASE_URL}{url}", json=data)
        
        print(f"\n✅ {method} {url}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, dict) and len(str(result)) > 200:
                print(f"Response: {str(result)[:200]}...")
            else:
                print(f"Response: {result}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"\n❌ {method} {url} - Error: {e}")

def main():
    print("🧪 Testing CMLRE Marine Data Platform API")
    print("=" * 50)
    
    # Health check
    test_endpoint("GET", "/healthz")
    
    # Oceanography endpoints
    test_endpoint("GET", "/api/v1/oceanography/records", params={"parameter": "sst", "region": "kerala"})
    test_endpoint("GET", "/api/v1/oceanography/tide", params={"station": "kochi"})
    
    # Fisheries endpoints
    test_endpoint("GET", "/api/v1/fisheries/records", params={"state": "Kerala"})
    test_endpoint("GET", "/api/v1/fisheries/species/Sardinella%20longiceps")
    
    # Biodiversity endpoints
    test_endpoint("GET", "/api/v1/biodiversity/species", params={"query": "marine fish"})
    test_endpoint("GET", "/api/v1/biodiversity/observations", params={"region": "kerala"})
    
    # Molecular endpoints
    test_endpoint("GET", "/api/v1/molecular/edna", params={"location": "India"})
    
    # AI endpoints
    test_endpoint("GET", "/api/v1/ai/examples")
    test_endpoint("GET", "/api/v1/ai/summary", params={"data_type": "oceanography", "region": "kerala"})
    
    # WebSocket status
    test_endpoint("GET", "/ws/status")
    
    # GraphQL endpoint (simple test)
    test_endpoint("GET", "/api/v1/graphql")
    
    print("\n🎉 API testing completed!")
    print("\n📖 Available endpoints:")
    print("- Swagger UI: http://127.0.0.1:8000/docs")
    print("- ReDoc: http://127.0.0.1:8000/redoc")
    print("- GraphQL Playground: http://127.0.0.1:8000/api/v1/graphql")
    print("- WebSocket: ws://127.0.0.1:8000/ws/live")

if __name__ == "__main__":
    main()

