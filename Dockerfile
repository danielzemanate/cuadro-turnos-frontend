# 1) Build: compila la app
FROM node:22-alpine AS builder
WORKDIR /app

# Instala dependencias solo cuando cambien los manifests
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Usamos caché de npm para acelerar builds
RUN --mount=type=cache,target=/root/.npm \
  if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm ci; \
  fi \
  # 👇 Fix Rollup en Alpine (musl)
  && npm i -D @rollup/rollup-linux-x64-musl

# Copia el resto del código y construye
COPY . .
# Si usas variables de entorno en build: VITE_API_URL, etc.
# Ejemplo: RUN VITE_API_URL=https://api.midominio.com npm run build
COPY .env.production ./
RUN npm run build

# 2) Runtime: sirve con Nginx
FROM nginx:stable-alpine
# Config SPA: soporta rutas de React (react-router)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copia artefactos del build
COPY --from=builder /app/dist /usr/share/nginx/html

# (Opcional) Salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
