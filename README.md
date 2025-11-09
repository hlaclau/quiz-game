# Quiz Project

A full-stack quiz application built for the **Architecture logicielle & design patterns** course @Ynov.

This project consists of a Go REST API backend and a React TypeScript frontend, demonstrating modern software architecture patterns and best practices.

## Overview

This is a quiz application that demonstrates:

- **Backend**: RESTful API built with Go and Echo framework
- **Frontend**: React application with Typescript
- **Database**: PostgreSQL for data persistence

- **Architecture**: Clean architecture principles with separation of concerns

## Quick Start

### Prerequisites

- **Go**
- **Bun** 
- **PostgreSQL**
- **Make** (optional, for convenience commands)

### Running the Application

#### Option 1: Using Make (Recommended)

Run both API and client in development mode:

```bash
make dev
```

Or run them separately:

```bash
make dev-api      # Start API server
make dev-client   # Start client dev server
```

#### Option 2: Manual Setup

**1. Start the API:**

```bash
cd api
go mod download
go run ./cmd/server
```

The API will be available at `http://localhost:8080`

**2. Start the Client:**

```bash
cd client
bun install
bun run dev
```

The client will be available at `http://localhost:3000`

### Environment Setup

**API Environment Variables:**

Create `api/.env`:
```env
PORT=8080
HOST=0.0.0.0
DATABASE_URL=<your_postgres_database_url>
```


**Client Environment Variables:**

Create `client/.env`:
```env
VITE_API_URL=http://localhost:8080
```

## Architecture

### Backend (API)

The API follows clean architecture principles:

- **cmd/**: Application entry points
- **internal/config/**: Configuration management
- **internal/handlers/**: HTTP request handlers
- **internal/infrastructure/**: External dependencies (database, etc.)

Key features:
- RESTful API design
- Health check endpoints

### Frontend (Client)

The client uses modern React patterns:

- **Components/**: Reusable UI components
- **Hooks/**: Custom React hooks
- **Repositories/**: Data access layer
- **lib/api/**: API client abstraction

Key features:
- Type-safe routing with TanStack Router
- Server state management with TanStack Query
- Component library with shadcn/ui
- Responsive design with Tailwind CSS

## Technologies

### Backend
- **Go** 1.25.3
- **Echo** - Web framework
- **PostgreSQL** - Database

### Frontend
- **React** 19
- **TypeScript**
- **Vite** - Build tool
- **TanStack Router** - Routing
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Biome** - Linting & formatting

## Development

### Code Formatting

Format all code:

```bash
make format
```

Or format individually:

```bash
make format-api      # Format Go code
make format-client   # Format TypeScript/React code
```

### Available Make Commands

```bash
make help           # Show all available commands
make dev            # Run both API and client
make dev-api        # Run API only
make dev-client     # Run client only
make format         # Format all code
make format-api     # Format API code
make format-client  # Format client code
```

## Docker

Both the API and client include Dockerfiles for containerized deployment.

### Build and Run API

```bash
cd api
docker build -t quiz-api .
docker run -p 8080:8080 quiz-api
```

### Build and Run Client

```bash
cd client
docker build -t quiz-client .
docker run -p 80:80 quiz-client
```
