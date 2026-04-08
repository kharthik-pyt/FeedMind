import feedparser
import httpx
from typing import List, Dict
from urllib.parse import quote_plus
import logging

logger = logging.getLogger(__name__)

GNEWS_RSS = "https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"

BACKUP_FEEDS: Dict[str, str] = {
    "ai": "https://feeds.feedburner.com/venturebeat/SZYF",
    "machine learning": "https://machinelearningmastery.com/feed/",
    "programming": "https://dev.to/feed",
}


def fetch_articles(topic: str, max_articles: int = 8) -> List[Dict]:
    """Fetch articles from Google News RSS for a given topic."""
    query = quote_plus(topic)
    url = GNEWS_RSS.format(query=query)

    articles = []
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:max_articles]:
            articles.append({
                "title": entry.get("title", "No title"),
                "link": entry.get("link", ""),
                "source": _extract_source(entry),
                "published_at": entry.get("published", ""),
                "summary_raw": entry.get("summary", ""),
                "topic": topic,
            })
    except Exception as e:
        logger.error(f"RSS fetch failed for '{topic}': {e}")

    # Fallback: check backup feeds
    if not articles and topic.lower() in BACKUP_FEEDS:
        try:
            feed = feedparser.parse(BACKUP_FEEDS[topic.lower()])
            for entry in feed.entries[:max_articles]:
                articles.append({
                    "title": entry.get("title", "No title"),
                    "link": entry.get("link", ""),
                    "source": feed.feed.get("title", ""),
                    "published_at": entry.get("published", ""),
                    "summary_raw": entry.get("summary", ""),
                    "topic": topic,
                })
        except Exception as e:
            logger.error(f"Backup RSS fetch failed for '{topic}': {e}")

    return articles


def _extract_source(entry) -> str:
    """Extract publisher name from a feedparser entry."""
    # Google News RSS wraps source in <source> tag
    source = entry.get("source", {})
    if isinstance(source, dict):
        return source.get("title", "")
    tags = entry.get("tags", [])
    if tags:
        return tags[0].get("label", "")
    return ""
