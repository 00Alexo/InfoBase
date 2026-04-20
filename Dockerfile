# ===== FRONTEND BUILD =====
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend .
RUN npm run build

# ===== BACKEND BUILD =====
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# ===== FINAL IMAGE =====
FROM node:18-alpine

RUN apk add --no-cache supervisor

# Create frontend folder manually
RUN mkdir -p /frontend

# Backend
WORKDIR /backend
COPY --from=backend-build /app/backend .

# Frontend
WORKDIR /frontend
COPY --from=frontend-build /app/frontend/build .

# Install serve
RUN npm install -g serve

# Supervisor config
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 3000
EXPOSE 4000

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
