from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl
from functools import lru_cache


class Settings(BaseSettings):
	model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

	app_name: str = "CMLRE Marine Data Platform"
	env: str = "development"
	debug: bool = True
	api_v1_str: str = "/api/v1"
	secret_key: str = "change-me"
	access_token_expire_minutes: int = 60 * 24

	database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/cmlre"
	alembic_database_url: str | None = None

	redis_url: str = "redis://redis:6379/0"
	minio_endpoint: str = "minio:9000"
	minio_access_key: str = "minioadmin"
	minio_secret_key: str = "minioadmin"
	minio_bucket: str = "cmlre-raw"
	minio_secure: bool = False

	gemini_api_key: str | None = None

	prometheus_enabled: bool = True


@lru_cache

def get_settings() -> Settings:
	return Settings()
