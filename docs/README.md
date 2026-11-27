# Documentación — Costos Industrial

Aplicativo web del **módulo de Costos** para proyectos de automatización industrial.
Frontend Angular 21 · API FastAPI · PostgreSQL · Docker / Nginx.

| # | Documento | Contenido |
|---|---|---|
| 1 | [Visión general](01-vision-general.md) | Propósito, alcance, usuarios, tecnologías, estructura del repositorio, glosario |
| 2 | [Casos de uso](02-casos-de-uso.md) | Diagrama de casos de uso, actores, 19 especificaciones con su **diagrama de secuencia** |
| 3 | [Arquitectura y diseño](03-arquitectura-y-diseno.md) | Diagramas de **componentes**, **despliegue**, **clases** (front y back), **modelo de datos**, estados y rutas |
| 4 | [Referencia del API](04-referencia-api.md) | Endpoints, cuerpos, códigos de respuesta, ejemplos |
| 5 | [Manual de instalación](05-manual-instalacion.md) | Docker (producción) y desarrollo local, operación, respaldos, solución de problemas |
| 6 | [Manual de usuario](06-manual-usuario.md) | Uso de cada pantalla, con capturas |
| 7 | [Manual de funcionalidad](07-manual-funcional.md) | Módulos, reglas de negocio, fórmulas de cálculo, estados, limitaciones |
| 8 | [Matriz de trazabilidad](08-trazabilidad.md) | RE-001…RE-040 → casos de uso → componentes → estado |

## Versión PDF

| PDF | Contenido |
|---|---|
| [Documentacion-Costos-Industrial.pdf](pdf/Documentacion-Costos-Industrial.pdf) | **Todo en un solo archivo**: portada, índice con enlaces y los 8 documentos |
| [01-vision-general.pdf](pdf/01-vision-general.pdf) · [02-casos-de-uso.pdf](pdf/02-casos-de-uso.pdf) · [03-arquitectura-y-diseno.pdf](pdf/03-arquitectura-y-diseno.pdf) · [04-referencia-api.pdf](pdf/04-referencia-api.pdf) | Documentos 1 a 4 por separado |
| [05-manual-instalacion.pdf](pdf/05-manual-instalacion.pdf) · [06-manual-usuario.pdf](pdf/06-manual-usuario.pdf) · [07-manual-funcional.pdf](pdf/07-manual-funcional.pdf) · [08-trazabilidad.pdf](pdf/08-trazabilidad.pdf) | Documentos 5 a 8 por separado |

Para recompilarlos tras editar un `.md`: `cd despliegue && make docs-pdf` (requiere Docker, `python3` con `markdown` y `websockets`, y `pdfunite`).

## Inicio rápido

```bash
cd despliegue && make up      # → http://localhost:8080 (API en /docs)
```

## Diagramas

Las fuentes están en [`diagramas/src/`](diagramas/src) (PlantUML) y los SVG generados en [`diagramas/`](diagramas).
Para regenerarlos después de editar un `.puml` (requiere Docker):

```bash
cd despliegue && make docs
```

| Diagrama | Archivo |
|---|---|
| Casos de uso | [casos-de-uso.svg](diagramas/casos-de-uso.svg) |
| Secuencia por caso de uso (CU-01 … CU-19) | `diagramas/seq-cuNN.svg` |
| Componentes | [componentes.svg](diagramas/componentes.svg) |
| Despliegue | [despliegue.svg](diagramas/despliegue.svg) |
| Clases — modelos del frontend | [clases-front-modelos.svg](diagramas/clases-front-modelos.svg) |
| Clases — servicios del frontend | [clases-front-servicios.svg](diagramas/clases-front-servicios.svg) |
| Clases — backend | [clases-backend.svg](diagramas/clases-backend.svg) |
| Modelo de datos | [modelo-datos.svg](diagramas/modelo-datos.svg) |
| Estados | [estados.svg](diagramas/estados.svg) |

Las capturas de pantalla ([`capturas/`](capturas)) se tomaron con Chrome headless sobre el despliegue en Docker con los datos de ejemplo.
