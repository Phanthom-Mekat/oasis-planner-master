from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "Oasis Simulation Service"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./simulation.db"
    
    # AI/LLM Config
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gemini-2.0-flash"
    LLM_TEMPERATURE: float = 0.7
    
    # ChromaDB (Vector Store)
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    
    # Simulation Config
    MAX_SIMULATION_TIME: int = 300  # 5 minutes
    DEFAULT_PREDICTION_YEARS: int = 10
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
