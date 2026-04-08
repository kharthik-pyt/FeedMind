"""
YouTube search — NO API KEY required.
Uses youtube-search-python which scrapes YouTube's internal search endpoint,
the same approach used by CrewAI's YoutubeVideoSearchTool under the hood.

Note: CrewAI's YoutubeVideoSearchTool is a RAG tool that does semantic search
INSIDE a known video's transcript — it does NOT search YouTube for videos.
This service covers the "find relevant videos" part properly.
"""
import logging
from typing import List, Dict
from urllib.parse import quote_plus

logger = logging.getLogger(__name__)


def get_videos(query: str, max_results: int = 3) -> List[Dict]:
    """
    Search YouTube for relevant learning videos — zero API key needed.
    Falls back to search-link cards if the scraper fails.
    """
    try:
        return _search_youtube(query, max_results)
    except Exception as e:
        logger.warning(f"YouTube scrape failed ({e}) — using search link fallback")
        return _search_link_fallback(query, max_results)


def _search_youtube(query: str, max_results: int) -> List[Dict]:
    """Use youtube-search-python to get real video results with no API key."""
    from youtubesearchpython import VideosSearch

    search_term = f"{query} tutorial explained"
    results = VideosSearch(search_term, limit=max_results).result()

    videos = []
    for item in results.get("result", []):
        vid_id = item.get("id", "")
        if not vid_id:
            continue

        # Pick the best available thumbnail
        thumbnails = item.get("thumbnails", [])
        thumbnail = thumbnails[0].get("url", "") if thumbnails else ""

        duration = item.get("duration") or ""
        channel = item.get("channel", {}).get("name", "")

        title = item.get("title", "")
        if channel:
            title = f"{title} — {channel}"

        videos.append({
            "title": title,
            "videoId": vid_id,
            "thumbnail": thumbnail,
            "url": f"https://www.youtube.com/watch?v={vid_id}",
            "duration": duration,
        })

    logger.info(f"YouTube scrape returned {len(videos)} videos for '{query}'")
    return videos


def _search_link_fallback(query: str, max_results: int) -> List[Dict]:
    """Last resort: return clickable YouTube search-results links."""
    searches = [
        f"{query} tutorial explained",
        f"{query} for beginners",
        f"{query} full course",
    ]
    results = []
    for term in searches[:max_results]:
        encoded = quote_plus(term)
        results.append({
            "title": f"🔍 Search: \"{term}\"",
            "videoId": "",
            "thumbnail": "",
            "url": f"https://www.youtube.com/results?search_query={encoded}",
            "duration": "",
        })
    return results
