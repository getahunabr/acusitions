# Acusitions - Docker Setup with Neon Database

This document provides comprehensive instructions for running the Acusitions application using Docker with both development (Neon Local) and production (Neon Cloud) database configurations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
- [Production Environment Setup](#production-environment-setup)
- [Environment Configuration](#environment-configuration)
- [Docker Commands](#docker-commands)
- [Database Migrations](#database-migrations)
- [Troubleshooting](#troubleshooting)
- [Architecture Overview](#architecture-overview)

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: For version control
- **Neon Account**: Sign up at [neon.tech](https://neon.tech)

### Neon Setup

1. **Create a Neon Project**:
   - Log in to your Neon Console
   - Create a new project
   - Note down your `PROJECT_ID` from Project Settings → General

2. **Get API Key**:
   - Go to Account Settings → API Keys
   - Generate a new API key
   - Keep this secure - you'll need it for local development

3. **Get Production Database URL**:
   - In your Neon project dashboard
   - Copy the connection string (looks like `postgresql://...@...neon.tech/...`)

## Development Environment Setup

### 1. Environment Configuration

Copy and configure the development environment file:

```bash
# Copy the development environment template
cp .env.development .env.development.local

# Edit the file with your actual Neon credentials
# Update the following values:
# - NEON_API_KEY=your_actual_api_key
# - NEON_PROJECT_ID=your_project_id
# - PARENT_BRANCH_ID=your_main_branch_id
```

### 2. Start Development Environment

```bash
# Start the development environment with Neon Local
docker-compose -f docker-compose.dev.yml --env-file .env.development.local up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop the environment
docker-compose -f docker-compose.dev.yml down
```

### 3. Development Features

- **Hot Reloading**: Code changes are automatically reflected
- **Ephemeral Database**: Fresh database branch created on each startup
- **Local Database Access**: Connect directly to `localhost:5432` if needed
- **Debug Logging**: Enhanced logging for development

### 4. Database Operations in Development

```bash
# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate Drizzle schema
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Open Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

## Production Environment Setup

### 1. Environment Configuration

Create production environment file:

```bash
# Create production environment file
cp .env.production .env.production.local

# Set the following environment variables in your deployment platform:
export DATABASE_URL="postgresql://username:password@hostname.neon.tech/database?sslmode=require"
export ARCJET_KEY="your_production_arcjet_key"
export CORS_ORIGIN="https://yourdomain.com"
```

### 2. Deploy to Production

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml --env-file .env.production.local up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale the application (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### 3. Production Features

- **Optimized Build**: Multi-stage Docker build for smaller images
- **Health Checks**: Automatic health monitoring
- **Resource Limits**: CPU and memory constraints
- **Security Hardening**: Read-only filesystem, security options
- **Logging**: Structured JSON logs with rotation

## Environment Configuration

### Development (.env.development)

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Neon Local Configuration
DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb?sslmode=require
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_neon_project_id
PARENT_BRANCH_ID=your_parent_branch_id

# Development Features
DEBUG=true
CORS_ORIGIN=http://localhost:3000
```

### Production (.env.production)

```bash
# Server Configuration
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Neon Cloud Configuration
DATABASE_URL=${DATABASE_URL}  # Injected via environment
ARCJET_KEY=${ARCJET_KEY}     # Injected via environment

# Production Features
DEBUG=false
CORS_ORIGIN=${CORS_ORIGIN}   # Injected via environment
```

## Docker Commands

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Rebuild containers after code changes affecting dependencies
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local

# Execute commands in app container
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
docker-compose -f docker-compose.dev.yml exec app npm test

# Stop and remove containers
docker-compose -f docker-compose.dev.yml down

# Stop and remove containers + volumes
docker-compose -f docker-compose.dev.yml down -v
```

### Production Commands

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Update production deployment
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Scale application instances
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Utility Commands

```bash
# Check container health
docker-compose -f docker-compose.dev.yml ps
docker-compose -f docker-compose.prod.yml ps

# Remove unused Docker resources
docker system prune -f

# View container resource usage
docker stats
```

## Database Migrations

### Development Migrations

```bash
# Generate new migration
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Run migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Open Drizzle Studio for database inspection
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### Production Migrations

```bash
# Run migrations in production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

# Verify database schema
docker-compose -f docker-compose.prod.yml exec app npm run db:generate -- --check
```

## Troubleshooting

### Common Issues

#### 1. Neon Local Connection Issues

**Problem**: Cannot connect to Neon Local proxy

**Solution**:

```bash
# Check Neon Local container status
docker-compose -f docker-compose.dev.yml ps neon-local

# View Neon Local logs
docker-compose -f docker-compose.dev.yml logs neon-local

# Verify environment variables
docker-compose -f docker-compose.dev.yml exec neon-local env | grep NEON
```

#### 2. Application Won't Start

**Problem**: Application container fails to start

**Solution**:

```bash
# Check application logs
docker-compose -f docker-compose.dev.yml logs app

# Verify database connectivity
docker-compose -f docker-compose.dev.yml exec app node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
docker-compose -f docker-compose.dev.yml exec neon-local pg_isready -h localhost -p 5432
```

#### 3. Hot Reloading Not Working

**Problem**: Code changes not reflected in development

**Solution**:

```bash
# Ensure volume mounts are correct
docker-compose -f docker-compose.dev.yml config

# Restart with fresh build
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build -d
```

#### 4. Production Database Issues

**Problem**: Cannot connect to Neon Cloud in production

**Solution**:

```bash
# Verify environment variables
docker-compose -f docker-compose.prod.yml exec app env | grep DATABASE_URL

# Test connection manually
docker-compose -f docker-compose.prod.yml exec app node -e "
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql\`SELECT NOW()\`.then(console.log).catch(console.error);
"
```

### Health Checks

```bash
# Check application health
curl http://localhost:3000/health

# Check container health status
docker inspect --format='{{.State.Health.Status}}' acusitions-app-dev
```

### Performance Monitoring

```bash
# Monitor resource usage
docker stats

# View container logs with timestamps
docker-compose -f docker-compose.prod.yml logs -f --timestamps
```

## Architecture Overview

### Development Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Developer     │    │  Application    │    │   Neon Local    │
│   (localhost)   │───▶│   Container     │───▶│     Proxy       │
│                 │    │  (port 3000)    │    │  (port 5432)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │  Neon Cloud     │
                                              │  (Ephemeral     │
                                              │   Branch)       │
                                              └─────────────────┘
```

### Production Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Users       │    │  Application    │    │   Neon Cloud    │
│  (Internet)     │───▶│   Container     │───▶│   Database      │
│                 │    │  (port 3000)    │    │ (Production DB) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Differences

| Feature         | Development                     | Production                 |
| --------------- | ------------------------------- | -------------------------- |
| Database        | Neon Local (Ephemeral branches) | Neon Cloud (Production DB) |
| Hot Reloading   | ✅ Enabled                      | ❌ Disabled                |
| Logging         | Debug level                     | Info level                 |
| Security        | Relaxed                         | Hardened                   |
| Resource Limits | None                            | CPU/Memory limits          |
| Health Checks   | Basic                           | Comprehensive              |

---

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

For issues or questions, please check the troubleshooting section above or open an issue in the project repository.
