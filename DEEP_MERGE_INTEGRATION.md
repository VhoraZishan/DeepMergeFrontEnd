# DeepMerge Backend Integration Guide

This document explains how the frontend has been integrated with the DeepMerge backend to provide all data and AI functionality.

## Backend Connection Overview

The frontend connects to the DeepMerge backend through a proxy configuration in `vite.config.ts`:

```javascript
proxy: {
  "/api": {
    target: "http://localhost:8000",
    changeOrigin: true,
    ws: false,
  },
  "/ws": {
    target: "ws://localhost:8000",
    changeOrigin: true,
    ws: true,
  },
}
```

All API requests to `/api/*` are automatically forwarded to the backend running on port 8000.

## API Service Layer

A dedicated API service layer has been created in `src/lib/api.ts` to handle all backend communications:

### AI Endpoints
- `aiApi.query(query)` - Process natural language queries about marine data
- `aiApi.getSummary(dataType, region)` - Get AI-generated summaries
- `aiApi.detectAnomalies(data, dataType)` - Detect anomalies in marine data
- `aiApi.getQueryExamples()` - Get examples of natural language queries
- `aiApi.suggestSql(question)` - Generate SQL from natural language
- `aiApi.suggestVisualization(question, fields)` - Suggest visualization specs

### Analytics Endpoints
- `analyticsApi.correlate(parameter, species, region)` - Correlate ocean parameters with species data

### Health Check
- `healthApi.check()` - Check backend health status

## Integrated Components

### 1. Chat Interface (`src/components/chat/ChatInterface.tsx`)
- Replaced mock data with real backend API calls
- Uses `aiApi.query()` for natural language processing
- Maintains location-aware functionality

### 2. Analytics Dashboard (`src/pages/Analytics.tsx`)
- Integrated `aiApi.getSummary()` for AI-generated summaries
- Added `analyticsApi.correlate()` for correlation analysis
- Added "Run Correlation" button to demonstrate backend functionality

### 3. Data Explorer (`src/pages/DataExplorer.tsx`)
- Integrated `aiApi.suggestSql()` for SQL generation
- Added `aiApi.suggestVisualization()` for visualization suggestions
- Added "Suggest Viz" button to demonstrate visualization capabilities

### 4. Search Page (`src/pages/SearchPage.tsx`)
- Integrated `aiApi.getSummary()` for AI assistance
- Added `aiApi.query()` for natural language querying
- Added "Run Query" button to demonstrate query processing

## Environment Configuration

The frontend uses the `API_BASE` utility from `src/lib/utils.ts` which automatically handles:
- Development mode: Uses proxy to `/api` endpoint
- Production mode: Uses environment variable `VITE_API_BASE_URL` or relative paths

## Available Backend Endpoints

### AI Services (`/api/v1/ai/*`)
- `POST /api/v1/ai/query` - Process natural language queries
- `GET /api/v1/ai/summary` - Get AI-generated data summaries
- `POST /api/v1/ai/anomalies` - Detect anomalies in data
- `GET /api/v1/ai/examples` - Get query examples
- `GET /api/v1/ai/sql` - Generate SQL from questions
- `POST /api/v1/ai/viz/suggest` - Suggest visualization specs

### Analytics (`/api/v1/analytics/*`)
- `GET /api/v1/analytics/correlate` - Correlate parameters with species

### Health Check
- `GET /healthz` - Backend health status

## Testing the Integration

1. Start the DeepMerge backend on port 8000
2. Start the frontend with `npm run dev`
3. Navigate to the Chat page and test natural language queries
4. Visit the Analytics page and try the "AI Summary" and "Run Correlation" buttons
5. Go to Data Explorer and test "Suggest SQL" and "Suggest Viz"
6. Visit Search Page and try "Ask AI" and "Run Query"

## Troubleshooting

If you encounter connection issues:
1. Verify the backend is running on `http://localhost:8000`
2. Check that the proxy configuration in `vite.config.ts` is correct
3. Ensure no firewall is blocking the connection
4. Check browser console for network errors

## Future Enhancements

1. Add authentication and user sessions
2. Implement real-time data streaming with WebSockets
3. Add more comprehensive error handling
4. Implement caching for frequently requested data
5. Add offline support with service workers