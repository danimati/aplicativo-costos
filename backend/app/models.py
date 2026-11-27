"""Modelos ORM. Cada tabla tiene una PK interna `pk` (orden de inserción estable) y
el `id` de negocio que consume el frontend."""

from typing import Any

from sqlalchemy import JSON, Boolean, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


def project_fk() -> Mapped[str]:
    return mapped_column(String, ForeignKey("projects.id", ondelete="CASCADE"), index=True)


class Project(Base):
    __tablename__ = "projects"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    cut_date: Mapped[str] = mapped_column(String)
    progress: Mapped[str] = mapped_column(String)
    family: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)
    start_date: Mapped[str] = mapped_column(String)
    end_date: Mapped[str] = mapped_column(String)
    nav_template: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)

    stages: Mapped[list["ProjectStage"]] = relationship(
        order_by="ProjectStage.pk", cascade="all, delete-orphan", lazy="selectin"
    )


class ProjectStage(Base):
    __tablename__ = "project_stages"
    __table_args__ = (UniqueConstraint("project_id", "id"),)
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String)
    project_id: Mapped[str] = project_fk()
    name: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    progress: Mapped[float] = mapped_column(Float)
    owner: Mapped[str] = mapped_column(String)
    due_date: Mapped[str] = mapped_column(String)


class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    day: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    project: Mapped[str] = mapped_column(String)


class BomMaterial(Base):
    __tablename__ = "bom_materials"
    __table_args__ = (UniqueConstraint("project_id", "id"),)
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String)
    project_id: Mapped[str] = project_fk()
    description: Mapped[str] = mapped_column(String)
    supplier: Mapped[str] = mapped_column(String)
    calc_type: Mapped[str] = mapped_column(String)
    quantity: Mapped[str] = mapped_column(String)
    unit_price: Mapped[str] = mapped_column(String)
    subtotal: Mapped[str] = mapped_column(String)
    note: Mapped[str] = mapped_column(String, default="")


class CatalogMaterial(Base):
    __tablename__ = "catalog_materials"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String, unique=True)
    description: Mapped[str] = mapped_column(String)
    supplier: Mapped[str] = mapped_column(String)
    family: Mapped[str] = mapped_column(String)
    base_cost: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)


class CatalogProvider(Base):
    __tablename__ = "catalog_providers"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String, unique=True)
    supplier: Mapped[str] = mapped_column(String)
    specialty: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    catalog_count: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)


class Notification(Base):
    __tablename__ = "notifications"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    date: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    project_id: Mapped[str | None] = mapped_column(String, nullable=True)


class ProjectNote(Base):
    __tablename__ = "project_notes"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    date: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text)


class ProjectDocument(Base):
    __tablename__ = "project_documents"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    title: Mapped[str] = mapped_column(String)
    kind: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text, default="")
    file_name: Mapped[str | None] = mapped_column(String, nullable=True)
    file_url: Mapped[str | None] = mapped_column(String, nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String, nullable=True)
    updated_at: Mapped[str] = mapped_column(String)


class LaborStage(Base):
    __tablename__ = "labor_stages"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    name: Mapped[str] = mapped_column(String)
    estimated_hours: Mapped[float] = mapped_column(Float)
    hourly_rate: Mapped[float] = mapped_column(Float)
    owner: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    notes: Mapped[str | None] = mapped_column(String, nullable=True)


class ProcurementItem(Base):
    __tablename__ = "procurement_items"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    material_id: Mapped[str] = mapped_column(String)
    material_description: Mapped[str] = mapped_column(String)
    supplier: Mapped[str] = mapped_column(String)
    quotation_ref: Mapped[str] = mapped_column(String, default="")
    unit_price: Mapped[float] = mapped_column(Float)
    discount_percent: Mapped[float] = mapped_column(Float, default=0)
    quantity: Mapped[float] = mapped_column(Float)
    received_quantity: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String)
    expected_date: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)


class ReceptionItem(Base):
    __tablename__ = "reception_items"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    material_id: Mapped[str] = mapped_column(String)
    material_description: Mapped[str] = mapped_column(String)
    supplier: Mapped[str] = mapped_column(String)
    lot_ref: Mapped[str] = mapped_column(String)
    requested_quantity: Mapped[float] = mapped_column(Float)
    received_quantity: Mapped[float] = mapped_column(Float, default=0)
    received_date: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String)
    incident_note: Mapped[str | None] = mapped_column(String, nullable=True)
    owner: Mapped[str] = mapped_column(String)


class ProductionActivity(Base):
    __tablename__ = "production_activities"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    stage: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    progress: Mapped[float] = mapped_column(Float, default=0)
    target_date: Mapped[str] = mapped_column(String)


class AssemblyUnit(Base):
    __tablename__ = "assembly_units"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    name: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)
    progress: Mapped[float] = mapped_column(Float, default=0)
    depends_on: Mapped[list[str]] = mapped_column(JSON, default=list)


class InstallationActivity(Base):
    __tablename__ = "installation_activities"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    activity: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    progress: Mapped[float] = mapped_column(Float, default=0)
    target_date: Mapped[str] = mapped_column(String)
    prerequisite: Mapped[str | None] = mapped_column(String, nullable=True)
    notes: Mapped[str | None] = mapped_column(String, nullable=True)


class WiringCircuit(Base):
    __tablename__ = "wiring_circuits"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    circuit_ref: Mapped[str] = mapped_column(String)
    origin: Mapped[str] = mapped_column(String)
    destination: Mapped[str] = mapped_column(String)
    gauge: Mapped[str] = mapped_column(String)
    quantity: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String)
    qc_pending: Mapped[bool] = mapped_column(Boolean, default=False)


class ProgrammingEntry(Base):
    __tablename__ = "programming_entries"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    controller: Mapped[str] = mapped_column(String)
    program_version: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    review_date: Mapped[str] = mapped_column(String)
    milestones: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    blockers: Mapped[str | None] = mapped_column(String, nullable=True)


class TestCase(Base):
    __tablename__ = "test_cases"
    pk: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id: Mapped[str] = mapped_column(String, unique=True)
    project_id: Mapped[str] = project_fk()
    protocol: Mapped[str] = mapped_column(String)
    owner: Mapped[str] = mapped_column(String)
    result: Mapped[str] = mapped_column(String)
    date: Mapped[str] = mapped_column(String)
    evidence_ref: Mapped[str | None] = mapped_column(String, nullable=True)
    notes: Mapped[str | None] = mapped_column(String, nullable=True)


class ProjectCostInputs(Base):
    __tablename__ = "project_cost_inputs"
    project_id: Mapped[str] = mapped_column(
        String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True
    )
    fixed_costs: Mapped[float] = mapped_column(Float, default=0)
    variable_costs: Mapped[float] = mapped_column(Float, default=0)
    indirect_costs: Mapped[float] = mapped_column(Float, default=0)
    margin_percent: Mapped[float] = mapped_column(Float, default=0)


class ProjectTemplateSnapshot(Base):
    __tablename__ = "project_templates"
    project_id: Mapped[str] = mapped_column(
        String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True
    )
    template_name: Mapped[str] = mapped_column(String)
    version: Mapped[str] = mapped_column(String)
    family: Mapped[str] = mapped_column(String)
    author: Mapped[str] = mapped_column(String)
    applied_at: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    blocks: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
