.PHONY: help format format-api format-client dev dev-api dev-client dev-all format-all

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Formatting targets
format: format-all ## Format all projects (alias for format-all)

format-all: format-api format-client ## Format both API and client

format-api: ## Format Go code in API
	@echo "Formatting API..."
	@cd api && go fmt ./...

format-client: ## Format client code with Biome
	@echo "Formatting client..."
	@cd client && bun run format:fix

# Development targets
dev: dev-all ## Run all projects in dev mode (alias for dev-all)

dev-all: ## Run both API and client in dev mode (in parallel)
	@echo "Starting all services in dev mode..."
	@make dev-api & make dev-client
	@wait

dev-api: ## Run API in dev mode
	@echo "Starting API server..."
	@cd api && go run ./cmd/server

dev-client: ## Run client in dev mode
	@echo "Starting client dev server..."
	@cd client && bun run dev

