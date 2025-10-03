from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Urban Growth Prediction Service"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 8003
    
    # Model path
    model_path: str = "../../aimodel/urban_growth_model_20251002_233119.joblib"
    
    # Data paths (same structure as training)
    data_dir: str = "../../data"
    
    # Dhaka bounding box
    dhaka_bbox: tuple = (90.2, 23.6, 90.6, 24.0)
    
    class Config:
        env_file = ".env"

settings = Settings()

