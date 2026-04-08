"""
Orchestrator — runs AI explanation + YouTube fetch + RSS fetch in parallel.
Caches results in SQLite so repeated queries are instant.
"""
import asyncio
import json
import logging
from typing import Optional

logger = logging.getLogger(__name__)


async def handle_query(query: str, difficulty_mode: str = "auto") -> dict:
    """
    Main entry point called by the chat router.
    Returns a fully merged response dict ready for the ChatResponse schema.
    """
    # Run AI + YouTube concurrently
    ai_task = asyncio.to_thread(_run_ai, query, difficulty_mode)
    yt_task = asyncio.to_thread(_run_youtube, query)
    rss_task = asyncio.to_thread(_run_rss, query)

    ai_result, videos, articles = await asyncio.gather(ai_task, yt_task, rss_task)

    return {
        "query": query,
        "explanation": ai_result["explanation"],
        "key_points": ai_result["key_points"],
        "difficulty": ai_result["difficulty"],
        "why_it_matters": ai_result["why_it_matters"],
        "videos": videos,
        "articles": articles,
    }


def _run_ai(query: str, difficulty_mode: str) -> dict:
    from services.ai_service import get_explanation
    return get_explanation(query, difficulty_mode)


def _run_youtube(query: str) -> list:
    from services.youtube_service import get_videos
    return get_videos(query)


def _run_rss(query: str) -> list:
    """Fetch a few related articles from RSS as reference material."""
    try:
        from services.news_fetcher import fetch_articles
        raw = fetch_articles(query, max_articles=3)
        return [
            {"title": a["title"], "link": a["link"], "source": a.get("source", "")}
            for a in raw
        ]
    except Exception as e:
        logger.error(f"RSS in orchestrator failed: {e}")
        return []
