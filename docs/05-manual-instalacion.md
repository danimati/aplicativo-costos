# 5. Manual de instalación

[← Índice](README.md)

Hay dos formas de instalarlo:

| Modalidad | Para qué | Requisitos |
|---|---|---|
| **A. Docker (recomendada)** | Despliegue en un servidor o demostración completa | Docker 24+ con Compose v2, GNU Make, Git |
| **B. Desarrollo local** | Modificar el código | Python 3.12+, Node.js 22 (npm 10+), GNU Make, Git |

## 5.1 Obtener el código

```bash
git clone https://bitbucket.org/<workspace>/aplicativo-costos-front.git
cd aplicativo-costos-front
```

---

## 5.2 Modalidad A — Docker

### Paso 1. Configurar variables

```bash
cd despliegue
make env            # crea .env a partir de .env.example
```

Edita `despliegue/.env`:

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `POSTGRES_USER` | `costos` | Usuario de la base |
| `POSTGRES_PASSWORD` | `cambiar-esta-clave` | **Cámbiala antes de un despliegue real** |
| `POSTGRES_DB` | `costos` | Nombre de la base |
| `HTTP_PORT` | `8080` | Puerto público de Nginx |
| `WEB_CONCURRENCY` | `2` | Workers de uvicorn |
| `CORS_ORIGINS` | `http://localhost:8080` | Orígenes permitidos para llamadas directas al API |

### Paso 2. Construir y levantar

```bash
make up
```

El comando:

1. construye `costos-backend` (Python 3.13) y `costos-frontend` (compila Angular y lo copia a Nginx);
2. inicia **db** y espera a que `pg_isready` responda;
3. inicia **backend**, que crea las tablas, carga los datos de ejemplo si la base está vacía y espera a que `/api/health` responda;
4. inicia **frontend** (Nginx).

La primera construcción tarda unos minutos (descarga de imágenes y `npm ci`).

### Paso 3. Verificar

```bash
make ps                                   # los tres servicios «healthy»
curl http://localhost:8080/api/health     # {"status":"ok"}
```

- Aplicación: <http://localhost:8080>
- API interactiva: <http://localhost:8080/docs>

### Operación diaria

| Comando | Acción |
|---|---|
| `make logs` / `make logs s=backend` | Ver logs en vivo |
| `make restart` | Reiniciar servicios |
| `make down` | Detener (los datos se conservan en el volumen `pgdata`) |
| `make up` | Volver a levantar; reconstruye si cambió el código |
| `make psql` | Consola SQL |
| `make backup` | Respaldo en `despliegue/backups/AAAAMMDD-HHMMSS.sql` |
| `make restore f=backups/archivo.sql` | Restaurar un respaldo |
| `make reset-db` | Borrar los datos y volver a cargar los de ejemplo |
| `make clean` | Eliminar contenedores, imágenes y **la base** (pide confirmación) |
| `make docs` | Regenerar los diagramas de esta documentación |

### Actualizar a una nueva versión

```bash
git pull
cd despliegue
make backup
make up
```

### Puesta en producción

- Cambia `POSTGRES_PASSWORD` y `CORS_ORIGINS` (dominio real).
- Pon HTTPS: un proxy TLS delante (Caddy, Traefik, balanceador) o un bloque `listen 443 ssl` en `despliegue/nginx/default.conf`, y luego `make up`.
- Programa `make backup` con `cron` y copia los respaldos fuera del servidor.
- Implementa la autenticación real (hoy está simulada).

---

## 5.3 Modalidad B — Desarrollo local

### Paso 1. Dependencias

```bash
cd despliegue
make dev-install     # crea backend/.venv con pip install y ejecuta npm ci en la raíz
```

### Paso 2. Levantar (dos terminales)

```bash
make dev-back        # API en http://localhost:8000 (SQLite backend/costos.db, recarga automática)
make dev-front       # Front en http://localhost:4200 (proxy /api → :8000)
```

Sin backend: `make dev-front-mock` usa los servicios mock con datos en memoria.

### Paso 3. Pruebas

```bash
make test                         # pytest del backend
cd .. && npx ng test              # pruebas del frontend (Vitest)
```

### Equivalencias sin Make

```bash
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8000
# otra terminal, en la raíz:
npm ci && npm start
```

### Usar PostgreSQL en local

```bash
DATABASE_URL=postgresql+psycopg://usuario:clave@localhost:5432/costos make dev-back
```

---

## 5.4 Solución de problemas

| Síntoma | Causa | Solución |
|---|---|---|
| El build falla en «Inlining of fonts failed» | La compilación intenta descargar Google Fonts sin acceso a internet | Ya está desactivado (`optimization.fonts: false` en `angular.json`); verifica que tienes la última versión. |
| Nginx: `open() default.conf failed (13: Permission denied)` | SELinux bloquea montajes del host | La configuración va dentro de la imagen; no la montes como volumen (o usa `:z`). |
| La interfaz carga pero sin datos; errores 504/502 en `/api` | El backend no está arriba o no está sano | `make ps`, `make logs s=backend`. En desarrollo, revisa que `make dev-back` esté corriendo. |
| En `ng serve`, `/api` devuelve 404 HTML | Falta el proxy | Usa `npm start` (ya incluye `proxyConfig`), no `ng serve` con otra configuración. |
| `Address already in use :8080` | Puerto ocupado | Cambia `HTTP_PORT` en `.env`. |
| Datos de ejemplo «perdidos» o desordenados | Pruebas manuales | `make reset-db` (Docker) o borrar `backend/costos.db` (local). |
| Ver el frontend con datos mock en Docker | — | No está previsto; usa `make dev-front-mock` en local. |
