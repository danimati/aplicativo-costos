"""Esquemas Pydantic: espejo de `src/app/core/models/*.ts` del frontend.
Se serializan en camelCase y aceptan camelCase o snake_case en la entrada."""

from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, create_model
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


# ── Navegación ──────────────────────────────────────────────
class NavLeaf(CamelModel):
    id: str
    label: str
    route: str


class NavCycle(CamelModel):
    id: str
    label: str
    leaves: list[NavLeaf]


# ── Proyecto ────────────────────────────────────────────────
class ProjectStage(CamelModel):
    id: str
    name: str
    status: str
    progress: float
    owner: str
    due_date: str


class Project(CamelModel):
    id: str
    name: str
    status: str
    cut_date: str
    progress: str
    family: str
    owner: str
    start_date: str
    end_date: str
    stages: list[ProjectStage] = []
    nav_template: Optional[list[NavCycle]] = None


class ProjectUpdate(CamelModel):
    name: Optional[str] = None
    status: Optional[str] = None
    cut_date: Optional[str] = None
    progress: Optional[str] = None
    family: Optional[str] = None
    owner: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    nav_template: Optional[list[NavCycle]] = None


class CalendarEvent(CamelModel):
    day: str
    title: str
    project: str


class ProjectDocument(CamelModel):
    id: str
    project_id: str
    title: str
    kind: Literal["markdown", "file"]
    content: str = ""
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    mime_type: Optional[str] = None
    updated_at: str


class ProjectNote(CamelModel):
    id: str
    project_id: str
    date: str
    content: str


class Notification(CamelModel):
    id: str
    date: str
    message: str
    read: bool
    project_id: Optional[str] = None


# ── Materiales / catálogo ──────────────────────────────────
class BomMaterial(CamelModel):
    id: str
    description: str
    supplier: str
    calc_type: Literal["EXACTO", "ESTIMADO"]
    quantity: str
    unit_price: str
    subtotal: str
    note: str = ""


class CatalogMaterial(CamelModel):
    code: str
    description: str
    supplier: str
    family: str
    base_cost: str
    status: str


class CatalogProvider(CamelModel):
    code: str
    supplier: str
    specialty: str
    location: str
    catalog_count: str
    status: str


# ── Ciclo I ─────────────────────────────────────────────────
class LaborStage(CamelModel):
    id: str
    project_id: str
    name: str
    estimated_hours: float
    hourly_rate: float
    owner: str
    status: Literal["PENDIENTE", "EN PROCESO", "COMPLETADO"]
    notes: Optional[str] = None


class TemplateInheritedBlock(CamelModel):
    label: str
    source: str
    overridden: bool


class ProjectTemplateSnapshot(CamelModel):
    project_id: str
    template_name: str
    version: str
    family: str
    author: str
    applied_at: str
    status: Literal["VIGENTE", "BORRADOR", "HISTÓRICA"]
    blocks: list[TemplateInheritedBlock]


class ProjectCostInputs(CamelModel):
    project_id: str
    fixed_costs: float = 0
    variable_costs: float = 0
    indirect_costs: float = 0
    margin_percent: float = 0


# ── Ciclo II ────────────────────────────────────────────────
class ProcurementItem(CamelModel):
    id: str
    project_id: str
    material_id: str
    material_description: str
    supplier: str
    quotation_ref: str = ""
    unit_price: float
    discount_percent: float = 0
    quantity: float
    received_quantity: float = 0
    status: Literal["PENDIENTE", "SOLICITADO", "ORDENADO", "PARCIAL", "COMPLETO"]
    expected_date: str
    owner: str


class ReceptionItem(CamelModel):
    id: str
    project_id: str
    material_id: str
    material_description: str
    supplier: str
    lot_ref: str
    requested_quantity: float
    received_quantity: float = 0
    received_date: Optional[str] = None
    status: Literal["PENDIENTE", "CONFORME", "INCIDENCIA", "RECHAZADO"]
    incident_note: Optional[str] = None
    owner: str


ProductionStatus = Literal["PENDIENTE", "EN PROCESO", "COMPLETADO", "BLOQUEADO"]


class ProductionActivity(CamelModel):
    id: str
    project_id: str
    stage: str
    description: str
    owner: str
    status: ProductionStatus
    progress: float = 0
    target_date: str


class AssemblyUnit(CamelModel):
    id: str
    project_id: str
    name: str
    status: ProductionStatus
    owner: str
    progress: float = 0
    depends_on: list[str] = []


# ── Ciclo III ───────────────────────────────────────────────
class InstallationActivity(CamelModel):
    id: str
    project_id: str
    activity: str
    location: str
    owner: str
    status: ProductionStatus
    progress: float = 0
    target_date: str
    prerequisite: Optional[str] = None
    notes: Optional[str] = None


class WiringCircuit(CamelModel):
    id: str
    project_id: str
    circuit_ref: str
    origin: str
    destination: str
    gauge: str
    quantity: float
    status: Literal["PENDIENTE", "CONECTADO", "EN REVISIÓN", "APROBADO"]
    qc_pending: bool = False


class ProgrammingMilestone(CamelModel):
    label: str
    done: bool


class ProgrammingEntry(CamelModel):
    id: str
    project_id: str
    controller: str
    program_version: str
    owner: str
    status: Literal["PENDIENTE", "EN DESARROLLO", "EN REVISIÓN", "APROBADO"]
    review_date: str
    milestones: list[ProgrammingMilestone] = []
    blockers: Optional[str] = None


class TestCase(CamelModel):
    id: str
    project_id: str
    protocol: str
    owner: str
    result: Literal["PENDIENTE", "APROBADA", "FALLIDA", "CON OBSERVACIONES"]
    date: str
    evidence_ref: Optional[str] = None
    notes: Optional[str] = None


# ── Reportes ────────────────────────────────────────────────
class CycleProgress(CamelModel):
    cycle: str
    progress: float


class ProgressMilestone(CamelModel):
    label: str
    done: bool
    date: str


class ProjectProgressReport(CamelModel):
    overall_progress: float
    cycles: list[CycleProgress]
    milestones: list[ProgressMilestone]
    blockers: list[str]


class CostBreakdownItem(CamelModel):
    label: str
    amount: float


class ProjectCostReport(CamelModel):
    materials: float
    labor: float
    fixed_costs: float
    variable_costs: float
    indirect_costs: float
    total_cost: float
    margin_percent: float
    estimated_profit: float
    final_estimated_value: float
    breakdown: list[CostBreakdownItem]
    actual_cost_available: bool


class HoursStageReport(CamelModel):
    name: str
    hours: float
    hourly_rate: float
    cost: float


class ProjectHoursReport(CamelModel):
    stages: list[HoursStageReport]
    total_hours: float
    total_cost: float
    capacity_status: Literal["PENDIENTE_DE_CARACTERIZACION"]


class ProjectIndicator(CamelModel):
    id: str
    label: str
    value: str
    source: str
    is_demo: bool


# ── Variantes de escritura derivadas ────────────────────────
SERVER_FIELDS = {"project_id"}


def create_schema(model: type[CamelModel]) -> type[CamelModel]:
    """Igual que `model` pero sin `projectId` (viene de la URL) y con `id` opcional."""
    fields: dict[str, Any] = {}
    for name, f in model.model_fields.items():
        if name in SERVER_FIELDS:
            continue
        if name == "id":
            fields[name] = (Optional[str], None)
        else:
            fields[name] = (f.annotation, f.default if not f.is_required() else ...)
    return create_model(f"{model.__name__}Create", __base__=CamelModel, **fields)


def update_schema(model: type[CamelModel]) -> type[CamelModel]:
    """Todos los campos opcionales (PATCH parcial); `id`/`projectId` no se modifican."""
    fields = {
        name: (Optional[f.annotation], None)
        for name, f in model.model_fields.items()
        if name not in SERVER_FIELDS | {"id"}
    }
    return create_model(f"{model.__name__}Update", __base__=CamelModel, **fields)
