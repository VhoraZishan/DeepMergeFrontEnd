# CMLRE Marine Data Platform - Makefile

# Variables
PYTHON := python3
POETRY := poetry
DOCKER := docker
COMPOSE := docker-compose

# Default target
.PHONY: help
help: ## Show this help
	@echo "CMLRE Marine Data Platform - Development Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make [command]"
	@echo ""
	@echo "Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install dependencies with Poetry
	$(POETRY) install

.PHONY: dev
dev: ## Run development server
	$(POETRY) run uvicorn app.main:app --reload

.PHONY: docker-build
docker-build: ## Build Docker images
	$(DOCKER) build -t cmlre-marine-data-platform .

.PHONY: docker-up
docker-up: ## Start all services with Docker Compose
	$(COMPOSE) up -d

.PHONY: docker-down
docker-down: ## Stop all services
	$(COMPOSE) down

.PHONY: docker-logs
docker-logs: ## View service logs
	$(COMPOSE) logs -f

.PHONY: test
test: ## Run tests
	$(POETRY) run pytest

.PHONY: test-endpoints
test-endpoints: ## Test API endpoints
	$(POETRY) run python test_endpoints.py

.PHONY: format
format: ## Format code with Black and isort
	$(POETRY) run black .
	$(POETRY) run isort .

.PHONY: lint
lint: ## Lint code with Ruff
	$(POETRY) run ruff check .

.PHONY: check
check: ## Run all code quality checks
	$(POETRY) run black --check .
	$(POETRY) run isort --check-only .
	$(POETRY) run ruff check .

.PHONY: migrate
migrate: ## Run database migrations
	$(POETRY) run alembic upgrade head

.PHONY: migrate-create
migrate-create: ## Create new database migration
	@echo "Enter migration message:"
	@read msg; \
	$(POETRY) run alembic revision --autogenerate -m "$$msg"

.PHONY: clean
clean: ## Clean Python cache files
	find . -type f -name "*.py[co]" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +

.PHONY: docs
docs: ## Open API documentation in browser
	@echo "Open http://localhost:8000/docs in your browser"

.PHONY: all
all: install docker-up ## Install dependencies and start services