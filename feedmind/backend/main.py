from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from database import create_db_and_tables, engine
from routers import topics, feed, chat, history
from scheduler import start_scheduler, stop_scheduler

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    start_scheduler(engine)
    logger.info("FeedMind backend started.")
    yield
    # Shutdown
    stop_scheduler()


app = FastAPI(title="FeedMind API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(topics.router)
app.include_router(feed.router)
app.include_router(chat.router)
app.include_router(history.router)


@app.get("/health")
def health():
    return {"status": "ok"}
