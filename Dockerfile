# 1) Build: compila la app
FROM node:22-alpine AS builder
WORKDIR /app

# Evita que husky intente instalar hooks sin .git en la imagen
ENV HUSKY=0

# Instala dependencias solo cuando cambien los manifests
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Usamos cache de npm para acelerar builds.
# Rollup en Alpine (musl) necesita el binario nativo segun la CPU del build
# (x64 en servidores/CI; arm64 en Mac Apple Silicon con Docker Desktop).
ARG TARGETARCH
RUN --mount=type=cache,target=/root/.npm \
  if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm ci; \
  fi \
  && case "$TARGETARCH" in \
       arm64) npm i -D @rollup/rollup-linux-arm64-musl ;; \
       amd64|"") npm i -D @rollup/rollup-linux-x64-musl ;; \
       *) echo "Arquitectura no soportada para Rollup Alpine: $TARGETARCH" >&2; exit 1 ;; \
     esac

# Copia el resto del codigo y construye
COPY . .
# Vite embebe VITE_* en build-time desde .env.production
COPY .env.production ./
RUN npm run build

# 2) Runtime: sirve con Nginx
FROM nginx:stable-alpine
# Config SPA: soporta rutas de React (react-router)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copia artefactos del build
COPY --from=builder /app/dist /usr/share/nginx/html

# Salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
