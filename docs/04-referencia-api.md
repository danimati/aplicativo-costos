# 4. Referencia del API

[← Índice](README.md)

- **Base**: `/api` (en Docker: `http://localhost:8080/api`; en desarrollo: `http://localhost:8000/api`).
- **Documentación interactiva**: `/docs` (Swagger UI), `/redoc` y `/openapi.json`, siempre al día con el código.
- **Formato**: JSON en camelCase. La entrada acepta camelCase o snake_case.
- **Autenticación**: no tiene en esta versión.

## 4.1 Códigos de respuesta

| Código | Cuándo |
|---|---|
| 200 | Consulta o actualización correcta |
| 201 | Recurso creado (POST) |
| 204 | Eliminado o marcado como leído; sin cuerpo |
| 404 | Proyecto o elemento inexistente: `{"detail": "Proyecto X no existe"}` |
| 409 | `POST /projects` con un `id` que ya existe |
| 422 | Cuerpo inválido (tipo incorrecto o estado fuera del enumerado); `detail` indica el campo |

## 4.2 Proyectos y calendario

| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| GET | `/projects` | — | `Project[]` |
| GET | `/projects/{id}` | — | `Project` (incluye `stages` y `navTemplate`) |
| POST | `/projects` | `Project` | 201 `Project` |
| PATCH | `/projects/{id}` | campos parciales | `Project` |
| DELETE | `/projects/{id}` | — | 204 (cascada) |
| GET | `/projects/calendar` | — | `CalendarEvent[]` |

```json
{
  "id": "PRY-2024-089", "name": "Tablero Línea Extrusión 04", "status": "EN EJECUCIÓN",
  "cutDate": "22 SEP 2026", "progress": "68%", "family": "CONTROL EXTRUSIÓN", "owner": "AM",
  "startDate": "2026-07-15", "endDate": "2026-09-22",
  "stages": [{ "id": "01", "name": "Ingeniería & Estimación", "status": "COMPLETADO",
               "progress": 100, "owner": "AM", "dueDate": "12 AGO 2026" }],
  "navTemplate": [{ "id": "CICLO I", "label": "INGENIERÍA & ESTIMACIÓN",
                    "leaves": [{ "id": "01", "label": "NOTAS & DOCUMENTACIÓN", "route": "documentacion" }] }]
}
```

## 4.3 Colecciones por proyecto (CRUD genérico)

Todas siguen el mismo patrón:

| Método | Ruta | Notas |
|---|---|---|
| GET | `/projects/{id}/{colección}` | Lista en orden de creación |
| POST | `/projects/{id}/{colección}` | `projectId` sale de la URL; `id` opcional (si falta, se genera `prefijo + 10 hex`) |
| PATCH | `/projects/{id}/{colección}/{itemId}` | Solo los campos enviados |
| DELETE | `/projects/{id}/{colección}/{itemId}` | 204 |

| Colección | Modelo | Prefijo de id | Campos obligatorios al crear | Enumerados |
|---|---|---|---|---|
| `bom` | BomMaterial | `bom` | description, supplier, calcType, quantity, unitPrice, subtotal | calcType: EXACTO, ESTIMADO |
| `labor-stages` | LaborStage | `lb` | name, estimatedHours, hourlyRate, owner, status | PENDIENTE, EN PROCESO, COMPLETADO |
| `procurement` | ProcurementItem | `pc` | materialId, materialDescription, supplier, unitPrice, quantity, status, expectedDate, owner | PENDIENTE, SOLICITADO, ORDENADO, PARCIAL, COMPLETO |
| `reception` | ReceptionItem | `rc` | materialId, materialDescription, supplier, lotRef, requestedQuantity, status, owner | PENDIENTE, CONFORME, INCIDENCIA, RECHAZADO |
| `fabricacion` | ProductionActivity | `fb` | stage, description, owner, status, targetDate | PENDIENTE, EN PROCESO, COMPLETADO, BLOQUEADO |
| `ensamble` | AssemblyUnit | `as` | name, status, owner | ídem |
| `instalacion` | InstallationActivity | `in` | activity, location, owner, status, targetDate | ídem |
| `cableado` | WiringCircuit | `ca` | circuitRef, origin, destination, gauge, quantity, status | PENDIENTE, CONECTADO, EN REVISIÓN, APROBADO |
| `programacion` | ProgrammingEntry | `pg` | controller, programVersion, owner, status, reviewDate | PENDIENTE, EN DESARROLLO, EN REVISIÓN, APROBADO |
| `pruebas` | TestCase | `ts` | protocol, owner, result, date | PENDIENTE, APROBADA, FALLIDA, CON OBSERVACIONES |

Ejemplo:

```bash
curl -X POST http://localhost:8080/api/projects/PRY-2024-089/labor-stages \
  -H 'content-type: application/json' \
  -d '{"name":"Puesta en marcha","estimatedHours":12,"hourlyRate":48000,"owner":"L. Medina","status":"PENDIENTE"}'
# 201 → {"id":"lb3f9a…","projectId":"PRY-2024-089","name":"Puesta en marcha",…}

curl -X PATCH http://localhost:8080/api/projects/PRY-2024-089/procurement/pc3 \
  -H 'content-type: application/json' -d '{"receivedQuantity":6,"status":"COMPLETO"}'
```

## 4.4 Notas y documentos

| Método | Ruta | Notas |
|---|---|---|
| GET / POST | `/projects/{id}/notes` | `{date, content}`; id `n…` |
| PATCH / DELETE | `/notes/{noteId}` | |
| GET / POST | `/projects/{id}/documents` | `{title, kind: markdown\|file, content, fileName?, fileUrl?, mimeType?, updatedAt?}`; id `d…` |
| PATCH / DELETE | `/documents/{docId}` | Si no se envía `updatedAt`, se pone la hora actual (UTC) |

## 4.5 Costos, plantilla y catálogo

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/projects/{id}/cost-inputs` | `{projectId, fixedCosts, variableCosts, indirectCosts, marginPercent}` (en 0 si no hay registro) |
| PUT | `/projects/{id}/cost-inputs` | Crea o reemplaza |
| GET | `/projects/{id}/template` | `ProjectTemplateSnapshot` o `null` |
| GET | `/catalog/materials` | `CatalogMaterial[]` |
| GET | `/catalog/providers` | `CatalogProvider[]` |

## 4.6 Reportes (calculados, solo lectura)

| Ruta | Respuesta |
|---|---|
| `/projects/{id}/reports/costos` | `{materials, labor, fixedCosts, variableCosts, indirectCosts, totalCost, marginPercent, estimatedProfit, finalEstimatedValue, breakdown[], actualCostAvailable}` |
| `/projects/{id}/reports/horas` | `{stages[{name, hours, hourlyRate, cost}], totalHours, totalCost, capacityStatus}` |
| `/projects/{id}/reports/avance` | `{overallProgress, cycles[{cycle, progress}], milestones[{label, done, date}], blockers[]}` |
| `/projects/{id}/reports/indicadores` | `[{id, label, value, source, isDemo}]` ×5 |

Fórmulas en [Manual funcional §7.3](07-manual-funcional.md#73-fórmulas-de-cálculo).

## 4.7 Notificaciones y sistema

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/notifications` | `Notification[]` |
| PATCH | `/notifications/{id}/read` | 204 |
| PATCH | `/notifications/read-all` | 204 |
| GET | `/health` | `{"status": "ok"}` (usado por el healthcheck de Docker) |

## 4.8 Correspondencia con el frontend

| Servicio Angular (`*ApiService`) | Endpoints |
|---|---|
| ProjectApiService | `/projects`, `/projects/{id}`, `/projects/calendar` |
| BomApiService | `/projects/{id}/bom` |
| CatalogApiService | `/catalog/materials`, `/catalog/providers` |
| LaborApiService | `/projects/{id}/labor-stages` |
| ProjectTemplateApiService | `/projects/{id}/template` |
| ProjectCostApiService | `/projects/{id}/cost-inputs` |
| ProcurementApiService | `/projects/{id}/procurement` |
| ReceptionApiService | `/projects/{id}/reception` |
| ProductionApiService | `/projects/{id}/fabricacion`, `/ensamble` |
| InstallationApiService | `/projects/{id}/instalacion`, `/cableado`, `/programacion`, `/pruebas` |
| ReportApiService | `/projects/{id}/reports/*` |
| ProjectNoteApiService | `/projects/{id}/notes`, `/notes/{id}` |
| ProjectDocumentApiService | `/projects/{id}/documents`, `/documents/{id}` |
| NotificationApiService | `/notifications`, `/notifications/{id}/read`, `/notifications/read-all` |
