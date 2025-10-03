@echo off
echo Starting Oasis Simulation Service...
cd /d "d:\oasis-planner\backend\oasis-core\services\simulation_service"
set PYTHONPATH=%cd%
python -m uvicorn app.main:app --reload --port 8001 --host 127.0.0.1
