# Quiz API

A RESTful API built with Go and Echo framework for the Quiz application. This API provides backend services for managing quiz data and operations.

## Features

- RESTful API built with [Echo](https://echo.labstack.com/) framework
- PostgreSQL database integration with connection pooling
- Health check endpoint with database connectivity monitoring
- Environment-based configuration
- Docker support

## Prerequisites

- Go 1.25.3 or higher
- PostgreSQL database
- Make (optional, for using Makefile commands)

## Installation

1. Clone the repository and navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
go mod download
```

## Configuration

The API uses environment variables for configuration. You can set them directly or use a `.env` file in the `api` directory.

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `PORT` | Server port | `8080` |
| `HOST` | Server host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:password@localhost:5432/quiz_db?sslmode=disable` |

### Example `.env` file

Create a `.env` file in the `api` directory:

```env
PORT=8080
HOST=0.0.0.0
DATABASE_URL=postgres://user:password@localhost:5432/quiz_db?sslmode=disable
```

### Database Connection String Format

The `DATABASE_URL` should follow this format:
```
postgres://username:password@host:port/database_name?sslmode=disable
```

## Running the Application

### Using Make (from project root)

```bash
make dev-api
```

### Using Go directly

```bash
cd api
go run ./cmd/server
```

The server will start on `http://localhost:8080` (or the port specified in your configuration).

### Production Build

```bash
cd api
go build -o server ./cmd/server
./server
```

## API Endpoints

### Health Check

Check the health status of the API and database connection.

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "message": "Database connection failed",
  "error": "error details"
}
```

**Example:**
```bash
curl http://localhost:8080/health
```

## Project Structure

```
api/
├── cmd/
│   └── server/
│       └── main.go          # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go        # Configuration management
│   ├── handlers/
│   │   ├── health_handler.go # Health check handler
│   │   └── middleware.go     # Middleware setup
│   └── infrastructure/
│       └── database/
│           └── postgres/
│               └── connection.go # Database connection pool
├── Dockerfile               # Docker build configuration
├── go.mod                   # Go module dependencies
├── go.sum                   # Go module checksums
└── README.md               # This file
```

## Development

### Code Formatting

Format Go code using:
```bash
make format-api
```

Or directly:
```bash
cd api
go fmt ./...
```

### Adding New Handlers

1. Create a new handler file in `internal/handlers/`
2. Implement your handler functions
3. Register routes in `cmd/server/main.go`

### Adding New Middleware

Add middleware in `internal/handlers/middleware.go` using Echo's middleware system.

### Database Operations

The database connection pool is available through the `Connection` struct in `internal/infrastructure/database/postgres/connection.go`. Access the pool using:

```go
pool := dbConn.Pool()
// Use pool for database operations
```

## Docker

### Build Docker Image

```bash
cd api
docker build -t quiz-api .
```

### Run Docker Container

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e HOST=0.0.0.0 \
  -e DATABASE_URL=postgres://user:password@host:5432/quiz_db \
  quiz-api
```
