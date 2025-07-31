# app/database.py
from contextlib import asynccontextmanager
from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlmodel import Session as SyncSession

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost:5432/chatdb"
engine = create_async_engine(DATABASE_URL, echo=True)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

@asynccontextmanager
async def get_session():
    async with AsyncSession(engine) as session:
        yield session