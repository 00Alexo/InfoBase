# ===== FRONTEND BUILD =====
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend .
ENV REACT_APP_API=http://localhost:4001/api
ENV REACT_APP_API_SOCKET=http://localhost:4001
RUN npm run build

# ===== BACKEND BUILD =====
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# ===== FINAL IMAGE =====
FROM node:20-alpine

RUN apk add --no-cache \
		supervisor \
		gcc \
		g++ \
		python3 \
		py3-pip \
		openjdk21-jdk

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

EXPOSE 3001
EXPOSE 4001

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
