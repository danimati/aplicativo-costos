# Costos Industrial — API (FastAPI)

Backend del frontend Angular (raíz de este repo). Implementa los endpoints que ya
consumen los servicios `src/app/core/services/api/*.ts`, con SQLite y los mismos datos
de ejemplo que los mocks.

## Arranque

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
```

- Documentación interactiva: http://localhost:8000/docs
- La base `costos.db` se crea y siembra sola al primer arranque.
  Reiniciar datos: `.venv/bin/python -m app.seed --reset`
- Tests: `.venv/bin/python -m pytest`

Con el backend corriendo, desde la raíz del repo: `npm start` (el proxy `proxy.conf.json` manda `/api` a `:8000`).
Para trabajar sin backend: `npx ng serve --configuration mock`.

## Endpoints (prefijo `/api`)

| Recurso | Rutas |
|---|---|
| Proyectos | `GET/POST /projects`, `GET/PATCH/DELETE /projects/{id}`, `GET /projects/calendar` |
| Colecciones por proyecto: `bom`, `labor-stages`, `procurement`, `reception`, `fabricacion`, `ensamble`, `instalacion`, `cableado`, `programacion`, `pruebas` | `GET/POST /projects/{id}/{col}`, `PATCH/DELETE /projects/{id}/{col}/{itemId}` |
| Notas | `GET/POST /projects/{id}/notes`, `PATCH/DELETE /notes/{noteId}` |
| Documentos | `GET/POST /projects/{id}/documents`, `PATCH/DELETE /documents/{docId}` |
| Costos | `GET/PUT /projects/{id}/cost-inputs` |
| Plantilla | `GET /projects/{id}/template` (devuelve `null` si no hay) |
| Reportes (calculados) | `GET /projects/{id}/reports/{avance,costos,horas,indicadores}` |
| Catálogo | `GET /catalog/materials`, `GET /catalog/providers` |
| Notificaciones | `GET /notifications`, `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all` |

JSON en camelCase, igual que las interfaces de `src/app/core/models`. Para usar otra base:
`DATABASE_URL=postgresql+psycopg://...` (instalar el driver).

## Estructura

```
app/
  main.py      app FastAPI, CORS, arranque
  db.py        engine / sesión
  models.py    tablas SQLAlchemy
  schemas.py   esquemas Pydantic (espejo de los modelos TS)
  crud.py      fábrica de rutas CRUD por proyecto
  reports.py   lógica de reportes (port de report-mock.service.ts)
  seed.py      datos iniciales
  routers/api.py
```
