# app/db/connections.py
import os
import logging
import asyncio
import asyncpg
from contextlib import asynccontextmanager
# Updated import to use the async singleton factory
from app.secrets_loader import get_secrets_client

logger = logging.getLogger(__name__)

# --- Configuration (credentials are now fetched inside init_db_pool) ---
DB_NAME   = os.getenv("DATABASE_NAME", "appname_db")
DB_HOST   = os.getenv("DATABASE_HOST", "postgres")
SCHEMA    = os.getenv("DATABASE_SCHEMA", "main_schema")

MAX_RETRIES = 10
RETRY_DELAY = 5

_pg_pool: asyncpg.Pool | None = None

async def init_db_pool():
    """
    Initialize the global asyncpg pool once. Fetches credentials asynchronously.
    Safe to call multiple times.
    """
    global _pg_pool
    if _pg_pool:
        return

    # --- Fetch secrets asynchronously ---
    logger.info("Fetching database credentials...")
    secrets_client = await get_secrets_client()
    
    # Fetch credentials concurrently for efficiency
    db_user, db_password = await asyncio.gather(
        secrets_client.get("db_user"),
        secrets_client.get("db_password")
    )

    if not db_user or not db_password:
        raise RuntimeError("❌ Database credentials could not be fetched from Secret Manager!")
    
    logger.info("✅ Database credentials fetched successfully.")

    dsn = f"postgresql://{db_user}:{db_password}@{DB_HOST}/{DB_NAME}"
    last_exc = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            _pg_pool = await asyncpg.create_pool(
                dsn=dsn,
                min_size=1,
                max_size=10,
                # Set the default search_path for all new connections in the pool
                init=lambda conn: conn.execute(f"SET search_path TO {SCHEMA}")
            )
            logger.info("✅ Database pool initialized.")
            return
        except Exception as e:
            last_exc = e
            logger.error(f"❌ Pool init failed ({attempt}/{MAX_RETRIES}): {e}")
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY)

    raise RuntimeError(f"❌ Could not initialize DB pool after {MAX_RETRIES} attempts: {last_exc}")

async def get_raw_db_connection(schema_name: str | None = None) -> asyncpg.Connection:
    """
    Acquire a connection from the pool and set its search_path.
    Must call init_db_pool() first (e.g. on startup).
    """
    if not _pg_pool:
        # This ensures credentials are fetched and the pool is ready.
        await init_db_pool()

    schema = schema_name or SCHEMA
    conn = await _pg_pool.acquire()
    try:
        # Check if the requested schema exists
        exists = await conn.fetchval(
            "SELECT 1 FROM information_schema.schemata WHERE schema_name=$1",
            schema
        )
        if not exists:
            # Create a safe quoted identifier for the error message
            safe_schema_for_error = '"' + schema.replace('"', '""') + '"'
            raise ValueError(f"⚠️ Schema {safe_schema_for_error} does not exist.")

        # Safely quote the schema name to prevent SQL injection
        safe_schema = '"' + schema.replace('"', '""') + '"'
        await conn.execute(f"SET search_path TO {safe_schema}")
        return conn

    except:
        # If any error occurs (e.g., schema doesn't exist), release the connection
        await _pg_pool.release(conn)
        raise

async def release_db_connection(conn: asyncpg.Connection):
    """Return the connection to the pool."""
    if _pg_pool and conn:
        await _pg_pool.release(conn)

@asynccontextmanager
async def connection_context(schema_name: str | None = None):
    """
    Async context manager that yields a connection with the correct search_path set.
    """
    conn = await get_raw_db_connection(schema_name)
    try:
        yield conn
    finally:
        await release_db_connection(conn)
