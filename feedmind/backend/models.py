from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
import json


class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Article(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    link: str = Field(index=True, unique=True)
    source: Optional[str] = None
    topic: str = Field(index=True)
    summary: Optional[str] = None          # "bullet1\nbullet2\nbullet3"
    difficulty: Optional[str] = None       # beginner / intermediate / advanced
    why_it_matters: Optional[str] = None
    is_read: bool = Field(default=False)
    is_bookmarked: bool = Field(default=False)
    fetched_at: datetime = Field(default_factory=datetime.utcnow)
    published_at: Optional[str] = None


# ── Chat History ──────────────────────────────────────────────────────────────

class ChatHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    query: str                            # original user query
    explanation: Optional[str] = None    # AI teacher explanation
    key_points_json: Optional[str] = None  # JSON list stored as string
    difficulty: Optional[str] = None
    why_it_matters: Optional[str] = None
    sections_json: Optional[str] = None   # JSON list of {heading, content}
    videos_json: Optional[str] = None    # JSON list of {title, videoId, thumbnail, url}
    articles_json: Optional[str] = None  # JSON list of {title, link, source}
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def get_sections(self) -> List[dict]:
        try:
            return json.loads(self.sections_json or "[]")
        except Exception:
            return []

    def get_key_points(self) -> List[str]:
        try:
            return json.loads(self.key_points_json or "[]")
        except Exception:
            return []

    def get_videos(self) -> List[dict]:
        try:
            return json.loads(self.videos_json or "[]")
        except Exception:
            return []

    def get_articles(self) -> List[dict]:
        try:
            return json.loads(self.articles_json or "[]")
        except Exception:
            return []


# ── Pydantic response schemas ──────────────────────────────────────────────────

class TopicCreate(SQLModel):
    name: str


class TopicRead(SQLModel):
    id: int
    name: str
    created_at: datetime


class ArticleRead(SQLModel):
    id: int
    title: str
    link: str
    source: Optional[str]
    topic: str
    summary: Optional[str]
    difficulty: Optional[str]
    why_it_matters: Optional[str]
    is_read: bool
    is_bookmarked: bool
    fetched_at: datetime
    published_at: Optional[str]


# ── Chat schemas ───────────────────────────────────────────────────────────────

class ChatRequest(SQLModel):
    query: str
    difficulty_mode: Optional[str] = "auto"  # beginner / intermediate / advanced / auto


class VideoResult(SQLModel):
    title: str
    videoId: str
    thumbnail: str
    url: str
    duration: Optional[str] = None


class ArticleResult(SQLModel):
    title: str
    link: str
    source: Optional[str] = None


class ExplanationSection(SQLModel):
    heading: str
    content: str


class ChatResponse(SQLModel):
    id: int
    query: str
    explanation: str
    sections: List[ExplanationSection] = []
    key_points: List[str]
    difficulty: str
    why_it_matters: str
    videos: List[VideoResult]
    articles: List[ArticleResult]
    created_at: datetime
    cached: bool = False


class ChatHistoryRead(SQLModel):
    id: int
    query: str
    explanation: Optional[str]
    sections: List[ExplanationSection] = []
    key_points: List[str]
    difficulty: Optional[str]
    why_it_matters: Optional[str]
    videos: List[VideoResult]
    articles: List[ArticleResult]
    created_at: datetime
