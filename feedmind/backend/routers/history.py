import json
import logging
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from database import get_session
from models import ChatHistory, ChatHistoryRead, VideoResult, ArticleResult, ExplanationSection

router = APIRouter(prefix="/history", tags=["history"])
logger = logging.getLogger(__name__)


@router.get("/", response_model=list[ChatHistoryRead])
def get_history(
    limit: int = Query(default=20, le=100),
    session: Session = Depends(get_session)
):
    """Return past chat queries, newest first."""
    entries = session.exec(
        select(ChatHistory).order_by(ChatHistory.created_at.desc()).limit(limit)  # type: ignore
    ).all()
    return [_to_read(e) for e in entries]


@router.delete("/{entry_id}", status_code=204)
def delete_history(entry_id: int, session: Session = Depends(get_session)):
    entry = session.get(ChatHistory, entry_id)
    if entry:
        session.delete(entry)
        session.commit()


def _to_read(entry: ChatHistory) -> ChatHistoryRead:
    return ChatHistoryRead(
        id=entry.id,
        query=entry.query,
        explanation=entry.explanation,
        sections=[ExplanationSection(**s) for s in entry.get_sections()],
        key_points=entry.get_key_points(),
        difficulty=entry.difficulty,
        why_it_matters=entry.why_it_matters,
        videos=[VideoResult(**v) for v in entry.get_videos() if v.get("videoId") or v.get("url")],
        articles=[ArticleResult(**a) for a in entry.get_articles()],
        created_at=entry.created_at,
    )
