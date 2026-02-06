# Portfolio Application - Docker Deployment Guide

Complete guide for deploying the Portfolio application using Docker. This application provides two deployment options: **All-in-One** with bundled MySQL, or **Standalone** with your own database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Option 1: All-in-One (Recommended for Development)](#option-1-all-in-one-recommended-for-development)
  - [Option 2: Standalone (BYO Database)](#option-2-standalone-byo-database)
- [Architecture](#architecture)
- [Configuration Reference](#configuration-reference)
- [Management Commands](#management-commands)
- [Database Management](#database-management)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Performance Tuning](#performance-tuning)
- [Security Best Practices](#security-best-practices)

---

## Prerequisites

### System Requirements

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **System Resources**:
  - Minimum: 2 GB RAM, 2 CPU cores
  - Recommended: 4 GB RAM, 4 CPU cores
  - Disk Space: 5 GB free

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## Quick Start

### Option 1: All-in-One (Recommended for Development)

Includes MySQL database container for quick setup.

#### Step 1: Create Environment File

```bash
cp .env.example .env
```

#### Step 2: Customize Configuration (Optional)

Edit `.env` to change default values:

```bash
# Change ports if needed
FRONTEND_PORT=80
BACKEND_PORT=8080
DB_PORT=3307

# Generate secure JWT secret for production
openssl rand -base64 32
```

#### Step 3: Start Services

```bash
docker-compose up -d
```

This will:
- Pull MySQL 8.0 image
- Build backend Docker image (~180-220 MB)
- Build frontend Docker image (~25-35 MB)
- Start all services with health checks
- Create and seed database automatically

#### Step 4: Verify Deployment

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Wait for all services to be healthy (1-2 minutes)
```

#### Step 5: Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api/profile
- **MySQL**: localhost:3307 (from host machine)

**Default Credentials**: admin / admin (Change immediately!)

---

### Option 2: Standalone (BYO Database)

Use your existing MySQL database server.

#### Step 1: Prepare Database

Connect to your MySQL server and run:

```sql
-- Create database
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'portfolio_user'@'%' IDENTIFIED BY 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'%';
FLUSH PRIVILEGES;
```

#### Step 2: Create Environment File

```bash
cp .env.standalone.example .env
```

#### Step 3: Configure Database Connection

Edit `.env` with your database details:

```bash
DB_HOST=your-mysql-host.com  # Use host.docker.internal for localhost
DB_PORT=3306
DB_NAME=portfolio_db
DB_USER=portfolio_user
DB_PASSWORD=secure_password

# REQUIRED: Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)
```

#### Step 4: Start Services

```bash
docker-compose -f docker-compose.standalone.yml up -d
```

#### Step 5: Verify Deployment

```bash
docker-compose -f docker-compose.standalone.yml ps
docker-compose -f docker-compose.standalone.yml logs -f backend
```

**Note**: Flyway will automatically create tables and seed data on first startup.

---

## Architecture

### Container Overview

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| portfolio-mysql | mysql:8.0 | 3307→3306 | Database (All-in-One only) |
| portfolio-backend | Custom build | 8080→8080 | Spring Boot API |
| portfolio-frontend | Custom build | 80→80 | Angular + nginx |

### Network Flow

```
User → Frontend (nginx:80)
         ↓ /api requests
       Backend (Spring Boot:8080)
         ↓
       MySQL (3306)
```

### Image Details

**Backend Image**:
- Multi-stage build (Maven + JRE)
- Base: eclipse-temurin:17-jre-alpine
- Size: ~180-220 MB
- Non-root user (spring:spring)
- Health check on /api/profile

**Frontend Image**:
- Multi-stage build (Node + nginx)
- Base: nginx:1.27-alpine
- Size: ~25-35 MB
- Environment variable substitution at runtime
- Health check on /

---

## Configuration Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL hostname | localhost | Yes |
| `DB_PORT` | MySQL port | 3306 | No |
| `DB_NAME` | Database name | portfolio_db | Yes |
| `DB_USER` | Database username | root | Yes |
| `DB_PASSWORD` | Database password | rootroot | Yes |
| `DB_USE_SSL` | Use SSL for MySQL | false | No |
| `SERVER_PORT` | Backend port | 8080 | No |
| `SERVER_HOST` | Bind address | 0.0.0.0 | No |
| `JWT_SECRET` | JWT signing secret | (default) | **Production: Yes** |
| `JWT_EXPIRATION` | Token expiration (ms) | 3600000 | No |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins | http://localhost:4200 | Yes |
| `ALLOW_SIGNUPS` | Enable signups | false | No |
| `LOG_LEVEL` | Application log level | INFO | No |
| `SECURITY_LOG_LEVEL` | Security log level | INFO | No |
| `JPA_SHOW_SQL` | Show SQL queries | false | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BACKEND_URL` | Backend API URL | http://backend:8080 | Yes |

### MySQL Environment Variables (All-in-One Only)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MYSQL_ROOT_PASSWORD` | Root password | rootroot | Yes |
| `MYSQL_DATABASE` | Database name | portfolio_db | Yes |
| `MYSQL_USER` | Application user | portfolio_user | Yes |
| `MYSQL_PASSWORD` | Application password | portfolio_pass | Yes |

---

## Management Commands

### All-in-One Commands

```bash
# Start services
docker-compose up -d

# Stop services (preserves data)
docker-compose down

# Stop and remove volumes (DELETES DATA!)
docker-compose down -v

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Check service status
docker-compose ps

# Restart specific service
docker-compose restart backend

# Rebuild after code changes
docker-compose build backend frontend
docker-compose up -d

# Execute command in container
docker-compose exec backend sh
docker-compose exec mysql mysql -u root -p
```

### Standalone Commands

Replace `docker-compose` with:

```bash
docker-compose -f docker-compose.standalone.yml [command]
```

Examples:

```bash
docker-compose -f docker-compose.standalone.yml up -d
docker-compose -f docker-compose.standalone.yml logs -f
docker-compose -f docker-compose.standalone.yml down
```

### Production Commands

Use production overrides:

```bash
# Start with production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Standalone + production
docker-compose -f docker-compose.standalone.yml -f docker-compose.prod.yml up -d
```

---

## Database Management

### Access MySQL Shell (All-in-One)

```bash
docker-compose exec mysql mysql -u root -p
# Password: value from DB_ROOT_PASSWORD in .env
```

### Backup Database

```bash
# Create backup
docker-compose exec mysql mysqldump -u root -p portfolio_db > backup.sql

# With timestamp
docker-compose exec mysql mysqldump -u root -p portfolio_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T mysql mysql -u root -p portfolio_db < backup.sql
```

### View Flyway Migration History

```bash
docker-compose exec mysql mysql -u root -p -e "SELECT * FROM portfolio_db.flyway_schema_history;"
```

### Reset Database (Development Only)

```bash
# Stop services
docker-compose down

# Remove volume (DELETES ALL DATA!)
docker volume rm portfolio_mysql_data

# Restart (recreates database)
docker-compose up -d
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Generate secure JWT secret: `openssl rand -base64 32`
- [ ] Use strong database passwords
- [ ] Set `CORS_ALLOWED_ORIGINS` to actual domain(s)
- [ ] Change admin password on first login
- [ ] Configure SSL/TLS with reverse proxy
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Use `docker-compose.prod.yml` for resource limits
- [ ] Review security headers in nginx.conf
- [ ] Enable firewall rules

### Production Environment Setup

1. **Generate Secure Secrets**:

```bash
# JWT Secret
openssl rand -base64 32

# Database Password
openssl rand -base64 16
```

2. **Create Production .env**:

```bash
DB_ROOT_PASSWORD=<secure-password>
DB_PASSWORD=<secure-password>
JWT_SECRET=<generated-secret>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
LOG_LEVEL=WARN
SECURITY_LOG_LEVEL=WARN
```

3. **Deploy with Production Settings**:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

4. **Configure Reverse Proxy (nginx/Traefik)**:

```nginx
# Example nginx reverse proxy with SSL
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Automated Backups

Create a cron job for daily backups:

```bash
# /etc/cron.daily/portfolio-backup.sh
#!/bin/bash
BACKUP_DIR=/backups/portfolio
DATE=$(date +%Y%m%d_%H%M%S)

docker-compose exec mysql mysqldump -u root -p$DB_ROOT_PASSWORD portfolio_db > $BACKUP_DIR/backup_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

---

## Troubleshooting

### Backend Won't Start

**Symptom**: Backend container exits immediately

**Solutions**:

1. Check logs:
```bash
docker-compose logs backend
```

2. Verify MySQL is healthy:
```bash
docker-compose ps
```

3. Check database credentials in `.env`

4. Ensure database exists:
```bash
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

5. Verify network connectivity:
```bash
docker-compose exec backend ping mysql
```

### Frontend Shows 502 Bad Gateway

**Symptom**: Frontend loads but API calls fail

**Solutions**:

1. Check backend is running:
```bash
docker-compose ps backend
```

2. Verify `BACKEND_URL` in `.env`:
```bash
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf | grep proxy_pass
```

3. Test backend directly:
```bash
curl http://localhost:8080/api/profile
```

4. Check CORS configuration:
```bash
docker-compose logs backend | grep CORS
```

### Flyway Migration Fails

**Symptom**: Backend logs show Flyway errors

**Solutions**:

1. Check database connection:
```bash
docker-compose exec backend wget -O- http://localhost:8080/actuator/health
```

2. Verify migration history:
```bash
docker-compose exec mysql mysql -u root -p -e "SELECT * FROM portfolio_db.flyway_schema_history;"
```

3. If needed, baseline and retry:
```bash
docker-compose down
docker volume rm portfolio_mysql_data
docker-compose up -d
```

### Port Already in Use

**Symptom**: Cannot bind to port (address already in use)

**Solutions**:

1. Change ports in `.env`:
```bash
FRONTEND_PORT=8081
BACKEND_PORT=8082
DB_PORT=3308
```

2. Find and stop conflicting service:
```bash
# Windows
netstat -ano | findstr :80

# Linux/Mac
lsof -i :80
```

### Database Connection Refused (Standalone)

**Symptom**: Backend can't connect to external MySQL

**Solutions**:

1. For localhost MySQL, use special hostname:
```bash
DB_HOST=host.docker.internal
```

2. Verify database is accessible:
```bash
docker-compose exec backend ping $DB_HOST
```

3. Check MySQL user permissions:
```sql
SELECT host, user FROM mysql.user WHERE user = 'portfolio_user';
```

4. Ensure MySQL allows remote connections:
```bash
# Check MySQL bind-address in my.cnf
bind-address = 0.0.0.0
```

### Container Unhealthy

**Symptom**: Health check fails

**Solutions**:

1. Check health check logs:
```bash
docker inspect portfolio-backend | grep -A 10 Health
```

2. Increase health check timeout in `docker-compose.yml`:
```yaml
healthcheck:
  start_period: 120s  # Increase for slow systems
  timeout: 10s
```

3. Manually test health endpoint:
```bash
docker-compose exec backend wget -O- http://localhost:8080/api/profile
```

---

## Performance Tuning

### JVM Options (Backend)

Adjust in `.env` or `docker-compose.prod.yml`:

```bash
JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

### MySQL Optimization

Edit `docker-compose.yml`:

```yaml
mysql:
  environment:
    MYSQL_INNODB_BUFFER_POOL_SIZE: 512M
  command:
    - --max_connections=200
    - --innodb_log_file_size=256M
```

### nginx Worker Processes

For high traffic, modify `nginx.conf`:

```nginx
worker_processes auto;
worker_connections 1024;
```

### Connection Pool Tuning

In `application.properties`:

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
```

### Resource Limits

Production limits in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

---

## Security Best Practices

### 1. Secrets Management

- Never commit `.env` files to version control
- Use Docker secrets or vault for production:

```yaml
secrets:
  db_password:
    external: true
services:
  backend:
    secrets:
      - db_password
```

### 2. JWT Secret

Generate strong secret:

```bash
openssl rand -base64 32
```

### 3. Database Security

- Use strong passwords (16+ characters)
- Restrict user permissions (no SUPER privilege)
- Enable SSL for production:

```bash
DB_USE_SSL=true
```

### 4. CORS Configuration

Restrict to specific origins:

```bash
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 5. Network Isolation

Use internal networks for service communication:

```yaml
networks:
  frontend:
  backend:
    internal: true
```

### 6. Regular Updates

- Update base images regularly
- Monitor security advisories
- Rebuild images with latest patches:

```bash
docker-compose pull
docker-compose build --no-cache
docker-compose up -d
```

### 7. nginx Rate Limiting

Add to `nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api {
    limit_req zone=api burst=20 nodelay;
    proxy_pass ${BACKEND_URL};
}
```

### 8. Disable Debug Features

Production settings:

```bash
JPA_SHOW_SQL=false
JPA_FORMAT_SQL=false
LOG_LEVEL=WARN
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build images
        run: docker-compose build

      - name: Run tests
        run: docker-compose run backend mvn test

      - name: Deploy
        run: |
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Monitoring

### Container Health

```bash
# Check health status
docker-compose ps

# Monitor resource usage
docker stats

# View detailed container info
docker inspect portfolio-backend
```

### Application Logs

```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Since timestamp
docker-compose logs --since 2024-01-01T00:00:00
```

### MySQL Monitoring

```bash
# Connection count
docker-compose exec mysql mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Slow queries
docker-compose exec mysql mysql -u root -p -e "SHOW STATUS LIKE 'Slow_queries';"
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [nginx Documentation](https://nginx.org/en/docs/)

---

## Support

For issues or questions:

1. Check logs: `docker-compose logs -f`
2. Review troubleshooting section above
3. Verify configuration in `.env`
4. Check Docker and Docker Compose versions
5. Ensure system meets minimum requirements

---

## License

Copyright © 2024 Portfolio Application. All rights reserved.
