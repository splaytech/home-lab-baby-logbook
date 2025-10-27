# Multi-stage build for Baby Logbook
# Based on Node.js 20 Alpine for minimal image size

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies (including dev dependencies for build)
RUN npm ci

# Copy backend source
COPY backend/ ./

# Stage 3: Production Image
FROM node:20-alpine

# Install nginx for serving frontend and reverse proxy
RUN apk add --no-cache nginx

# Create app user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Create necessary directories
RUN mkdir -p /app/backend /app/frontend/dist /data /backups /config /var/log/nginx /run/nginx && \
    chown -R appuser:appuser /app /data /backups /config /var/log/nginx /run/nginx

WORKDIR /app

# Copy backend from builder
COPY --from=backend-builder --chown=appuser:appuser /app/backend ./backend

# Copy built frontend from builder
COPY --from=frontend-builder --chown=appuser:appuser /app/frontend/dist ./frontend/dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Install production dependencies only for backend
WORKDIR /app/backend
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'nginx' >> /app/start.sh && \
    echo 'cd /app/backend' >> /app/start.sh && \
    echo 'exec node src/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh && \
    chown appuser:appuser /app/start.sh

# Switch to non-root user
USER appuser

# Start both nginx and node
CMD ["/app/start.sh"]
