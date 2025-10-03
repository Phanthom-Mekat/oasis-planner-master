from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Opportunity Service"
    port: int = 8002
    host: str = "0.0.0.0"
    
    dhaka_bounds: dict = {
        "min_lat": 23.7,
        "max_lat": 23.9,
        "min_lon": 90.3,
        "max_lon": 90.5
    }
    
    class Config:
        env_file = ".env"

settings = Settings()

