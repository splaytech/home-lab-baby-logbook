# ==========================
# Stage 1: Build Frontend
# ==========================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ==========================
# Stage 2: Build Backend
# ==========================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./

# ==========================
# Stage 3: Production Image
# ==========================
FROM node:20-alpine

# Install nginx and bash (for startup scripting)
RUN apk add --no-cache nginx bash

# Create non-root user
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

# Prepare directories and fix permissions
RUN mkdir -p \
      /app/backend \
      /app/frontend/dist \
      /data \
      /backups \
      /config \
      /var/log/nginx \
      /run/nginx \
      /var/lib/nginx/tmp/client_body \
      /var/lib/nginx/tmp/proxy \
      /var/lib/nginx/tmp/fastcgi \
      /var/lib/nginx/tmp/uwsgi \
      /var/lib/nginx/tmp/scgi \
  && chown -R appuser:appuser /app /data /backups /config /var/log/nginx /run/nginx /var/lib/nginx

WORKDIR /app

# Copy backend + frontend from builders
COPY --from=backend-builder --chown=appuser:appuser /app/backend ./backend
COPY --from=frontend-builder --chown=appuser:appuser /app/frontend/dist ./frontend/dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Install backend production dependencies + sequelize-cli globally
WORKDIR /app/backend
RUN npm ci --omit=dev && npm install -g sequelize-cli

# Add startup script
WORKDIR /app
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "[INIT] Starting nginx..."' >> /app/start.sh && \
    echo 'nginx' >> /app/start.sh && \
    echo 'echo "[INIT] Ensuring /data is writable..."' >> /app/start.sh && \
    echo 'mkdir -p /data && chown -R appuser:appuser /data' >> /app/start.sh && \
    echo 'cd /app/backend' >> /app/start.sh && \
    echo 'echo "[DB] Running Sequelize migrations..."' >> /app/start.sh && \
    echo 'npx sequelize-cli db:migrate || echo "No migrations found or already applied."' >> /app/start.sh && \
    echo 'echo "[DB] Running Sequelize seeders..."' >> /app/start.sh && \
    echo 'npx sequelize-cli db:seed:all || echo "No seeders found or already applied."' >> /app/start.sh && \
    echo 'echo "[APP] Starting backend server..."' >> /app/start.sh && \
    echo 'exec node src/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Switch to non-root user
USER appuser

# Expose app port (nginx reverse proxy likely on 3000)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode===200?0:1))"

# Start everything
CMD ["/app/start.sh"]
