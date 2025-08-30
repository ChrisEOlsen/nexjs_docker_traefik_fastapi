import logging
import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
# from app.middleware import validate_signature_middleware
from app.db.connections import init_db_pool
from starlette.middleware.sessions import SessionMiddleware

logger = logging.getLogger(__name__)

# Init lifespan of FastAPI application
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1) Initialize the DB pool before serving any requests
    await init_db_pool()
    # OTHER FUNCTIONS
    logger.info("🏁 App startup complete, ready to accept requests.")
    yield
    # await _pg_pool.close()
    logger.info("🛑 App shutdown complete.")

# Initialize FastAPI app with lifespan management
app = FastAPI(lifespan=lifespan)

# Sessions (for OAuth temporary state storage)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET"),
    max_age=3600,  
    https_only=True,          # Set to True if running on HTTPS
    same_site="lax",           # Lax is less strict and works better with some OAuth flows
)

# Custom middleware to validate users and database schemas 
# app.middleware("http")(validate_signature_middleware)

