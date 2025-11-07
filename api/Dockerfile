# Build stage
FROM golang:1.25.3-alpine AS builder

WORKDIR /app

# Install git (needed for some Go dependencies)
RUN apk add --no-cache git

# Copy everything first to inspect the structure
COPY . .

# Debug: Show what was copied (helps diagnose build context issues)
RUN echo "=== Build context structure ===" && \
    ls -la && \
    echo "=== Looking for go.mod ===" && \
    find . -name "go.mod" -type f 2>/dev/null | head -5 && \
    echo "=== Looking for main.go ===" && \
    find . -name "main.go" -type f 2>/dev/null | head -5

# Determine build path and setup accordingly
# If build context is repo root, we need to work in api subdirectory
RUN if [ -f ./api/go.mod ]; then \
        echo "Build context is repository root, working in api/ subdirectory" && \
        cd api && \
        go mod download && \
        CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ../server ./cmd/server; \
    elif [ -f ./go.mod ]; then \
        echo "Build context is api/ directory" && \
        go mod download && \
        CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/server; \
    else \
        echo "ERROR: go.mod not found!" && \
        echo "Current directory contents:" && \
        ls -la && \
        echo "Searching for go.mod:" && \
        find . -name "go.mod" && \
        exit 1; \
    fi

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/server .

# Expose port
EXPOSE 8080

# Run the application
CMD ["./server"]

