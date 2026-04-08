import json
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from database import get_session
from models import ChatHistory, ChatRequest, ChatResponse, VideoResult, ArticleResult, ExplanationSection
from services.orchestrator import handle_query

router = APIRouter(prefix="/chat", tags=["chat"])
logger = logging.getLogger(__name__)


@router.post("/", response_model=ChatResponse)
async def chat(payload: ChatRequest, session: Session = Depends(get_session)):
    query = payload.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # ── Check cache ──────────────────────────────────────────────────────────
    cached = session.exec(
        select(ChatHistory).where(ChatHistory.query == query.lower())
    ).first()

    if cached:
        logger.info(f"Cache hit for: '{query}'")
        return _to_response(cached, cached=True)

    # ── Run orchestrator (parallel AI + YouTube + RSS) ────────────────────────
    result = await handle_query(query, payload.difficulty_mode or "auto")

    # ── Persist ──────────────────────────────────────────────────────────────
    entry = ChatHistory(
        query=query.lower(),
        explanation=result["explanation"],
        sections_json=json.dumps(result.get("sections", [])),
        key_points_json=json.dumps(result["key_points"]),
        difficulty=result["difficulty"],
        why_it_matters=result["why_it_matters"],
        videos_json=json.dumps(result["videos"]),
        articles_json=json.dumps(result["articles"]),
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)

    return _to_response(entry, cached=False)


def _to_response(entry: ChatHistory, cached: bool) -> ChatResponse:
    return ChatResponse(
        id=entry.id,
        query=entry.query,
        explanation=entry.explanation or "",
        sections=[ExplanationSection(**s) for s in entry.get_sections()],
        key_points=entry.get_key_points(),
        difficulty=entry.difficulty or "intermediate",
        why_it_matters=entry.why_it_matters or "",
        videos=[VideoResult(**v) for v in entry.get_videos() if v.get("videoId") or v.get("url")],
        articles=[ArticleResult(**a) for a in entry.get_articles()],
        created_at=entry.created_at,
        cached=cached,
    )
