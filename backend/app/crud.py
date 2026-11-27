"""Fábrica de endpoints CRUD para colecciones que cuelgan de un proyecto:

    GET    /projects/{projectId}/{path}
    POST   /projects/{projectId}/{path}
    PATCH  /projects/{projectId}/{path}/{itemId}
    DELETE /projects/{projectId}/{path}/{itemId}
"""

import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models
from .db import get_db
from .schemas import CamelModel, create_schema, update_schema


def ensure_project(db: Session, project_id: str) -> models.Project:
    project = db.scalar(select(models.Project).where(models.Project.id == project_id))
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Proyecto {project_id} no existe")
    return project


def list_by_project(db: Session, orm: type[Any], project_id: str) -> list[Any]:
    return list(db.scalars(select(orm).where(orm.project_id == project_id).order_by(orm.pk)))


def new_id(prefix: str) -> str:
    return f"{prefix}{uuid.uuid4().hex[:10]}"


def apply_changes(obj: Any, changes: CamelModel) -> None:
    for key, value in changes.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)


def project_collection(
    router: APIRouter,
    path: str,
    orm: type[Any],
    schema: type[CamelModel],
    id_prefix: str,
    tag: str,
) -> None:
    Create = create_schema(schema)
    Update = update_schema(schema)

    def get_item(db: Session, project_id: str, item_id: str) -> Any:
        obj = db.scalar(select(orm).where(orm.project_id == project_id, orm.id == item_id))
        if obj is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"{item_id} no existe en {path}")
        return obj

    @router.get(f"/projects/{{project_id}}/{path}", response_model=list[schema], tags=[tag])
    def list_items(project_id: str, db: Session = Depends(get_db)) -> list[Any]:
        ensure_project(db, project_id)
        return list_by_project(db, orm, project_id)

    @router.post(
        f"/projects/{{project_id}}/{path}",
        response_model=schema,
        status_code=status.HTTP_201_CREATED,
        tags=[tag],
    )
    def create_item(project_id: str, body: Create, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
        ensure_project(db, project_id)
        data = body.model_dump()  # type: ignore[attr-defined]
        data["id"] = data.get("id") or new_id(id_prefix)
        obj = orm(project_id=project_id, **data)
        db.add(obj)
        db.commit()
        return obj

    @router.patch(f"/projects/{{project_id}}/{path}/{{item_id}}", response_model=schema, tags=[tag])
    def update_item(
        project_id: str, item_id: str, body: Update, db: Session = Depends(get_db)  # type: ignore[valid-type]
    ) -> Any:
        obj = get_item(db, project_id, item_id)
        apply_changes(obj, body)
        db.commit()
        return obj

    @router.delete(
        f"/projects/{{project_id}}/{path}/{{item_id}}",
        status_code=status.HTTP_204_NO_CONTENT,
        tags=[tag],
    )
    def delete_item(project_id: str, item_id: str, db: Session = Depends(get_db)) -> Response:
        db.delete(get_item(db, project_id, item_id))
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
