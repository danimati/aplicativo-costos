from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from .. import models, reports
from .. import schemas as s
from ..crud import apply_changes, ensure_project, list_by_project, new_id, project_collection
from ..db import get_db

router = APIRouter()


# ── Proyectos ───────────────────────────────────────────────
# /projects/calendar debe declararse antes que /projects/{project_id}.
@router.get("/projects/calendar", response_model=list[s.CalendarEvent], tags=["proyectos"])
def calendar(db: Session = Depends(get_db)) -> list[Any]:
    return list(db.scalars(select(models.CalendarEvent).order_by(models.CalendarEvent.pk)))


@router.get("/projects", response_model=list[s.Project], tags=["proyectos"])
def list_projects(db: Session = Depends(get_db)) -> list[Any]:
    return list(db.scalars(select(models.Project).order_by(models.Project.pk)))


@router.get("/projects/{project_id}", response_model=s.Project, tags=["proyectos"])
def get_project(project_id: str, db: Session = Depends(get_db)) -> Any:
    return ensure_project(db, project_id)


@router.post("/projects", response_model=s.Project, status_code=201, tags=["proyectos"])
def create_project(body: s.Project, db: Session = Depends(get_db)) -> Any:
    if db.scalar(select(models.Project).where(models.Project.id == body.id)):
        raise HTTPException(status.HTTP_409_CONFLICT, f"Proyecto {body.id} ya existe")
    data = body.model_dump()
    stages = data.pop("stages")
    project = models.Project(**data)
    project.stages = [models.ProjectStage(project_id=body.id, **st) for st in stages]
    db.add(project)
    db.commit()
    return project


@router.patch("/projects/{project_id}", response_model=s.Project, tags=["proyectos"])
def update_project(project_id: str, body: s.ProjectUpdate, db: Session = Depends(get_db)) -> Any:
    project = ensure_project(db, project_id)
    apply_changes(project, body)
    db.commit()
    return project


@router.delete("/projects/{project_id}", status_code=204, tags=["proyectos"])
def delete_project(project_id: str, db: Session = Depends(get_db)) -> Response:
    db.delete(ensure_project(db, project_id))
    db.commit()
    return Response(status_code=204)


# ── Colecciones por proyecto (GET/POST/PATCH/DELETE) ────────
for path, orm, schema, prefix, tag in [
    ("bom", models.BomMaterial, s.BomMaterial, "bom", "ciclo I"),
    ("labor-stages", models.LaborStage, s.LaborStage, "lb", "ciclo I"),
    ("procurement", models.ProcurementItem, s.ProcurementItem, "pc", "ciclo II"),
    ("reception", models.ReceptionItem, s.ReceptionItem, "rc", "ciclo II"),
    ("fabricacion", models.ProductionActivity, s.ProductionActivity, "fb", "ciclo II"),
    ("ensamble", models.AssemblyUnit, s.AssemblyUnit, "as", "ciclo II"),
    ("instalacion", models.InstallationActivity, s.InstallationActivity, "in", "ciclo III"),
    ("cableado", models.WiringCircuit, s.WiringCircuit, "ca", "ciclo III"),
    ("programacion", models.ProgrammingEntry, s.ProgrammingEntry, "pg", "ciclo III"),
    ("pruebas", models.TestCase, s.TestCase, "ts", "ciclo III"),
]:
    project_collection(router, path, orm, schema, prefix, tag)


# ── Notas y documentos (contrato del front: PATCH/DELETE en raíz) ──
NoteCreate, NoteUpdate = s.create_schema(s.ProjectNote), s.update_schema(s.ProjectNote)
DocCreate, DocUpdate = s.create_schema(s.ProjectDocument), s.update_schema(s.ProjectDocument)


def _get_or_404(db: Session, orm: type[Any], item_id: str) -> Any:
    obj = db.scalar(select(orm).where(orm.id == item_id))
    if obj is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"{item_id} no existe")
    return obj


@router.get("/projects/{project_id}/notes", response_model=list[s.ProjectNote], tags=["notas"])
def list_notes(project_id: str, db: Session = Depends(get_db)) -> list[Any]:
    ensure_project(db, project_id)
    return list_by_project(db, models.ProjectNote, project_id)


@router.post("/projects/{project_id}/notes", response_model=s.ProjectNote, status_code=201, tags=["notas"])
def create_note(project_id: str, body: NoteCreate, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
    ensure_project(db, project_id)
    data = body.model_dump()  # type: ignore[attr-defined]
    data["id"] = data.get("id") or new_id("n")
    note = models.ProjectNote(project_id=project_id, **data)
    db.add(note)
    db.commit()
    return note


@router.patch("/notes/{note_id}", response_model=s.ProjectNote, tags=["notas"])
def update_note(note_id: str, body: NoteUpdate, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
    note = _get_or_404(db, models.ProjectNote, note_id)
    apply_changes(note, body)
    db.commit()
    return note


@router.delete("/notes/{note_id}", status_code=204, tags=["notas"])
def delete_note(note_id: str, db: Session = Depends(get_db)) -> Response:
    db.delete(_get_or_404(db, models.ProjectNote, note_id))
    db.commit()
    return Response(status_code=204)


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


@router.get("/projects/{project_id}/documents", response_model=list[s.ProjectDocument], tags=["documentos"])
def list_documents(project_id: str, db: Session = Depends(get_db)) -> list[Any]:
    ensure_project(db, project_id)
    return list_by_project(db, models.ProjectDocument, project_id)


@router.post(
    "/projects/{project_id}/documents", response_model=s.ProjectDocument, status_code=201, tags=["documentos"]
)
def create_document(project_id: str, body: DocCreate, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
    ensure_project(db, project_id)
    data = body.model_dump()  # type: ignore[attr-defined]
    data["id"] = data.get("id") or new_id("d")
    data["updated_at"] = data.get("updated_at") or _now_iso()
    doc = models.ProjectDocument(project_id=project_id, **data)
    db.add(doc)
    db.commit()
    return doc


@router.patch("/documents/{doc_id}", response_model=s.ProjectDocument, tags=["documentos"])
def update_document(doc_id: str, body: DocUpdate, db: Session = Depends(get_db)) -> Any:  # type: ignore[valid-type]
    doc = _get_or_404(db, models.ProjectDocument, doc_id)
    apply_changes(doc, body)
    if "updated_at" not in body.model_fields_set:  # type: ignore[attr-defined]
        doc.updated_at = _now_iso()
    db.commit()
    return doc


@router.delete("/documents/{doc_id}", status_code=204, tags=["documentos"])
def delete_document(doc_id: str, db: Session = Depends(get_db)) -> Response:
    db.delete(_get_or_404(db, models.ProjectDocument, doc_id))
    db.commit()
    return Response(status_code=204)


# ── Costos y plantilla (un registro por proyecto) ───────────
@router.get("/projects/{project_id}/cost-inputs", response_model=s.ProjectCostInputs, tags=["costos"])
def get_cost_inputs(project_id: str, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    return db.get(models.ProjectCostInputs, project_id) or s.ProjectCostInputs(project_id=project_id)


@router.put("/projects/{project_id}/cost-inputs", response_model=s.ProjectCostInputs, tags=["costos"])
def put_cost_inputs(project_id: str, body: s.ProjectCostInputs, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    data = body.model_dump() | {"project_id": project_id}
    obj = db.merge(models.ProjectCostInputs(**data))
    db.commit()
    return obj


@router.get(
    "/projects/{project_id}/template", response_model=s.ProjectTemplateSnapshot | None, tags=["plantillas"]
)
def get_template(project_id: str, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    return db.get(models.ProjectTemplateSnapshot, project_id)


# ── Reportes ────────────────────────────────────────────────
@router.get("/projects/{project_id}/reports/avance", response_model=s.ProjectProgressReport, tags=["reportes"])
def report_avance(project_id: str, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    return reports.avance(db, project_id)


@router.get("/projects/{project_id}/reports/costos", response_model=s.ProjectCostReport, tags=["reportes"])
def report_costos(project_id: str, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    return reports.costos(db, project_id)


@router.get("/projects/{project_id}/reports/horas", response_model=s.ProjectHoursReport, tags=["reportes"])
def report_horas(project_id: str, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    return reports.horas(db, project_id)


@router.get(
    "/projects/{project_id}/reports/indicadores", response_model=list[s.ProjectIndicator], tags=["reportes"]
)
def report_indicadores(project_id: str, db: Session = Depends(get_db)) -> Any:
    ensure_project(db, project_id)
    return reports.indicadores(db, project_id)


# ── Catálogo ────────────────────────────────────────────────
@router.get("/catalog/materials", response_model=list[s.CatalogMaterial], tags=["catálogo"])
def catalog_materials(db: Session = Depends(get_db)) -> list[Any]:
    return list(db.scalars(select(models.CatalogMaterial).order_by(models.CatalogMaterial.pk)))


@router.get("/catalog/providers", response_model=list[s.CatalogProvider], tags=["catálogo"])
def catalog_providers(db: Session = Depends(get_db)) -> list[Any]:
    return list(db.scalars(select(models.CatalogProvider).order_by(models.CatalogProvider.pk)))


# ── Notificaciones ──────────────────────────────────────────
@router.get("/notifications", response_model=list[s.Notification], tags=["notificaciones"])
def list_notifications(db: Session = Depends(get_db)) -> list[Any]:
    return list(db.scalars(select(models.Notification).order_by(models.Notification.pk)))


# /read-all antes de /{id}/read no colisiona (distinto número de segmentos), pero se deja primero por claridad.
@router.patch("/notifications/read-all", status_code=204, tags=["notificaciones"])
def mark_all_read(db: Session = Depends(get_db)) -> Response:
    db.execute(update(models.Notification).values(read=True))
    db.commit()
    return Response(status_code=204)


@router.patch("/notifications/{notification_id}/read", status_code=204, tags=["notificaciones"])
def mark_read(notification_id: str, db: Session = Depends(get_db)) -> Response:
    _get_or_404(db, models.Notification, notification_id).read = True
    db.commit()
    return Response(status_code=204)
