# Project Roadmap

This roadmap translates the improvement suggestions into actionable milestones. Target sequencing is indicative; parallelization is possible where teams permit.

## Q1: Interoperability Foundations
- Adopt domain standards
  - Darwin Core mappings for biodiversity records (OBIS/GBIF export)
  - CF-compliant NetCDF export pipelines for oceanography datasets
  - GenBank/ENA-aligned metadata for eDNA studies
- Geospatial enablement
  - Enable PostGIS and spatial indexes; serve GeoJSON
  - ERDDAP-style naming conventions for variables/attributes
- Data validation and QA/QC
  - Great Expectations suites for ingestion checks (nulls, ranges, units)
  - Provenance fields across models (`source`, `processing_level`, `license`)

## Q2: Cross-Domain Analytics and Visualization
- Correlation Engine
  - Service to link oceanographic time series to biodiversity/fisheries
  - TimescaleDB hypertables + continuous aggregates for performance
  - API/GraphQL endpoints for correlation queries (e.g., SST anomaly vs sardine landings)
- Visualization stack
  - Map server: PostGIS + GeoServer; client: Deck.gl/Leaflet layers
  - Dashboards: Grafana for time series, Plotly Dash/Streamlit for scientific viz
  - Otolith morphology module with EFD/Fourier descriptors and similarity search

## Q3: Molecular Workflows and AI Interactivity
- eDNA module expansion
  - BLAST-like local/remote search against curated references
  - Preprocessing pipelines (QC, trimming, metadata tagging)
  - QIIME2/DADA2 integration for taxonomic assignment
- AI-driven analytics
  - Natural language → SQL for TimescaleDB
  - LLM-guided visualization suggestions (chart type + parameters)

## Q4: Scalability and User Experience
- Cloud-native
  - Kubernetes manifests/Helm charts for API, workers, DB extensions
  - Kafka-based event-driven ingestion for high-throughput sensors
  - MinIO lifecycle policies for tiered storage/archival
- Frontend portal
  - Role-based access control (RBAC) for scientists/admins/policymakers
  - Exploratory UI: filters, map layers, time windows, AI query bar
  - Saved analyses and shareable dashboards

## Testing and Quality (Continuous)
- Integration tests with mock external datasets (INCOIS, CMFRI, NCBI)
- Load/perf tests for ingestion and correlation endpoints
- Security testing and secrets scanning

## Milestone Acceptance Criteria (samples)
- Interoperability: Successful export to OBIS/GBIF; CF-compliant NetCDF validated by `cf-checker`.
- Correlation Engine: API returns statistically significant correlations with confidence metrics.
- eDNA: Sequence query returns top-k matches with taxonomy; pipeline reproducible via CI.
- Visualization: Map tiles and charts render within target latency on sample datasets.
- Cloud: Cluster deploys via Helm; autoscaling meets load SLOs.

## Tracking
Use GitHub Projects/Issues with labels: `interoperability`, `correlation`, `viz`, `molecular`, `cloud`, `ai`, `qa`.


