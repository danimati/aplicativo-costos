# 8. Matriz de trazabilidad

[← Índice](README.md)

Relaciona cada requerimiento del módulo de Costos (`requerimientos_modulo_costos.md`) con sus casos de uso, sus componentes de software y su estado.

**Estado:** ✅ cumplido · 🟡 parcial · ⏳ pendiente (definido en caracterización) · ❌ no implementado · — retirado.

| Req. | Descripción corta | Casos de uso | Frontend | Backend (API / tabla) | Estado | Observación |
|---|---|---|---|---|---|---|
| RE-001 | Crear proyecto de costos | CU-02, CU-03, CU-18 | ProjectHub, ProjectDetail | `/projects` · projects | 🟡 | Alta por API; botón de la UI pendiente |
| RE-002 | Usar plantillas de tableros | CU-08 | PlantillasPage | `/projects/{id}/template` · project_templates | 🟡 | Consulta de la plantilla aplicada; falta crear un proyecto desde plantilla |
| RE-003 | Registrar componentes del tablero | CU-06 | BomPage | `/projects/{id}/bom` · bom_materials | 🟡 | Registro por API |
| RE-004 | Cantidades exactas | CU-06 | BomPage (`calcType`) | bom_materials.calc_type = EXACTO | ✅ | |
| RE-005 | Cantidades estimadas | CU-06 | BomPage (nota metrológica) | calc_type = ESTIMADO, note | ✅ | |
| RE-006 | Tipificación de consumos | — | — | — | ⏳ | Pendiente de caracterización |
| RE-007 | Precio de materiales | CU-06 | BomPage | bom_materials.unit_price, catalog_materials | ✅ | Precio como texto (L-04) |
| RE-008 | Varios proveedores | CU-09 | ComprasPage | procurement_items.supplier, catalog_providers | 🟡 | Catálogo solo por API |
| RE-009 | Descuentos de proveedores | CU-09 | ComprasPage (precio neto) | procurement_items.discount_percent | ✅ | |
| RE-010 | Selección del costo de compra | CU-09 | ComprasPage | procurement_items | 🟡 | El precio neto no se lleva automáticamente a la BOM |
| RE-011 | Etapas de trabajo | CU-07 | ManoObraPage | `/labor-stages` · labor_stages | ✅ | |
| RE-012 | Horas por etapa | CU-07 | ManoObraPage | labor_stages.estimated_hours | ✅ | |
| RE-013 | Valor de la hora | CU-07 | ManoObraPage | labor_stages.hourly_rate | ✅ | Valor por etapa; metodología en caracterización |
| RE-014 | Costo de mano de obra | CU-07 | ManoObraPage | horas × valor | ✅ | |
| RE-015 | Tiempo disponible | CU-15 | HorasPage (aviso) | `capacityStatus` | ⏳ | Pendiente de caracterización |
| RE-016 – RE-018 | Tiempo usado / no usado / utilización | — | Aviso en ManoObraPage | — | — | Retirados |
| RE-019 | Costos fijos | CU-13 | CostosPage | project_cost_inputs.fixed_costs | 🟡 | Edición por API |
| RE-020 | Asignación de costos fijos | CU-13 | CostosPage | fixed_costs (valor ya asignado) | ⏳ | Método de reparto en caracterización |
| RE-021 | Costos variables | CU-13 | CostosPage | variable_costs | 🟡 | Edición por API |
| RE-022 – RE-023 | Maquinaria | — | — | — | — | Retirados |
| RE-024 | Costos indirectos | CU-13 | CostosPage | indirect_costs | 🟡 | Edición por API |
| RE-025 | Parametrización inicial | CU-13 | — | `/cost-inputs`, `/labor-stages`, `/bom` | 🟡 | Por proyecto; no hay parámetros globales |
| RE-026 | Ajuste de parámetros | CU-13 | — | `PUT /cost-inputs`, `PATCH` | ✅ | Los reportes se recalculan al instante |
| RE-027 | Comparar lo estimado con lo obtenido | CU-14 | CostosPage (aviso) | `actualCostAvailable=false` | ❌ | |
| RE-028 | Calibrar estimaciones | — | — | — | ❌ | Depende de RE-027 |
| RE-029 | Costo de materiales | CU-14 | CostosPage | reports.costos → materials | ✅ | |
| RE-030 | Costo de mano de obra | CU-14, CU-15 | CostosPage, HorasPage | reports → labor | ✅ | |
| RE-031 | Costos adicionales | CU-14 | CostosPage | fixed + variable + indirect | ✅ | |
| RE-032 | Costo total | CU-14 | CostosPage | totalCost | ✅ | |
| RE-033 | % de ganancia | CU-13 | CostosPage | margin_percent | 🟡 | Edición por API |
| RE-034 | Cálculo de la ganancia | CU-14 | CostosPage | estimatedProfit | ✅ | |
| RE-035 | Valor final | CU-14 | CostosPage | finalEstimatedValue | ✅ | |
| RE-036 | Reporte de costos | CU-14, CU-16 | CostosPage, IndicadoresPage | `/reports/costos` | ✅ | Falta exportar |
| RE-037 | Reporte de mano de obra proyectada | CU-15 | HorasPage | `/reports/horas` | ✅ | |
| RE-038 | Reporte estimado vs. resultado | — | — | — | ❌ | Depende de RE-027 |
| RE-039 | Aplicación web | CU-01, CU-19 | SPA Angular | Nginx + FastAPI + Docker | ✅ | Falta HTTPS / dominio |
| RE-040 | Áreas financiera y de planeación | CU-01 | AuthService (rol) | — | 🟡 | Roles sin control de acceso |

**Cobertura** (35 requerimientos vigentes): **18 ✅ · 11 🟡 · 3 ⏳** (RE-006, RE-015, RE-020) **· 3 ❌** (RE-027, RE-028, RE-038).

## 8.1 Inconsistencias encontradas en la interfaz

Los rótulos de algunas hojas citan códigos de requerimiento que no coinciden con el documento de requerimientos:

| Hoja | Rótulo actual | Debería decir |
|---|---|---|
| 03 Mano de obra | «RE-005 — RE-008 / PROYECCIÓN DE MANO DE OBRA» | RE-011 — RE-014 |
| 03 Mano de obra | «RE-006 — ETAPAS DEL PROYECTO» | RE-011 |
| 14 Costos | «COMPARACIÓN CON COSTO REAL (RE-027 / RE-037)» | RE-027 / RE-038 (RE-037 es el reporte de horas) |
| `report.model.ts` | comentario `RE-027 / RE-037` | RE-027 / RE-038 |

## 8.2 Trazabilidad casos de uso → componentes

| CU | Página / componente | Servicio Angular | Endpoint(s) | Tablas |
|---|---|---|---|---|
| CU-01 | LoginComponent | AuthService | — | — |
| CU-02 | ProjectHubComponent, MonthCalendar | ProjectService | `/projects`, `/projects/calendar` | projects, project_stages, calendar_events |
| CU-03 | ProjectDetailComponent, TopNav | ProjectService, NavStateService | `/projects/{id}` | projects |
| CU-04 | DocumentacionPage, NotesModal | ProjectNotesService → ProjectNoteService | `/projects/{id}/notes`, `/notes/{id}` | project_notes |
| CU-05 | DocumentacionPage | ProjectDocumentService | `/projects/{id}/documents`, `/documents/{id}` | project_documents |
| CU-06 | BomPage | BomService | `/projects/{id}/bom` | bom_materials |
| CU-07 | ManoObraPage | LaborService | `/projects/{id}/labor-stages` | labor_stages |
| CU-08 | PlantillasPage | ProjectTemplateService | `/projects/{id}/template` | project_templates |
| CU-09 | ComprasPage | ProcurementService | `/projects/{id}/procurement` | procurement_items |
| CU-10 | RecepcionPage | ReceptionService | `/projects/{id}/reception` | reception_items |
| CU-11 | FabricacionPage, EnsamblePage | ProductionService | `/fabricacion`, `/ensamble` | production_activities, assembly_units |
| CU-12 | Instalacion/Cableado/Programacion/PruebasPage | InstallationService | `/instalacion`, `/cableado`, `/programacion`, `/pruebas` | installation_activities, wiring_circuits, programming_entries, test_cases |
| CU-13 | (API) | ProjectCostService (lectura) | `/projects/{id}/cost-inputs` | project_cost_inputs |
| CU-14 | CostosPage | ReportService | `/reports/costos` | bom_materials, labor_stages, project_cost_inputs |
| CU-15 | HorasPage | ReportService | `/reports/horas` | labor_stages |
| CU-16 | AvancePage, IndicadoresPage | ReportService | `/reports/avance`, `/reports/indicadores` | (varias) |
| CU-17 | ShellComponent, TopNav | NotificationService | `/notifications/*` | notifications |
| CU-18 | (API) | — | `/projects` POST/PATCH/DELETE | projects (+ cascada) |
| CU-19 | Makefile, docker-compose | — | `/health` | todas |
