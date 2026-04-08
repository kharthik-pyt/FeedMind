from fastapi import APIRouter, Depends, BackgroundTasks, Query
from sqlmodel import Session, select
from typing import Optional
import logging
from sqlalchemy.exc import IntegrityError

from database import get_session
from models import Article, ArticleRead, Topic
from services.news_fetcher import fetch_articles
from services.summarizer import summarize

router = APIRouter(prefix="/feed", tags=["feed"])
logger = logging.getLogger(__name__)


@router.get("/", response_model=list[ArticleRead])
def get_feed(
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    unread_only: bool = Query(False),
    bookmarked: bool = Query(False),
    session: Session = Depends(get_session),
):
    """Return stored articles with optional filters."""
    query = select(Article).order_by(Article.fetched_at.desc())  # type: ignore[arg-type]

    articles = session.exec(query).all()

    # Filter in Python for flexibility
    if topic:
        articles = [a for a in articles if a.topic.lower() == topic.lower()]
    if difficulty:
        articles = [a for a in articles if a.difficulty == difficulty.lower()]
    if unread_only:
        articles = [a for a in articles if not a.is_read]
    if bookmarked:
        articles = [a for a in articles if a.is_bookmarked]

    return articles


@router.post("/refresh", status_code=202)
def refresh_feed(background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    """Trigger an immediate feed refresh (runs in background)."""
    topics = session.exec(select(Topic)).all()
    topic_names = [t.name for t in topics]
    background_tasks.add_task(_refresh_all, topic_names)
    return {"message": f"Refreshing {len(topic_names)} topic(s) in background."}


@router.patch("/{article_id}/read", response_model=ArticleRead)
def mark_read(article_id: int, session: Session = Depends(get_session)):
    article = session.get(Article, article_id)
    if not article:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Article not found.")
    article.is_read = True
    session.add(article)
    session.commit()
    session.refresh(article)
    return article


@router.patch("/{article_id}/bookmark", response_model=ArticleRead)
def toggle_bookmark(article_id: int, session: Session = Depends(get_session)):
    article = session.get(Article, article_id)
    if not article:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Article not found.")
    article.is_bookmarked = not article.is_bookmarked
    session.add(article)
    session.commit()
    session.refresh(article)
    return article


def _refresh_all(topic_names: list[str]):
    """Fetch + summarize articles for all topics and persist to DB."""
    from database import Session, engine

    with Session(engine) as session:
        for topic in topic_names:
            try:
                raw_articles = fetch_articles(topic)
                for raw in raw_articles:
                    # Skip duplicates
                    existing = session.exec(
                        select(Article).where(Article.link == raw["link"])
                    ).first()
                    if existing:
                        continue

                    # Summarize
                    ai = summarize(raw["title"], raw.get("summary_raw", raw["title"]))

                    article = Article(
                        title=raw["title"],
                        link=raw["link"],
                        source=raw.get("source", ""),
                        topic=topic,
                        summary=ai["summary"],
                        difficulty=ai["difficulty"],
                        why_it_matters=ai["why_it_matters"],
                        published_at=raw.get("published_at", ""),
                    )
                    try:
                        session.add(article)
                        session.commit()
                    except IntegrityError:
                        session.rollback()
                        logger.debug(f"Skipping duplicate article: {raw['link']}")
                logger.info(f"Refreshed topic: {topic} ({len(raw_articles)} articles)")
            except Exception as e:
                logger.error(f"Error refreshing topic '{topic}': {e}")
