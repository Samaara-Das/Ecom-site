# Multi-stage Dockerfile for Medusa v2 Backend

# ============================================
# Base stage - common dependencies
# ============================================
FROM node:20-slim AS base

WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Dependencies stage - single npm ci install
# ============================================
FROM base AS deps

COPY package.json package-lock.json* ./

# Use npm ci (faster than npm install, uses lock file exactly)
RUN npm ci

# ============================================
# Build stage - compile TypeScript and build Medusa
# ============================================
FROM base AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build Medusa application
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:20-slim AS production

WORKDIR /app

# Install curl for health check and create non-root user
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1001 medusa \
    && useradd --system --uid 1001 --gid medusa medusa

# Copy node_modules from deps stage (reuse — avoids a second npm install)
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy source files needed at runtime
COPY --from=builder /app/src ./src

# Copy startup script (runs migrations then starts server)
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x start.sh

# Set ownership to medusa user
RUN chown -R medusa:medusa /app

# Switch to non-root user
USER medusa

# Expose Medusa port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

# Production command: run migrations then start server
CMD ["./start.sh"]
