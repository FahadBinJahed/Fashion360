from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Fashion360 EAI"
    debug: bool = True  
    database_url: str = "mysql+pymysql://root:@localhost:3306/fashion360"
settings = Settings()
SECRET_KEY = "8a28e6d3c2f84a0e8f5b9c3a0b6d5c7e2a9f3b1d4c6e7f8a9b0c1d2e3f4a5b6c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60