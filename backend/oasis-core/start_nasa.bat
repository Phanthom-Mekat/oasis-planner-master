@echo off
cd services\nasa_agent_service
python -m uvicorn app.main:app --reload --port 8004

