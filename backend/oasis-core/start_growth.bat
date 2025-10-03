@echo off
echo Starting Urban Growth Prediction Service...
cd services\urban_growth_service
python -m uvicorn app.main:app --reload --port 8003

