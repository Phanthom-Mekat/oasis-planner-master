#!/usr/bin/env python3
"""Start all Oasis backend services."""
import subprocess
import sys
import time
from pathlib import Path

def main():
    print("🌍 Starting Oasis Platform Backend Services...")
    
    # Check if requirements are installed
    try:
        import fastapi
        import uvicorn
    except ImportError:
        print("❌ Dependencies not installed. Run: pip install -r requirements.txt")
        sys.exit(1)
    
    # Start services
    services = [
        {
            "name": "Geospatial Service",
            "port": 8000,
            "dir": "services/geospatial_service",
            "module": "app.main:app"
        },
        {
            "name": "Simulation Service",
            "port": 8001,
            "dir": "services/simulation_service",
            "module": "app.main:app"
        },
        {
            "name": "Opportunity Service",
            "port": 8002,
            "dir": "services/opportunity_service",
            "module": "app.main:app"
        },
        {
            "name": "Urban Growth Service",
            "port": 8003,
            "dir": "services/urban_growth_service",
            "module": "app.main:app"
        },
        {
            "name": "Urban Planner AI Assistant",
            "port": 8004,
            "dir": "services/nasa_agent_service",
            "module": "app.main:app"
        }
    ]
    
    processes = []
    
    for service in services:
        print(f"🚀 Starting {service['name']} on port {service['port']}...")
        
        proc = subprocess.Popen(
            [
                sys.executable, "-m", "uvicorn",
                service["module"],
                "--reload",
                "--port", str(service["port"]),
                "--host", "0.0.0.0"
            ],
            cwd=service["dir"]
        )
        
        processes.append(proc)
        time.sleep(2)
    
    print("\n✅ All services started!")
    print("\n📚 API Documentation:")
    for service in services:
        print(f"   {service['name']}: http://localhost:{service['port']}/docs")
    
    print("\n⚠️  Press Ctrl+C to stop all services\n")
    
    try:
        for proc in processes:
            proc.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
        for proc in processes:
            proc.terminate()
        print("✅ All services stopped")

if __name__ == "__main__":
    main()
