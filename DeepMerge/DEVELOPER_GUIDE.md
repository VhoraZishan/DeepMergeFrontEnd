# CMLRE Marine Data Platform - Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Getting Started](#getting-started)
6. [API Endpoints](#api-endpoints)
7. [Data Models](#data-models)
8. [Services and Ingestion](#services-and-ingestion)
9. [AI and LLM Integration](#ai-and-llm-integration)
10. [Database](#database)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Development Workflow](#development-workflow)
14. [Standards & Interoperability](#standards--interoperability)
15. [Roadmap](#roadmap)

## Project Overview

The CMLRE Marine Data Platform is a comprehensive backend system designed to collect, process, and analyze marine data across multiple domains:
- Oceanography (SST, tide data, chlorophyll levels)
- Fisheries (species landings, catch data)
- Biodiversity (species observations, marine life data)
- Molecular biology (eDNA studies, genetic data)

The platform provides RESTful APIs, GraphQL endpoints, WebSocket connections for real-time data, and AI-powered natural language querying capabilities.

## Technology Stack

- **Language**: Python 3.12+
- **Framework**: FastAPI (ASGI web framework)
- **Database**: PostgreSQL with TimescaleDB extension
- **ORM**: SQLAlchemy (async)
- **Database Migrations**: Alembic
- **Caching**: Redis
- **Object Storage**: MinIO (S3-compatible)
- **Containerization**: Docker & Docker Compose
- **AI/ML**: Google Gemini API
- **Monitoring**: Prometheus metrics
- **Authentication**: JWT-based (planned)
- **Task Queue**: Celery (planned)

## Project Structure

```
.
├── alembic/                 # Database migration files
├── app/                     # Main application code
│   ├── core/                # Core configuration and utilities
│   ├── db/                  # Database configuration
│   ├── ingestion/           # Data ingestion modules
│   ├── models/              # Database models
│   ├── routers/             # API route definitions
│   ├── schemas/             # Pydantic data schemas
│   ├── services/            # Business logic and external services
│   └── main.py              # Application entry point
├── tests/                   # Test files
├── Dockerfile               # Docker configuration
├── docker-compose.yaml      # Multi-container orchestration
├── pyproject.toml           # Project dependencies
└── README.md               # Basic project information
```

## Architecture

The application follows a modular architecture with clear separation of concerns:

1. **API Layer** (`routers/`): Handles HTTP requests and responses
2. **Business Logic Layer** (`services/`): Contains core application logic
3. **Data Access Layer** (`models/`, `db/`): Database interactions
4. **External Services Layer** (`ingestion/`): Integration with external data sources
5. **Presentation Layer** (`schemas/`): Data validation and serialization

The system is designed to be horizontally scalable with async I/O throughout the stack.

## Getting Started

### Prerequisites
- Python 3.12+
- Docker and Docker Compose
- Poetry (Python package manager)

### Quick Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd sih-back
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Using Docker (recommended):
```bash
docker compose up -d --build
```

4. Using Poetry (for development):
```bash
pip install poetry
poetry install
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` with documentation at `/docs` and `/redoc`.

## API Endpoints

### Health and Monitoring
- `GET /healthz` - Health check endpoint
- `GET /metrics` - Prometheus metrics

### Oceanography
- `GET /api/v1/oceanography/records` - Get oceanographic data records
- `GET /api/v1/oceanography/tide` - Get tide gauge data

### Fisheries
- `GET /api/v1/fisheries/records` - Get fisheries records
- `GET /api/v1/fisheries/species/{species}` - Get data for specific species

### Biodiversity
- `GET /api/v1/biodiversity/species` - Search for species
- `GET /api/v1/biodiversity/observations` - Get biodiversity observations

### Molecular Data
- `GET /api/v1/molecular/edna` - Get eDNA studies
- `POST /api/v1/molecular/blast` - BLAST-like k-mer similarity search

### AI Integration
- `POST /api/v1/ai/query` - Natural language query processing
- `GET /api/v1/ai/summary` - AI-generated data summaries
- `POST /api/v1/ai/anomalies` - Anomaly detection in data
- `GET /api/v1/ai/examples` - Example queries
- `GET /api/v1/ai/sql` - Generate SQL from a natural question
- `POST /api/v1/ai/viz/suggest` - Suggest visualization spec

### WebSocket
- `GET /ws/live` - Real-time data streaming
- `GET /ws/status` - WebSocket status

### GraphQL
- `POST /api/v1/graphql` - GraphQL endpoint (use JSON body: `{ query, variables }`)
- `GET /api/v1/graphql/` - GraphiQL-compatible endpoint in browser

## Data Models

The platform uses SQLAlchemy models for data persistence:

### OceanographyRecord
```python
class OceanographyRecord(Base):
    __tablename__ = "oceanography_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parameter = Column(String(50), nullable=False)  # sst, tide_height, chlorophyll
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    value = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    region = Column(String(100), nullable=True)
    source = Column(String(100), nullable=False)
```

### FisheriesRecord
```python
class FisheriesRecord(Base):
    __tablename__ = "fisheries_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    species = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    region = Column(String(100), nullable=True)
    state = Column(String(50), nullable=False)
```

### BiodiversityRecord
```python
class BiodiversityRecord(Base):
    __tablename__ = "biodiversity_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    species = Column(String(100), nullable=False)
    observation_count = Column(Integer, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
```

### MolecularRecord
```python
class MolecularRecord(Base):
    __tablename__ = "molecular_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    study_id = Column(String(100), nullable=False)
    species = Column(String(100), nullable=True)
    gene = Column(String(100), nullable=True)
    sequence = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
```

## Services and Ingestion

### Data Sources

The platform integrates with multiple external data sources:

1. **INCOIS** (Indian National Centre for Ocean Information Services)
   - Sea Surface Temperature (SST) data
   - Tide gauge data
   - Oceanographic parameters

2. **CMFRI** (Central Marine Fisheries Research Institute)
   - Fish landings data
   - Species information
   - Fisheries statistics

3. **IBP** (India Biodiversity Portal)
   - Species observations
   - Biodiversity data
   - Citizen science contributions

4. **NCBI** (National Center for Biotechnology Information)
   - eDNA studies
   - Genetic sequences
   - Molecular data

### Ingestion Process

Data ingestion is handled through dedicated clients in the [app/ingestion/](file:///c%3A/Users/yashd/Downloads/sih-back/app/ingestion) directory:

```python
# Example: INCOIS data ingestion
class IncoisClient:
    async def fetch_sst_daily(self, region: str = "kerala") -> list[IncoisRecord]:
        # Fetch SST data from INCOIS ERDDAP server
        # Returns structured data for processing
```

## AI and LLM Integration

The platform integrates with Google's Gemini API for natural language processing capabilities:

### Query Processor
Located in [app/services/llm/query_processor.py](file:///c%3A/Users/yashd/Downloads/sih-back/app/services/llm/query_processor.py), this service handles:
- Natural language query analysis
- Data retrieval based on query intent
- AI-generated summaries and insights
- Anomaly detection in datasets

### Key Features
1. **Natural Language Queries**: Users can ask questions like "Show fish abundance trend near Kerala coast 2020-2025"
2. **Data Summarization**: AI-generated summaries of marine data
3. **Anomaly Detection**: Identification of unusual patterns in datasets
4. **Query Examples**: Predefined examples to guide users

### Implementation
```python
class QueryProcessor:
    async def process_natural_language_query(self, query: str) -> Dict[str, Any]:
        # Analyze query with LLM
        # Fetch relevant data
        # Generate natural language response
        
    async def get_data_summary(self, data_type: str, region: str = "kerala") -> str:
        # Generate AI summary for specific data type and region
        
    async def detect_anomalies(self, data: List[Dict[str, Any]], data_type: str) -> str:
        # Detect anomalies in provided data
```

## Database

### Schema Management
The platform uses Alembic for database migrations:

```bash
# Generate new migration
alembic revision --autogenerate -m "Migration message"

# Apply migrations
alembic upgrade head
```

### TimescaleDB Integration
The database uses TimescaleDB extension for time-series data optimization:
- Automatic partitioning of time-series data
- Efficient querying of temporal data
- Built-in functions for time-series analysis

### Indexing Strategy
Models include optimized indexes for performance:
```python
# Oceanography records indexing
__table_args__ = (
    Index('idx_oceanography_timestamp', 'timestamp'),
    Index('idx_oceanography_parameter', 'parameter'),
    Index('idx_oceanography_location', 'latitude', 'longitude'),
)
```

## Testing

### Test Structure
Tests are located in the [tests/](file:///c%3A/Users/yashd/Downloads/sih-back/tests) directory and follow the standard pytest structure.

### Endpoint Testing
A test script is provided at [test_endpoints.py](file:///c%3A/Users/yashd/Downloads/sih-back/test_endpoints.py) to verify API functionality:

```bash
python test_endpoints.py
```

### Unit Testing
Run unit tests with pytest:
```bash
poetry run pytest
```

## Deployment

### Docker Deployment
The recommended deployment method uses Docker Compose:

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Services Included
1. **API Service**: Main application
2. **Database**: TimescaleDB (PostgreSQL extension)
3. **Redis**: Caching and session storage
4. **MinIO**: Object storage for raw data files

### Environment Configuration
## Security & Auth

- JWT (demo): `GET /api/v1/auth/token/example?role=admin` to mint a short-lived token.
- Use `Authorization: Bearer <token>` for secured routes (e.g., `/api/v1/auth/admin/ping`).
- RBAC roles: `scientist`, `policymaker`, `admin`.

## Migrations (TimescaleDB & PostGIS)

- Enable extensions and hypertables via Alembic:
```bash
poetry run alembic upgrade head
```
- `0001_enable_extensions`: installs PostGIS & TimescaleDB
- `0002_timescale_hypertables`: converts `oceanography_records` to hypertable and creates a daily cagg

Configure deployment through environment variables in `.env`:
- Database connection strings
- API keys for external services
- Storage configurations
- Feature flags

## Development Workflow

### Adding New Features

1. **Create a feature branch**:
```bash
git checkout -b feature/new-feature-name
```

2. **Implement the feature**:
   - Add new models in [app/models/](file:///c%3A/Users/yashd/Downloads/sih-back/app/models)
   - Create routers in [app/routers/](file:///c%3A/Users/yashd/Downloads/sih-back/app/routers)
   - Add schemas in [app/schemas/](file:///c%3A/Users/yashd/Downloads/sih-back/app/schemas)
   - Implement business logic in [app/services/](file:///c%3A/Users/yashd/Downloads/sih-back/app/services)

3. **Add database migrations** (if needed):
```bash
alembic revision --autogenerate -m "Add new feature"
```

4. **Write tests** in the [tests/](file:///c%3A/Users/yashd/Downloads/sih-back/tests) directory

5. **Run tests**:
```bash
poetry run pytest
```

6. **Commit and push**:
```bash
git add .
git commit -m "Add new feature"
git push origin feature/new-feature-name
```

### Code Quality

The project follows these standards:
- **Formatting**: Black with 100-character line limit
- **Imports**: isort for import organization
- **Linting**: ruff for code quality checks
- **Type Hints**: Required for all functions and variables

Run code quality checks:
```bash
poetry run black .
poetry run isort .
poetry run ruff check .
```

### Adding New Data Sources

1. Create a new ingestion client in [app/ingestion/](file:///c%3A/Users/yashd/Downloads/sih-back/app/ingestion)
2. Add corresponding router in [app/routers/](file:///c%3A/Users/yashd/Downloads/sih-back/app/routers)
3. Create appropriate models in [app/models/](file:///c%3A/Users/yashd/Downloads/sih-back/app/models)
4. Update the QueryProcessor to handle the new data type
5. Add tests for the new functionality

### API Documentation

FastAPI automatically generates interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Update documentation by adding docstrings to router functions and Pydantic models.

## Common Development Tasks

### Adding a New API Endpoint

1. Create a new router file in [app/routers/](file:///c%3A/Users/yashd/Downloads/sih-back/app/routers)
2. Define the endpoint with appropriate HTTP method and path
3. Add request/response schemas in [app/schemas/](file:///c%3A/Users/yashd/Downloads/sih-back/app/schemas)
4. Implement business logic in [app/services/](file:///c%3A/Users/yashd/Downloads/sih-back/app/services)
5. Register the router in [app/main.py](file:///c%3A/Users/yashd/Downloads/sih-back/app/main.py)

### Adding a New Database Model

1. Create a new model in [app/models/](file:///c%3A/Users/yashd/Downloads/sih-back/app/models)
2. Add the model import to [app/db/base.py](file:///c%3A/Users/yashd/Downloads/sih-back/app/db/base.py)
3. Generate and apply database migration:
```bash
alembic revision --autogenerate -m "Add new model"
alembic upgrade head
```

### Adding a New External Service

1. Create a new client in [app/ingestion/](file:///c%3A/Users/yashd/Downloads/sih-back/app/ingestion)
2. Add the client to [app/services/llm/query_processor.py](file:///c%3A/Users/yashd/Downloads/sih-back/app/services/llm/query_processor.py)
3. Update the [_fetch_data_by_intent](file:///c%3A/Users/yashd/Downloads/sih-back/app/services/llm/query_processor.py#L71-L135) method to handle the new data source
4. Add appropriate endpoints in the relevant router

## Troubleshooting


## Contributing

1. Follow the existing code style and patterns
2. Write tests for new functionality
3. Update documentation when adding new features
4. Submit pull requests for review
5. Ensure all tests pass before merging

## Standards & Interoperability

This project aligns with domain standards to ensure interoperability with global portals and tools across oceanography, biodiversity, fisheries, and molecular biology.

- **Biodiversity metadata (Darwin Core/DwC)**: Use DwC terms for occurrence records and observations for compatibility with OBIS/GBIF export pipelines. Map fields such as `scientificName`, `eventDate`, `decimalLatitude`, `decimalLongitude`, `recordedBy`, `basisOfRecord`.
- **Oceanography data (CF/ERDDAP)**: Prefer CF-compliant NetCDF for gridded/time-series; follow ERDDAP conventions for variable/attribute naming (e.g., `sea_surface_temperature`, `units="degree_C"`, `standard_name`).
- **Molecular data (GenBank/ENA alignment)**: Align eDNA study metadata with `bioproject`, `biosample`, `instrument_model`, `library_strategy`, `target_gene`, `primer_sequence`, `taxon_id` to enable downstream submission and cross-links.
- **Geospatial**: Use WGS84 (`EPSG:4326`) as default CRS; expose GeoJSON in APIs; plan PostGIS indexes for spatial queries.
- **Time-series (TimescaleDB)**: Use hypertables for high-ingest data and define retention and continuous aggregates for performant analytics.
- **Validation & QA/QC**: Use Pydantic for IO validation and Great Expectations suites at ingestion for missing values, ranges, units, and outlier checks.

Implementation notes:
- Add term mappings in `schemas/` and `models/` docstrings to clarify DwC/CF alignment.
- Provide export utilities for OBIS/GBIF and CF-compliant NetCDF where appropriate.
- Track provenance (`source`, `processing_level`, `license`) across domains.

## Roadmap

See `ROADMAP.md` for actionable milestones: correlation engine, geospatial visualization, otolith morphology analysis, eDNA workflows (BLAST-like search, QIIME2/DADA2), cloud scalability (Kubernetes, Kafka), AI-assisted SQL/visualization, RBAC, and enhanced testing/validation.

## Additional Resources

- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLAlchemy Documentation: https://docs.sqlalchemy.org/
- Docker Documentation: https://docs.docker.com/
- TimescaleDB Documentation: https://docs.timescale.com/