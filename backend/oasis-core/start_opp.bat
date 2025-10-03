@echo off
cd services\opportunity_service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload

