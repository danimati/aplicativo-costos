"""Datos iniciales: los mismos que usan los servicios mock del frontend.
Se cargan sólo si la base está vacía. Para reiniciar: borrar costos.db o `python -m app.seed --reset`."""

import sys

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models as m
from .db import Base, SessionLocal, engine

P089, P076, P061, P044 = "PRY-2024-089", "PRY-2024-076", "PRY-2024-061", "PRY-2024-044"

NAV_TEMPLATE = [
    {"id": "CICLO I", "label": "INGENIERÍA & ESTIMACIÓN", "leaves": [
        {"id": "01", "label": "NOTAS & DOCUMENTACIÓN", "route": "documentacion"},
        {"id": "02", "label": "LISTA DE MATERIALES / BOM", "route": "bom"},
        {"id": "03", "label": "MANO DE OBRA & ETAPAS", "route": "mano-obra"},
        {"id": "04", "label": "PLANTILLAS BASE", "route": "plantillas"},
    ]},
    {"id": "CICLO II", "label": "TALLER & PRODUCCIÓN", "leaves": [
        {"id": "05", "label": "COMPRAS", "route": "compras"},
        {"id": "06", "label": "RECEPCIÓN DE MATERIALES", "route": "recepcion"},
        {"id": "07", "label": "FABRICACIÓN", "route": "fabricacion"},
        {"id": "08", "label": "ENSAMBLE", "route": "ensamble"},
    ]},
    {"id": "CICLO III", "label": "INSTALACIÓN & PUESTA EN MARCHA", "leaves": [
        {"id": "09", "label": "INSTALACIÓN", "route": "instalacion"},
        {"id": "10", "label": "CABLEADO", "route": "cableado"},
        {"id": "11", "label": "PROGRAMACIÓN", "route": "programacion"},
        {"id": "12", "label": "PRUEBAS", "route": "pruebas"},
    ]},
    {"id": "REPORTES", "label": "REPORTES & CONTROL", "leaves": [
        {"id": "13", "label": "AVANCE DEL PROYECTO", "route": "avance"},
        {"id": "14", "label": "COSTOS", "route": "costos"},
        {"id": "15", "label": "HORAS", "route": "horas"},
        {"id": "16", "label": "INDICADORES", "route": "indicadores"},
    ]},
    {"id": "CONFIGURACIÓN", "label": "CONFIGURACIÓN", "leaves": [
        {"id": "17", "label": "DATOS DEL PROYECTO", "route": "datos"},
        {"id": "18", "label": "USUARIOS", "route": "usuarios"},
        {"id": "19", "label": "PERMISOS", "route": "permisos"},
    ]},
]


def _projects() -> list[m.Project]:
    def p(id, name, status, start, end, cut, progress, family, owner):  # noqa: ANN001, ANN202
        return m.Project(id=id, name=name, status=status, start_date=start, end_date=end, cut_date=cut,
                         progress=progress, family=family, owner=owner, nav_template=NAV_TEMPLATE)

    p1 = p(P089, "Tablero Línea Extrusión 04", "EN EJECUCIÓN", "2026-07-15", "2026-09-22", "22 SEP 2026", "68%",
           "CONTROL EXTRUSIÓN", "AM")
    p1.stages = [
        m.ProjectStage(id="01", project_id=P089, name="Ingeniería & Estimación", status="COMPLETADO", progress=100,
                       owner="AM", due_date="12 AGO 2026"),
        m.ProjectStage(id="02", project_id=P089, name="Adquisición & Taller", status="EN PROCESO", progress=65,
                       owner="JC", due_date="25 SEP 2026"),
        m.ProjectStage(id="03", project_id=P089, name="Liquidación & Calibración", status="PENDIENTE", progress=0,
                       owner="AM", due_date="10 OCT 2026"),
    ]
    return [
        p1,
        p(P076, "Celda de ensamble neumático", "EN CIERRE", "2026-08-02", "2026-09-14", "14 SEP 2026", "92%",
          "AUTOMATIZACIÓN", "JC"),
        p(P061, "Retrofit transportador norte", "PAUSADO", "2026-07-10", "2026-08-29", "29 AGO 2026", "41%",
          "TRANSPORTE", "LM"),
        p(P044, "Tablero de fuerza Planta B", "FINALIZADO", "2026-06-02", "2026-07-18", "18 JUL 2026", "100%",
          "ENERGÍA", "AM"),
    ]


BOM = [
    ("01", "Interruptor termomagnético 3P", "Schneider Electric", "EXACTO", "2", "$ 1,240.00", "$ 2,480.00",
     "NSX 160F / 25kA"),
    ("02", "Gabinete metálico IP55", "Rittal", "EXACTO", "1", "$ 8,960.00", "$ 8,960.00", "TS8 / 800×600×300 mm"),
    ("03", "PLC compacto + módulos I/O", "Siemens", "EXACTO", "1", "$ 6,780.00", "$ 6,780.00", "S7-1200 / 24 DI/DO"),
    ("04", "Cable de control 18 AWG", "Viakon", "ESTIMADO", "180 m", "$ 18.40", "$ 3,312.00",
     "180m según perímetro y distribución TS8."),
    ("05", "Canaleta ranurada 40×60", "Phoenix Contact", "ESTIMADO", "12 m", "$ 86.00", "$ 1,032.00",
     "12m según perímetro de gabinete."),
]


def _labor(pid: str, rows: list[tuple]) -> list[m.LaborStage]:
    return [m.LaborStage(id=r[0], project_id=pid, name=r[1], estimated_hours=r[2], hourly_rate=r[3], owner=r[4],
                         status=r[5], notes=r[6] if len(r) > 6 else None) for r in rows]


def seed(db: Session) -> None:
    db.add_all(_projects())
    db.flush()

    db.add_all([m.CalendarEvent(day=d, title=t, project=p) for d, t, p in [
        ("22", "CORTE DE COSTOS", P089), ("24", "REVISIÓN DE BOM", P089), ("28", "ENTREGA DE TABLERO", P076),
        ("02", "CIERRE DE PROYECTO", P061), ("07", "AUDITORÍA INTERNA", "TODOS LOS PROYECTOS"),
    ]])

    # El mock del front devuelve la misma BOM para cualquier proyecto; se replica ese comportamiento.
    for pid in (P089, P076, P061, P044):
        db.add_all([m.BomMaterial(id=r[0], project_id=pid, description=r[1], supplier=r[2], calc_type=r[3],
                                  quantity=r[4], unit_price=r[5], subtotal=r[6], note=r[7]) for r in BOM])

    db.add_all([m.CatalogMaterial(code=c, description=d, supplier=s, family=f, base_cost=b, status=st)
                for c, d, s, f, b, st in [
        ("MAT-001", "Interruptor termomagnético 3P", "Schneider Electric", "Eléctrico", "MXN 1,240.00", "ACTIVO"),
        ("MAT-002", "Gabinete metálico IP55", "Rittal", "Envolventes", "MXN 8,960.00", "ACTIVO"),
        ("MAT-003", "Cable de control 18 AWG", "Viakon", "Conductores", "MXN 18.40 / m", "ACTIVO"),
        ("MAT-004", "Canaleta ranurada 40×60", "Phoenix Contact", "Accesorios", "MXN 86.00 / m", "REVISAR"),
    ]])
    db.add_all([m.CatalogProvider(code=c, supplier=s, specialty=sp, location=l, catalog_count=n, status=st)
                for c, s, sp, l, n, st in [
        ("PRV-001", "Schneider Electric", "Componentes eléctricos", "Monterrey, NL", "12 SKUs", "ACTIVO"),
        ("PRV-002", "Rittal", "Gabinetes y envolventes", "Querétaro, QRO", "8 SKUs", "ACTIVO"),
        ("PRV-003", "Viakon", "Conductores", "Ciudad de México", "21 SKUs", "ACTIVO"),
        ("PRV-004", "Phoenix Contact", "Conectividad industrial", "Tlalnepantla, EDO. MEX.", "6 SKUs", "PENDIENTE"),
    ]])

    db.add_all([
        m.Notification(id="NOT-001", date="22 SEP 2026 / 14:32", message="Nuevo corte de material registrado",
                       read=False, project_id=P089),
        m.Notification(id="NOT-002", date="22 SEP 2026 / 11:18", message="La BOM del proyecto fue actualizada",
                       read=False, project_id=P089),
        m.Notification(id="NOT-003", date="21 SEP 2026 / 16:45", message="Orden de compra recibida en taller",
                       read=True, project_id=P076),
    ])

    db.add(m.ProjectNote(id="n1", project_id=P089, date="2026-09-22", content=(
        "# Corte de Costos\n- Revisar BOM\n- [ ] Aprobar gastos **extraordinarios**\n- [x] Enviar borrador")))
    db.add_all([
        m.ProjectDocument(id="d1", project_id=P089, title="Especificación técnica — Tablero Extrusión 04",
                          kind="markdown", updated_at="2026-09-10T14:30:00.000Z", content=(
            "# Alcance\nEste documento describe el diseño del tablero de control.\n\n## Componentes\n"
            "- PLC Siemens S7-1500\n- Variador de frecuencia")),
        m.ProjectDocument(id="d2", project_id=P089, title="Acta de kickoff", kind="markdown",
                          updated_at="2026-07-16T09:00:00.000Z", content=(
            "# Acta de kickoff\n**Fecha:** 15 jul 2026\n\n## Acuerdos\n- [ ] Confirmar proveedor\n"
            "- [x] Definir alcance")),
    ])

    db.add_all(_labor(P089, [
        ("lb1", "Entendimiento del problema", 8, 45000, "A. Morales", "COMPLETADO"),
        ("lb2", "Diseño", 24, 55000, "A. Morales", "COMPLETADO"),
        ("lb3", "Fabricación", 40, 38000, "J. Castañeda", "EN PROCESO"),
        ("lb4", "Configuración", 16, 50000, "L. Medina", "PENDIENTE"),
        ("lb5", "Instalación", 20, 42000, "J. Castañeda", "PENDIENTE"),
        ("lb6", "Calibración", 10, 60000, "A. Morales", "PENDIENTE", "Requiere certificado metrológico vigente."),
    ]) + _labor(P076, [
        ("lb7", "Entendimiento del problema", 6, 45000, "J. Castañeda", "COMPLETADO"),
        ("lb8", "Diseño", 18, 55000, "J. Castañeda", "COMPLETADO"),
        ("lb9", "Fabricación", 30, 38000, "L. Medina", "COMPLETADO"),
        ("lb10", "Instalación", 14, 42000, "L. Medina", "EN PROCESO"),
    ]))

    db.add_all([
        m.ProjectCostInputs(project_id=P089, fixed_costs=3200000, variable_costs=1450000, indirect_costs=980000,
                            margin_percent=22),
        m.ProjectCostInputs(project_id=P076, fixed_costs=2100000, variable_costs=900000, indirect_costs=640000,
                            margin_percent=18),
    ])

    src = "Plantilla Extrusión Estándar v4.2"
    db.add(m.ProjectTemplateSnapshot(
        project_id=P089, template_name="Tablero de Control — Extrusión Estándar", version="v4.2",
        family="CONTROL EXTRUSIÓN", author="A. Morales", applied_at="2026-07-15T09:00:00.000Z", status="VIGENTE",
        blocks=[{"label": "Materiales", "source": src, "overridden": True},
                {"label": "Mano de obra", "source": src, "overridden": False},
                {"label": "Parámetros eléctricos", "source": src, "overridden": False}]))

    db.add_all([m.ProcurementItem(id=r[0], project_id=P089, material_id=r[1], material_description=r[2],
                                  supplier=r[3], quotation_ref=r[4], unit_price=r[5], discount_percent=r[6],
                                  quantity=r[7], received_quantity=r[8], status=r[9], expected_date=r[10],
                                  owner=r[11]) for r in [
        ("pc1", "MAT-001", "PLC Siemens S7-1500", "Siemens Colombia", "COT-4471", 8500000, 5, 1, 1, "COMPLETO",
         "2026-08-01", "A. Morales"),
        ("pc2", "MAT-014", "Variador de frecuencia 15HP", "Danfoss", "COT-4488", 3200000, 0, 2, 1, "PARCIAL",
         "2026-09-10", "J. Castañeda"),
        ("pc3", "MAT-022", "Contactor 3 polos 40A", "Schneider Electric", "COT-4502", 145000, 8, 6, 0, "ORDENADO",
         "2026-09-25", "J. Castañeda"),
        ("pc4", "MAT-031", "Gabinete IP55 800x600", "Rittal", "COT-4519", 1850000, 0, 1, 0, "SOLICITADO",
         "2026-10-02", "A. Morales"),
        ("pc5", "MAT-045", "Cable THHN 12 AWG (rollo)", "Centelsa", "", 210000, 0, 4, 0, "PENDIENTE",
         "2026-10-05", "L. Medina"),
    ]])

    db.add_all([
        m.ReceptionItem(id="rc1", project_id=P089, material_id="MAT-001", material_description="PLC Siemens S7-1500",
                        supplier="Siemens Colombia", lot_ref="LOTE-2208", requested_quantity=1, received_quantity=1,
                        received_date="2026-08-03", status="CONFORME", owner="L. Medina"),
        m.ReceptionItem(id="rc2", project_id=P089, material_id="MAT-014",
                        material_description="Variador de frecuencia 15HP", supplier="Danfoss", lot_ref="LOTE-2231",
                        requested_quantity=2, received_quantity=1, received_date="2026-09-12", status="INCIDENCIA",
                        incident_note=("Llegó 1 de 2 unidades; proveedor confirma envío pendiente para la "
                                       "próxima semana."), owner="L. Medina"),
        m.ReceptionItem(id="rc3", project_id=P089, material_id="MAT-022", material_description="Contactor 3 polos 40A",
                        supplier="Schneider Electric", lot_ref="—", requested_quantity=6, received_quantity=0,
                        received_date=None, status="PENDIENTE", owner="L. Medina"),
    ])

    db.add_all([m.ProductionActivity(id=r[0], project_id=P089, stage=r[1], description=r[2], owner=r[3],
                                     status=r[4], progress=r[5], target_date=r[6]) for r in [
        ("fb1", "Corte y perforado de gabinete", "Preparación mecánica del gabinete IP55", "J. Castañeda",
         "COMPLETADO", 100, "2026-09-05"),
        ("fb2", "Montaje de riel DIN", "Instalación de riel y canaletas internas", "J. Castañeda", "COMPLETADO", 100,
         "2026-09-10"),
        ("fb3", "Cableado de potencia", "Tendido de cable de potencia entre PLC y variadores", "L. Medina",
         "EN PROCESO", 55, "2026-09-28"),
        ("fb4", "Rotulado de bornes", "Identificación de bornes según plano eléctrico", "L. Medina", "PENDIENTE", 0,
         "2026-10-03"),
    ]])
    db.add_all([
        m.AssemblyUnit(id="as1", project_id=P089, name="Conjunto de control (PLC + E/S)", status="COMPLETADO",
                       owner="J. Castañeda", progress=100, depends_on=[]),
        m.AssemblyUnit(id="as2", project_id=P089, name="Conjunto de potencia (variadores + contactores)",
                       status="EN PROCESO", owner="L. Medina", progress=60, depends_on=["as1"]),
        m.AssemblyUnit(id="as3", project_id=P089, name="Conjunto de campo (bornes de salida)", status="BLOQUEADO",
                       owner="L. Medina", progress=0, depends_on=["as2"]),
    ])

    loc = "Línea Extrusión 04 — Planta Norte"
    db.add_all([
        m.InstallationActivity(id="in1", project_id=P089, activity="Anclaje de gabinete en sitio", location=loc,
                               owner="J. Castañeda", status="PENDIENTE", progress=0, target_date="2026-10-10",
                               prerequisite="Fabricación y ensamble completos"),
        m.InstallationActivity(id="in2", project_id=P089, activity="Conexión a tablero general", location=loc,
                               owner="L. Medina", status="PENDIENTE", progress=0, target_date="2026-10-12"),
        m.InstallationActivity(id="in3", project_id=P089, activity="Verificación de puesta a tierra", location=loc,
                               owner="L. Medina", status="PENDIENTE", progress=0, target_date="2026-10-13",
                               notes="Requiere certificado de resistencia de tierra vigente."),
    ])
    db.add_all([m.WiringCircuit(id=r[0], project_id=P089, circuit_ref=r[1], origin=r[2], destination=r[3],
                                gauge=r[4], quantity=r[5], status=r[6], qc_pending=r[7]) for r in [
        ("ca1", "CTO-014", "PLC — salida digital 1", "Contactor principal", "12 AWG", 8, "CONECTADO", False),
        ("ca2", "CTO-015", "Variador 1", "Motor extrusión", "10 AWG", 12, "EN REVISIÓN", True),
        ("ca3", "CTO-016", "Fuente 24VDC", "Sensores de línea", "18 AWG", 20, "PENDIENTE", False),
    ]])
    db.add(m.ProgrammingEntry(
        id="pg1", project_id=P089, controller="PLC Siemens S7-1500", program_version="v0.3-beta", owner="A. Morales",
        status="EN DESARROLLO", review_date="2026-10-15",
        milestones=[{"label": "Lógica de arranque/paro", "done": True},
                    {"label": "Interbloqueos de seguridad", "done": True},
                    {"label": "Control de velocidad de extrusión", "done": False},
                    {"label": "Pantalla HMI de operación", "done": False}],
        blockers="Pendiente definición final de setpoints con el cliente."))
    db.add_all([m.TestCase(id=i, project_id=P089, protocol=p, owner=o, result="PENDIENTE", date=d) for i, p, o, d in [
        ("ts1", "Prueba de aislamiento eléctrico", "L. Medina", "2026-10-18"),
        ("ts2", "Prueba de continuidad de tierra", "L. Medina", "2026-10-18"),
        ("ts3", "Prueba funcional de arranque/paro", "A. Morales", "2026-10-20"),
    ]])

    db.commit()


def init_db(reset: bool = False) -> None:
    from . import models  # noqa: F401  (registra tablas)

    if reset:
        Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        if db.scalar(select(m.Project).limit(1)) is None:
            seed(db)


if __name__ == "__main__":
    init_db(reset="--reset" in sys.argv)
    print("Base de datos lista.")
