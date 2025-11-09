# Quiz Client

A modern React application built with TypeScript, TanStack Router, and TanStack Query. This client provides the frontend interface for the Quiz application.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Configuration](#configuration)
- [Styling](#styling)
- [Testing](#testing)
- [Docker](#docker)

## Features

- ⚛️ **React 19** with TypeScript
- 🚀 **Vite** for fast development and building
- 🧭 **TanStack Router** for type-safe routing
- 🔄 **TanStack Query** for server state management
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** components
- 🔧 **Biome** for linting and formatting
- 📦 **Bun** as package manager

## Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- API server running (see [API README](../api/README.md))

## Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
bun install
```

Or with npm/yarn:
```bash
npm install
# or
yarn install
```

## Running the Application

### Development Mode

Start the development server:

```bash
bun run dev
```

Or using npm/yarn:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Using Make (from project root)

```bash
make dev-client
```

## Configuration

### API URL

The client connects to the API using the `VITE_API_URL` environment variable. Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8080
```

If not set, it defaults to `http://localhost:8080`.

## Development

### Code Formatting

Format code using Biome:

```bash
bun run format:fix
```

Or using Make (from project root):
```bash
make format-client
```

### Linting

Check for linting issues:

```bash
bun run lint
```

### Format and Lint Check

Run both formatting and linting checks:

```bash
bun run check
```

### Adding Routes

This project uses TanStack Router with code-based routing. Routes are defined in `src/main.tsx`.

Example of adding a new route:

```tsx
import { createRoute } from "@tanstack/react-router";

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <h1>About</h1>,
});
```

Then add it to the route tree:

```tsx
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);
```

For more information, see the [TanStack Router documentation](https://tanstack.com/router).

### Adding Components

Components are located in `src/components/`. Use shadcn/ui for UI components:

```bash
bunx shadcn@latest add [component-name]
```

### Data Fetching

The project uses TanStack Query for server state management. Example:

```tsx
import { useQuery } from "@tanstack/react-query";

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: () => apiClient.get("/endpoint"),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

### API Client

The API client is located in `src/lib/api/client.ts`. It provides methods for making HTTP requests:

```tsx
import { apiClient } from "@/lib/api/client";

// GET request
const data = await apiClient.get<MyType>("/endpoint");

// POST request
const result = await apiClient.post<ResponseType>("/endpoint", { data });

// PUT request
const updated = await apiClient.put<ResponseType>("/endpoint", { data });

// DELETE request
await apiClient.delete("/endpoint");
```

## Docker

### Build Docker Image

```bash
cd client
docker build -t quiz-client .
```

### Run Docker Container

```bash
docker run -p 80:80 quiz-client
```

The application will be available at `http://localhost`.

### Environment Variables in Docker

To set the API URL in Docker:

```bash
docker run -p 80:80 \
  -e VITE_API_URL=http://api:8080 \
  quiz-client
```

Note: Environment variables need to be set at build time for Vite. You may need to adjust the Dockerfile to accept build arguments.

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `serve` | Preview production build |
| `test` | Run tests |
| `lint` | Run linter |
| `format` | Check code formatting |
| `format:fix` | Fix code formatting |
| `check` | Run both lint and format checks |

## Architecture Notes

- **Repository Pattern**: Data access is abstracted through repositories (e.g., `health.repository.ts`)
- **API Client**: Centralized HTTP client for API communication
- **Custom Hooks**: Reusable logic is encapsulated in custom hooks
- **Component Organization**: Components are organized by feature and type
- **Type Safety**: Full TypeScript support with strict type checking