import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.api import router
from .seed import init_db


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    init_db()
    yield


app = FastAPI(title="Costos Industrial API", version="0.1.0", lifespan=lifespan)

# En desarrollo el front usa el proxy de `ng serve` (mismo origen); CORS queda para
# clientes que llamen directo a :8000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:4200").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/api/health", tags=["sistema"])
def health() -> dict[str, str]:
    return {"status": "ok"}
