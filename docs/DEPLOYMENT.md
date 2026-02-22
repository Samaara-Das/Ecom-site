# Kuwait Marketplace - Deployment Guide

This document provides comprehensive deployment instructions for the Kuwait Marketplace e-commerce platform built on Medusa v2.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Docker Configuration](#docker-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Production Checklist](#production-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20+ | Runtime for Medusa backend and Next.js storefront |
| npm | 9+ | Package management |
| Docker | 24+ | Containerization |
| Docker Compose | 2.20+ | Multi-container orchestration |
| PostgreSQL | 15+ | Primary database |
| Redis | 7+ | Caching and event bus |
| Git | 2.40+ | Version control |

### Hardware Requirements

#### Development

- CPU: 2+ cores
- RAM: 8GB minimum
- Storage: 20GB free space

#### Staging

- CPU: 4 cores
- RAM: 8GB
- Storage: 50GB SSD

#### Production

- CPU: 8+ cores
- RAM: 16GB minimum (32GB recommended)
- Storage: 100GB+ SSD with automatic backups
- Network: Low latency connection between services

---

## Environment Setup

### Development Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "Ecom Site for Bharat"
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   cp .env.example .env
   npm install
   ```

3. **Install storefront dependencies**

   ```bash
   cd ../storefront
   cp .env.template .env.local
   npm install
   ```

4. **Start development with Docker Compose**

   ```bash
   # From project root
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

5. **Run database migrations**

   ```bash
   cd backend
   npm run db:migrate
   ```

6. **Seed initial data**

   ```bash
   npm run seed:products
   npm run seed:shipping
   npm run seed:inventory
   ```

7. **Start the storefront**

   ```bash
   cd ../storefront
   npm run dev
   ```

8. **Access the applications**

   | Application | URL |
   |-------------|-----|
   | Storefront | http://localhost:8000 |
   | Admin Dashboard | http://localhost:9000/app |
   | Backend API | http://localhost:9000 |
   | pgAdmin | http://localhost:5050 |
   | Redis Commander | http://localhost:8081 |

### Staging Environment

Staging should mirror production as closely as possible:

1. **Use production Docker configuration**

   ```bash
   docker-compose up -d
   ```

2. **Configure staging-specific environment variables**

   ```bash
   # .env for staging
   NODE_ENV=staging
   STORE_CORS=https://staging.yourdomain.com
   ADMIN_CORS=https://admin-staging.yourdomain.com
   ```

3. **Use separate database credentials**

   - Create dedicated PostgreSQL user for staging
   - Use different JWT and cookie secrets from development

### Production Environment

1. **Infrastructure setup**

   - Provision dedicated servers or cloud instances
   - Set up load balancer (nginx, AWS ALB, etc.)
   - Configure SSL/TLS certificates
   - Set up database replication for high availability

2. **Deploy with production configuration**

   ```bash
   # Set environment to production
   export NODE_ENV=production

   # Build and start containers
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Verify deployment**

   ```bash
   # Check container health
   docker-compose ps

   # Verify API health
   curl https://api.yourdomain.com/health
   ```

---

## Docker Configuration

### docker-compose.yml Structure

The production Docker Compose configuration includes three services:

```yaml
services:
  medusa:        # Medusa backend API
  db:            # PostgreSQL 15 database
  redis:         # Redis 7 cache and event bus

networks:
  medusa-network:  # Bridge network for inter-service communication

volumes:
  postgres-data:   # Persistent PostgreSQL data
  redis-data:      # Persistent Redis data
  medusa-uploads:  # User-uploaded files
```

### Service Definitions

#### Medusa Backend

```yaml
medusa:
  build:
    context: ./backend
    dockerfile: Dockerfile
    target: production
  container_name: medusa-backend
  restart: unless-stopped
  ports:
    - "9000:9000"
  depends_on:
    db:
      condition: service_healthy
    redis:
      condition: service_healthy
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 60s
```

#### PostgreSQL Database

```yaml
db:
  image: postgres:15-alpine
  container_name: medusa-db
  restart: unless-stopped
  environment:
    - POSTGRES_USER=medusa
    - POSTGRES_PASSWORD=medusa_password
    - POSTGRES_DB=medusa
  volumes:
    - postgres-data:/var/lib/postgresql/data
    - ./docker/postgres/init:/docker-entrypoint-initdb.d:ro
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U medusa -d medusa"]
    interval: 10s
    timeout: 5s
    retries: 5
```

#### Redis Cache

```yaml
redis:
  image: redis:7-alpine
  container_name: medusa-redis
  restart: unless-stopped
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### Volume Management

| Volume | Purpose | Backup Strategy |
|--------|---------|-----------------|
| `postgres-data` | PostgreSQL data files | Daily automated backups |
| `redis-data` | Redis persistence (AOF) | Optional - can be rebuilt |
| `medusa-uploads` | User uploads (images, files) | Sync to S3 or cloud storage |
| `medusa-node-modules` | Dev only - node_modules | Not backed up |

#### Backup PostgreSQL Volume

```bash
# Create backup
docker exec medusa-db pg_dump -U medusa medusa > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i medusa-db psql -U medusa medusa < backup_20240101.sql
```

### Development vs Production Docker

Use the development overlay for local development:

```bash
# Development (with hot reload, pgAdmin, Redis Commander)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Production (optimized, minimal)
docker-compose -f docker-compose.yml up -d
```

---

## Environment Variables

### Complete Checklist

#### Backend Environment Variables (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| **Database** ||||
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/medusa` |
| **Redis** ||||
| `REDIS_URL` | Yes | Redis connection string | `redis://localhost:6379` |
| **Security** ||||
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) | `your-secure-jwt-secret-min-32-chars` |
| `COOKIE_SECRET` | Yes | Cookie signing secret (min 32 chars) | `your-secure-cookie-secret-min-32-chars` |
| **CORS** ||||
| `STORE_CORS` | Yes | Storefront origin(s) | `https://store.yourdomain.com` |
| `ADMIN_CORS` | Yes | Admin dashboard origin | `https://admin.yourdomain.com` |
| `AUTH_CORS` | Yes | Auth endpoints origins | `https://store.yourdomain.com,https://admin.yourdomain.com` |
| **Server** ||||
| `NODE_ENV` | Yes | Environment mode | `development`, `staging`, `production` |
| `MEDUSA_BACKEND_URL` | Yes | Backend URL for admin | `https://api.yourdomain.com` |
| `DISABLE_ADMIN` | No | Disable admin dashboard | `true` or `false` |
| `WORKER_MODE` | No | Worker process mode | `shared`, `server`, `worker` |
| **SMS (Twilio)** ||||
| `TWILIO_ACCOUNT_SID` | No | Twilio account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | No | Twilio auth token | `your_auth_token` |
| `TWILIO_FROM_NUMBER` | No | Twilio phone number | `+1234567890` |
| **Email (SendGrid)** ||||
| `SENDGRID_API_KEY` | No | SendGrid API key | `SG.xxxxx` |
| `SENDGRID_FROM` | No | Sender email address | `noreply@yourdomain.com` |
| **Payments (Stripe)** ||||
| `STRIPE_API_KEY` | No | Stripe secret key | `sk_live_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret | `whsec_xxxxx` |
| **Payments (PayPal)** ||||
| `PAYPAL_CLIENT_ID` | No | PayPal client ID | `AYxxxxxxxx` |
| `PAYPAL_CLIENT_SECRET` | No | PayPal client secret | `EHxxxxxxxx` |
| `PAYPAL_ENVIRONMENT` | No | PayPal environment | `sandbox` or `production` |
| `PAYPAL_AUTO_CAPTURE` | No | Auto-capture payments | `true` or `false` |
| `PAYPAL_WEBHOOK_ID` | No | PayPal webhook ID | `your_webhook_id` |
| **File Storage (S3)** ||||
| `S3_FILE_URL` | No | S3 bucket URL | `https://bucket.s3.region.amazonaws.com` |
| `S3_ACCESS_KEY_ID` | No | AWS access key | `AKIA...` |
| `S3_SECRET_ACCESS_KEY` | No | AWS secret key | `xxxxx` |
| `S3_REGION` | No | AWS region | `us-east-1` |
| `S3_BUCKET` | No | S3 bucket name | `your-bucket-name` |
| `S3_PREFIX` | No | Upload path prefix | `uploads` |

#### Storefront Environment Variables (.env.local)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MEDUSA_BACKEND_URL` | Yes | Medusa API URL | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Yes | Publishable API key | `pk_xxxxx` |
| `NEXT_PUBLIC_BASE_URL` | Yes | Storefront URL | `https://store.yourdomain.com` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Yes | Default region code | `kw` |
| `NEXT_PUBLIC_STRIPE_KEY` | No | Stripe publishable key | `pk_live_xxxxx` |
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY` | No | Medusa payments key | `xxxxx` |
| `NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID` | No | Medusa payments account | `xxxxx` |
| `REVALIDATE_SECRET` | Yes | Next.js revalidation secret | `your-revalidation-secret` |
| `MEDUSA_CLOUD_S3_HOSTNAME` | No | S3 hostname for images | `bucket.s3.amazonaws.com` |
| `MEDUSA_CLOUD_S3_PATHNAME` | No | S3 path for images | `/uploads` |

### Generating Secure Secrets

```bash
# Generate JWT_SECRET (Linux/macOS)
openssl rand -base64 48

# Generate COOKIE_SECRET
openssl rand -base64 48

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

---

## Database Setup

### Migration Commands

```bash
# Run all pending migrations
npm run db:migrate

# Generate migrations from module changes
npm run db:generate

# Sync link tables between modules
npm run db:sync-links
```

### Seeding Scripts

The platform includes several seeding scripts for initial data:

| Script | Command | Description |
|--------|---------|-------------|
| Products | `npm run seed:products` | Seeds product catalog with 5 categories |
| Shipping | `npm run seed:shipping` | Creates shipping options |
| Inventory | `npm run seed:inventory` | Sets up inventory locations and stock |

#### Execution Order

Run seeds in this order for proper data relationships:

```bash
cd backend

# 1. First, run database migrations
npm run db:migrate

# 2. Seed products (creates categories, products, variants)
npm run seed:products

# 3. Seed shipping options
npm run seed:shipping

# 4. Seed inventory (requires products to exist)
npm run seed:inventory
```

### Database Initialization

The PostgreSQL container automatically runs initialization scripts from `docker/postgres/init/`:

```sql
-- 01-init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
GRANT ALL PRIVILEGES ON DATABASE medusa TO medusa;
```

### Database Maintenance

```bash
# Connect to database container
docker exec -it medusa-db psql -U medusa -d medusa

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM product WHERE ...;

# Vacuum and analyze tables
VACUUM ANALYZE;

# Check database size
SELECT pg_size_pretty(pg_database_size('medusa'));
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Kuwait Marketplace

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ghcr.io/${{ github.repository }}/backend
  STOREFRONT_IMAGE: ghcr.io/${{ github.repository }}/storefront

jobs:
  # ========================================
  # Test Job
  # ========================================
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: medusa
          POSTGRES_PASSWORD: medusa
          POSTGRES_DB: medusa
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            storefront/package-lock.json

      # Backend Tests
      - name: Install backend dependencies
        working-directory: backend
        run: npm ci

      - name: Run backend linting
        working-directory: backend
        run: npm run lint

      - name: Run backend type check
        working-directory: backend
        run: npm run typecheck

      - name: Run backend tests
        working-directory: backend
        run: npm test
        env:
          DATABASE_URL: postgresql://medusa:medusa@localhost:5432/medusa
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-jwt-secret-min-32-characters-long
          COOKIE_SECRET: test-cookie-secret-min-32-characters

      # Storefront Tests
      - name: Install storefront dependencies
        working-directory: storefront
        run: npm ci

      - name: Run storefront linting
        working-directory: storefront
        run: npm run lint

      - name: Run storefront tests
        working-directory: storefront
        run: npm test

  # ========================================
  # Build Job
  # ========================================
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Build Backend Image
      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          target: production
          push: true
          tags: |
            ${{ env.BACKEND_IMAGE }}:latest
            ${{ env.BACKEND_IMAGE }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Build Storefront Image
      - name: Build and push storefront image
        uses: docker/build-push-action@v5
        with:
          context: ./storefront
          file: ./storefront/Dockerfile
          push: true
          tags: |
            ${{ env.STOREFRONT_IMAGE }}:latest
            ${{ env.STOREFRONT_IMAGE }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            MEDUSA_BACKEND_URL=${{ secrets.MEDUSA_BACKEND_URL }}
            NEXT_PUBLIC_BASE_URL=${{ secrets.NEXT_PUBLIC_BASE_URL }}

  # ========================================
  # Deploy Job
  # ========================================
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /opt/kuwait-marketplace

            # Pull latest images
            docker pull ${{ env.BACKEND_IMAGE }}:${{ github.sha }}
            docker pull ${{ env.STOREFRONT_IMAGE }}:${{ github.sha }}

            # Update docker-compose with new image tags
            export BACKEND_TAG=${{ github.sha }}
            export STOREFRONT_TAG=${{ github.sha }}

            # Deploy with zero downtime
            docker-compose up -d --no-deps --build medusa
            docker-compose up -d --no-deps --build storefront

            # Run migrations
            docker-compose exec -T medusa npm run db:migrate

            # Health check
            sleep 30
            curl -f http://localhost:9000/health || exit 1

            # Clean up old images
            docker image prune -f

      - name: Notify deployment success
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "Deployment successful! :rocket:",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Kuwait Marketplace deployed successfully*\nCommit: ${{ github.sha }}\nBy: ${{ github.actor }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Build and Deploy Steps Summary

1. **Test Stage**
   - Lint code (ESLint)
   - Type check (TypeScript)
   - Run unit tests (Vitest)

2. **Build Stage**
   - Build Docker images
   - Push to container registry
   - Tag with commit SHA

3. **Deploy Stage**
   - SSH to production server
   - Pull new images
   - Run migrations
   - Restart services
   - Health check verification

---

## Monitoring and Logging

### Medusa Logging

Medusa uses built-in logging that can be configured through environment variables:

```bash
# Enable detailed logging in development
DATABASE_LOGGING=true
NODE_ENV=development
```

#### Log Levels

| Level | When to Use |
|-------|-------------|
| `error` | Errors that need immediate attention |
| `warn` | Potential issues that don't stop execution |
| `info` | General operational information |
| `debug` | Detailed debugging information |

### Docker Logging

View container logs:

```bash
# All containers
docker-compose logs -f

# Specific service
docker-compose logs -f medusa

# Last 100 lines
docker-compose logs --tail=100 medusa

# Since timestamp
docker-compose logs --since="2024-01-01T00:00:00" medusa
```

### Error Tracking Recommendations

#### Sentry Integration

Add Sentry for error tracking:

```bash
npm install @sentry/node
```

```typescript
// In backend src/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

#### LogDNA/Mezmo

For centralized log management:

```bash
# docker-compose.yml addition
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Health Checks

The backend exposes a health endpoint:

```bash
# Check health
curl http://localhost:9000/health

# Expected response
{"status":"ok"}
```

### Recommended Monitoring Stack

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| **Sentry** | Error tracking | 5K events/month |
| **Grafana Cloud** | Metrics visualization | 10K series |
| **Uptime Robot** | Uptime monitoring | 50 monitors |
| **LogDNA** | Log aggregation | 1GB/month |

### Custom Health Dashboard

Create a monitoring endpoint for custom metrics:

```typescript
// Custom health check with metrics
app.get('/health/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabaseConnection(),
    redis: await checkRedisConnection(),
  };
  res.json(health);
});
```

---

## Production Checklist

### Pre-Deployment

- [ ] **Security secrets generated**
  - [ ] JWT_SECRET (min 32 characters)
  - [ ] COOKIE_SECRET (min 32 characters)
  - [ ] Database password (strong, unique)

- [ ] **Environment configuration**
  - [ ] NODE_ENV set to `production`
  - [ ] All CORS origins configured correctly
  - [ ] SSL/TLS certificates installed

- [ ] **Database**
  - [ ] Migrations run successfully
  - [ ] Backups configured
  - [ ] Connection pooling configured

- [ ] **Payment providers**
  - [ ] Stripe live keys configured
  - [ ] Webhook endpoints registered
  - [ ] PayPal production credentials

### Post-Deployment

- [ ] **Verification**
  - [ ] Health endpoint responding
  - [ ] Admin dashboard accessible
  - [ ] Storefront loading correctly
  - [ ] Payment flow working

- [ ] **Monitoring**
  - [ ] Error tracking active
  - [ ] Log aggregation configured
  - [ ] Uptime monitoring enabled
  - [ ] Alert thresholds set

- [ ] **Backup verification**
  - [ ] Database backup successful
  - [ ] Backup restoration tested
  - [ ] File storage backup configured

---

## Troubleshooting

### Common Issues

#### Container won't start

```bash
# Check logs
docker-compose logs medusa

# Common causes:
# - Database not ready: Check db service health
# - Missing environment variables: Verify .env file
# - Port already in use: Change port mapping
```

#### Database connection failed

```bash
# Test database connection
docker exec medusa-db psql -U medusa -d medusa -c "SELECT 1"

# Check DATABASE_URL format
# Correct: postgresql://user:password@host:5432/database
```

#### Redis connection issues

```bash
# Test Redis connection
docker exec medusa-redis redis-cli ping
# Expected: PONG

# Check REDIS_URL format
# Correct: redis://host:6379
```

#### Migration errors

```bash
# Reset and rerun migrations (CAUTION: destroys data)
docker exec medusa-db psql -U medusa -d medusa -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:migrate
```

#### CORS errors

```bash
# Verify CORS configuration
# STORE_CORS must match exact origin including protocol
# Example: https://store.example.com (not https://store.example.com/)
```

### Performance Issues

```bash
# Monitor container resources
docker stats

# Check for memory leaks
docker exec medusa-backend cat /proc/meminfo

# Analyze slow queries
docker exec medusa-db psql -U medusa -d medusa -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

### Recovery Procedures

#### Database Recovery

```bash
# Restore from backup
docker exec -i medusa-db psql -U medusa medusa < backup.sql

# Verify data integrity
npm run db:migrate
```

#### Full System Recovery

```bash
# Stop all services
docker-compose down

# Remove volumes (CAUTION: destroys data)
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build
npm run db:migrate
npm run seed:products
npm run seed:shipping
npm run seed:inventory
```

---

## Support

For additional support:

- **Medusa Documentation**: https://docs.medusajs.com
- **Medusa Discord**: https://discord.gg/medusajs
- **Project Issues**: Create an issue in the repository
