from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/v1", tags=["chat"])


@app.on_event("startup")
async def startup():
    print(f"[STARTING] {settings.app_name} v{settings.version}")
    print(f"[OK] NASA API Key configured: {'Yes' if settings.nasa_api_key != 'DEMO_KEY' else 'No (using DEMO_KEY)'}")
    print(f"[OK] Google AI configured: {'Yes' if settings.google_api_key else 'No'}")
    print(f"[OK] Service running on http://{settings.host}:{settings.port}")


@app.get("/")
async def root():
    return {
        "service": settings.app_name,
        "version": settings.version,
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)

