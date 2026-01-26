# Multi-stage Dockerfile for Medusa v2 Backend
# Supports both development and production builds

# ============================================
# Base stage - common dependencies
# ============================================
FROM node:20-alpine AS base

WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# ============================================
# Dependencies stage - install node modules
# ============================================
FROM base AS deps

COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
# Use npm install instead of npm ci since lock file may be out of sync
RUN npm install

# ============================================
# Development stage - for local development
# ============================================
FROM base AS development

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose Medusa port
EXPOSE 9000

# Development command - uses hot reload
CMD ["npm", "run", "dev"]

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
# Production dependencies stage
# ============================================
FROM base AS production-deps

COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev

# ============================================
# Production stage - minimal image
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 medusa && \
    adduser --system --uid 1001 --ingroup medusa medusa

# Copy production node_modules
COPY --from=production-deps /app/node_modules ./node_modules

# Copy built application from builder
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy source files needed at runtime
COPY --from=builder /app/src ./src

# Set ownership to medusa user
RUN chown -R medusa:medusa /app

# Switch to non-root user
USER medusa

# Expose Medusa port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:9000/health || exit 1

# Production command
CMD ["node", ".medusa/server/index.js"]
