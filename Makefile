.PHONY: up down build logs help

# Default target
.DEFAULT_GOAL := help

# Docker compose file
COMPOSE_FILE := docker/compose.dev.yml

help: ## Show available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

up: ## Start all services
	docker-compose -f $(COMPOSE_FILE) up -d

down: ## Stop all services
	docker-compose -f $(COMPOSE_FILE) down

build: ## Build Docker images
	docker-compose -f $(COMPOSE_FILE) build

logs: ## Show logs from all services
	docker-compose -f $(COMPOSE_FILE) logs -f

