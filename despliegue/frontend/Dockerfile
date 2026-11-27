# Imagen del frontend Angular servido por Nginx.
# Contexto de build: raíz del repo (ver docker-compose.yml)

# ── 1. Build ────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# Configuración "production": environment.ts con useMock=false y apiUrl=/api
RUN npx ng build --configuration production

# ── 2. Runtime ──────────────────────────────────────────────
FROM nginx:1.27-alpine
# despliegue/nginx/default.conf llega como contexto adicional "nginx" (docker-compose.yml).
COPY --from=nginx default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/costos-industrial/browser /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
