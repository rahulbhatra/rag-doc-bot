import asyncio
from logging.config import fileConfig

from alembic import context
from sqlmodel import SQLModel

# Import models so tables are registered in metadata
from backend.models.session import Session  # noqa: F401
from backend.models.message import Message  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata


def _get_db_url():
    # Prefer CLI -x db_url=..., else fall back to alembic.ini sqlalchemy.url
    x_args = context.get_x_argument(as_dictionary=True)
    return x_args.get("db_url") or config.get_main_option("sqlalchemy.url")


def run_migrations_offline() -> None:
    url = _get_db_url()
    if not url:
        raise ValueError("Database URL not provided. Use `-x db_url=...` or set `sqlalchemy.url` in alembic.ini")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    from sqlalchemy.ext.asyncio import create_async_engine

    db_url = _get_db_url()
    if not db_url:
        raise ValueError("Database URL not provided. Use `-x db_url=...` or set `sqlalchemy.url` in alembic.ini")

    engine = create_async_engine(db_url, echo=True, future=True)

    async def run():
        async with engine.begin() as conn:
            await conn.run_sync(do_run_migrations)
        await engine.dispose()

    asyncio.run(run())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()