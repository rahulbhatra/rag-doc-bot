# app/database.py
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from backend.models.session import Session
from backend.models.message import Message
from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session as SyncSession

DATABASE_URL = "postgresql+asyncpg://rahul:1234@localhost:5432/ragbot"
engine = create_async_engine(DATABASE_URL, echo=True)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session