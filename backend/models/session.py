from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import List, Optional

class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List["Message"] = Relationship(back_populates="session")