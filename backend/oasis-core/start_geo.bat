@echo off
echo Starting Oasis Geospatial Service...
cd /d "d:\oasis-planner\backend\oasis-core\services\geospatial_service"
set PYTHONPATH=%cd%
python -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
