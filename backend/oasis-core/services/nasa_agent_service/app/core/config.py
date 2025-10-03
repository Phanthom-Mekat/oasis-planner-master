import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Urban Planner AI Assistant"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 8004
    
    nasa_api_key: str = "6hVAPnmzFoh4oPyXalocM2ZGn2yc7SlCgyKEXCSS"
    google_api_key: str = "AIzaSyC2HeSW9ira2Cr-KOH0m_R4lQKdfgvqrxw"
    
    nasa_base_url: str = "https://api.nasa.gov"
    
    class Config:
        env_file = ".env"

settings = Settings()

