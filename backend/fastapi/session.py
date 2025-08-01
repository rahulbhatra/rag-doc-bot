from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.session import Session
from backend.models.message import Message
from backend.database.psql import get_session
from pydantic import BaseModel

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"]
)

@router.post("", response_model=Session)
async def create_session(title: Optional[str] = None, db: AsyncSession = Depends(get_session)):
    session = Session(title=title)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

class MessageCreate(BaseModel):
    session_id: int
    role: str
    text: str
    timestamp: datetime

@router.post("/{session_id}/messages", response_model=Message)
async def add_message(session_id: int, msg: MessageCreate, db: AsyncSession = Depends(get_session)):
    data = msg.model_dump()
    # Ensure timestamp is naive (no tzinfo)
    if data["timestamp"].tzinfo is not None:
        data["timestamp"] = data["timestamp"].replace(tzinfo=None)

    db_session: Session = await db.get(Session, session_id)
    if not db_session.title:
        strip_size = min(10, len(msg.text))
        db_session.title = msg.text[:strip_size]
        db.add(db_session)
        await db.commit()
        await db.refresh(db_session)

    db_msg = Message(**data)
    db_msg.session_id = session_id 
    msg.session_id = session_id
    db.add(db_msg)
    await db.commit()
    await db.refresh(db_msg)
    return db_msg

@router.get("/{session_id}/messages", response_model=List[Message])
async def list_messages(session_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Message).where(Message.session_id == session_id).order_by(Message.timestamp.asc()))
    return result.scalars().all()

@router.get("", response_model=List[Session])
async def list_sessions(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Session))
    return result.scalars().all()

@router.delete("/{session_id}", response_model=dict)
async def delete_session(session_id: int, db: AsyncSession = Depends(get_session)):
    session = await db.get(Session, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()
    return {"ok": True, "deleted_session_id": session_id}