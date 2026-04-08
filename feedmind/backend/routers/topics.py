from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Topic, TopicCreate, TopicRead

router = APIRouter(prefix="/topics", tags=["topics"])


@router.get("/", response_model=list[TopicRead])
def list_topics(session: Session = Depends(get_session)):
    return session.exec(select(Topic)).all()


@router.post("/", response_model=TopicRead, status_code=201)
def create_topic(payload: TopicCreate, session: Session = Depends(get_session)):
    name = payload.name.strip().lower()
    existing = session.exec(select(Topic).where(Topic.name == name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Topic already exists.")
    topic = Topic(name=name)
    session.add(topic)
    session.commit()
    session.refresh(topic)
    return topic


@router.delete("/{topic_id}", status_code=204)
def delete_topic(topic_id: int, session: Session = Depends(get_session)):
    topic = session.get(Topic, topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found.")
    session.delete(topic)
    session.commit()
