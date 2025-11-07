# Docker Configuration

This folder contains all Docker Compose configurations.

## Files

- `compose.dev.yml` - Development configuration (convenient defaults)
- `compose.prod.yml` - Production configuration (secure, with resource limits)

## Usage

### Development

```bash
make up  # Uses docker/compose.dev.yml
```

Or directly:
```bash
docker-compose -f docker/compose.dev.yml up -d
```

### Production

```bash
docker-compose -f docker/compose.prod.yml up -d
```

Make sure to set environment variables for production:
- `POSTGRES_PASSWORD` (required)
- `POSTGRES_USER` (optional, defaults to postgres)
- `POSTGRES_DB` (optional, defaults to quiz_db)
- `API_PORT` (optional, defaults to 8080)

