"""Reportes consolidados. Misma lógica que `report-mock.service.ts`, calculada en servidor."""

import re

from sqlalchemy.orm import Session

from . import models
from . import schemas as s
from .crud import list_by_project

LABOR_PROGRESS = {"COMPLETADO": 100, "EN PROCESO": 50}


def _avg(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0


def parse_money(value: str | None) -> float:
    """'$ 2,480.00' / 'MXN 18.40 / m' -> 2480.0 / 18.4"""
    if not value:
        return 0
    match = re.search(r"-?[\d,]+(?:\.\d+)?", value)
    return float(match.group().replace(",", "")) if match else 0


def avance(db: Session, project_id: str) -> s.ProjectProgressReport:
    labor = list_by_project(db, models.LaborStage, project_id)
    fabricacion = list_by_project(db, models.ProductionActivity, project_id)
    ensamble = list_by_project(db, models.AssemblyUnit, project_id)
    instalacion = list_by_project(db, models.InstallationActivity, project_id)
    programacion = list_by_project(db, models.ProgrammingEntry, project_id)

    cycles = [
        s.CycleProgress(cycle="CICLO I", progress=round(_avg([LABOR_PROGRESS.get(x.status, 0) for x in labor]))),
        s.CycleProgress(
            cycle="CICLO II",
            progress=round(_avg([x.progress for x in fabricacion] + [x.progress for x in ensamble])),
        ),
        s.CycleProgress(cycle="CICLO III", progress=round(_avg([x.progress for x in instalacion]))),
    ]
    milestones = [
        s.ProgressMilestone(label=m["label"], done=m["done"], date=p.review_date)
        for p in programacion
        for m in p.milestones
    ]
    blockers = [f"Bloqueado: {e.name}" for e in ensamble if e.status == "BLOQUEADO"]
    blockers += [p.blockers for p in programacion if p.blockers]

    return s.ProjectProgressReport(
        overall_progress=round(_avg([c.progress for c in cycles])),
        cycles=cycles,
        milestones=milestones,
        blockers=blockers,
    )


def costos(db: Session, project_id: str) -> s.ProjectCostReport:
    materials = sum(parse_money(m.subtotal) for m in list_by_project(db, models.BomMaterial, project_id))
    labor = sum(x.estimated_hours * x.hourly_rate for x in list_by_project(db, models.LaborStage, project_id))
    inputs = db.get(models.ProjectCostInputs, project_id)
    fixed = inputs.fixed_costs if inputs else 0
    variable = inputs.variable_costs if inputs else 0
    indirect = inputs.indirect_costs if inputs else 0
    margin = inputs.margin_percent if inputs else 0

    total = materials + labor + fixed + variable + indirect
    profit = total * margin / 100
    return s.ProjectCostReport(
        materials=materials,
        labor=labor,
        fixed_costs=fixed,
        variable_costs=variable,
        indirect_costs=indirect,
        total_cost=total,
        margin_percent=margin,
        estimated_profit=profit,
        final_estimated_value=total + profit,
        breakdown=[
            s.CostBreakdownItem(label="Materiales", amount=materials),
            s.CostBreakdownItem(label="Mano de obra", amount=labor),
            s.CostBreakdownItem(label="Costos fijos asignados", amount=fixed),
            s.CostBreakdownItem(label="Costos variables", amount=variable),
            s.CostBreakdownItem(label="Costos indirectos", amount=indirect),
        ],
        actual_cost_available=False,  # RE-027 / RE-037
    )


def horas(db: Session, project_id: str) -> s.ProjectHoursReport:
    stages = [
        s.HoursStageReport(
            name=x.name, hours=x.estimated_hours, hourly_rate=x.hourly_rate, cost=x.estimated_hours * x.hourly_rate
        )
        for x in list_by_project(db, models.LaborStage, project_id)
    ]
    return s.ProjectHoursReport(
        stages=stages,
        total_hours=sum(x.hours for x in stages),
        total_cost=sum(x.cost for x in stages),
        capacity_status="PENDIENTE_DE_CARACTERIZACION",  # RE-015
    )


def _fmt_number(value: float) -> str:
    # Formato es-CO: separador de miles con punto.
    return f"{round(value):,}".replace(",", ".")


def _fmt_hours(value: float) -> str:
    return f"{int(value)}" if float(value).is_integer() else f"{value:g}"


def indicadores(db: Session, project_id: str) -> list[s.ProjectIndicator]:
    av = avance(db, project_id)
    co = costos(db, project_id)
    ho = horas(db, project_id)
    procurement = list_by_project(db, models.ProcurementItem, project_id)
    pruebas = list_by_project(db, models.TestCase, project_id)

    pending = sum(1 for p in procurement if p.status != "COMPLETO")
    approved = sum(1 for t in pruebas if t.result == "APROBADA")
    return [
        s.ProjectIndicator(id="ind-avance", label="Avance general", value=f"{round(av.overall_progress)}%",
                           source="Avance del proyecto", is_demo=False),
        s.ProjectIndicator(id="ind-costo", label="Costo total estimado", value=f"$ {_fmt_number(co.total_cost)}",
                           source="Costos", is_demo=False),
        s.ProjectIndicator(id="ind-horas", label="Horas proyectadas", value=f"{_fmt_hours(ho.total_hours)} h",
                           source="Mano de obra", is_demo=False),
        s.ProjectIndicator(id="ind-compras", label="Compras pendientes", value=str(pending),
                           source="Compras", is_demo=False),
        s.ProjectIndicator(id="ind-pruebas", label="Pruebas aprobadas", value=f"{approved} / {len(pruebas)}",
                           source="Pruebas", is_demo=False),
    ]
