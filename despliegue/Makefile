# Despliegue de Costos Industrial (PostgreSQL + FastAPI + Angular/Nginx)
# Uso: `make help`

SHELL      := /bin/bash
COMPOSE    := docker compose --env-file .env -f docker-compose.yml
BACK_DIR   := ../backend
FRONT_DIR  := ..
BACKUP_DIR := backups

-include .env
export

.DEFAULT_GOAL := help
.PHONY: help env build up down restart logs ps psql reset-db backup restore clean \
        test dev-install dev-back dev-front dev-front-mock docs docs-pdf

help: ## Muestra esta ayuda
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
	  awk 'BEGIN{FS=":.*?## "} {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

# ── Contenedores ────────────────────────────────────────────
env: ## Crea .env a partir de .env.example (si no existe)
	@test -f .env || (cp .env.example .env && echo ".env creado: revisa POSTGRES_PASSWORD")

build: env ## Construye las imágenes de backend y frontend
	$(COMPOSE) build

up: env ## Levanta todo en segundo plano (construye si hace falta)
	$(COMPOSE) up -d --build
	@echo "App:  http://localhost:$${HTTP_PORT:-8080}"
	@echo "Docs: http://localhost:$${HTTP_PORT:-8080}/docs"

down: ## Detiene y elimina los contenedores (conserva los datos)
	$(COMPOSE) down

restart: ## Reinicia los servicios
	$(COMPOSE) restart

logs: ## Sigue los logs (make logs s=backend para uno solo)
	$(COMPOSE) logs -f --tail=100 $(s)

ps: ## Estado de los servicios
	$(COMPOSE) ps

# ── Base de datos ───────────────────────────────────────────
psql: ## Consola psql dentro del contenedor de la base
	$(COMPOSE) exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

reset-db: ## Borra y vuelve a sembrar los datos de ejemplo
	$(COMPOSE) exec backend python -m app.seed --reset

backup: ## Respaldo de la base en backups/AAAAMMDD-HHMMSS.sql
	@mkdir -p $(BACKUP_DIR)
	$(COMPOSE) exec -T db pg_dump -U $(POSTGRES_USER) -d $(POSTGRES_DB) --clean --if-exists \
	  > $(BACKUP_DIR)/$$(date +%Y%m%d-%H%M%S).sql
	@ls -1t $(BACKUP_DIR) | head -1

restore: ## Restaura un respaldo: make restore f=backups/archivo.sql
	@test -n "$(f)" || (echo "Uso: make restore f=backups/archivo.sql" && exit 1)
	$(COMPOSE) exec -T db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) < $(f)

clean: ## Elimina contenedores, imágenes locales y el volumen de datos (¡borra la base!)
	@read -p "Esto borra la base de datos. ¿Continuar? [s/N] " r && [ "$$r" = "s" ]
	$(COMPOSE) down -v --rmi local

# ── Desarrollo local (sin Docker) ───────────────────────────
dev-install: ## Instala dependencias de backend (.venv) y frontend (node_modules)
	cd $(BACK_DIR) && (test -d .venv || python3 -m venv .venv) && .venv/bin/pip install -r requirements.txt
	cd $(FRONT_DIR) && npm ci

dev-back: ## API en http://localhost:8000 con recarga (SQLite)
	cd $(BACK_DIR) && .venv/bin/uvicorn app.main:app --reload --port 8000

dev-front: ## Front en http://localhost:4200 contra el API local
	cd $(FRONT_DIR) && npm start

dev-front-mock: ## Front con datos mock, sin backend
	cd $(FRONT_DIR) && npx ng serve --configuration mock

test: ## Corre los tests del backend
	cd $(BACK_DIR) && .venv/bin/python -m pytest -q

# ── Documentación ───────────────────────────────────────────
docs: ## Regenera los diagramas SVG de docs/ (PlantUML en Docker)
	../docs/diagramas/generar.sh

docs-pdf: ## Compila la documentación a PDF en docs/pdf/ (Docker + python3 markdown/websockets + pdfunite)
	python3 ../docs/exportar/generar_pdf.py
