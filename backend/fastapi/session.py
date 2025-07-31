from fastapi import APIRouter, FastAPI, Depends
from typing import List, Optional
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.session import Session
from backend.models.message import Message
from backend.database.psql import get_session

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

@router.post("/{session_id}/messages", response_model=Message)
async def add_message(session_id: int, msg: Message, db: AsyncSession = Depends(get_session)):
    msg.session_id = session_id
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

@router.get("/{session_id}/messages", response_model=List[Message])
async def list_messages(session_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Message).where(Message.session_id == session_id))
    return result.scalars().all()

@router.get("", response_model=List[Session])
async def list_sessions(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Session))
    return result.scalars().all()