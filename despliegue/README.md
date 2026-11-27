# Despliegue — Costos Industrial

Orquesta el front (raíz del repo) y el API (`backend/`) con Docker Compose:

```
navegador ──► :8080  frontend (Nginx)  ──/api, /docs──►  backend (FastAPI :8000) ──► db (PostgreSQL 17)
                     └─ build de Angular (SPA)
```

| Servicio | Imagen | Expuesto |
|---|---|---|
| `frontend` | `costos-frontend` — build Angular multi-etapa + Nginx | `HTTP_PORT` (8080) |
| `backend` | `costos-backend` — Python 3.13 + uvicorn | sólo red interna |
| `db` | `postgres:17-alpine`, volumen `pgdata` | sólo red interna |

Estructura del repo:

```
aplicativo-costos-front/
├── src/ …                 front Angular
├── backend/               API FastAPI
└── despliegue/            ← aquí
    ├── Makefile
    ├── docker-compose.yml
    ├── .env.example
    ├── backend/Dockerfile (+ .dockerignore)
    ├── frontend/Dockerfile (+ .dockerignore)
    └── nginx/default.conf
```

## Uso

```bash
make up        # crea .env si falta, construye y levanta → http://localhost:8080
make logs      # make logs s=backend
make down      # detiene (los datos quedan en el volumen)
make help      # todos los comandos
```

Antes de un despliegue real, cambiar `POSTGRES_PASSWORD` en `.env`.

| Comando | Qué hace |
|---|---|
| `make psql` | consola de la base |
| `make reset-db` | borra y vuelve a sembrar los datos de ejemplo |
| `make backup` / `make restore f=backups/x.sql` | respaldo y restauración con `pg_dump` |
| `make clean` | elimina contenedores, imágenes y **la base** (pide confirmación) |
| `make dev-install`, `dev-back`, `dev-front`, `dev-front-mock`, `test` | desarrollo local sin Docker |

## Notas

- El backend crea tablas y siembra datos al arrancar, solo si la base está vacía.
- `nginx/default.conf` se copia dentro de la imagen (contexto adicional de build), así no
  depende de montajes del host (evita problemas de SELinux). Si se edita: `make up`.
- Nginx: fallback de rutas a `index.html`, gzip, caché de un año para assets con hash,
  `no-cache` para `index.html`, y proxy de `/api`, `/docs`, `/openapi.json` al backend.
- HTTPS: poner un proxy/terminador TLS delante (Caddy, Traefik, balanceador del proveedor)
  o añadir un bloque `listen 443 ssl` con los certificados.
