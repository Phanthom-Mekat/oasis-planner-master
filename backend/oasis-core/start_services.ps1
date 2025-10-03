# Start all services
cd backend/oasis-core

# Geospatial Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/geospatial_service; python -m uvicorn app.main:app --reload --port 8000"

# Wait 2 seconds
Start-Sleep -Seconds 2

# Simulation Service  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services/simulation_service; python -m uvicorn app.main:app --reload --port 8001"

Write-Host "`n✅ All services starting!"
Write-Host "`n📚 API Documentation:"
Write-Host "   Geospatial: http://localhost:8000/docs"
Write-Host "   Simulation: http://localhost:8001/docs"
Write-Host "`n🌐 Frontend: http://localhost:3000"
