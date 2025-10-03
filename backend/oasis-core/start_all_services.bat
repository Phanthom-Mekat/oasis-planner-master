@echo off
echo Starting all Oasis services...
echo.

start "Geospatial Service (Port 8000)" cmd /k "cd services\geospatial_service && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 2 /nobreak >nul

start "Simulation Service (Port 8001)" cmd /k "cd services\simulation_service && python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"
timeout /t 2 /nobreak >nul

start "Opportunity Service (Port 8002)" cmd /k "cd services\opportunity_service && python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload"

echo.
echo All services started!
echo - Geospatial: http://localhost:8000
echo - Simulation: http://localhost:8001
echo - Opportunity: http://localhost:8002
echo.
pause

