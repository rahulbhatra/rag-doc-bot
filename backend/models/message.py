from backend.models.session import Session
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import List, Optional

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="session.id")
    role: str
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session: Session = Relationship(back_populates="messages")