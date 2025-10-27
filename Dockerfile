# Multi-stage build for Baby Logbook
# Based on Node.js 20 Alpine for minimal image size

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install ALL frontend dependencies (needed for build)
RUN npm ci

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
# Use alternative GID/UID if 1000 is already taken
RUN (addgroup -g 1000 appuser 2>/dev/null || addgroup appuser) && \
    (adduser -D -u 1000 -G appuser appuser 2>/dev/null || adduser -D -G appuser appuser)

# Create necessary directories with proper permissions for nginx
RUN mkdir -p /app/backend /app/frontend/dist /data /backups /config \
    /var/log/nginx /run/nginx /var/lib/nginx /var/lib/nginx/tmp \
    /var/lib/nginx/tmp/client_body /var/lib/nginx/tmp/proxy \
    /var/lib/nginx/tmp/fastcgi /var/lib/nginx/tmp/uwsgi \
    /var/lib/nginx/tmp/scgi && \
    chown -R appuser:appuser /app /data /backups /config \
    /var/log/nginx /run/nginx /var/lib/nginx

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
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

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
