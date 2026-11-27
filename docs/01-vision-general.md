# 1. Visión general

[← Índice](README.md)

## 1.1 Propósito

**Costos Industrial** es el aplicativo web del **módulo de Costos** para proyectos de automatización industrial (tableros de control, celdas, retrofits). Permite estimar y analizar el costo de cada proyecto a partir de:

- **materiales y componentes** (BOM), con cantidades exactas o estimadas;
- **mano de obra** por etapas (horas × valor hora);
- **costos fijos asignados, variables e indirectos**;
- un **margen de ganancia**, para llegar al **valor final estimado**.

Además, centraliza el expediente de cada proyecto, organizado en ciclos: ingeniería y estimación, taller y producción, instalación y puesta en marcha, reportes y configuración.

## 1.2 Usuarios objetivo

Según RE-040, el aplicativo apoya principalmente a las áreas **financiera** y de **planeación**. Los actores y sus casos de uso se detallan en [Casos de uso](02-casos-de-uso.md#22-actores).

## 1.3 Alcance de la versión actual (MVP)

| Incluido | Pendiente / fuera de alcance |
|---|---|
| Portafolio de proyectos y calendario de hitos | Autenticación real y control de permisos (hoy simulado) |
| Expediente por ciclos con 16 hojas funcionales | Formularios de alta y edición en la interfaz para BOM, mano de obra, compras, etc. (hoy por API) |
| Notas y documentos Markdown persistentes | Subida real de archivos binarios |
| Consulta de BOM, mano de obra, plantilla, compras, recepción, fabricación, ensamble, instalación, cableado, programación y pruebas | RE-006 Tipificación de consumos aproximados |
| Reportes calculados en servidor: costos, horas, avance, indicadores | RE-027 / RE-038 Comparación entre lo estimado y lo real; RE-028 Calibración |
| API REST completa (lectura y CRUD) documentada con OpenAPI | Exportar e imprimir reportes |
| Despliegue en contenedores (Nginx + FastAPI + PostgreSQL) | Hojas de CONFIGURACIÓN (datos, usuarios, permisos) |

Retirados del levantamiento: RE-016, RE-017, RE-018, RE-022 y RE-023.

## 1.4 Arquitectura en una mirada

```
Navegador ──► Nginx (:8080) ──┬── /          → SPA Angular 21
                              └── /api, /docs → FastAPI (Python 3.13) ──► PostgreSQL 17
```

- **Frontend**: Angular 21 con componentes standalone, signals y control de flujo `@if/@for`. Cada dominio tiene un servicio abstracto con dos implementaciones: `*ApiService` (HTTP) y `*MockService` (datos en memoria). `environment.useMock` decide cuál se usa.
- **Backend**: FastAPI + SQLAlchemy 2 + Pydantic 2. JSON en camelCase que replica exactamente las interfaces TypeScript. Los reportes se calculan en el servidor.
- **Datos**: SQLite en desarrollo y PostgreSQL en contenedor para despliegue. Al primer arranque se cargan los datos de ejemplo de los mocks.

Detalle en [Arquitectura y diseño](03-arquitectura-y-diseno.md).

## 1.5 Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| UI | Angular, RxJS, TypeScript | 21.2, 7.8, 5.9 |
| Markdown | markdown-it + DOMPurify | 15, 3 |
| API | FastAPI, Uvicorn, Pydantic | 0.165, 0.54, 2.14 |
| ORM | SQLAlchemy | 2.1 |
| Base de datos | SQLite / PostgreSQL (psycopg 3) | — / 17 |
| Servidor web | Nginx | 1.27 |
| Contenedores | Docker, Docker Compose | 29 / v2+ |
| Pruebas | pytest (backend), Vitest (frontend) | 9.2 / 4 |
| Diagramas | PlantUML | 1.2025.4 |

## 1.6 Estructura del repositorio

```
aplicativo-costos-front/
├── src/                     Frontend Angular
│   ├── app/core/models/     Interfaces del dominio
│   ├── app/core/services/   Contratos, *ApiService, *MockService, estado de UI
│   ├── app/core/features/   Login, shell, portafolio, expediente y páginas por ciclo
│   ├── app/data/            Plantilla de navegación (ciclos y hojas)
│   └── environments/        environment.ts (API), environment.mock.ts (mock)
├── backend/                 API FastAPI (app/, tests/)
├── despliegue/              Docker Compose, Dockerfiles, Nginx y Makefile
├── docs/                    Esta documentación (+ diagramas PlantUML)
└── proxy.conf.json          Proxy /api → :8000 para ng serve
```

## 1.7 Glosario

| Término | Significado |
|---|---|
| **Expediente** | Un proyecto con toda su información, organizada en hojas. |
| **Ciclo** | Agrupación de hojas: I Ingeniería y estimación, II Taller y producción, III Instalación y puesta en marcha, Reportes, Configuración. |
| **Hoja (folio)** | Página del expediente, numerada de 01 a 19. |
| **BOM** | *Bill of Materials*: lista de materiales del tablero. |
| **Cálculo EXACTO / ESTIMADO** | Cantidad determinable con certeza (p. ej., 2 interruptores) o aproximada (p. ej., 180 m de cable). |
| **Plantilla base** | Configuración estándar de tablero de la que parte un proyecto (RE-002). |
| **Costos fijos asignados** | Porción de los costos recurrentes de la empresa (arriendo, licencias) que se carga al proyecto. |
| **Margen** | Porcentaje de ganancia sobre el costo total. |
| **Valor final estimado** | Costo total + ganancia. |
| **Mock** | Implementación de servicio con datos en memoria, para trabajar sin backend. |
